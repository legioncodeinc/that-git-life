# Stripe API version log

Track which API version the Stinger's guides target. Refresh when Stripe ships a new annual version line.

| Forge date | Most recent GA version | Most recent preview | Notes |
|---|---|---|---|
| 2026-04-25 | `2025-09-30.clover` | `2026-04-22.dahlia` | Clover makes `billing_mode: flexible` the default for new subscriptions. Dahlia adds `azure_event_grid` to event destination types. |

## Pinned in this Stinger

The guides assume:

- **Default version recommendation:** `2025-09-30.clover` for new integrations.
- **Migration target if currently on Acacia / pre-Acacia:** Basil (`2025-06-30.basil`) → Clover, in two steps, with the `billing_mode` semantics tested at each step.
- **Webhook signing scheme:** `v1` only.
- **Replay tolerance:** 300 seconds (Stripe SDK default).

## When to refresh

- A new annual line ships (next: post-Dahlia).
- A breaking change lands in any line that affects Checkout, webhooks, subscriptions, or portal — the four core areas of this Stinger.
- The user's pinned `Stripe-Version` in `package.json` or in their Dashboard differs from the most-recent we've researched.
