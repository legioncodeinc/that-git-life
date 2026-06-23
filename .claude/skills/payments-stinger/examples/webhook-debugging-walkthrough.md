# Example: Webhook debugging walkthrough

A real-shaped scenario showing how to use Workbench, the CLI, and the failure-mode catalog to diagnose and fix a broken webhook in under 30 minutes.

---

## The symptom

> "Customers are subscribing successfully on Stripe — payments show up in the Dashboard — but our app isn't provisioning them. The user gets the success page redirect but `users.plan` stays `free` forever. Started yesterday around 11am after a deploy."

## Step 1: Confirm the failure surface

Open Workbench → Events. Filter by:
- **Date:** last 24 hours
- **Type:** `checkout.session.completed`
- **Delivery status:** Failed (or All, to see retries)

Observation: the events fired, but every delivery to the registered HTTPS endpoint returned **400** with body `invalid signature`.

This narrows the failure mode to one of:
- #4 from `guides/09-common-failure-modes.md` — raw body broken by JSON middleware
- #5 — signature drift after key rotation
- The endpoint is reading the wrong secret

## Step 2: Reproduce locally

Pull yesterday's deploy and replay one of the failing events against a local handler with verbose logging:

```bash
# Terminal 1 — run the local app at the deploy that's failing in prod
git checkout <yesterday-deploy-sha>
npm install
npm run dev

# Terminal 2 — forward
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Note the printed whsec_* — set it in .env.local as STRIPE_WEBHOOK_SECRET

# Terminal 3 — replay the actual failing event from prod
stripe events resend evt_1AbC123XYZ
```

If the local handler also returns 400 → it's a code bug introduced in yesterday's deploy.
If the local handler returns 200 → it's a secret/configuration mismatch in prod.

## Step 3: Check failure mode #4 (raw body)

Reproduces locally with 400. Check the diff for body-parser changes:

```bash
git log -p --since="48 hours ago" -- 'src/api/stripe/**' 'src/middleware/**' 'app/api/stripe/**'
```

In our scenario, the diff shows:

```diff
// src/middleware/index.ts
- // No global body parser; webhook route reads raw via req.text()
+ app.use(express.json());  // global JSON parsing for all routes
```

Someone added `express.json()` globally to make a different feature work. That globally-applied middleware reads and parses the request body **before** it reaches the webhook handler — so when the handler asks for the raw body, it gets a parsed object. Signature verification fails because the bytes Stripe signed differ from the bytes the handler computed HMAC on.

## Step 4: Apply the fix

Per `guides/02-webhook-verification.md` "JSON middleware ate the raw body":

```diff
- app.use(express.json());
+ // Mount express.json() AFTER the webhook route — order matters
+ app.post(
+   '/api/stripe/webhook',
+   express.raw({ type: 'application/json' }),
+   stripeWebhookHandler,
+ );
+ app.use(express.json()); // applies to everything else
```

Or for Next.js App Router (which doesn't auto-parse), the equivalent fix is to make sure the route uses `req.text()`, not `req.json()`. App Router doesn't have a global body parser, so this surface is harder to break — but the same problem appears in Pages Router via `bodyParser: false`.

## Step 5: Verify

Locally:

```bash
stripe events resend evt_1AbC123XYZ
# Local handler logs: Stripe event received: checkout.session.completed
# Local handler logs: Inserted dedup row for evt_1AbC123XYZ
# Local handler logs: Provisioned user_xyz to gold_monthly
# Returns 200
```

Deploy the fix. Then in Workbench:

1. Watch the next live event arrive — confirm 2xx delivery.
2. Click **Resend** on each of the failed events from the past 24h. Each delivers, dedups (some have already been processed by Stripe's retries that *did* succeed), and the resulting state in the app catches up.

## Step 6: Backfill any users who fell through the cracks

If some events failed all retries (Stripe gives up after 3 days), you may have customers who paid but were never provisioned. Recovery:

```ts
// scripts/backfill-missed-subscriptions.ts
const subs = await stripe.subscriptions.list({
  status: 'active',
  expand: ['data.items.data.price'],
  limit: 100,
});

for (const sub of subs.data) {
  const userId = sub.metadata.app_user_id;
  if (!userId) continue;
  const localSub = await db.subscription.findUnique({
    where: { stripeSubscriptionId: sub.id },
  });
  if (!localSub) {
    console.log(`Backfilling ${sub.id} for user ${userId}`);
    await provision(sub);
  }
}
```

This is also why a **scheduled reconciliation job** is a Should-refactor recommendation in `guides/05-idempotency.md` — it catches these cases automatically before a customer notices.

## Step 7: Postmortem

```
WHAT HAPPENED
- 2026-04-24 11:03 UTC: deploy adds global express.json() middleware to fix
  feature X.
- 2026-04-24 11:03 UTC onward: Stripe webhook 400s on every delivery.
- 2026-04-25 09:14 UTC: customer escalation surfaces the issue.
- 2026-04-25 09:42 UTC: fix deployed; failed events replayed; 14 missed
  customers backfilled.

ROOT CAUSE
Globally-applied JSON body parser consumed the raw request body before the
Stripe webhook handler could verify the Stripe-Signature header.

WHY IT WASN'T CAUGHT
- No CI test for the webhook signature path.
- No staging test of `stripe trigger` against a fresh deploy.

ACTION ITEMS
- [ ] Add a CI test that runs `stripe trigger` against the test webhook handler.
- [ ] Add a post-deploy check that resends the most recent N events from
      Workbench and asserts 2xx.
- [ ] Add a reconciliation cron that catches drifted subscriptions
      (Should-refactor surfaced in last audit).
- [ ] Move webhook route's body-parsing to a route-scoped middleware that
      cannot be globally overridden.
```

## Lessons that map back to the Stinger

| Lesson | Guide |
|---|---|
| The single most common webhook failure is body-parser middleware | `guides/02-webhook-verification.md` |
| `stripe events resend` is the fastest debugging tool | `guides/06-testing-and-cli.md` |
| Reconciliation jobs are insurance against this exact incident | `guides/05-idempotency.md` |
| Deploys that touch routing/middleware should run a webhook smoke test | `guides/06-testing-and-cli.md` |
