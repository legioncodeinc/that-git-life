# 2026-04-25 — `billing_mode: flexible` and the Basil → Clover transition

**Query:** Stripe API version 2025-06-30.basil billing_mode flexible release notes

## Timeline

| API version | What changed |
|---|---|
| `2025-06-30.basil` | **Adds** the `billing_mode` parameter (object form, `{type: "flexible" \| "classic"}`). Default remains `classic`; you opt in by setting `billing_mode[type]=flexible` on subscription create / preview / Checkout / quote / schedule, or migrate via the new billing-mode-migrate endpoint. Source: [docs.stripe.com/changelog/basil/2025-06-30/billing-mode](https://docs.stripe.com/changelog/basil/2025-06-30/billing-mode). |
| `2025-08-27.preview` | Default flips to `flexible` for newly-created subscriptions on preview API versions. Source: [docs.stripe.com/changelog/basil/2025-08-27/billing-mode-default-flexible](https://docs.stripe.com/changelog/basil/2025-08-27/billing-mode-default-flexible). |
| `2025-09-30.clover` (GA) | **Default is now `flexible`.** To use `classic` you must set `billing_mode.type = classic` explicitly. Source: [docs.stripe.com/changelog/clover/2025-09-30/billing-mode-default-flexible](https://docs.stripe.com/changelog/clover/2025-09-30/billing-mode-default-flexible). |

The default for any given request depends on the **request's `Stripe-Version`** header (or the SDK pin):
- `2025-09-30.clover` or newer → `flexible`.
- Older → `classic`.

## What flexible mode actually changes

From [docs.stripe.com/billing/subscriptions/billing-mode](https://docs.stripe.com/billing/subscriptions/billing-mode):

- "Flexible billing mode changes how subscriptions calculate prorations, handle trials, and process cancellations."
- Migration to flexible is **one-way** — once a subscription is migrated, you cannot revert it.
- Stripe does **not** recalculate any resources created before migration (pending proration `Invoice Items` are not adjusted).
- After migration, `billing_mode.updated_at` reflects the migration timestamp.
- Affected endpoints: `Subscription#create`, `Invoice#create_preview`, `SubscriptionSchedule#create`, `Quote#create`, `Checkout.Session#create.subscription_data`, Payment Link API.

## Migration recipe captured in the Stinger

Lives in `guides/03-subscriptions.md` and `guides/07-march-2025-api-change.md`:

1. Confirm the SDK pin / `Stripe-Version` header.
2. Audit existing subscriptions for proration assumptions that may differ between classic and flexible.
3. Decide: stay on classic (set `billing_mode.type = classic` explicitly post-Clover), opt in to flexible per-subscription, or migrate the whole book via the migration endpoint.
4. Test with `stripe trigger` against staging.
5. Roll forward; rollback window is 72 hours for API version upgrades via Workbench.

## Quoted from the docs

> "Upgrading your API version to `2025-09-30.clover` or later changes the default billing mode for new subscriptions from `classic` to `flexible`. Flexible billing mode changes how subscriptions calculate prorations, handle trials, and process cancellations. To continue using classic billing mode after upgrading, explicitly set `billing_mode` to `classic` when creating subscriptions. Review the differences before upgrading."

## Sources

- https://docs.stripe.com/changelog/basil/2025-06-30/billing-mode
- https://docs.stripe.com/changelog/basil/2025-08-27/billing-mode-default-flexible
- https://docs.stripe.com/changelog/clover/2025-09-30/billing-mode-default-flexible
- https://docs.stripe.com/billing/subscriptions/billing-mode
- https://docs.stripe.com/changelog/basil
