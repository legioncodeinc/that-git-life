# 2026-04-25 — Stripe CLI and Workbench for testing/operations

**Query:** Stripe CLI listen forward webhooks Workbench replay event 2025

## Stripe CLI essentials

From [docs.stripe.com/stripe-cli](https://docs.stripe.com/stripe-cli):

- **`stripe login`** — opens browser for one-time pairing; stores a restricted key locally.
- **`stripe listen --forward-to localhost:3000/api/stripe/webhook`** — opens a tunnel from Stripe's edge to your local handler. Prints a `whsec_*` for **the listen session** — different from your registered webhook endpoint secret. Use it as the local `STRIPE_WEBHOOK_SECRET`.
- **`stripe trigger checkout.session.completed`** — fires a fixture event of that type at every registered destination.
- **`stripe events resend evt_xxx`** — re-delivers a specific past event to all destinations (or use `--webhook-endpoint we_xxx` to target one).
- **`stripe fixtures fixtures/sub-flow.json`** — runs a multi-step API recipe against test mode (good for setting up state, e.g. a customer + subscription, before triggering an event).

## Workbench

[Workbench](https://docs.stripe.com/workbench) is the in-Dashboard developer console. It exposes:

- Event log with payloads, signature, and delivery attempts per destination.
- API request log (every API call your account made, with full request/response).
- One-click **resend** for any event to any destination.
- API version pin and rollback (72-hour window after a version upgrade).
- Webhook destination CRUD.

## Operating discipline

Captured in `guides/06-testing-and-cli.md`:

- **Local dev:** `stripe listen` running in one terminal, app running in another. The CLI's session secret is set in `.env.local`, never committed.
- **CI:** test mode only, secret keys via the runner's secret manager, never in repo. CI runs `stripe trigger` for happy-path events and asserts on processed-webhook DB rows.
- **Pre-prod sanity:** in staging Stripe account, `stripe events resend` a known-good production event ID against the staging endpoint to verify a deploy didn't break the handler.
- **Never** run any test against `sk_live_*`. Live keys are only set in production deploy infra. There is no test recipe in this Stinger that requires a live key.

## Sources

- https://docs.stripe.com/stripe-cli
- https://docs.stripe.com/workbench
- https://docs.stripe.com/cli/listen
- https://docs.stripe.com/cli/trigger
- https://docs.stripe.com/cli/fixtures
