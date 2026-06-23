# 2026-04-25 — Checkout Sessions vs Payment Intents vs Payment Links vs Customer Portal

**Query:** Stripe Checkout Sessions vs Payment Intents vs Payment Links decision guide 2025

## Stripe's official position

From [docs.stripe.com/payments/checkout-sessions-and-payment-intents-comparison](https://docs.stripe.com/payments/checkout-sessions-and-payment-intents-comparison) (verbatim):

> "We recommend the Checkout Sessions API for most integrations. Checkout Sessions allows you to build both a basic payment collection integration and complex checkout flows. If you use PaymentIntents, you must manually build equivalent features in your code, including discount logic, tax calculation, and currency conversion. Some features, such as Adaptive Pricing, require significant effort to replicate with PaymentIntents. Choose PaymentIntents only if you want to own every part of your checkout, and rebuild these capabilities yourself."

## The four-product map

| Product | Hosted by | Code volume | When it wins |
|---|---|---|---|
| **Payment Links** | Stripe | None — created in Dashboard or one API call | Promo links, donations, simple SKUs, no-code teams, share-via-email/QR |
| **Checkout Sessions (hosted)** | Stripe (separate page redirect) | Low — one server-side call, one redirect | **Default for most teams.** Tax + discounts + Adaptive Pricing + 3DS handled by Stripe |
| **Checkout Sessions (embedded)** | Your site (iframe/component) | Low — one server call + `<EmbeddedCheckout />` | Same as hosted, but you keep the user on your domain |
| **Payment Intents + Elements** | Your site (you build the form) | High — you wire tax, discounts, retries, 3DS yourself | Highly custom flows; multi-step checkouts that don't fit Checkout's model |
| **Customer Portal** | Stripe | None — one API call to create a session | Self-serve subscription management (cancel, update payment method, view invoices) |

## Built-in Checkout features that PI requires you to rebuild

Per Stripe's own comparison table:

- Tax calculation (`automatic_tax.enabled = true`)
- Discounts / coupons / promotion codes
- Subscriptions with line items
- Shipping address collection
- Currency conversion (Adaptive Pricing — **only available on Checkout**)
- 3D Secure / SCA orchestration
- Session expiration management
- Built-in "no double charge" guarantee

## When Payment Intents is the right answer

- Multi-merchant cart that pays multiple sellers in one user-facing transaction (note: this often means **Connect**, which is out of scope here).
- Highly bespoke flow where the checkout UX is the product (e.g., a guided multi-step form across many pages).
- Embedded payment widgets inside an existing flow that Checkout's modes can't represent.

For **everything else**, Checkout wins. The Stinger's `guides/01-checkout-vs-payment-intents.md` enforces this opinion.

## Sources

- https://docs.stripe.com/payments/checkout-sessions-and-payment-intents-comparison
- https://docs.stripe.com/payments/online-payments
- https://docs.stripe.com/payments/checkout-sessions
- https://docs.stripe.com/payment-links
- https://docs.stripe.com/customer-management
- https://stripe.com/resources/more/checkout-solutions (2025-10-29)
