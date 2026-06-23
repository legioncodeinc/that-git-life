# Payments Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `payments-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/payments-worker-bee.md`](../../agents/payments-worker-bee.md)
**Stinger:** [`.cursor/skills/payments-stinger/`](../../skills/payments-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

payments-worker-bee is the Army's Stripe (non-Connect) integration authority. It owns money-flow correctness end to end: the product-decision tree (Checkout / Payment Intents / Payment Links / Customer Portal), the webhook contract (signature verification, replay protection, idempotency, fan-out), and the subscription lifecycle including the March 2025 latency change and the 2025-06-30.basil → 2025-09-30.clover `billing_mode: flexible` transition. The Bee is paranoid about idempotency, allergic to logging secret keys, and refuses to claim a subscription is "active" until a webhook confirms it. Stripe Connect, Issuing, Treasury, and Terminal are explicitly out of scope.

## Trigger phrases

Route to `payments-worker-bee` when the user says any of:

- "integrate Stripe"
- "audit our payments"
- "webhook isn't firing / 400ing"
- "subscription stuck in incomplete"
- "migrate to flexible billing mode"
- "set up Customer Portal"
- "compare Checkout vs Payment Intents"
- "implement subscription provisioning"

Or when the request implicitly involves Stripe-shaped concerns in a PR, webhook debugging, billing lifecycle, or payment flow correctness.

## Do NOT route when

- The request involves Stripe Connect, marketplace flows, transfers, application fees, or on-behalf-of charges — route to a future `connect-worker-bee`.
- The request is about database schema for `processed_webhook_events`, `subscriptions`, or `entitlements_cache` — route to `db-worker-bee`.
- The request is about secret storage, secret rotation, PII handling, or leaked-key incident response — route to `security-worker-bee`.
- The request is about client-side Stripe.js components, Elements, or `<EmbeddedCheckout />` — route to `react-worker-bee`.
- The request is about authoring a PRD for a payments feature — route to `library-worker-bee`.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- The Stripe SDK version from `package.json` and any explicit `apiVersion` / `Stripe-Version` in the codebase
- The invocation type: implementation, audit, webhook debugging, or subscription migration
- The relevant files or code area (webhook handler, Checkout creation, subscription logic, etc.)
- The Stripe API version pinned to the registered webhook endpoint in the Dashboard (optional — Bee will grep for it if absent)

## Outputs the Bee produces

- **Audits:** `library/qa/payments/<date>-payments-audit.md` (standalone) or `library/requirements/features/feature-<###>-<title>/reports/<date>-payments-audit.md` (feature-tied), using `templates/audit-output-template.md` as skeleton
- **Implementation:** scaffolded webhook handler (`templates/webhook-handler.ts`), Checkout session creator (`templates/checkout-session-create.ts`), and idempotency table SQL (`templates/idempotency-table.sql`)
- **Webhook debugging:** 1-page postmortem with patch, following `examples/webhook-debugging-walkthrough.md` Step 7
- **Subscription / billing_mode migration:** phased migration plan + implementation diff with entitlement provisioning trace
- **Archive copy:** every run is also stored at `reports/YYYY-MM-DD-<slug>.md` inside the stinger

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- **Money is sacred** — treat every finding as if it ships tomorrow; a bug here is a chargeback or a refund.
- **Idempotency-first** — every webhook handler dedups on `event.id`; every retryable API write uses an `Idempotency-Key`.
- **Never trust the client** — amounts, prices, plan choices, and entitlements must come from Stripe events or server-fetches by ID, never from query strings or POST bodies.
- **Every webhook is a contract** — raw body + HMAC-SHA256 signature verify + 300s replay tolerance + persisted dedup + fast 2xx + async side effects; skipping any step is a Must-fix.
- **API version awareness** — provision subscriptions on `checkout.session.completed` (not `payment_intent.succeeded`) after March 2025; treat `billing_mode: flexible` as the default from the Clover API version onward.
- **Secret keys never leave the server** — `sk_*` and `whsec_*` in client bundles, committed env files, or logs are immediate Must-fix items; surface to `security-worker-bee`.
- **No test ever hits live mode** — `sk_live_*` only in production deploy infra.
- **Use `lookup_keys`, not raw `price_*` IDs** — stable, human-readable, and swappable without a redeploy.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
