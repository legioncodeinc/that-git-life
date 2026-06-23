# 05 — Idempotency

Hard Rule #2. Everything that touches money is idempotent or it's a bug.

Source: `research/2026-04-25-webhook-signature-verification.md`, [docs.stripe.com/api/idempotent_requests](https://docs.stripe.com/api/idempotent_requests).

---

## Two surfaces, two tools

| Surface | Tool |
|---|---|
| **Inbound webhooks** | Persisted `event.id` in a `processed_webhook_events` table |
| **Outbound API writes** that could be retried under timeout | `Idempotency-Key` header on the request |

Both are required. Either alone is incomplete.

## Inbound: the `processed_webhook_events` table

```sql
CREATE TABLE processed_webhook_events (
  event_id     text PRIMARY KEY,
  event_type   text NOT NULL,
  received_at  timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);

-- Index supports operational queries; PK already unique-indexes event_id.
CREATE INDEX idx_pwe_received_at ON processed_webhook_events (received_at DESC);
```

`templates/idempotency-table.sql` ships this. Hand to `db-worker-bee` for migration + tenancy decisions.

### Usage pattern

```ts
const event = stripe.webhooks.constructEvent(body, sig, WHSEC);

// Inside a transaction
await db.transaction(async (tx) => {
  // Insert first; conflict means already processed
  const { rowCount } = await tx.query(
    `INSERT INTO processed_webhook_events (event_id, event_type)
     VALUES ($1, $2) ON CONFLICT (event_id) DO NOTHING`,
    [event.id, event.type],
  );
  if (rowCount === 0) return; // already done

  await handle(event, tx);

  await tx.query(
    `UPDATE processed_webhook_events SET processed_at = now() WHERE event_id = $1`,
    [event.id],
  );
});
```

Why insert first, update later: if the handler crashes mid-processing, the row exists but `processed_at` is null. An ops query (`SELECT * FROM processed_webhook_events WHERE processed_at IS NULL AND received_at < now() - interval '5 minutes'`) finds stuck events to investigate.

### Retention

Stripe retries for up to 3 days. Keep rows for at least 30 days for audit. Older rows can be archived; do not delete the table.

## Outbound: `Idempotency-Key`

When your code creates resources that cost money or commit state — a `Customer`, `Subscription`, `Refund`, `Charge`, `PaymentIntent` confirmation — and the request could time out, **you must pass an `Idempotency-Key`**.

```ts
const refund = await stripe.refunds.create(
  { payment_intent: paymentIntentId, amount: 5000 },
  { idempotencyKey: `refund:${paymentIntentId}:5000` },
);
```

Stripe stores the key + response for **24 hours**. Retrying within that window returns the original response — same `id`, same `status`, no duplicate side effect.

### Picking an idempotency key

The key must be **deterministic** for the operation that should be deduped. Patterns:

- `refund:<payment_intent_id>:<amount>` — refunding the same PI for the same amount is idempotent across retries.
- `subscription:<customer_id>:<lookup_key>` — creating a subscription for a given customer + plan is once.
- `payment_intent_confirm:<intent_id>` — confirming the same intent twice is once.

**Anti-patterns:**

- `Math.random().toString()` — defeats the purpose entirely. **Must-fix.**
- `Date.now().toString()` — same issue at retry time. **Must-fix.**
- Reusing the same key across genuinely-different operations (e.g., the same key for a $5 refund and a $10 refund of the same PI) — Stripe returns the original response, your $10 refund silently doesn't happen. **Must-fix.**

## Fan-out partial failure

When a single webhook event triggers N consumers (email + ERP + analytics + CRM), and 3 succeed but 2 fail:

- The dedup table records the event as processed (assuming you committed inside the handler).
- The 2 failed consumers must retry **without** re-processing in your handler.

Patterns:

1. **Per-consumer dead-letter queue (DLQ).** Each side-effect job has its own queue with retry. The webhook handler's job is to enqueue, not to do — see `guides/02-webhook-verification.md` "Returning fast".
2. **Per-consumer dedup.** Each consumer has its own `processed_for_X` table keyed by `(event_id, consumer_name)`. Even if the same event reaches the consumer twice (e.g., from a manual re-run of the queue), it only sends the email once.
3. **Reconciliation job.** A nightly job re-fetches Stripe state for active subscriptions and corrects local drift. The cheapest insurance against missed events.

For larger fan-out scenarios, see `guides/08-event-fanout.md`.

## When a write **doesn't** need an idempotency key

- Pure reads (`stripe.subscriptions.retrieve(id)`).
- Operations Stripe itself dedupes (the Checkout Session API already prevents double charges per session lifecycle).
- Operations where retry has no side effect by virtue of state (updating a Customer's email — the second update produces the same end state).

When in doubt, add the key. It's cheap; the bug is expensive.

## Findings catalog

| Finding | Severity |
|---|---|
| Webhook handler with no `event.id` dedup | Must-fix |
| Outbound `stripe.refunds.create` with no idempotency key | Must-fix |
| Random idempotency key | Must-fix |
| Dedup check + processing in separate transactions (race) | Must-fix |
| `processed_webhook_events` keyed by something other than `event.id` | Must-fix |
| Fan-out without per-consumer DLQ | Should-refactor |
| No reconciliation job | Should-refactor |

## Connecting back

Hard Rule #2. See `guides/00-principles.md`.
