# 03 — Subscriptions

Recurring revenue is the lifeblood of most Stripe customers. It is also where the most subtle bugs live — proration, trial behavior, dunning, the March 2025 lifecycle change, and the `billing_mode` flip in 2025-09-30.clover.

Source: [docs.stripe.com/billing/subscriptions/build-subscriptions](https://docs.stripe.com/billing/subscriptions/build-subscriptions), `research/2026-04-25-march-2025-checkout-subscription-change.md`, `research/2026-04-25-billing-mode-flexible.md`, `research/2026-04-25-entitlements-and-lookup-keys.md`.

---

## The default architecture (post-March-2025)

```
1. Customer clicks "Subscribe"
2. Server creates Checkout Session (mode=subscription) with lookup_key-resolved Price
3. Customer redirected to Checkout
4. Customer completes payment
5. Stripe creates the Subscription (only after payment succeeds)
6. Stripe fires `checkout.session.completed`
7. Your webhook provisions entitlements based on the subscription
8. Customer redirected to your success URL
```

Note step 5: subscriptions are now created **after** successful payment, not before. This is the March 2025 change. See `guides/07-march-2025-api-change.md`.

## Use `lookup_keys`, not `price_*` IDs

```ts
// Bad — hardcoded ID, redeploy needed when price changes
await stripe.checkout.sessions.create({
  mode: 'subscription',
  line_items: [{ price: 'price_1Abc123XYZ...', quantity: 1 }],
  ...
});

// Good — resolve from a stable lookup_key
const prices = await stripe.prices.list({
  lookup_keys: ['gold_monthly'],
  expand: ['data.product'],
});
const price = prices.data[0];

await stripe.checkout.sessions.create({
  mode: 'subscription',
  line_items: [{ price: price.id, quantity: 1 }],
  ...
});
```

Source: `research/2026-04-25-entitlements-and-lookup-keys.md`. Findings:

- **Must-fix** (over time, but won't crash on day one): hardcoded `price_*` in `line_items`.
- **Should-refactor:** Price IDs read from env var instead of `lookup_keys`. Env var is just a more painful version of hardcoding.

## Provisioning entitlements

Two paths:

**A — Local logic** (recommended for products with ≤3 plans, ≤5 features). The webhook handler reads the subscription's `items[0].price.lookup_key`, looks up the local feature set, and writes `tenant.plan = 'gold'`.

**B — Stripe Entitlements** (recommended for richer SaaS). Define Features in the Dashboard or via API, attach to Products, listen for `entitlements.active_entitlement_summary.updated`, and call `stripe.entitlements.activeEntitlements.list({ customer })` for the source of truth. Source: `research/2026-04-25-entitlements-and-lookup-keys.md`.

The decision is a heuristic, not a rule. Both work. Pick one and be consistent.

## Webhooks to handle (subscription lifecycle)

| Event | What to do |
|---|---|
| `checkout.session.completed` | **Primary provisioning hook.** Re-fetch the session, get the subscription, write entitlements. |
| `customer.subscription.created` | Defensive backup — provision if not already done. |
| `customer.subscription.updated` | Plan change, quantity change, status change (active → past_due → canceled). Re-derive entitlements. |
| `customer.subscription.deleted` | Subscription ended (period over, or admin cancellation). Revoke entitlements. |
| `invoice.paid` | Successful renewal. Extend access through the new period. |
| `invoice.payment_failed` | Dunning starts. Notify customer; do NOT revoke immediately — Stripe will retry. |
| `customer.subscription.trial_will_end` | 3 days before trial conversion. Notify customer. |

## `billing_mode: flexible` — what changed and when

| API version | Default | Behavior |
|---|---|---|
| Pre-Basil 2025-06-30 | classic | Original proration / trial / cancellation semantics |
| Basil 2025-06-30 to 2025-08-26 | classic (opt-in flexible) | New behavior available; explicit `billing_mode[type]=flexible` |
| Basil 2025-08-27 (preview) onwards | flexible | Preview API versions default to flexible |
| Clover 2025-09-30 (GA) onwards | **flexible** | GA default flips |

Source: `research/2026-04-25-billing-mode-flexible.md`.

What flexible changes (per Stripe): "how subscriptions calculate prorations, handle trials, and process cancellations." Migration is **one-way** — you can flip a subscription from classic → flexible, never the reverse.

**Findings:**

- **Should-refactor**: SDK pinned to `2025-09-30.clover` or later but code creates subscriptions without thinking about `billing_mode`. The team is now on flexible by default and may not realize their proration logic shifted. Open follow-up.
- **Must-fix**: code asserts on classic-mode invoice item shapes (e.g., a specific number of proration line items) while running on flexible — proration calculation differs.

See `guides/07-march-2025-api-change.md` for the full migration recipe.

## Trial behavior

Trials in Checkout Sessions:

```ts
await stripe.checkout.sessions.create({
  mode: 'subscription',
  line_items: [{ price: priceId, quantity: 1 }],
  subscription_data: {
    trial_period_days: 14,
    // billing_mode: { type: 'flexible' },  // explicit on Clover-pinned SDKs
  },
  // Capture payment method during trial — Stripe charges automatically when it ends
  payment_method_collection: 'always',
  ...
});
```

- `payment_method_collection: 'always'` requires a card during signup (preferred — no surprise dunning at trial end).
- `payment_method_collection: 'if_required'` skips card collection for $0 trial — Stripe will email the customer when the trial is about to end.

Trial-end behavior under flexible mode differs from classic — verify with `stripe trigger customer.subscription.trial_will_end` and `customer.subscription.updated` in test mode before assuming.

## Proration

Mid-period plan changes generate proration line items on the next invoice (or a new invoice immediately, depending on `proration_behavior`). Options:

- `create_prorations` (default for upgrades) — the standard "you get a credit for unused old plan, you owe for the new plan".
- `none` — no proration; new plan starts at next period boundary.
- `always_invoice` — invoice immediately for the proration delta.

**Findings:**

- A team that hand-calculates prorations in app code: that's a Must-fix. Stripe does this. Trust it.

## Cancellation modes

```ts
// Cancel at period end (most common — they keep access until renewal)
await stripe.subscriptions.update(subId, { cancel_at_period_end: true });

// Cancel immediately (revokes entitlements at once)
await stripe.subscriptions.cancel(subId);

// Cancel + refund the latest invoice (rare; usually a customer-service action)
await stripe.subscriptions.cancel(subId, { invoice_now: true, prorate: true });
```

Customer Portal supports all three (configurable). See `guides/04-customer-portal.md`.

## Connecting back

This guide enforces Hard Rules #1, #3, #5, and #8. See `guides/00-principles.md`.
