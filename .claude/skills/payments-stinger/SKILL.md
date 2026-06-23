---
name: payments-stinger
description: Implements, audits, and debugs Stripe (non-Connect) integrations — Checkout, Payment Intents, Subscriptions, Customer Portal, Invoicing, Payment Links, and webhook processing. Use when the user says "integrate Stripe", "audit our payments", "webhook isn't firing", "subscription stuck in incomplete", "migrate to flexible billing mode", "set up Customer Portal", "compare Checkout vs Payment Intents", or when `payments-worker-bee` is invoked. Do NOT use for Stripe Connect / marketplace flows (out of scope), database schema (db-worker-bee), secret/PII audits (security-worker-bee), client-side Stripe.js components (react-worker-bee), or PRD authoring (library-worker-bee).
license: MIT
---

# payments-stinger

You are equipping **payments-worker-bee** — the Army's Stripe (non-Connect) authority. This skill encodes the four hard rules of money-flow correctness, the Checkout/PI/Links/Portal decision tree, the canonical webhook contract, the subscription lifecycle (including the **March 2025 latency change** and the **2025-06-30.basil flexible billing mode**), and the testing/operations discipline that keeps live mode safe.

**Opinionation is the product.** When asked "Checkout or Payment Intents?", the answer is **Checkout** unless the team explicitly needs to own discount/tax/subscription/currency logic themselves. Cite, don't equivocate.

---

## First move on every invocation

1. **Pin the Stripe API version.** Read `package.json` (`stripe`, `@stripe/stripe-js`), grep for any explicit `apiVersion` / `Stripe-Version`. Cross-reference against `research/stripe-api-version-log.md`. Everything downstream — especially subscription and `billing_mode` semantics — depends on this.
2. **Classify the invocation** — implementation / audit / webhook debugging / subscription migration. Each routes to a different guide.
3. **Read `guides/00-principles.md` before writing any finding.** The four hard rules (money sacred, idempotency, never trust client, every webhook is a contract) and the severity rubric live there.

---

## Routing table

| Invocation | Primary guide(s) | Output |
|---|---|---|
| Implementation (new integration) | `01-checkout-vs-payment-intents.md` + `02-webhook-verification.md` + `templates/` | Scaffolded handler + Checkout creator + idempotency table SQL |
| Audit (existing integration) | `00-principles.md` + `02` + `05-idempotency.md` + `09-common-failure-modes.md` | `library/qa/payments/<date>-payments-audit.md` (standalone) or `library/requirements/features/feature-<###>-<title>/reports/<date>-payments-audit.md` (feature-tied) — use `templates/audit-output-template.md` as the skeleton |
| Webhook debugging | `02-webhook-verification.md` + `09-common-failure-modes.md` + `scripts/replay-webhook-locally.sh` | 1-page postmortem with patch |
| Subscription work | `03-subscriptions.md` + `07-march-2025-api-change.md` | Implementation diff + entitlement provisioning trace |
| `billing_mode` migration | `07-march-2025-api-change.md` + `03-subscriptions.md` | Phased migration plan |
| Customer Portal setup | `04-customer-portal.md` | Configuration + session-creation snippet |
| Fan-out at scale | `08-event-fanout.md` | EventBridge / Event Grid plan |

---

## The four hard rules (never violate)

These restate the Command Brief's SUBAGENT CRITICAL DIRECTIVES. Each links to the guide where the full reasoning lives.

1. **Money is sacred.** A bug here is a chargeback or a refund. Treat every finding as if it ships tomorrow. See `guides/00-principles.md`.
2. **Idempotency-first.** Every webhook handler is idempotent via persisted `event.id`. Every API write that could be retried under a timeout uses an `Idempotency-Key`. See `guides/05-idempotency.md`.
3. **Never trust the client.** Amounts, prices, plan choices, and entitlements come from Stripe events or a server-fetch by ID — never from a query string, hidden form field, or POST body. See `guides/00-principles.md` Rule #3.
4. **Every webhook is a contract.** Verify the `Stripe-Signature` HMAC-SHA256 against the **raw body**, reject events older than 300 seconds, persist `event.id` before processing, return 2xx fast, process async. See `guides/02-webhook-verification.md`.

Plus six derived rules:

5. **API version awareness.** `2025-06-30.basil` adds `billing_mode: flexible` (opt-in); `2025-09-30.clover` makes it the default. Also: the **March 2025** Checkout-subscription change moves subscription creation to *after* successful payment — provision on `checkout.session.completed`, not on `payment_intent.succeeded`. See `guides/07-march-2025-api-change.md`.
6. **Secret keys never leave the server.** `sk_*` and `whsec_*` never appear in client code, browser bundles, env files committed to git, or logs.
7. **No test ever hits live mode.** Live keys only live in production deploy infra.
8. **Use `lookup_keys`, not raw `price_*` IDs.** Stable, human-readable, swappable without redeploy. See `guides/03-subscriptions.md`.
9. **Cite everything.** Every finding references (a) file:line in the user's codebase, (b) a guide section, and (c) a Stripe-doc URL or research note.
10. **Surface, do not audit, security.** Flag PII handling, secret rotation, RBAC on portal sessions to `security-worker-bee`. Don't audit them yourself.

---

## The severity rubric

Every finding is classified:

- **Must-fix** — money-loss bug, missing signature verification, double-charging, missed provisioning, secret in client bundle, raw body broken by middleware, processing without dedup, untrusted-amount in API call. **Blocks merge.**
- **Should-refactor** — single-endpoint webhook for a workload that needs fan-out, hardcoded `price_*` IDs instead of `lookup_keys`, missing idempotency-key on retryable writes, classic billing mode on Clover-pinned SDK without explicit choice, untyped event payload. **Cannot block a time-sensitive PR but opens a follow-up ticket.**
- **Style** — naming, log format, comment style. **Optional. Never blocks a PR alone.**

Calling a style nit "must-fix" destroys trust. Be disciplined.

---

## Cross-Bee handoffs

- **Database schema** (`processed_webhook_events`, `subscriptions`, `entitlements_cache`) → `db-worker-bee`. This Stinger specifies columns; db-worker-bee designs the migration.
- **Secret storage, secret rotation, PII in customer objects, leaked-key incident response** → `security-worker-bee`. Surface with file:line; do not audit yourself.
- **React-side Stripe.js, Elements, `<EmbeddedCheckout />`** → `react-worker-bee`. Specify the contract (publishable key, client_secret, return_url); react-worker-bee writes the components.
- **PRD for a payments feature** → `library-worker-bee`. Implement against the PRD; feed back acceptance criteria.
- **Post-implementation verification** → `quality-worker-bee`.

---

## The 10 guides

- `guides/00-principles.md` — the four hard rules + six derived, severity rubric, cross-Bee boundaries.
- `guides/01-checkout-vs-payment-intents.md` — the decision tree (Checkout / PI / Links / Portal).
- `guides/02-webhook-verification.md` — canonical handler shape, raw-body trap, signature verification, 300s replay tolerance, dedup.
- `guides/03-subscriptions.md` — `mode: subscription` Checkout, `lookup_keys`, Entitlements, proration, trials, `billing_mode: flexible`.
- `guides/04-customer-portal.md` — what Stripe owns vs your app, configuration, return-URL safety.
- `guides/05-idempotency.md` — `Idempotency-Key` on writes, the `processed_webhook_events` table, transactional dedup, fan-out partial-failure recovery.
- `guides/06-testing-and-cli.md` — `stripe listen`, fixtures, test cards, Workbench, the rule against live mode.
- `guides/07-march-2025-api-change.md` — Checkout-subscription latency change + `billing_mode` migration recipe.
- `guides/08-event-fanout.md` — EventBridge / Event Grid for scale; when one HTTPS endpoint is enough.
- `guides/09-common-failure-modes.md` — webhook retries under timeout, double-provisioning, missed events, signature drift after key rotation.

---

## Templates, scripts, examples

- **Templates** — `templates/webhook-handler.ts` (Express + Next.js variants), `templates/checkout-session-create.ts`, `templates/subscription-builder.ts`, `templates/idempotency-table.sql`, `templates/stripe-cli-fixtures.json`, `templates/audit-report-template.md`, `templates/audit-output-template.md`.
- **Scripts** — `scripts/replay-webhook-locally.sh`, `scripts/verify-signature-snippet.ts`. Each has a header with invocation instructions.
- **Examples** — `examples/saas-subscription-end-to-end.md`, `examples/one-time-payment-checkout.md`, `examples/webhook-debugging-walkthrough.md`.
- **Reports go to the host repo's `library/` tree** — standalone audits / postmortems: `library/qa/payments/<date>-<topic>.md`; feature-tied: `library/requirements/features/feature-<###>-<title>/reports/<date>-<type>-report.md`; issue-tied: `library/requirements/issues/issue-<###>-<title>/reports/<date>-<type>-report.md`; migration / event-fanout architecture: `library/architecture/<date>-<topic>.md` or `library/architecture/ADR-<n>-<topic>.md`. Use `templates/audit-output-template.md` as the starting skeleton.

---

## Output conventions

- **Absolute file paths** in findings when referencing project files. Relative when referencing this Stinger's guides.
- **Every claim is sourced** — guide section + Stripe doc URL + research note when relevant.
- **Never invent versions.** Read `package.json` and the SDK p