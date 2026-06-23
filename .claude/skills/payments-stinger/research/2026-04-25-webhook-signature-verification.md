# 2026-04-25 — Webhook signature verification, replay protection, idempotency

**Query:** Stripe webhook signature verification HMAC-SHA256 Stripe-Signature replay protection idempotency

## Summary of the contract

From [stripe.com/docs/webhooks/signatures](https://docs.stripe.com/webhooks/signatures) and the canonical Go SDK (`stripe/stripe-go/webhooks.go`):

- **Header:** `Stripe-Signature` contains a `t=<unix-timestamp>` and one or more `v1=<hex-hmac-sha256>` signatures.
- **Algorithm:** HMAC-SHA256 of the **`signed_payload` string** = `<timestamp>.<raw_request_body>`, keyed by the **endpoint signing secret** (`whsec_*`).
- **Scheme discipline:** Reject everything that isn't `v1`. Stripe sends a `v0` only on test events. Per the docs: "Currently, the only valid live signature scheme is `v1`."
- **Multiple signatures may be present** during a key rotation — the Go SDK loops over all of them and accepts a match against any.
- **Replay window:** Stripe's libraries default to a **5-minute (300-second) tolerance** on the timestamp. Reject older events.
- **Raw body required.** Body parsing (Express's `express.json()`, Next.js's automatic JSON parsing) breaks signature verification. The handler must read the request as **raw bytes / raw string** before any JSON middleware.
- **Retries get fresh signatures.** "Stripe generates the timestamp and signature each time we send an event to your endpoint. If Stripe retries an event (for example, your endpoint previously replied with a non-2xx status code), then we generate a new signature and timestamp for the new delivery attempt." → cannot dedupe by signature; must dedupe by `event.id`.

## Idempotency rules

From the Stripe docs and the [DEV / Hooklistener writeups](https://www.hooklistener.com/learn/stripe-webhooks-implementation):

- Stripe delivers events **at least once**, occasionally out of order, and retries failed events for **up to 3 days**.
- Persist processed `event.id` values in a durable store. Check before processing; record after processing — both inside the same DB transaction whenever possible.
- Re-fetch the canonical object from Stripe by ID when accuracy matters (e.g., re-fetch `PaymentIntent` instead of trusting the snapshot in the event payload).
- Queue heavy work (email, ERP sync, Slack notification) so the webhook returns 2xx fast.

## Canonical handler shape

```ts
const body = await req.text();           // raw bytes/string — NEVER JSON.parsed first
const sig  = req.headers.get('stripe-signature')!;
const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

if (await wasProcessed(event.id)) return ok({ duplicate: true });

await db.transaction(async (tx) => {
  await handle(event, tx);
  await tx.processedWebhookEvent.create({ eventId: event.id, type: event.type });
});
return ok();
```

## Common signature-verification failures (pulled from issue threads)

1. **JSON body middleware** runs before the handler (Express `app.use(express.json())` is the worst offender).
2. **Trailing-slash redirects** rewrite the body — verification fails on the second hop.
3. **Whitespace in the secret** (copy-paste from the Dashboard).
4. **Wrong endpoint secret** (using the account-wide `whsec_*` instead of the per-endpoint one — they differ).
5. **Clock skew** > 5 minutes.

## Sources

- https://docs.stripe.com/webhooks/signatures
- https://github.com/stripe/stripe-go/blob/master/webhooks.go
- https://www.hooklistener.com/learn/stripe-webhooks-implementation
- https://www.hooklistener.com/learn/receiving-stripe-webhooks
- https://dev.to/whoffagents/stripe-webhook-security-signature-verification-idempotency-and-local-testing-1lk3
- https://dev.to/whoffagents/webhook-security-in-nextjs-signature-verification-replay-prevention-and-idempotency-2jnk
