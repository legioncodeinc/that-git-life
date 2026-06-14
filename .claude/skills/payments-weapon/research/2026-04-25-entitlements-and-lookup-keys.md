# 2026-04-25 — `lookup_keys` on Prices and Entitlements for provisioning

**Query:** Stripe Entitlements API provisioning lookup_keys prices 2025

## `lookup_keys` on Prices — why they matter

From [docs.stripe.com/api/prices](https://docs.stripe.com/api/prices):

- `lookup_key` is a **stable, human-readable identifier** (up to 200 chars) attached to a Price.
- Use `prices.list({ lookup_keys: ['gold_monthly', 'gold_yearly'] })` to retrieve Prices **without hardcoding `price_*` IDs in app code**.
- `transfer_lookup_key: true` on a Price create atomically reassigns the key from an old Price to a new one — used to swap pricing without redeploying.
- This is the recommended way to keep Stripe IDs out of your code: app code references `lookup_key`, Stripe holds the mapping to the live `price_*` ID.

## Why this is the discipline

Every team that has hardcoded `price_1Abc...` in code has eventually had to ship an emergency deploy to change a price. With `lookup_keys`, you change the Price in the Dashboard and the same code keeps working.

## Entitlements (provisioning)

Stripe's [Entitlements API](https://docs.stripe.com/billing/entitlements) (GA throughout the Basil/Clover line) is Stripe's answer to the question "what features can this customer use?":

- A **Feature** is a named capability (`api_calls_per_month`, `team_seats`, `premium_support`).
- A Feature is **attached to a Product**.
- When a Customer is on a Subscription whose Product owns Feature X, they have an active Entitlement on Feature X.
- Your app calls `entitlements.activeEntitlements.list({ customer })` to get the current set, or listens for `entitlements.active_entitlement_summary.updated` webhooks.

Trade-off captured in `guides/03-subscriptions.md`:

- For simple products (one or two plans, simple feature flags), local provisioning logic keyed off the Subscription's Price `lookup_key` is enough.
- For multi-feature SaaS with many plans, Entitlements pays for itself by centralizing the access truth in Stripe.

## Sources

- https://docs.stripe.com/api/prices
- https://docs.stripe.com/api/prices/list
- https://docs.stripe.com/billing/entitlements
- https://docs.stripe.com/billing/subscriptions/build-subscriptions
