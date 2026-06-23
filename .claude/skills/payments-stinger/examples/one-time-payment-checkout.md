# Example: One-time payment Checkout

The simplest production-ready flow — single charge, fulfillment via webhook.

Stack assumed: Next.js (App Router) + Postgres + a queue. Stripe SDK pinned to `2025-09-30.clover`.

---

## When to use

- Selling a single SKU (a course, a downloadable, a one-off service).
- Donations (with an open amount).
- Any flow where there's no recurring billing.

For donations specifically, **prefer a Payment Link** — Dashboard-configured, share-via-URL, no code at all. See `guides/01-checkout-vs-payment-intents.md`.

For everything else where you have product variants or want post-purchase orchestration, Checkout `mode: payment` is right.

## Architecture

```
   Browser → /api/checkout → Stripe Checkout (hosted) → /success
                                       │
                                       │ checkout.session.completed
                                       v
                            Webhook handler
                                       │
                                       ├── Insert order row
                                       ├── Enqueue: send receipt email
                                       └── Enqueue: ship goods / grant download
```

Critically, the **success page does NOT fulfill**. It displays "you're all set" based on the DB state populated by the webhook. If the user reloads the success page before the webhook lands, the page polls or shows a "processing" state.

## Code: server-side Checkout creation

```ts
// app/api/checkout/route.ts
import { createOneTimeCheckout } from '@/server/stripe/checkout';
import { getAuthenticatedUserIdOrAnonymous } from '@/server/auth';

export async function POST(req: Request): Promise<Response> {
  // For one-time payments, anonymous purchases are typical (gift cards, courses).
  // The auth function returns either a user ID or a stable anonymous ID.
  const userId = await getAuthenticatedUserIdOrAnonymous(req);
  const body = await req.json();

  // Allow-list — Hard Rule #3.
  const allowed = ['course_react_basics', 'course_react_advanced', 'gift_card_25'];
  if (!allowed.includes(body.lookup_key)) {
    return new Response('invalid product', { status: 400 });
  }

  const session = await createOneTimeCheckout({
    userId,
    priceLookupKey: body.lookup_key,
    quantity: body.quantity ?? 1,
  });

  return Response.json({ url: session.url });
}
```

## Code: webhook handler

The single event you need is `checkout.session.completed`:

```ts
async function handleCheckoutCompleted(session: Stripe.Checkout.Session, tx: Tx) {
  if (session.mode !== 'payment') return;
  if (session.payment_status !== 'paid') return; // defensive

  // Re-fetch with line items expanded — the webhook payload omits them by default.
  const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ['line_items', 'line_items.data.price'],
  });

  const userId = fullSession.metadata?.app_user_id ?? 'anon';
  const lookupKey = fullSession.metadata?.lookup_key;

  await tx.order.create({
    data: {
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
      userId,
      lookupKey,
      amountTotal: session.amount_total ?? 0,
      currency: session.currency ?? 'usd',
      status: 'paid',
    },
  });

  // Async fulfillment — receipt + delivery.
  await enqueue('send-receipt', { sessionId: session.id });
  await enqueue('fulfill-order', { sessionId: session.id, lookupKey });
}
```

## Code: success page

```tsx
// app/success/page.tsx
export default async function Success({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  if (!searchParams.session_id) return <p>Missing session ID.</p>;

  // Re-fetch the order row populated by the webhook.
  const order = await db.order.findUnique({
    where: { stripeSessionId: searchParams.session_id },
  });

  if (!order) {
    // Webhook hasn't landed yet — show a friendly "processing" state.
    // Client-side polling refreshes; or use a server-sent event for instant update.
    return <p>Processing your order. This page will update shortly.</p>;
  }

  return (
    <div>
      <h1>Thank you!</h1>
      <p>Your order is confirmed. A receipt is on its way to your email.</p>
    </div>
  );
}
```

**Note:** the success page displays state but does NOT write it. If a malicious user constructs a fake `?session_id=` they see "Processing" forever (because no order row exists for a fake ID). Hard Rule #3 holds.

## Refunds

When customer service needs to refund:

```ts
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-09-30.clover' });

await stripe.refunds.create(
  {
    payment_intent: order.stripePaymentIntentId,
    amount: order.amountTotal, // omit for full refund
    reason: 'requested_by_customer',
  },
  {
    idempotencyKey: `refund:${order.stripePaymentIntentId}:full`,
  },
);
```

The `Idempotency-Key` ensures that if the request times out and the operator retries, only one refund happens. See `guides/05-idempotency.md`.

Listen for `charge.refunded` to update the local order row's status.

## Hard Rules audit

- ✅ **Money is sacred** — fulfillment via webhook, not redirect.
- ✅ **Idempotency-first** — `processed_webhook_events` + idempotency key on refund create.
- ✅ **Never trust the client** — `lookup_key` allow-list, success page doesn't write state.
- ✅ **Every webhook is a contract** — same handler shape as the subscription example.

## Cross-Bee handoffs needed

- `db-worker-bee` — `orders`, `processed_webhook_events` schemas.
- `security-worker-bee` — RBAC on the customer-service refund endpoint.
- `library-worker-bee` — PRD defining what each `lookup_key` fulfills (download URL, course access, physical shipment).
