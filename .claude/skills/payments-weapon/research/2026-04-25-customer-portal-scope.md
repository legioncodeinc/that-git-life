# 2026-04-25 — Customer Portal scope, configuration, and limits

**Query:** Stripe Customer Portal configuration features 2025 self-service

## What the Portal owns (Stripe-hosted)

From [docs.stripe.com/customer-management/configure-portal](https://docs.stripe.com/customer-management/configure-portal) and [the Customer portal configuration object](https://stripe.com/docs/api/customer_portal/configuration), the portal can be configured to expose:

| Feature | Knob |
|---|---|
| `customer_update` | Allowed updates (email, address, phone, name, shipping, tax_id) |
| `invoice_history` | On / off |
| `payment_method_update` | On / off, which payment methods are allowed |
| `subscription_cancel` | On / off, mode (`at_period_end` or `immediately`), proration behavior, optional cancellation-reason capture |
| `subscription_update` | On / off, allowed plan switches, proration behavior |
| `subscription_pause` | On / off (where supported) |

Customization is restricted to:

- A headline (otherwise default fallback `"{{YOUR_BUSINESS_NAME}} partners with Stripe for simplified billing."`).
- Terms of service link, privacy policy link, business name, default return URL.
- One custom domain per account (if enabled).

## What the Portal does NOT own

- **Entitlement provisioning.** Even if the user upgrades inside the portal, your app must catch the resulting webhook (`customer.subscription.updated`) and update its own access logic.
- **Custom plan logic** beyond "switch to one of these allowed Prices".
- **Marketing copy** — the portal has limited surface for upsells; teams that need real upsell copy build their own UI.
- **Access control** — the portal's own session expires, but **your app must verify that the customer requesting a portal session is the logged-in user**. This is the single most-flagged Customer Portal security finding.

## Session creation

```ts
const session = await stripe.billingPortal.sessions.create({
  customer: customerId,
  return_url: 'https://app.example.com/billing',
});
return Response.redirect(session.url);
```

- `customer` must be looked up server-side from the authenticated session — never trusted from the client.
- `return_url` should be a known whitelisted URL on your domain. **Open redirect risk** if you let users specify it.

## Sources

- https://docs.stripe.com/customer-management
- https://docs.stripe.com/customer-management/configure-portal
- https://stripe.com/docs/api/customer_portal/configuration
- https://docs.stripe.com/api/customer_portal/sessions/create
