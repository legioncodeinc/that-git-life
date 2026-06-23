/**
 * payments-stinger — Canonical Checkout Session creation.
 *
 * Reflects:
 *   - Default to Checkout Sessions (Hard Rule from guides/01-checkout-vs-payment-intents.md).
 *   - Use lookup_keys, not raw price IDs (guides/03-subscriptions.md).
 *   - automatic_tax + Adaptive Pricing — let Stripe handle it.
 *   - Server-side resolution; never trust the client (guides/00-principles.md Rule #3).
 *
 * Two flavors: subscription mode and one-time payment mode.
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

// ----- Subscription mode -----

export interface CreateSubscriptionCheckoutInput {
  /** Authenticated user's ID — derived from session, NEVER from request body. */
  userId: string;
  /** Stable lookup_key like "gold_monthly" — NEVER a raw price_* id. */
  priceLookupKey: string;
  /** Optional trial in days (Stripe captures payment method during signup). */
  trialDays?: number;
}

export async function createSubscriptionCheckout(
  input: CreateSubscriptionCheckoutInput,
): Promise<Stripe.Checkout.Session> {
  // 1. Resolve the user's Stripe customer (create if first-time).
  const customer = await ensureStripeCustomer(input.userId);

  // 2. Resolve the price by lookup_key — server-side, no client trust.
  const prices = await stripe.prices.list({
    lookup_keys: [input.priceLookupKey],
    active: true,
    limit: 1,
  });
  const price = prices.data[0];
  if (!price) {
    throw new Error(`No active price for lookup_key=${input.priceLookupKey}`);
  }

  // 3. Create the session.
  return stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customer.id,
    line_items: [{ price: price.id, quantity: 1 }],

    // Stripe handles tax + 3DS + Adaptive Pricing for you. Don't reinvent.
    automatic_tax: { enabled: true },
    allow_promotion_codes: true,

    subscription_data: {
      // Explicit on Clover-pinned SDK; flexible is the default but be deliberate.
      // billing_mode: { type: 'flexible' },  // uncomment to be explicit
      ...(input.trialDays
        ? {
            trial_period_days: input.trialDays,
          }
        : {}),
      metadata: {
        // Echo the userId into the subscription so webhooks can route without lookups.
        app_user_id: input.userId,
      },
    },

    // payment_method_collection 'always' ensures a card is captured during signup.
    // Use 'if_required' only if you genuinely want $0 trials without card capture.
    payment_method_collection: 'always',

    success_url: `${process.env.APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.APP_URL}/billing/canceled`,

    // Let Stripe expire stale sessions automatically.
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour

    metadata: {
      app_user_id: input.userId,
      lookup_key: input.priceLookupKey,
    },
  });
}

// ----- One-time payment mode -----

export interface CreateOneTimeCheckoutInput {
  userId: string;
  priceLookupKey: string;
  quantity?: number;
}

export async function createOneTimeCheckout(
  input: CreateOneTimeCheckoutInput,
): Promise<Stripe.Checkout.Session> {
  const customer = await ensureStripeCustomer(input.userId);

  const prices = await stripe.prices.list({
    lookup_keys: [input.priceLookupKey],
    active: true,
    limit: 1,
  });
  const price = prices.data[0];
  if (!price) {
    throw new Error(`No active price for lookup_key=${input.priceLookupKey}`);
  }

  return stripe.checkout.sessions.create({
    mode: 'payment',
    customer: customer.id,
    line_items: [{ price: price.id, quantity: input.quantity ?? 1 }],
    automatic_tax: { enabled: true },

    // payment_intent_data covers idempotency and metadata for the underlying PI.
    payment_intent_data: {
      metadata: {
        app_user_id: input.userId,
        lookup_key: input.priceLookupKey,
      },
    },

    success_url: `${process.env.APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.APP_URL}/checkout/canceled`,
  });
}

// ----- Setup mode (capture payment method without charging) -----

export async function createSetupCheckout(userId: string): Promise<Stripe.Checkout.Session> {
  const customer = await ensureStripeCustomer(userId);
  return stripe.checkout.sessions.create({
    mode: 'setup',
    customer: customer.id,
    success_url: `${process.env.APP_URL}/billing/payment-method/success`,
    cancel_url: `${process.env.APP_URL}/billing/payment-method/canceled`,
  });
}

// ----- Helpers -----

async function ensureStripeCustomer(userId: string): Promise<Stripe.Customer> {
  // Look up the user; create + persist a Stripe customer if missing.
  // Use idempotency on create so a retry under timeout does not double-create.
  const user = await db.user.findUniqueOrThrow({ where: { id: userId } });
  if (user.stripeCustomerId) {
    return (await stripe.customers.retrieve(user.stripeCustomerId)) as Stripe.Customer;
  }

  const customer = await stripe.customers.create(
    {
      email: user.email,
      metadata: { app_user_id: userId },
    },
    { idempotencyKey: `customer:create:${userId}` },
  );

  await db.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer;
}

declare const db: any;
