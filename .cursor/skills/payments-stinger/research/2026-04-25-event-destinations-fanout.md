# 2026-04-25 — Event destinations: EventBridge, Event Grid, fan-out

**Query:** Stripe event destinations AWS EventBridge Azure Event Grid fan-out webhook 2025

## What the feature is

Per [docs.stripe.com/webhooks/configure](https://docs.stripe.com/webhooks/configure.md), [event-destinations/eventbridge](https://docs.stripe.com/event-destinations/eventbridge), and [event-destinations/eventgrid](https://docs.stripe.com/event-destinations/eventgrid):

- Instead of (or in addition to) an HTTPS webhook endpoint, Stripe can deliver events directly to:
  - **Amazon EventBridge** — events arrive at a partner event source, fan out to Lambda, SQS, Step Functions, or any EventBridge target.
  - **Azure Event Grid** — events arrive at a partner topic in your Azure subscription, fan out to Functions, Event Hub, webhooks, etc.
- Maximum **16 event destinations** per Stripe account.
- `azure_event_grid` was added to the type enum in [Dahlia 2026-04-22](https://docs.stripe.com/changelog/dahlia/2026-04-22/azure-event-grid-event-destination).

## Why teams reach for it

- **Fan-out at scale** — one event triggers email + ERP sync + analytics + CRM + Slack notification, each as an independent consumer with its own retry policy.
- **Operational separation** — webhook authentication and infra reliability are managed by AWS/Azure rather than your app's HTTPS endpoint.
- **Event sourcing** — partner topics persist events for replay, easier than reconstructing from Stripe's Workbench.

## Limitations

- **Issuing-authorization is webhook-only.** From the Stripe docs: "You can't subscribe to the `issuing_authorization.request` event type for Event Grid destinations. Instead, set up a webhook endpoint to subscribe to this event type." The reason is that real-time approve/decline requires a synchronous response that fan-out can't give. (Issuing is out of scope for this Stinger, but the limitation generalizes: any event type that requires a synchronous response from your code is webhook-only.)
- **Idempotency is still your problem.** EventBridge / Event Grid don't dedupe. Each consumer must persist event IDs.
- **Partial failure under fan-out** — if 3 of 5 consumers succeed and 2 fail, you have a half-applied event. The `guides/09-common-failure-modes.md` file covers the recovery patterns: per-consumer dead-letter queues, idempotent retry, eventual-consistency reconciliation jobs.

## When a single HTTPS endpoint is enough

- Less than ~10 events/sec sustained.
- One internal consumer (no fan-out needs).
- No regulatory/operational requirement to keep payment events outside of your own infra.

For everything else, EventBridge/Event Grid wins.

## Sources

- https://docs.stripe.com/webhooks/configure
- https://docs.stripe.com/event-destinations/eventbridge
- https://docs.stripe.com/event-destinations/eventgrid
- https://docs.stripe.com/changelog/dahlia/2026-04-22/azure-event-grid-event-destination
