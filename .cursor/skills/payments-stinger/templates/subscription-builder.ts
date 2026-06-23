/**
 * payments-stinger — Direct Subscription creation (when not using Checkout).
 *
 * Most teams should NOT use this — Checkout Sessions in mode: subscription
 * is the right tool (see guides/01-checkout-vs-payment-intents.md).
 *
 * Reach for this when:
 *   - You already have a saved payment method (mode: setup completed earlier)
 *     and want to start a subscription server-side without redirecting.
 *   - You're migrating an existing customer onto a new plan from an admin tool.
 *
 * Reflects:
 *   - billing_mode: flexible explicit (Clover-pinned, but be deliberate).
 *   - lookup_keys, not price_* IDs.
 *   - Idempotency on create.
 *   - default_incomplete to handle SCA/3DS gracefully.
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

export interface BuildSubscriptionInput {
  userId: string;
  customerId: string;            // Stripe customer ID
  priceLookupKey: string;        // e.g. 'gold_monthly'
  trialDays?: number;
  defaultPaymentMethodId?: string;
  /** Set to 'classic' only if you have a deliberate reason; default is flexible on Clover+. */
  billingMode?: 'flexible' | 'classic';
}

export async function buildSubscription(
  input: BuildSubscriptionInput,
): Promise<Stripe.Subscription> {
  // Resolve price by lookup_key
  const prices = await stripe.prices.list({
    lookup_keys: [input.priceLookupKey],
    active: true,
    limit: 1,
  });
  const price = prices.data[0];
  if (!price) {
    throw new Error(`No active price for lookup_key=${input.priceLookupKey}`);
  }

  return stripe.subscriptions.create(
    {
      customer: input.customerId,
      items: [{ price: price.id, quantity: 1 }],

      // Be explicit on Clover+ to avoid silent classic/flexible drift.
      billing_mode: { type: input.billingMode ?? 'flexible' },

      // default_incomplete creates the subscription in 'incomplete' status if
      // the first invoice requires payment (SCA/3DS, bank debit mandate).
      // The client confirms the PaymentIntent on the first invoice;
      // subscription transitions to 'active' on success.
      // (See https://docs.stripe.com/api/subscriptions/create — payment_behavior.)
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
        payment_method_types: ['card'],
      },

      ...(input.defaultPaymentMethodId
        ? { default_payment_method: input.defaultPaymentMethodId }
        : {}),

      ...(input.trialDays ? { trial_period_days: input.trialDays } : {}),

      // Expand the latest_invoice's PaymentIntent so the caller can confirm client-side.
      expand: ['latest_invoice.payment_intent'],

      metadata: {
        app_user_id: input.userId,
        lookup_key: input.priceLookupKey,
      },
    },
    {
      // Idempotent: same user + lookup_key produces the same subscription on retry.
      idempotencyKey: `subscription:create:${input.userId}:${input.priceLookupKey}`,
    },
  );
}

/**
 * Switch a subscription's plan (e.g., upgrade/downgrade from admin tool or Portal-bypass flow).
 * Default behavior creates prorations; pass proration_behavior: 'none' to defer to next period.
 */
export async function switchSubscriptionPlan(
  subscriptionId: string,
  newPriceLookupKey: string,
  prorationBehavior: 'create_prorations' | 'none' | 'always_invoice' = 'create_prorations',
): Promise<Stripe.Subscription> {
  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  const currentItem = sub.items.data[0];

  const prices = await stripe.prices.list({
    lookup_keys: [newPriceLookupKey],
    active: true,
    limit: 1,
  });
  const newPrice = prices.data[0];
  if (!newPrice) {
    throw new Error(`No active price for lookup_key=${newPriceLookupKey}`);
  }

  return stripe.subscriptions.update(
    subscriptionId,
    {
      items: [{ id: currentItem.id, price: newPrice.id }],
      proration_behavior: prorationBehavior,
    },
    {
      idempotencyKey: `subscription:switch:${subscriptionId}:${newPriceLookupKey}`,
    },
  );
}

/**
 * Migrate an existing classic-mode subscription to flexible. ONE-WAY.
 * See guides/07-march-2025-api-change.md.
 */
export async function migrateToFlexible(subscriptionId: string): Promise<Stripe.Subscription> {
  return stripe.subscriptions.migrate(subscriptionId, {
    billing_mode: { type: 'flexible' },
  });
}
