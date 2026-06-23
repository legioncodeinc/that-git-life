# 02 — Webhook verification

The most-violated, most-consequential surface in Stripe integrations. Every step here is a Must-fix if missing.

Source: [docs.stripe.com/webhooks/signatures](https://docs.stripe.com/webhooks/signatures), [stripe/stripe-go webhooks.go](https://github.com/stripe/stripe-go/blob/master/webhooks.go), `research/2026-04-25-webhook-signature-verification.md`.

---

## The contract

Stripe sends every webhook with a header:

```
Stripe-Signature: t=1672531200,v1=4f4c...c4d4e
```

- `t=` — the timestamp Stripe signed at (Unix seconds).
- `v1=` — HMAC-SHA256 of `<timestamp>.<raw_body>`, keyed by your endpoint's `whsec_*` secret.
- Multiple `v1=` entries may appear during a key rotation — accept a match against any.
- `v0=` is sent only on test events; reject it for live verification.
- Stripe regenerates the timestamp and signature on each retry — **dedupe by `event.id`, not by signature**.

## The canonical handler shape (Next.js / Express / generic Node)

```ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const WHSEC = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  // 1. RAW body — never JSON.parsed first
  const body = await req.text();
  const sig  = req.headers.get('stripe-signature');
  if (!sig) return new Response('missing signature', { status: 400 });

  // 2. Verify (this also enforces the 300s replay window)
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, WHSEC);
  } catch (err) {
    return new Response('invalid signature', { status: 400 });
  }

  // 3. Dedup by event.id BEFORE processing
  if (await wasProcessed(event.id)) {
    return Response.json({ received: true, duplicate: true });
  }

  // 4. Process inside a transaction; record event.id in the same tx
  await db.transaction(async (tx) => {
    await handle(event, tx);
    await tx.processedWebhookEvent.create({
      data: { eventId: event.id, type: event.type, receivedAt: new Date() },
    });
  });

  // 5. Return 2xx fast — heavy work goes to a queue
  return Response.json({ received: true });
}
```

`templates/webhook-handler.ts` ships both Express and Next.js variants of this shape.

## The five killer mistakes

### 1. JSON middleware ate the raw body

The body Stripe signed is the **exact bytes** they sent. Any middleware that parses JSON first (Express's `app.use(express.json())`, Next.js's automatic body parsing on Pages Router API routes, body-parser, fastify's default JSON parser) **breaks signature verification permanently**.

Fixes:

- **Next.js App Router:** `req.text()` is fine — App Router does not auto-parse.
- **Next.js Pages Router:** `export const config = { api: { bodyParser: false } };` then read raw with `getRawBody`.
- **Express:** `app.post('/webhook', express.raw({ type: 'application/json' }), handler)`. Mount `express.json()` **after** the webhook route, not before.
- **Fastify:** `fastify.addContentTypeParser('application/json', { parseAs: 'buffer' }, ...)` for the webhook route only.

### 2. Trailing-slash redirects rewrite the body

If your CDN or framework redirects `/webhook` → `/webhook/`, the second-hop body may differ (or the POST may be downgraded). Stripe will retry forever, all failing. Register the **exact URL** in Stripe and verify it doesn't redirect.

### 3. Whitespace in the secret

Copy-pasting `whsec_...` from the Dashboard sometimes appends a newline. `STRIPE_WEBHOOK_SECRET=whsec_abc\n` and `STRIPE_WEBHOOK_SECRET=whsec_abc` produce different HMACs. Trim and verify.

### 4. Wrong endpoint secret

Each registered endpoint has its **own** `whsec_*`. The `stripe listen` CLI prints a **separate** session secret for local. Don't cross them.

### 5. Clock skew > 5 minutes

Stripe's SDKs default to a 300-second tolerance. Containers without NTP, dev machines that hibernated, CI runners with stale clocks — all produce false `Webhook timestamp too old` errors. Run NTP. Source: `research/2026-04-25-webhook-signature-verification.md`.

## The 300-second replay window

Stripe says, verbatim:

> "If the signature is valid but the timestamp is too old, you can have your application reject the payload. ... Our libraries have a default tolerance of 5 minutes between the timestamp and the current time."

Don't widen this without a written reason. A widened window means a stolen signed payload remains replay-valid longer. Even when Stripe retries, the **new** delivery has a fresh timestamp.

## Dedup table contract

```sql
CREATE TABLE processed_webhook_events (
  event_id    text PRIMARY KEY,
  event_type  text NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);
```

- Insert with `ON CONFLICT DO NOTHING`. If the insert returns 0 rows, the event was already processed — return early.
- Insert + work inside a single DB transaction so a crash mid-processing leaves nothing recorded; Stripe will retry.

`templates/idempotency-table.sql` ships this. Hand to `db-worker-bee` for indexing/migration.

## Returning fast

Stripe's retry policy assumes a fast 2xx. Heavy work (sending email, syncing CRM, ERP write) goes to a queue. The webhook handler's job is:

1. Verify
2. Dedup
3. Persist the canonical state change (e.g., insert `subscription_active=true`)
4. Enqueue side effects
5. Return 200

If your handler takes more than a few seconds, Stripe retries while you're still working — your dedup table catches it, but you waste a delivery.

## Connecting back to the principles

Every Must-fix in this guide flows from **Hard Rule #4 — every webhook is a contract**. See `guides/00-principles.md`.
