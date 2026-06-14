# 05 — Remediation Playbooks

Canonical before/after code for every vulnerability class the Weapon covers. Use these verbatim — they are reviewed, sourced, and keep the blast radius of each fix minimal.

Guiding principle: **change only what closes the vulnerability**. No opportunistic refactoring. If a fix requires architectural work (e.g., migrating off raw SQL), implement a minimal secure wrapper for the current finding and document the larger refactor in the report's "Recommended Follow-Up" section.

---

## §IDOR — Object-level authorization

**Before:**
```ts
// app/api/documents/[id]/route.ts
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return new Response('Unauthorized', { status: 401 });
  const doc = await prisma.document.findUnique({ where: { id: params.id } });
  if (!doc) return new Response('Not found', { status: 404 });
  return Response.json(doc);
}
```

**After:**
```ts
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

  const doc = await prisma.document.findFirst({
    where: { id: params.id, userId: session.user.id }, // scoped read
    select: { id: true, title: true, content: true },  // explicit fields
  });
  if (!doc) return new Response('Not found', { status: 404 }); // 404, not 403 (no enumeration)

  return Response.json(doc);
}
```

**Why `findFirst` + scoped `where`:** the query itself enforces authorization. No chance of a later refactor introducing the bug by forgetting a separate check. Returns 404 instead of 403 so unauthorized callers cannot distinguish "doesn't exist" from "not yours" (no enumeration oracle).

For state-changing queries (`UPDATE`, `DELETE`), use `updateMany` / `deleteMany` with the scoped `where` so the operation is a no-op rather than a leak when unauthorized.

Guide cross-ref: `guides/02-vibe-coding-patterns.md` A1, `guides/03-owasp-top-10.md` B4.

---

## §Server Actions — auth + origin hardening

```ts
// app/actions/update-profile.ts
'use server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { z } from 'zod';

const ProfileSchema = z.object({
  displayName: z.string().min(1).max(80),
  avatarUrl: z.string().url().optional(),
}).strict(); // rejects unknown keys — mitigates prototype pollution

export async function updateProfile(input: unknown) {
  // 1. Identity — framework does NOT do this for you
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  // 2. Defense-in-depth origin check (redundant with Next's built-in
  //    check, but protects self-hosters on older Next versions)
  const h = headers();
  const origin = h.get('origin');
  const host = h.get('host');
  if (origin === 'null' || (origin && new URL(origin).host !== host)) {
    throw new Error('Cross-origin request rejected');
  }

  // 3. Validate
  const data = ProfileSchema.parse(input);

  // 4. Scoped mutation
  await prisma.user.update({
    where: { id: session.user.id },
    data,
  });
}
```

Guide cross-ref: `guides/02-vibe-coding-patterns.md` A6. Research: `research/2026-04-24-server-actions-csrf.md`.

---

## §JWT verification — pinned algorithm

**Before:**
```ts
jwt.verify(token, secret); // algorithm not pinned
jwt.verify(token, secret, { algorithms: ['HS256', 'none'] }); // 'none' accepted
```

**After:**
```ts
const decoded = jwt.verify(token, process.env.JWT_SECRET!, {
  algorithms: ['HS256'],                     // pin exactly one
  issuer: process.env.JWT_ISSUER,
  audience: process.env.JWT_AUDIENCE,
  clockTolerance: 30,                        // seconds
}) as { sub: string; roles: string[] };
```

If using RS256, pin to RS256 — never include HS256 alongside RS256 in the algorithm list (defeats the defense against algorithm-confusion attacks).

Guide cross-ref: `guides/03-owasp-top-10.md` B3. Research: `research/2026-04-24-jwt-algorithm-confusion.md`.

---

## §Prototype pollution — Zod strict + Object.hasOwn

**Before:**
```ts
const merged = Object.assign({}, defaults, JSON.parse(req.body));
if (user.isAdmin) { grantAccess(); } // reads polluted prototype
```

**After:**
```ts
import { z } from 'zod';

const BodySchema = z.object({
  theme: z.enum(['light', 'dark']),
  notifications: z.boolean(),
}).strict(); // rejects __proto__, constructor, prototype

const parsed = BodySchema.parse(JSON.parse(req.body));
const merged = { ...defaults, ...parsed };

// For flag reads, prefer Object.hasOwn over plain property access
if (Object.hasOwn(user, 'isAdmin') && user.isAdmin) { grantAccess(); }
```

For internal lookup maps, use `Object.create(null)` or `Map`:
```ts
const cache = Object.create(null);              // or: new Map()
cache[safeKey] = value;
```

Guide cross-ref: `guides/02-vibe-coding-patterns.md` A8. Research: `research/2026-04-24-prototype-pollution.md`.

---

## §SafeHTML — wrap every `dangerouslySetInnerHTML`

`src/components/SafeHTML.tsx`:
```tsx
import DOMPurify from 'isomorphic-dompurify';

const CONFIG = {
  ALLOWED_TAGS: ['p','b','i','em','strong','a','ul','ol','li','br','blockquote','code','pre','h1','h2','h3'],
  ALLOWED_ATTR: ['href','target','rel'],
  ALLOW_DATA_ATTR: false,
} as const;

// Post-processing hook: force noopener noreferrer on _blank anchors
DOMPurify.addHook?.('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

export function SafeHTML({ html, className }: { html: string; className?: string }) {
  const clean = DOMPurify.sanitize(html, CONFIG);
  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
}
```

Then replace every direct `dangerouslySetInnerHTML` call with `<SafeHTML html={...} />`. This also makes it trivial for CI to ban direct usage (`eslint-disable` everywhere except in `SafeHTML.tsx`).

Guide cross-ref: `guides/03-owasp-top-10.md` B1.4. Research: `research/2026-04-24-dompurify-xss.md`.

---

## §safeLog — PII-redacting logger

Reference implementation: `templates/safe-log.ts`. Drop it into `src/lib/safe-log.ts`.

Usage replaces every `console.log` / `Sentry.captureException` in PII paths:

```ts
import { safeLog } from '@/lib/safe-log';

safeLog.info('user.updated', { userId: user.id, user });
// Automatically strips: ssn, cardNumber, cvv, password, token, apiKey, secret,
// authorization, cookie, pin, dob, driverLicense, passport
```

Guide cross-ref: `guides/04-pii-and-financial.md` C2.

---

## §Stripe PCI — Payment Element migration

**Before (Critical, SAQ D):**
```ts
// api/pay/route.ts
export async function POST(req: Request) {
  const { cardNumber, cvv, exp_month, exp_year, amount } = await req.json();
  const charge = await stripe.charges.create({
    source: { number: cardNumber, cvc: cvv, exp_month, exp_year },
    amount: req.body.amount,
    currency: 'usd',
  });
  return Response.json(charge);
}
```

**After (SAQ A):**
```tsx
// client
import { Elements, PaymentElement, useStripe, useElements }
  from '@stripe/react-stripe-js';

function Checkout({ clientSecret }: { clientSecret: string }) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm />
    </Elements>
  );
}
```
```ts
// api/create-intent/route.ts
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

  const { productId, quantity } = ProductOrderSchema.parse(await req.json());
  const product = await prisma.product.findUniqueOrThrow({ where: { id: productId } });
  const amount = product.priceCents * Math.max(1, Math.min(quantity, 99)); // server-side recompute

  const intent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    metadata: { userId: session.user.id, productId },
  });
  return Response.json({ clientSecret: intent.client_secret });
}

// api/stripe/webhook/route.ts
export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  const event = stripe.webhooks.constructEvent(
    body, sig!, process.env.STRIPE_WEBHOOK_SECRET!
  );
  // ... handle event.type
  return new Response('ok');
}
```

Companion actions: delete any `card_number` / `cvv` database columns (write a migration), rotate Stripe keys, purge historical raw card data from logs and backups.

Guide cross-ref: `guides/04-pii-and-financial.md` C5. Research: `research/2026-04-24-stripe-pci-dss.md`.

---

## §Security headers — minimum viable `next.config.js`

```js
// next.config.js
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

module.exports = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};
```

CSP with nonces belongs in `middleware.ts` (see Next.js CSP guide). Don't ship an `'unsafe-inline'` CSP as the fix — it's worse than nothing because it gives a false sense of security.

Guide cross-ref: `guides/03-owasp-top-10.md` B5. Research: `research/2026-04-24-nextjs-security-headers.md`.

---

## §Path traversal — resolved-path prefix check

```ts
import { resolve, sep } from 'node:path';
import { readFile } from 'node:fs/promises';

const UPLOADS_DIR = resolve(process.cwd(), 'uploads');

export async function GET(req: Request, { params }: { params: { file: string } }) {
  const requested = resolve(UPLOADS_DIR, params.file);
  if (!requested.startsWith(UPLOADS_DIR + sep)) {
    return new Response('Bad request', { status: 400 });
  }
  const content = await readFile(requested);
  return new Response(content);
}
```

Guide cross-ref: `guides/03-owasp-top-10.md` B9.

---

## §Verbose errors — safe response + full server log

```ts
export async function POST(req: Request) {
  try {
    // ... work
  } catch (err) {
    console.error('[POST /api/x]', err); // full detail, server-side only
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

Guide cross-ref: `guides/03-owasp-top-10.md` B10.1. Example: `examples/low-verbose-error.md` (walks the Medium severity reasoning).

---

## §GDPR — minimal erasure + portability endpoints

```ts
// app/api/user/delete/route.ts
export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });
  const userId = session.user.id;

  await prisma.$transaction([
    prisma.post.deleteMany({ where: { userId } }),
    prisma.session.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  // Fan-out to downstream processors (best effort, log failures)
  await Promise.allSettled([
    stripe.customers.del(session.user.stripeCustomerId).catch(() => {}),
    sentry.deleteUser(userId).catch(() => {}),
    analytics.deleteUser(userId).catch(() => {}),
  ]);

  await auditLog.write({ kind: 'user.erasure', subject: userId, at: new Date() });
  return new Response(null, { status: 204 });
}

// app/api/user/export/route.ts
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });
  const userId = session.user.id;

  const data = {
    user: await prisma.user.findUniqueOrThrow({ where: { id: userId }, select: PUBLIC_USER_FIELDS }),
    posts: await prisma.post.findMany({ where: { userId } }),
    orders: await prisma.order.findMany({ where: { userId } }),
  };

  return new Response(JSON.stringify(data, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename=user-${userId}-export.json`,
    },
  });
}
```

Guide cross-ref: `guides/04-pii-and-financial.md` C9. Research: `research/2026-04-24-gdpr-17-20.md`.

---

## §CVE upgrades — Next.js & React patch bump

```bash
# CVE-2025-29927 (Next.js middleware bypass)
pnpm up next@^14.2.25    # or: pnpm up next@^15.2.3

# CVE-2025-55182 (React2Shell) + CVE-2025-66478
pnpm up react@^19.2.1 react-dom@^19.2.1
# then also: pnpm up next  # to pick up CVE-2025-66478 framework fix

# verify
pnpm why react
pnpm why next
pnpm run type-check
pnpm test
pnpm run build
```

For self-hosted Next.js deployments that cannot upgrade immediately, block the `x-middleware-subrequest` header at the reverse proxy / WAF as a stopgap for CVE-2025-29927. This is a temporary measure, not a fix.

Guide cross-refs: `guides/02-vibe-coding-patterns.md` A2, A3; `guides/06-cve-tracker.md`.

---

## See also

- `templates/safe-log.ts` — PII-redacting logger.
- `templates/security-audit-report.md` — the Phase 4 report shape.
- `examples/critical-pci-violation.md` — PCI playbook applied end-to-end.
