# 09 — Common failure modes

Catalog of the bugs that show up most often in Stripe integrations. Each entry has a diagnostic, a fix, and the severity.

Pulled from Stripe's own issue threads, the Hooklistener writeups (2026), and field experience. Source: `research/2026-04-25-webhook-signature-verification.md` and `research/2026-04-25-event-destinations-fanout.md`.

---

## 1. Webhook delivery latency

**Symptom:** Stripe retries events. Your dashboard shows "delivery succeeded" eventually, but customers see slow provisioning. Webhook handler logs show p95 > 10s.

**Diagnostic:**

- Look at the handler shape — is heavy work (email, CRM sync) running synchronously inside the handler?
- Look for blocking I/O (sync DB queries, sync HTTP calls to other services, log shipping that flushes synchronously).

**Fix:** Return 2xx as soon as the canonical state change is committed. Enqueue side effects. See `guides/02-webhook-verification.md` "Returning fast".

**Severity:** Must-fix if it causes Stripe to retry (loss of throughput); Should-refactor if just slow.

---

## 2. Idempotent retry under timeout

**Symptom:** A flakily-network retry creates two Refunds, two Customers, two Subscriptions for the same logical operation.

**Diagnostic:**

- Search the codebase for `stripe.refunds.create`, `stripe.customers.create`, `stripe.subscriptions.create` calls.
- For each, check whether the request includes an `idempotencyKey` in the request options.

**Fix:** Pass `{ idempotencyKey: '<deterministic-key>' }`. See `guides/05-idempotency.md` "Picking an idempotency key".

**Severity:** Must-fix.

---

## 3. Partial failure during fan-out

**Symptom:** A subscription is provisioned (DB shows entitlements active) but no welcome email was sent. Or the email went out twice.

**Diagnostic:**

- Are side effects inside the webhook handler or in a queue?
- Does each consumer have its own dedup?
- Does any single consumer have more than one trigger path (webhook + a manual replay button + a CLI command)?

**Fix:** Per-consumer DLQ + per-consumer dedup. See `guides/08-event-fanout.md` "Partial failure changes shape".

**Severity:** Must-fix for double side effects; Should-refactor for single missed side effect.

---

## 4. Raw body broken by JSON middleware

**Symptom:** Every webhook 400s with `Webhook payload signature failed verification`. The signature secret is correct.

**Diagnostic:**

```ts
// In Express:
console.log(typeof req.body); // 'object' = parsed (BAD), Buffer = raw (GOOD)
```

In Next.js Pages Router:

```ts
export const config = { api: { bodyParser: false } };
```

**Fix:** Mount `express.raw({ type: 'application/json' })` on the webhook route only, before any global `express.json()`. In Pages Router, disable bodyParser. In App Router, use `req.text()`. See `guides/02-webhook-verification.md` "JSON middleware ate the raw body".

**Severity:** Must-fix.

---

## 5. Signature drift after key rotation

**Symptom:** Signature verification was working; you rotated the endpoint secret in the Dashboard; now everything 400s.

**Diagnostic:** The deployed `STRIPE_WEBHOOK_SECRET` env var still has the old `whsec_*`.

**Fix:** Stripe supports rolling rotation — the old secret stays valid for 24 hours after rotation, and during that window Stripe sends **two `v1=` signatures** (one with each secret). Update your env var **before** the old secret expires; deploys can be staggered. The SDK's `constructEvent` accepts a match against any `v1=` in the header.

If the deploy missed the window: regenerate the secret, update the env var, redeploy. Use `stripe events resend` from Workbench to replay the missed events.

**Severity:** Must-fix during the incident.

---

## 6. Trusting the redirect

**Symptom:** Customer occasionally gets provisioned without a successful payment. Audit logs show provisioning happened on the success-page redirect, before the webhook fired.

**Diagnostic:** Look for code on the `/success?session_id=cs_xxx` page that grants entitlements based on the session ID being present in the URL.

**Fix:** The success page may verify and display state, but **provisioning is webhook-only**. The success page can:

- Re-fetch the session by ID (`stripe.checkout.sessions.retrieve(id)`) and display "you're all set".
- Poll the local DB (populated by webhook) and display a loading state until provisioned.

The success page must **not** write entitlements. See `guides/00-principles.md` Hard Rule #3.

**Severity:** Must-fix.

---

## 7. Hardcoded `price_*` IDs

**Symptom:** Marketing wants to change the price from $19/mo to $24/mo. Engineering has to do an emergency deploy.

**Fix:** Use `lookup_keys`. See `guides/03-subscriptions.md` "Use `lookup_keys`, not `price_*` IDs".

**Severity:** Should-refactor (won't crash, but accumulates as tech debt).

---

## 8. Customer Portal session created with attacker-supplied `customer`

**Symptom:** A red-team finds that visiting `/api/portal?customer=cus_attacker` from any logged-in account opens a portal for someone else's subscription.

**Diagnostic:** The route reads `customer` from the request instead of the authenticated session.

**Fix:** Always derive `customer` from the auth session. See `guides/04-customer-portal.md` "Access control".

**Severity:** Must-fix. Also surface to `security-worker-bee` for broader auth audit.

---

## 9. Missing `processed_webhook_events` dedup

**Symptom:** Customer is charged once but receives two welcome emails, or has their subscription processed twice.

**Diagnostic:** Search for the table; if it doesn't exist or isn't checked before processing, dedup is missing.

**Fix:** `templates/idempotency-table.sql` + the pattern in `guides/05-idempotency.md`.

**Severity:** Must-fix.

---

## 10. Long-running handler blocks Stripe retry detection

**Symptom:** Logs show one handler invocation taking 45 seconds. By the time it returns, Stripe has already retried because of a 30-second timeout, kicking off a parallel handler. Both run concurrently, racing on the dedup row.

**Fix:** Return 2xx within seconds. Use the dedup-then-enqueue pattern. Either insert the dedup row first (so the racing second handler sees the conflict and exits) or use a row-level lock — but the cleanest fix is to keep handlers short.

**Severity:** Must-fix if causing duplicate side effects; Should-refactor if just inefficient.

---

## 11. `payment_intent.succeeded` is the subscription-provisioning hook

**Symptom:** Subscription provisioning sometimes shows the invoice as `null`. Sometimes the subscription doesn't exist yet.

**Diagnostic:** Stripe is on Basil 2025-03-31 or later; the team's handler is reading invoice / subscription state from `payment_intent.succeeded`.

**Fix:** Switch to `checkout.session.completed`. See `guides/07-march-2025-api-change.md` Phase 1.

**Severity:** Must-fix.

---

## 12. Classic-mode invoice assertions on a flexible subscription

**Symptom:** A test that asserted on a specific number of proration line items started failing after a subscription was migrated to flexible mode.

**Fix:** Stop asserting on Stripe's invoice line-item shape. Assert on the **net effect** (charge amount, period boundaries, entitlements derived). See `guides/03-subscriptions.md` "billing_mode: flexible".

**Severity:** Should-refactor (test brittleness, not a payment bug).

---

## How to use this catalog in an audit

For each finding observed in the user's codebase, cite:

1. The numbered failure mode here (e.g., "Failure mode #4: raw body broken by JSON middleware").
2. The file:line where it lives.
3. The fix from this catalog or the linked guide.
4. The severity per the rubric.

The audit report template in `templates/audit-report-template.md` ships this shape.
