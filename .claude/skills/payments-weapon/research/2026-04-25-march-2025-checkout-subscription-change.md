# 2026-04-25 — March 2025 Checkout-subscription lifecycle change

**Query:** Stripe March 2025 subscription API change subscriptions only created after successful payment

**Stripe API version affected:** `2025-03-31.basil` and any later version that uses Checkout Sessions in `mode: subscription`.

## Summary

Per the [Basil 2025-03-31 changelog: "Checkout Sessions have lower latency and new update semantics"](https://docs.stripe.com/changelog/basil/2025-03-31/checkout-legacy-subscription-upgrade):

- Checkout Sessions for subscriptions now **postpone creation of the subscription** until **after the user completes payment**.
- This both improves latency on Checkout Session API calls and fixes a common bug where customers couldn't modify billing details after the first payment attempt.
- Failed payment attempts no longer result in an `incomplete` subscription with a finalized invoice.
- An invoice is **not present** until the Checkout Session is in the `complete` state.
- The `payment_intent` field doesn't reference an invoice until the Checkout Session fully completes.

## Direct integration impact

- **Stripe's own recommendation:** if your integration relied on an invoice during the `payment_intent.succeeded` webhook, **switch to `checkout.session.completed`** — that webhook guarantees the invoice is present.
- Subscriptions cannot be observed in `incomplete` state mid-Checkout-flow anymore for this mode.

## Quoted from the changelog

> "Because this change creates the subscription after the user has completed the payment, `payment_intent` doesn't reference an invoice until the Checkout Session fully completes. This means the `checkout.session.status` property must be `complete` before the invoice is created."

> "If your integration currently relies on an invoice during the payment intent webhooks, we recommend that you update your integration to use the `checkout_session.completed` webhook instead, which ensures an invoice is present."

## Implementation rules captured in guides

- `guides/03-subscriptions.md` §"After March 2025": always provision entitlements on `checkout.session.completed`, not on `payment_intent.succeeded`.
- `guides/07-march-2025-api-change.md`: full migration recipe for teams upgrading from pre-Acacia / Acacia → Basil.

## Sources

- https://docs.stripe.com/changelog/basil/2025-03-31/checkout-legacy-subscription-upgrade
- https://docs.stripe.com/changelog/basil — index
