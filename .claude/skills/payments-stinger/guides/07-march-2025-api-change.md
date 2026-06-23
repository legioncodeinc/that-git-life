# 07 — The March 2025 API change (and the `billing_mode` migration)

Two related upgrades a team will hit on the way from pre-Acacia to current Clover. This guide is the migration recipe.

Source: `research/2026-04-25-march-2025-checkout-subscription-change.md`, `research/2026-04-25-billing-mode-flexible.md`, [docs.stripe.com/changelog/basil/2025-03-31/checkout-legacy-subscription-upgrade](https://docs.stripe.com/changelog/basil/2025-03-31/checkout-legacy-subscription-upgrade).

---

## The headline changes

### A) March 2025 (Basil 2025-03-31): Checkout-subscription lifecycle

Before: Checkout Sessions in `mode: subscription` created the subscription **before** the customer paid. Failed payments produced an `incomplete` subscription with a finalized invoice. Customers couldn't modify billing details after a failed first attempt.

After: subscriptions are created **only after** the customer completes payment. Failed attempts no longer leave behind incomplete subscriptions or invoices. **The invoice is not present until `checkout.session.status === 'complete'`.**

Stripe's own recommendation (verbatim):

> "If your integration currently relies on an invoice during the payment intent webhooks, we recommend that you update your integration to use the `checkout_session.completed` webhook instead, which ensures an invoice is present."

### B) June 2025 → September 2025: `billing_mode: flexible`

| API version | Default | Behavior |
|---|---|---|
| Acacia and pre-Acacia | classic | Original semantics |
| Basil 2025-06-30 to 2025-08-26 | classic | `billing_mode: flexible` available as opt-in |
| Basil 2025-08-27 (preview) → | flexible | Preview API versions default to flexible |
| Clover 2025-09-30 (GA) → | **flexible** | GA default flips |

Per Stripe: flexible mode "changes how subscriptions calculate prorations, handle trials, and process cancellations." Migration is **one-way**.

---

## Migration recipe

### Phase 0 — Inventory

1. Read `package.json` for the `stripe` SDK version and the `apiVersion:` in your `new Stripe(...)` constructor.
2. Inspect any registered webhook endpoints — their pinned API version may differ from the SDK's.
3. List every code path that:
   - Creates a Checkout Session in `mode: subscription`.
   - Listens for `payment_intent.succeeded`, `invoice.created`, `invoice.finalized` for subscription provisioning.
   - Calls `stripe.subscriptions.create` directly.
   - Asserts on invoice line-item count or proration math.

### Phase 1 — Move provisioning to `checkout.session.completed`

For every `payment_intent.succeeded` handler that reads an invoice or provisions a subscription:

```diff
- case 'payment_intent.succeeded': {
-   const pi = event.data.object;
-   const invoice = await stripe.invoices.retrieve(pi.invoice);
-   await provision(invoice.subscription);
-   break;
- }
+ case 'checkout.session.completed': {
+   const session = event.data.object;
+   if (session.mode !== 'subscription') break;
+   const sub = await stripe.subscriptions.retrieve(
+     session.subscription as string,
+     { expand: ['items.data.price'] },
+   );
+   await provision(sub);
+   break;
+ }
```

Test in test mode:

```bash
stripe trigger checkout.session.completed --override checkout_session=mode=subscription
```

### Phase 2 — Upgrade the SDK and API version pin

1. Bump `stripe` package version in `package.json`.
2. Update the constructor: `new Stripe(secretKey, { apiVersion: '2025-06-30.basil' })` (intermediate step) or directly to `'2025-09-30.clover'`.
3. Upgrade webhook endpoints' API version in the Dashboard / Workbench.
4. Run integration tests. Stripe gives a **72-hour rollback** window after a Workbench API-version upgrade.

### Phase 3 — Decide on billing_mode

If pinning to `2025-09-30.clover` or later, you are on flexible by default. Three choices:

**A. Stay on flexible (recommended for new accounts).**

Just verify proration / trial / cancellation behaviors in test mode against the new defaults. Run `stripe trigger customer.subscription.updated` with plan changes and inspect the resulting invoice preview.

**B. Stay on classic via explicit override.**

Pass `billing_mode: { type: 'classic' }` on every subscription create / Checkout Session / quote / schedule. Findings:

- **Should-refactor**: Clover-pinned SDK without explicit `billing_mode` choice. Implicit drift.

**C. Migrate existing subscriptions to flexible.**

```ts
await stripe.subscriptions.migrate(subId, {
  billing_mode: { type: 'flexible' },
});
```

This is **one-way**. Pre-existing pending proration `Invoice Items` are **not** recalculated. Test extensively before running on production volume.

### Phase 4 — Remove dead code

After the migration:

- Remove any `payment_intent.succeeded` provisioning logic that's now duplicate.
- Remove any code that asserted on classic-mode invoice shapes (line item counts, proration math).
- Remove any "subscription is incomplete, retry payment" UI — that state no longer exists in `mode: subscription` Checkout flows.

---

## What this guide does NOT cover

- **Stripe Connect migration patterns.** Out of scope; future `connect-worker-bee`.
- **Switching billing systems away from Stripe.** Different problem entirely.
- **Pre-2024 Subscriptions API patterns.** If the team is on something older than Acacia, escalate to Stripe Support — there are migration tools they don't expose in self-service.

## Checklist for the audit report

When auditing a team's readiness:

- [ ] `payment_intent.succeeded` is not the subscription-provisioning hook.
- [ ] `checkout.session.completed` is the subscription-provisioning hook.
- [ ] The handler tolerates the invoice not being present until `session.status === 'complete'`.
- [ ] `billing_mode` is set explicitly when creating subscriptions (or the team has consciously chosen to inherit the SDK default).
- [ ] No code asserts on classic-mode invoice line-item shapes if running on flexible.
- [ ] SDK version and `apiVersion:` constructor argument match.
- [ ] Webhook endpoints' Dashboard-pinned API version matches the SDK.

## Connecting back

Hard Rule #5 — API version awareness. See `guides/00-principles.md`.
