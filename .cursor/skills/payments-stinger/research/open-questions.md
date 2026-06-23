# Open questions

Questions the Stinger doesn't answer definitively in v1.

1. **Should `payments-worker-bee` ever recommend Payment Element + Payment Intents over Checkout?** Stripe's official guidance is Checkout-first; the Stinger agrees. The exception path (truly bespoke flows) is described in `guides/01-checkout-vs-payment-intents.md`, but the bar is intentionally high. Revisit if Adaptive Pricing parity ships for Payment Intents.
2. **When does Entitlements pay for itself vs local provisioning?** The Stinger's heuristic — "more than 3 plans or more than 5 features" — is a guess from the field, not an official Stripe guideline. Validate over time.
3. **EventBridge vs Event Grid choice for cloud-mixed teams.** No clean answer; the Stinger defers to whatever cloud the rest of the infra runs on.
4. **Stripe Tax adoption** — when is `automatic_tax.enabled = true` enough vs when does the team need a separate tax engine (TaxJar, Avalara)? The Stinger defers; out of scope for v1.
5. **Webhook delivery latency monitoring** — what SLO should teams hold themselves to? Stripe says "respond fast"; teams often hold p95 < 1s end-to-end. Capture an explicit SLO recommendation in v2.
