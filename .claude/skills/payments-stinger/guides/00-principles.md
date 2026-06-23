# 00 — Principles

The non-negotiables. Read on every invocation.

## The four hard rules

### 1. Money is sacred

Every bug here is a chargeback or a refund. Treat every finding as if it ships tomorrow. Two consequences:

- **Bias to "must-fix" on anything that could double-charge, fail to provision, or fail to revoke.** Even a 1-in-10000 race is unacceptable when 10000 customers means 1 incident.
- **Refuse to ship without webhooks.** A "we'll add webhooks later" integration is broken; provisioning by polling or by trusting the redirect is a bug.

### 2. Idempotency-first

Everything that touches money must be idempotent.

- **Webhook handlers** dedupe on `event.id` via a persisted `processed_webhook_events` table. Insert before processing inside the same DB transaction.
- **Outbound API writes** that could be retried under a timeout (creating a Customer, a Subscription, a Refund, a Charge) **must** use an `Idempotency-Key` header. Stripe stores the key for 24 hours and returns the same response on retry.
- **Background jobs** that act on a webhook event re-check the dedup table.

See `guides/05-idempotency.md`.

### 3. Never trust the client

Amounts, prices, plan choices, customer IDs, and entitlements come from **Stripe events** or **server-fetched objects by ID** — never from a query string, hidden form field, POST body, or `localStorage`.

Findings include:

- A redirect handler that reads `?amount=` from the URL and provisions on it.
- A "thank you" page that calls `/upgrade` with the price chosen client-side.
- An entitlement cache populated from a `data-plan="gold"` HTML attribute.

Re-fetch the canonical object (`stripe.checkoutSessions.retrieve(id)`, `stripe.subscriptions.retrieve(id)`) when the value matters.

Source: `research/2026-04-25-webhook-signature-verification.md`.

### 4. Every webhook is a contract

The webhook handler shape is non-negotiable:

1. Read **raw body** before any JSON parsing.
2. Verify `Stripe-Signature` HMAC-SHA256 against the endpoint's `whsec_*` secret.
3. Reject events with timestamp older than **300 seconds** (Stripe SDK default).
4. Persist `event.id` in `processed_webhook_events`; return early on duplicate.
5. Return **2xx fast** (within seconds, not after the work).
6. Process heavy work async (queue, EventBridge, background job).

Skipping any step is a Must-fix. See `guides/02-webhook-verification.md`.

## Six derived rules

### 5. API version awareness

The Stripe API has annual lines (Acacia → Basil → Clover → Dahlia). Two specific calls live here:

- **March 2025 (Basil 2025-03-31):** Checkout Sessions in `mode: subscription` create the subscription **only after successful payment**. Provision on `checkout.session.completed`, not `payment_intent.succeeded`. See `guides/07-march-2025-api-change.md`.
- **June 2025 → September 2025 (Basil 2025-06-30 → Clover 2025-09-30):** `billing_mode: flexible` becomes available, then default. Proration, trial, and cancellation semantics differ. See `guides/03-subscriptions.md`.

Source: `research/2026-04-25-march-2025-checkout-subscription-change.md`, `research/2026-04-25-billing-mode-flexible.md`.

### 6. Secret keys never leave the server

`sk_*` (secret key) and `whsec_*` (webhook signing secret) never appear in:

- Client-side JS bundles
- Environment files committed to git
- Logs (even debug logs)
- CI artifacts retained beyond the run
- Slack messages, screenshots, or shared docs

Publishable keys (`pk_*`) are fine on the client; that's their purpose.

If you find a leaked key, surface to `security-worker-bee` immediately and rotate before continuing.

### 7. No test ever hits live mode

`sk_live_*` only exists in the production deploy infrastructure. Every test, every fixture, every CI run uses test mode keys. Stripe CLI gives you `stripe listen` for local; Workbench replays in test mode for staging.

### 8. Use `lookup_keys`, not raw `price_*` IDs

Hardcoding `price_1Abc123...` in app code means an emergency redeploy when the price changes. Use `lookup_key` strings (`gold_monthly`, `team_seat_yearly`) and resolve via `prices.list({ lookup_keys: [...] })`. Source: `research/2026-04-25-entitlements-and-lookup-keys.md`.

### 9. Cite everything

Every finding has three citations:

- **Where in the user's codebase** — `src/api/stripe/webhook.ts:42`
- **Why it's a finding** — guide section (`guides/02-webhook-verification.md §"Raw body trap"`)
- **External authority** — Stripe doc URL or research note (`research/2026-04-25-webhook-signature-verification.md`)

### 10. Surface, do not audit, security

You flag concerns; `security-worker-bee` audits them. Examples to surface:

- Webhook secret stored in plaintext alongside the codebase.
- Customer email logged in payment-error tracking.
- Portal session created without verifying the requesting user matches the `customer` field.
- Stripe Dashboard access shared via a single account instead of per-user sign-in.

Surface with file:line + the specific concern. Do not write the fix.

---

## Severity rubric

| Severity | Example | Blocks PR? |
|---|---|---|
| **Must-fix** | Missing signature verification; double-charging; provisioning without webhook confirmation; raw body broken by middleware; secret in client bundle; webhook handler not idempotent | **Yes** |
| **Should-refactor** | Hardcoded `price_*` IDs; single endpoint where fan-out is needed; classic billing mode on Clover-pinned SDK without explicit choice; missing `Idempotency-Key` on retryable write | **No — but open follow-up** |
| **Style** | Naming, log format, comment style | **No — suggestion only** |

Calling a style nit "must-fix" destroys trust.

---

## First-move checklist

Before writing any finding:

- [ ] `package.json` read; Stripe SDK version captured.
- [ ] Pinned API version captured (from `apiVersion:` in code, the SDK pin, or the Dashboard).
- [ ] Invocation classified (implementation / audit / webhook debug / subscription migration).
- [ ] Relevant guide(s) identified from `SKILL.md` routing table.
- [ ] Severity rubric in mind.

## Cross-Bee boundaries

| Question type | Owner |
|---|---|
| Database schema, migrations, indexing | `db-worker-bee` |
| Secret storage, PII handling, leaked-key response | `security-worker-bee` |
| Stripe.js / Elements / `<EmbeddedCheckout />` React components | `react-worker-bee` |
| PRD authoring | `library-worker-bee` |
| Post-implementation verification | `quality-worker-bee` |

You *surface* concerns in these areas; you don't author the fix.

## Scope explicitly excluded (v1)

- **Stripe Connect** — marketplaces, multi-party charges, transfers, application fees. Future `connect-worker-bee`.
- **Stripe Issuing, Treasury, Capital, Climate, Terminal.** Different SDK surfaces.
- **Stripe Tax adoption decisions.** Use `automatic_tax.enabled = true` in Checkout when sufficient; otherwise out of scope for v1.

## Example in action

`examples/saas-subscription-end-to-end.md` shows these principles applied to a real subscription flow, with the four hard rules called out at each step.
