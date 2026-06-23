# Example: SaaS subscription end to end

A worked example of the canonical SaaS subscription pattern from "user clicks Subscribe" to "Customer Portal manages it forever". Reference architecture; copy and adapt.

Stack assumed: Next.js (App Router) + Postgres + a queue (SQS / Cloud Tasks / Inngest). Stripe SDK pinned to `2025-09-30.clover`.

---

## Architecture

```
                           +----------------+
                           |  Stripe        |
                           +--------+-------+
                                    |
        +-------- (1) checkout ---->|
        |                           |
        |                           |
+-------+-------+                   |
|  Browser /    |                   |
|  React app    |                   |
+-------+-------+                   |
        |                           |
        | (2) /api/checkout         |
        v                           |
+---------------+         (3) Hosted Checkout
|  Next.js app  +<-----------------+
|  (App Router) |                  |
|  +----------+ |                  |
|  | Postgres | |                  |
|  +----------+ |  (4) checkout.session.completed
|               +<------------------+
|  /api/stripe/webhook              |
|         |                         |
|         | (5) provision           |
|         v                         |
|  +---------------+                |
|  | Queue         |  (6) email + ERP + analytics + Slack (async)
|  +---------------+                |
|                                   |
|  /api/portal      (7) link out--->+
|         |                         |
|         |  (8) self-serve manage |
+---------+                         |
                                    |
        (9) customer.subscription.* |
+<-----------------------------------+
```

Steps:

1. User clicks "Subscribe to Gold" on the marketing/pricing page.
2. The browser POSTs to `/api/checkout` with `{ lookup_key: 'gold_monthly' }`. The handler reads the **authenticated user** from the session (never from the request body) and creates a Checkout Session.
3. Server returns the Checkout URL; browser redirects.
4. User completes payment on Stripe-hosted Checkout. Stripe creates the subscription **after** successful payment (March 2025 change), then fires `checkout.session.completed`.
5. Webhook handler verifies signature, dedups on `event.id`, retrieves the subscription server-side, writes entitlements, all inside one DB transaction.
6. Post-commit, side effects (welcome email, ERP sync, analytics event, Slack notification) are enqueued.
7. Later, user goes to `/billing` and clicks "Manage subscription" → `/api/portal` creates a Customer Portal session.
8. User cancels / updates payment method / switches plan inside Stripe-hosted Portal.
9. Stripe fires `customer.subscription.updated` or `customer.subscription.deleted`; webhook handler re-derives entitlements.

## Code: server-side Checkout creation (`/api/checkout`)

Uses `templates/checkout-session-create.ts`:

```ts
// app/api/checkout/route.ts
import { createSubscriptionCheckout } from '@/server/stripe/checkout';
import { getAuthenticatedUserId } from '@/server/auth';

export async function POST(req: Request): Promise<Response> {
  const userId = await getAuthenticatedUserId(req);
  const body = await req.json();

  // Validate the lookup_key against an allow-list — never accept arbitrary strings.
  const allowed = ['gold_monthly', 'gold_yearly', 'team_monthly'] as const;
  if (!allowed.includes(body.lookup_key)) {
    return new Response('invalid plan', { status: 400 });
  }

  const session = await createSubscriptionCheckout({
    userId,
    priceLookupKey: body.lookup_key,
    trialDays: 14,
  });

  return Response.json({ url: session.url });
}
```

**Why an allow-list?** Hard Rule #3 — never trust the client. Even though `lookup_key` resolution is server-side, accepting arbitrary keys means an attacker can probe for hidden Prices.

## Code: webhook handler (`/api/stripe/webhook`)

Uses `templates/webhook-handler.ts` Variant A (Next.js App Router). Key event handlers:

```ts
async function handleCheckoutCompleted(session: Stripe.Checkout.Session, tx: Tx) {
  if (session.mode !== 'subscription' || !session.subscription) return;

  const sub = await stripe.subscriptions.retrieve(session.subscription as string, {
    expand: ['items.data.price'],
  });

  const userId = sub.metadata.app_user_id;
  if (!userId) {
    // Defensive: should never happen because we set it during creation.
    throw new Error(`subscription ${sub.id} has no app_user_id metadata`);
  }

  const lookupKey = sub.items.data[0].price.lookup_key!;
  const entitlements = entitlementsFor(lookupKey); // local function

  await tx.subscription.upsert({
    where: { stripeSubscriptionId: sub.id },
    create: {
      stripeSubscriptionId: sub.id,
      userId,
      lookupKey,
      status: sub.status,
      currentPeriodEnd: new Date(sub.current_period_end * 1000),
    },
    update: {
      status: sub.status,
      lookupKey,
      currentPeriodEnd: new Date(sub.current_period_end * 1000),
    },
  });

  await tx.user.update({
    where: { id: userId },
    data: { entitlements },
  });

  // Side effects async — don't block the webhook return.
  await enqueue('subscription-welcome', { userId, lookupKey });
}
```

## Code: Customer Portal session (`/api/portal`)

```ts
// app/api/portal/route.ts
import { stripe } from '@/server/stripe/client';
import { getAuthenticatedUserId } from '@/server/auth';

export async function POST(req: Request): Promise<Response> {
  const userId = await getAuthenticatedUserId(req);
  const user = await db.user.findUniqueOrThrow({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });

  if (!user.stripeCustomerId) {
    return new Response('no Stripe customer for user', { status: 400 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.APP_URL}/billing`,
  });

  return Response.redirect(session.url, 303);
}
```

## What can go wrong (and how this design defends)

| Failure | Defense |
|---|---|
| Stripe retries the same event | `processed_webhook_events` dedup |
| Handler crashes mid-processing | Transactional insert + work; Stripe retries; no half-applied state |
| User opens the success page before the webhook lands | Success page polls the DB or re-fetches the session by ID; never provisions itself |
| Attacker sends `customer=cus_other` to `/api/portal` | `customer` derived from the authenticated session, not the request |
| Marketing changes the price from $19 → $24 | `lookup_keys`; no code change |
| Stripe rotates the webhook secret | Roll the env var within the 24h overlap window; SDK accepts both signatures during overlap |
| User changes plan in the Portal | `customer.subscription.updated` re-derives entitlements |
| Failed renewal | `invoice.payment_failed` triggers dunning notification; do NOT revoke immediately — wait for Stripe to give up after retries |

## Hard Rules audit

- ✅ **Money is sacred** — provisioning is webhook-only, never on the redirect.
- ✅ **Idempotency-first** — `processed_webhook_events` + `Idempotency-Key` on Customer create.
- ✅ **Never trust the client** — `userId` from session, `lookup_key` allow-listed, `customer` derived server-side.
- ✅ **Every webhook is a contract** — raw body, signature verify, 300s tolerance, dedup, fast 2xx.

## Cross-Bee handoffs needed

- `db-worker-bee` — schema for `subscriptions`, `users.entitlements`, `processed_webhook_events`. Migration.
- `security-worker-bee` — secret storage in env, RBAC on `/api/portal`, retention of webhook payloads.
- `react-worker-bee` — the React-side `useCheckout` hook that POSTs to `/api/checkout` and handles the redirect.
- `library-worker-bee` — the PRD that defined "what does Gold give you?" — should map 1:1 to `entitlementsFor(lookupKey)`.
