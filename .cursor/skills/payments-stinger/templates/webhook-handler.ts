/**
 * payments-stinger — Canonical Stripe webhook handler.
 *
 * Implements all four Hard Rules:
 *   1. Money is sacred (commits canonical state inside a DB transaction).
 *   2. Idempotency-first (dedup by event.id).
 *   3. Never trust the client (no untrusted input in the handler).
 *   4. Every webhook is a contract (raw body + signature verification).
 *
 * Two variants below: Next.js (App Router) and Express. Pick one.
 *
 * See also: guides/02-webhook-verification.md, guides/05-idempotency.md.
 */

import Stripe from 'stripe';

// Pin the API version explicitly; do NOT rely on the SDK default.
// See guides/07-march-2025-api-change.md for the version transition recipe.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

const WHSEC = process.env.STRIPE_WEBHOOK_SECRET!;

// ----- Variant A: Next.js App Router (app/api/stripe/webhook/route.ts) -----

export async function POST(req: Request): Promise<Response> {
  // 1. RAW body — App Router does not auto-parse, so req.text() is correct.
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    return new Response('missing signature', { status: 400 });
  }

  // 2. Verify (also enforces the 300s replay tolerance via the SDK default).
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, WHSEC);
  } catch (err) {
    return new Response('invalid signature', { status: 400 });
  }

  // 3. Dedup + 4. Process inside one transaction.
  try {
    await processOnce(event);
  } catch (err) {
    // Re-throw so Stripe retries; never swallow.
    return new Response('handler error', { status: 500 });
  }

  // 5. Return 2xx fast.
  return Response.json({ received: true });
}

// ----- Variant B: Express -----

import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';

export async function expressHandler(
  req: ExpressRequest,
  res: ExpressResponse,
): Promise<void> {
  // Mount this route with express.raw({ type: 'application/json' }) — NOT express.json().
  // req.body is a Buffer here.
  const body: Buffer = req.body;
  const sig = req.header('stripe-signature');
  if (!sig) {
    res.status(400).send('missing signature');
    return;
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, WHSEC);
  } catch (err) {
    res.status(400).send('invalid signature');
    return;
  }

  try {
    await processOnce(event);
  } catch (err) {
    res.status(500).send('handler error');
    return;
  }

  res.json({ received: true });
}

// ----- Shared processing logic -----

/**
 * Inserts the event_id row and processes the event inside a single transaction.
 * If the row already exists, returns early — the event was already handled.
 *
 * Heavy work (email, ERP sync, analytics) goes to a queue inside `handle()`;
 * the transaction commits the canonical state, the queue takes the side effects.
 */
async function processOnce(event: Stripe.Event): Promise<void> {
  await db.transaction(async (tx) => {
    const inserted = await tx.processedWebhookEvent.create({
      data: {
        eventId: event.id,
        eventType: event.type,
        receivedAt: new Date(),
      },
      // ON CONFLICT DO NOTHING semantics — adapt to your ORM
      ignoreDuplicates: true,
    });
    if (!inserted) return; // already processed

    await handle(event, tx);

    await tx.processedWebhookEvent.update({
      where: { eventId: event.id },
      data: { processedAt: new Date() },
    });
  });
}

/**
 * Route by event.type. Keep handlers small; enqueue side effects.
 */
async function handle(event: Stripe.Event, tx: Tx): Promise<void> {
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, tx);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, tx);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, tx);
      break;
    case 'invoice.paid':
      await handleInvoicePaid(event.data.object as Stripe.Invoice, tx);
      break;
    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice, tx);
      break;
    default:
      // Log + ignore. Don't 4xx — Stripe will retry forever.
      break;
  }
}

// ----- Per-event handlers (your business logic) -----

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  tx: Tx,
): Promise<void> {
  // After March 2025, this is THE provisioning hook for subscription-mode Checkout.
  // See guides/07-march-2025-api-change.md.
  if (session.mode === 'subscription' && session.subscription) {
    const sub = await stripe.subscriptions.retrieve(session.subscription as string, {
      expand: ['items.data.price'],
    });
    await provisionFromSubscription(sub, tx);
  } else if (session.mode === 'payment') {
    await fulfillOneTimePayment(session, tx);
  }
}

async function handleSubscriptionUpdated(sub: Stripe.Subscription, tx: Tx): Promise<void> {
  await provisionFromSubscription(sub, tx);
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription, tx: Tx): Promise<void> {
  await revokeEntitlements(sub.customer as string, tx);
}

async function handleInvoicePaid(invoice: Stripe.Invoice, tx: Tx): Promise<void> {
  // Renewal succeeded — extend access period.
  // Re-derive from the subscription rather than trusting the invoice snapshot.
  if (invoice.subscription) {
    const sub = await stripe.subscriptions.retrieve(invoice.subscription as string);
    await provisionFromSubscription(sub, tx);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice, tx: Tx): Promise<void> {
  // Dunning starts. Notify customer; do NOT revoke immediately — Stripe retries.
  await enqueue('payment-failed-notification', { customerId: invoice.customer });
}

// ----- Stubs for the host app to implement -----

declare const db: { transaction<T>(fn: (tx: Tx) => Promise<T>): Promise<T> };
type Tx = any; // your ORM's transaction type
declare function provisionFromSubscription(sub: Stripe.Subscription, tx: Tx): Promise<void>;
declare function fulfillOneTimePayment(session: Stripe.Checkout.Session, tx: Tx): Promise<void>;
declare function revokeEntitlements(customerId: string, tx: Tx): Promise<void>;
declare function enqueue(jobName: string, payload: unknown): Promise<void>;
