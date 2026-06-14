# Worked Example — Critical: PCI DSS Violation (Raw Card Data on Server)

Demonstrates: `guides/04-pii-and-financial.md` C5 · `guides/01-scan-procedure.md` Step 10 · `guides/05-remediation-playbooks.md` §Stripe PCI.

---

## Scenario

Branch `feat/premium-upgrade` adds a new checkout endpoint. The developer used AI code generation to scaffold the Stripe integration.

## Vulnerable code discovered

`app/api/checkout/route.ts` (lines 1–23):

```ts
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  const { cardNumber, cvv, exp_month, exp_year, amount } = await req.json();

  const charge = await stripe.charges.create({
    source: {
      number: cardNumber,
      cvc: cvv,
      exp_month,
      exp_year,
    },
    amount: Math.round(amount * 100),
    currency: 'usd',
  });

  await prisma.payment.create({
    data: {
      cardNumber,                            // <- raw PAN stored
      last4: cardNumber.slice(-4),
      amount,
      stripeChargeId: charge.id,
    },
  });

  return Response.json({ ok: true, id: charge.id });
}
```

`prisma/schema.prisma` relevant block:

```prisma
model Payment {
  id              String   @id @default(cuid())
  cardNumber      String   // <- raw PAN column
  last4           String
  amount          Float
  stripeChargeId  String
  createdAt       DateTime @default(now())
}
```

## Finding text (report-ready)

> - [x] **PCI DSS / Payment Processing** `app/api/checkout/route.ts:5-17`, `prisma/schema.prisma:Payment.cardNumber` — Route accepts raw card data (`cardNumber`, `cvv`, `exp_month`, `exp_year`) in the request body and the `Payment` table persists the full PAN in a column named `cardNumber`. This pushes the merchant from PCI DSS SAQ A (Stripe-tokenized, ~22 controls) to SAQ D (~300 controls, external ASV scans, quarterly pen-tests). Also: `amount` is trusted from the client request, enabling price manipulation.

## Severity rationale

**Critical.** Two simultaneous Critical findings in a single handler:

1. Raw cardholder data touching the server = immediate PCI DSS scope escalation. The brief's never-downgrade rule applies: financial findings are Critical by construction.
2. Client-trusted `amount` = direct financial loss vector.

## Remediation diff (applied in-session)

`app/api/checkout/create-intent/route.ts` (new):

```ts
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const OrderSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().min(1).max(99),
}).strict();

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

  const { productId, quantity } = OrderSchema.parse(await req.json());

  // Server-side price recomputation — client amount never trusted.
  const product = await prisma.product.findUniqueOrThrow({
    where: { id: productId },
    select: { priceCents: true, currency: true, name: true },
  });
  const amount = product.priceCents * quantity;

  const intent = await stripe.paymentIntents.create({
    amount,
    currency: product.currency,
    metadata: { userId: session.user.id, productId, quantity: String(quantity) },
  });

  return Response.json({ clientSecret: intent.client_secret });
}
```

`app/api/stripe/webhook/route.ts` (new):

```ts
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  if (!sig) return new Response('Missing signature', { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('[stripe webhook] signature verification failed', err);
    return new Response('Invalid signature', { status: 400 });
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      // Grant entitlement scoped by metadata.userId — server-side only
      break;
    default:
      break;
  }
  return new Response('ok');
}
```

`components/CheckoutForm.tsx` (new, replaces the custom card form):

```tsx
'use client';
import { Elements, PaymentElement, useStripe, useElements }
  from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm />
    </Elements>
  );
}
```

Migration (new):

```prisma
// prisma/migrations/.../drop-payment-raw-pan.sql
ALTER TABLE "Payment" DROP COLUMN "cardNumber";
```

Delete the old handler: `rm app/api/checkout/route.ts`.

## Post-fix actions (non-code)

- Rotate Stripe API keys (leaked secrets assumption, even if no evidence of compromise).
- Purge any log aggregator (Datadog, Sentry) records older than the retention window for hits on `cardNumber`.
- Purge existing DB rows: `UPDATE "Payment" SET "cardNumber" = NULL` (in migration, before drop).
- Re-attest SAQ tier with the finance team — confirm SAQ A eligibility now that no PAN touches the server.

## What goes in the audit report

Under **Critical Findings (fixed in this session):**

- [x] **PCI DSS / Payment Processing** `app/api/checkout/route.ts:5-17` — Raw card data in request body, PAN stored in `Payment.cardNumber` column, client-trusted amount. Migrated to Stripe Payment Element + Payment Intents; dropped `cardNumber` column; added server-side price recompute; added webhook signature verification.

Under **Files Changed (remediation):**

| File | Change Summary |
|---|---|
| `app/api/checkout/route.ts` | Deleted (replaced with create-intent + webhook handlers) |
| `app/api/checkout/create-intent/route.ts` | New — creates PaymentIntent with server-side amount |
| `app/api/stripe/webhook/route.ts` | New — verifies `stripe-signature` and fulfills |
| `components/CheckoutForm.tsx` | New — Stripe Elements PaymentElement |
| `prisma/schema.prisma` | Dropped `Payment.cardNumber` column |
| `prisma/migrations/YYYYMMDDHHMMSS_drop_payment_raw_pan/migration.sql` | New migration |

Under **Recommended Follow-Up (architectural):**

- Re-run PCI SAQ attestation with finance now that card data no longer touches the server.
- Rotate Stripe API keys at convenience (no evidence of compromise, but defense-in-depth).
