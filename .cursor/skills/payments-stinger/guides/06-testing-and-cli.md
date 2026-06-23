# 06 — Testing and the Stripe CLI

How to develop and test against Stripe without ever touching live mode.

Source: [docs.stripe.com/stripe-cli](https://docs.stripe.com/stripe-cli), [docs.stripe.com/workbench](https://docs.stripe.com/workbench), `research/2026-04-25-stripe-cli-and-workbench.md`.

---

## The rules

1. **Live keys (`sk_live_*`) only exist in production deploy infrastructure.** Never in test scripts, fixtures, CI, dev machines, or screenshots.
2. **Local dev uses test mode + Stripe CLI.** `stripe listen` forwards real Stripe-edge requests to `localhost`.
3. **Staging uses test mode + a separate registered webhook endpoint.** Same code path as prod, different secrets.
4. **Production uses live mode.** Self-evident; written here so the contract is explicit.

## Local: the standard dev loop

```bash
# Terminal 1 — start the local app
npm run dev

# Terminal 2 — forward Stripe events to your local handler
stripe listen --forward-to localhost:3000/api/stripe/webhook

# CLI prints something like:
# > Ready! Your webhook signing secret is whsec_abc123... (^C to quit)
```

Set that printed secret in your **local** `.env.local` as `STRIPE_WEBHOOK_SECRET`. **It is not the same as your registered endpoint's secret.** The CLI rotates session secrets every run.

```bash
# Terminal 3 — trigger an event when you want to test
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger invoice.payment_failed
```

`stripe trigger` runs a fixture against the test API and emits the resulting event to all listeners — including your `stripe listen` session and any registered test-mode webhook.

## Test cards

| PAN | Behavior |
|---|---|
| `4242 4242 4242 4242` | Always succeeds |
| `4000 0000 0000 0002` | Always declined (`card_declined`) |
| `4000 0027 6000 3184` | Requires 3DS authentication |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0000 0000 0341` | Attaches but charge declines (good for testing post-Setup-mode flows) |

Full list: [docs.stripe.com/testing#cards](https://docs.stripe.com/testing#cards).

## Fixtures for multi-step setup

`stripe trigger` fires one event at a time. For multi-step recipes (create a customer + a subscription + cancel it), use a fixture:

```bash
stripe fixtures fixtures/sub-flow.json
```

`templates/stripe-cli-fixtures.json` ships an example. Each fixture is a JSON array of API calls to run sequentially, with reference passing (`${customer:id}`, etc.).

## Workbench

Workbench is the in-Dashboard developer console. Use it for:

- **Event log:** every event your account fired in the last ~30 days, with payload, signatures, and per-destination delivery attempts.
- **Resend** any past event to any registered destination — equivalent to `stripe events resend evt_xxx`.
- **API request log:** every API call your account made, with full request and response bodies.
- **Webhook destination management:** add, remove, rotate signing secrets.
- **API version pin and rollback:** 72-hour rollback after upgrading versions.

## CI testing

What CI **should** do:

- Run integration tests against test mode (CI-issued `sk_test_*` from a secret manager).
- Use `stripe trigger` to drive happy-path events.
- Assert on the resulting state in your test DB (entitlements provisioned, `processed_webhook_events` row inserted, etc.).

What CI **must not** do:

- Use `sk_live_*`. Ever. Even "just to check it's still valid."
- Commit fixtures that include real customer emails or PII.
- Capture full event payloads in CI logs that retain beyond the run (PII risk).

## Pre-prod sanity recipe

After a deploy to staging:

```bash
# Replay a known-good production event ID against the staging endpoint
stripe events resend evt_1AbC123 --webhook-endpoint we_staging_xyz
```

This catches signature-verification regressions (e.g., a body-parser middleware accidentally added) before they reach prod.

## What NOT to test

- **The Stripe API itself.** Don't test that `stripe.checkout.sessions.create` returns a session — that's Stripe's job.
- **Live-mode behavior with real cards.** No.
- **Tax calculation correctness.** Test that you call `automatic_tax.enabled = true`; trust Stripe Tax.
- **3DS challenge UX.** Test that you handle the `requires_action` status; don't try to scrape the 3DS popup.

## Findings catalog

| Finding | Severity |
|---|---|
| Live key in repo or CI | Must-fix (rotate immediately + escalate to `security-worker-bee`) |
| Test against live mode | Must-fix |
| `stripe listen` session secret committed in `.env.example` (it'll be wrong tomorrow) | Should-refactor — use `STRIPE_WEBHOOK_SECRET=whsec_LOCAL_SET_BY_STRIPE_LISTEN` placeholder |
| No CI tests for webhook handler | Should-refactor |
| No reconciliation script for production drift | Should-refactor |

## Connecting back

This guide enforces Hard Rules #6 (secrets never leave the server) and #7 (no test ever hits live mode). See `guides/00-principles.md`.
