# 08 — Event fan-out: EventBridge, Event Grid, and when one endpoint is enough

A single HTTPS webhook endpoint is fine until it isn't. This guide is the threshold and the patterns.

Source: `research/2026-04-25-event-destinations-fanout.md`, [docs.stripe.com/event-destinations/eventbridge](https://docs.stripe.com/event-destinations/eventbridge), [docs.stripe.com/event-destinations/eventgrid](https://docs.stripe.com/event-destinations/eventgrid).

---

## The threshold

| Reach for fan-out when... | Stay with one HTTPS endpoint when... |
|---|---|
| > ~10 events/sec sustained | < 10 events/sec |
| 3+ independent consumers (email, ERP, analytics, CRM, Slack) | One internal consumer |
| Operational separation matters (regulatory, on-call ownership) | Single team owns everything |
| You need replay-from-archive longer than Stripe's 30-day retention | Stripe's retention is enough |
| Multi-region delivery for low latency | Single-region is fine |

If none of those are true, **don't add fan-out yet.** Premature fan-out trades operational simplicity for theoretical scale.

## Stripe's options

| Destination type | Best when | Limit |
|---|---|---|
| **HTTPS webhook** | Default; up to 16 endpoints per account | Synchronous response — your HTTPS service must stay up |
| **Amazon EventBridge** | Cloud is AWS; consumers are Lambda / SQS / Step Functions | 16 destinations total (counted alongside HTTPS) |
| **Azure Event Grid** | Cloud is Azure; consumers are Functions / Event Hub / webhooks | Same 16-destination limit |

Stripe added `azure_event_grid` to the destination type enum in [Dahlia 2026-04-22](https://docs.stripe.com/changelog/dahlia/2026-04-22/azure-event-grid-event-destination).

## What changes when you fan out

### Idempotency stays your problem

EventBridge / Event Grid do **not** dedupe. Each downstream consumer must persist the `event.id` it has handled. Use a per-consumer dedup table or composite key — see `guides/05-idempotency.md` "Fan-out partial failure".

### Synchronous responses are no longer possible

The biggest constraint: any event Stripe needs you to **respond** to (e.g., `issuing_authorization.request` for Stripe Issuing real-time decisions) must remain on an HTTPS webhook. Fan-out destinations buffer and forward; they can't synchronously authorize.

For non-Connect Payments, every event we care about (`checkout.session.completed`, `customer.subscription.updated`, `invoice.paid`, etc.) is fire-and-forget — fan-out works fine.

### Partial failure changes shape

In the single-endpoint world, a failure means Stripe retries the same payload to your one endpoint. In the fan-out world, "partial success" is normal: 3 of 5 consumers commit, 2 fail and retry independently. Your reconciliation strategy must assume eventual consistency.

## Pattern: HTTPS webhook for the truth + fan-out for side effects

The recommended architecture for most SaaS:

```
                  Stripe
                    |
                    v
          [HTTPS webhook endpoint]      <-- the SOURCE OF TRUTH
                    |
                    | (commits to processed_webhook_events,
                    |  writes canonical entitlement state)
                    v
              [your DB]
                    |
                    | (post-commit, enqueue side effects)
                    v
           [SQS / Cloud Tasks / Inngest]
              /     |       |        \
            v       v       v         v
        [email]  [ERP]   [analytics] [CRM]
```

Why this beats fan-out from Stripe directly:

- **One source of truth** — your DB is the contract for "did the subscription provision". You don't have to reason about whether 3 of 4 fan-out targets succeeded.
- **Side effects retry independently** — your queue is your retry policy.
- **Lower coupling** — replacing one consumer doesn't touch Stripe configuration.

Reach for native EventBridge / Event Grid only when **the truth itself** is being consumed by services that benefit from cloud-native event routing.

## Pattern: EventBridge directly for archive + fan-out

When operational scale demands it:

```
       Stripe → EventBridge partner source
                    |
            +-------+-------+-------+
            v       v       v       v
       [Lambda]  [SQS]  [Firehose] [DLQ]
       (truth)  (queue)  (S3/Snowflake)
```

Lambda owns the canonical state write; SQS feeds workers; Firehose archives every payload to S3 or a data lake for replay; DLQ catches failed Lambda invocations.

The `truth` Lambda still implements the same dedup discipline as the HTTPS handler — there is no shortcut.

## Pattern: Event Grid into Azure-native consumers

Mirror of the AWS pattern — Functions own the truth, Event Hub buffers, Service Bus dead-letters, Storage archives.

## Findings catalog

| Finding | Severity |
|---|---|
| Fan-out without per-consumer dedup | Must-fix (double side effects) |
| Premature fan-out (single low-volume consumer split into 5 destinations) | Should-refactor (added complexity, no benefit) |
| `issuing_authorization.request` routed to a fan-out destination | Must-fix (synchronous response impossible) — note: Issuing is out of scope for this Stinger |
| No reconciliation job to catch missed/dropped events | Should-refactor |
| Each consumer writes to the same dedup row (race) | Must-fix — composite key `(event_id, consumer_name)` |

## Connecting back

This guide enforces Hard Rule #2 (idempotency) at scale. See `guides/05-idempotency.md`.
