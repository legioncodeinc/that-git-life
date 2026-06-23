# 04 — Customer Portal

Stripe's hosted self-serve UI for subscribers. Always the right answer for SaaS subscription management. Not a substitute for the initial Checkout Session — an addition.

Source: [docs.stripe.com/customer-management](https://docs.stripe.com/customer-management), [docs.stripe.com/customer-management/configure-portal](https://docs.stripe.com/customer-management/configure-portal), `research/2026-04-25-customer-portal-scope.md`.

---

## What the Portal owns (Stripe-hosted)

Configurable features (Dashboard → Settings → Customer Portal):

| Feature | What it does |
|---|---|
| `customer_update` | Customer can edit email, address, phone, shipping, tax_id |
| `invoice_history` | Past invoices visible and downloadable |
| `payment_method_update` | Add / remove / set default payment method |
| `subscription_cancel` | Cancel mode (`at_period_end` or `immediately`), proration behavior, optional cancellation-reason capture |
| `subscription_update` | Plan switching among allowed Prices, proration behavior |
| `subscription_pause` | Pause / resume (where supported) |

Customization scope:

- Headline (one line — defaults to `"{{YOUR_BUSINESS_NAME}} partners with Stripe for simplified billing."`).
- Terms of service link, privacy policy link, business name, default return URL.
- One custom domain per Stripe account (if enabled).

That's it. The Portal is **deliberately not** a full marketing surface.

## What the Portal does NOT own — and your app must

### Entitlement provisioning

Even when the user upgrades / cancels / pauses inside the Portal, the Portal does **not** update your app's access logic. Stripe fires webhooks (`customer.subscription.updated`, `customer.subscription.deleted`) — your handler is responsible for re-deriving entitlements.

### Custom plan logic beyond switching among allowed Prices

The Portal can switch the user from `gold_monthly` to `gold_yearly`. It cannot:

- Add a one-time setup fee on plan change.
- Apply a custom retention discount.
- Branch on whether the user is in a special segment.

If you need any of those, build a server-side flow that the Portal links out to.

### Custom upsells / retention offers

Limited copy real estate; no in-flow upsells. If retention copy matters, build a pre-cancel intercept on your side that creates the Portal session only after the user dismisses the offer.

### Access control

**This is the most-flagged Customer Portal security finding.** When you create a Portal session:

```ts
const session = await stripe.billingPortal.sessions.create({
  customer: customerId,
  return_url: 'https://app.example.com/billing',
});
return Response.redirect(session.url);
```

`customerId` **must** come from the authenticated user's record. Never accept it from a query string, hidden form field, or POST body. If you do, an attacker logs in as user A and creates a portal session for user B's customer ID — full subscription takeover. Surface to `security-worker-bee` immediately if seen.

### Return-URL safety

`return_url` should be a **whitelisted** URL on your domain. Letting the user supply it is an open redirect — Stripe will faithfully redirect to whatever you pass. Hardcode or whitelist.

## Configuration via API

```ts
const config = await stripe.billingPortal.configurations.create({
  business_profile: {
    headline: 'Manage your subscription',
    privacy_policy_url: 'https://example.com/privacy',
    terms_of_service_url: 'https://example.com/tos',
  },
  features: {
    customer_update: { enabled: true, allowed_updates: ['email', 'address', 'tax_id'] },
    invoice_history: { enabled: true },
    payment_method_update: { enabled: true },
    subscription_cancel: {
      enabled: true,
      mode: 'at_period_end',
      proration_behavior: 'none',
      cancellation_reason: {
        enabled: true,
        options: ['too_expensive', 'missing_features', 'switched_service', 'unused', 'other'],
      },
    },
    subscription_update: {
      enabled: true,
      default_allowed_updates: ['price', 'quantity', 'promotion_code'],
      proration_behavior: 'create_prorations',
    },
  },
  default_return_url: 'https://app.example.com/billing',
});
```

Pin the configuration ID; a session can override the default config by passing `configuration: 'bpc_...'`.

## Session creation — the canonical pattern

```ts
// In an authenticated route — userId comes from session, NOT from request
async function POST(req: Request) {
  const userId = await getAuthenticatedUserId(req);
  const customer = await db.user.findUniqueOrThrow({ where: { id: userId } });

  if (!customer.stripeCustomerId) {
    return new Response('No Stripe customer for this user', { status: 400 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customer.stripeCustomerId,
    return_url: 'https://app.example.com/billing',
  });

  return Response.redirect(session.url, 303);
}
```

## Common mistakes

| Mistake | Severity | Fix |
|---|---|---|
| `customer:` from query string | Must-fix (subscription takeover) | Always read from authenticated session |
| User-supplied `return_url` | Must-fix (open redirect) | Whitelist or hardcode |
| Skipping webhooks "because Portal handles it" | Must-fix (provisioning never updates) | Always handle `customer.subscription.updated` and `customer.subscription.deleted` |
| Reading subscription state from app DB right after a Portal redirect | Should-refactor (race against the webhook) | Fetch from Stripe by ID on the success page, or wait for the webhook |
| Trying to upsell inside the Portal | Should-refactor | Build a pre-Portal intercept page |

## Connecting back

This guide enforces Hard Rules #3 (never trust the client) and #10 (surface security to `security-worker-bee`). See `guides/00-principles.md`.
