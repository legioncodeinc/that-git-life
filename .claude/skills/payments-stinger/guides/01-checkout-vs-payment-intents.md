# 01 — Checkout vs Payment Intents vs Payment Links vs Customer Portal

The decision tree. Stripe has four user-facing money-collection surfaces in non-Connect mode. Pick the right one or you are paying in code complexity for capabilities Stripe already gives you.

Source: [docs.stripe.com/payments/checkout-sessions-and-payment-intents-comparison](https://docs.stripe.com/payments/checkout-sessions-and-payment-intents-comparison) + `research/2026-04-25-checkout-vs-payment-intents.md`.

---

## The four products at a glance

| Product | Hosted by | Code volume | When it wins |
|---|---|---|---|
| **Payment Links** | Stripe | None | No-code, promo links, donations, simple SKUs, one-off invoices via QR/email |
| **Checkout Sessions (hosted)** | Stripe (redirect) | Low — one server call | **Default for most teams.** Tax + discounts + 3DS + Adaptive Pricing |
| **Checkout Sessions (embedded)** | Your domain (component) | Low — one server call + `<EmbeddedCheckout />` | Same as hosted but user stays on your domain |
| **Payment Intents + Elements** | Your domain (you build) | High — wire tax/discounts/3DS yourself | Truly bespoke flows that don't fit Checkout's model |
| **Customer Portal** | Stripe | None | Self-serve subscription management |

## The 90% answer: Checkout Sessions

Stripe's own recommendation, verbatim:

> "We recommend the Checkout Sessions API for most integrations. ... Choose PaymentIntents only if you want to own every part of your checkout, and rebuild [tax, discounts, currency conversion, Adaptive Pricing] yourself."

Built into Checkout, not free with Payment Intents:

- Tax calculation via `automatic_tax.enabled = true`
- Discounts / coupons / promotion codes
- Subscriptions with line items and `lookup_keys`
- Shipping address collection
- Adaptive Pricing (currency conversion) — **only Checkout**
- 3D Secure / SCA orchestration
- Session expiration management
- Built-in "no double charge" guarantee

If a team is reaching for Payment Intents to "save complexity" they have the trade-off backwards.

## The decision tree

```
Is this a one-time, no-code use case (donation, promo link, simple SKU)?
├── YES → Payment Link
└── NO
    │
    Is this self-serve subscription management (cancel, update card, view invoices)?
    ├── YES → Customer Portal (in addition to a Checkout Session for initial signup)
    └── NO
        │
        Do you need to own every step of the checkout UX (multi-page guided flow,
        cart that pays multiple sellers, embedded payment in a non-checkout context)?
        ├── YES → Payment Intents + Elements (and accept the cost)
        └── NO
            │
            Should the user stay on your domain (branding, single-page-app)?
            ├── YES → Checkout Sessions, embedded mode
            └── NO  → Checkout Sessions, hosted mode  ← DEFAULT for most teams
```

## When Payment Intents is genuinely the right answer

- A multi-step guided flow where checkout is the product (e.g., a configurator that prices per-step).
- A multi-merchant cart where the user pays multiple sellers in one transaction (note: this typically means **Connect**, which is out of scope here).
- Embedded payment widgets inside an existing flow that Checkout's `mode: payment` / `mode: subscription` / `mode: setup` don't represent.

If the answer is "we want it to look like our brand" — that's **embedded Checkout**, not Payment Intents.

## Modes within Checkout

| Mode | Use for |
|---|---|
| `payment` | One-time payments — single charge, immediate fulfillment via webhook |
| `subscription` | Recurring billing — note the **March 2025 lifecycle change** (`guides/07`) |
| `setup` | Capture a customer + payment method **without** charging — useful for "save card for later" or trial-then-charge flows where the trial uses other auth |

`mode: setup` is the under-used mode. Reach for it when the team thinks they need a $0 charge — they don't.

## When to add the Customer Portal

The Customer Portal is **always** the right answer for self-serve sub management on a SaaS product. It is not a substitute for the initial Checkout Session — it's an addition. See `guides/04-customer-portal.md`.

## Common misroutes

| Symptom | Often misrouted to | Should be |
|---|---|---|
| "We need to support coupons" | Custom Payment Intents flow | Checkout with `discounts` / `allow_promotion_codes` |
| "We want a custom-looking checkout" | Payment Intents + Elements | **Embedded** Checkout Session |
| "We want to save a card without charging" | Payment Intent with $0.50 then refund (don't) | `mode: setup` Checkout Session |
| "We need recurring billing in one click" | Custom Subscription create + Payment Intent | Checkout `mode: subscription` |
| "We want a simple share-link" | Custom landing page + Checkout | Payment Link (Dashboard or API) |

---

## What this guide rules

When in doubt, **Checkout Sessions, hosted mode** is the answer. Cite this guide. The Bee does not equivocate.
