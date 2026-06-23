# Research plan — payments-stinger

Forge date: **2026-04-25**.
Today the team is on the **Basil** API line; **Clover** (2025-09-30) is GA and **Dahlia** (2026-04-22) is current preview. Notes in this folder are dated and pinned to the Stripe API version they describe.

## Queries executed

1. "Stripe March 2025 subscription API change subscriptions only created after successful payment" → `2026-04-25-march-2025-checkout-subscription-change.md`
2. "Stripe webhook signature verification HMAC-SHA256 replay protection idempotency" → `2026-04-25-webhook-signature-verification.md`
3. "Stripe Checkout Sessions vs Payment Intents vs Payment Links decision" → `2026-04-25-checkout-vs-payment-intents.md`
4. "Stripe API version 2025-06-30 basil billing_mode flexible release notes" → `2026-04-25-billing-mode-flexible.md`
5. "Stripe Customer Portal configuration features 2025" → `2026-04-25-customer-portal-scope.md`
6. "Stripe Entitlements API provisioning lookup_keys prices" → `2026-04-25-entitlements-and-lookup-keys.md`
7. "Stripe event destinations AWS EventBridge Azure Event Grid fan-out webhook" → `2026-04-25-event-destinations-fanout.md`

## Sources of truth (pinned)

- Canonical reference for signature verification: [stripe/stripe-go webhooks.go](https://github.com/stripe/stripe-go/blob/master/webhooks.go) — read the actual SDK code, not just the docs.
- API changelog index: https://docs.stripe.com/changelog/basil and https://docs.stripe.com/changelog/clover.
- Decision guide (Stripe-authored): https://docs.stripe.com/payments/checkout-sessions-and-payment-intents-comparison.

## Out of scope (explicit, v1)

- **Stripe Connect** (`destination` charges, `application_fee_amount`, `transfer_data`, marketplace flows). Future `connect-worker-bee`.
- **Stripe Issuing, Treasury, Capital, Climate.** Not in this Stinger.
- **Stripe Terminal / Tap to Pay / in-person.** Different SDK surface; future Bee if needed.

## Refresh cadence

Stripe ships a new API version line each year (2025: Acacia → Basil → Clover; 2026: Dahlia and beyond). Refresh research/ on each annual line transition. Re-verify the "Most recent breaking change" call-outs in `guides/07-march-2025-api-change.md` and `guides/03-subscriptions.md` whenever the user's pinned `Stripe-Version` differs from the most recent we've researched.

## Open questions

See `open-questions.md` and `gaps.md`.
