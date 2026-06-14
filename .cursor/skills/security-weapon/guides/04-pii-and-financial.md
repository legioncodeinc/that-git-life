# 04 — PII Exposure and Financial Data Patterns (Catalog C)

Financial and PII findings are **Critical or High by construction** (never downgrade — see `guides/00-principles.md`). The blast radius of a leaked card number, SSN, or OAuth token is measured in regulator fines and permanent brand damage, not engineering hours.

This catalog has nine patterns. Each maps to a scan step in `guides/01-scan-procedure.md` and a remediation playbook in `guides/05-remediation-playbooks.md`.

---

## C1 — `NEXT_PUBLIC_` Environment Variable Misuse

**What it is:** any `NEXT_PUBLIC_*` variable is embedded in the **client-side JavaScript bundle** and visible to every user who loads your site.

**Must NEVER be `NEXT_PUBLIC_`:** API keys (`OPENAI_API_KEY`, `GOOGLE_API_KEY`), JWT secrets, database URLs, Stripe **secret** keys (`sk_live_*`, `sk_test_*`), internal auth tokens, webhook secrets.

**Allowed as `NEXT_PUBLIC_`:** app name, public API endpoint base URL, Stripe **publishable** key (`pk_live_*`, `pk_test_*`), Google Analytics ID, Sentry public DSN (but not the auth token).

**Scan for:** grep `.env*` files for `NEXT_PUBLIC_` variables whose name contains `key`, `secret`, `token`, `password`, whose value matches `sk_live_`, `sk_test_`, begins with `-----BEGIN`, or is a JWT-shaped string.

**Severity:** **Critical** (secrets leaked to the client = already compromised; rotate immediately).

**Fix:** move to a non-prefixed env var, reference server-side only, rotate the leaked secret.

---

## C2 — PII in Logging

**What it is:** shipping personally identifiable information into logs, error trackers, or session replay tools.

**Vulnerable:**
```ts
console.log('User:', user);                                        // user has email, phone, SSN
Sentry.captureException(err, { contexts: { payment: cardData } }); // PII in Sentry
Sentry.Replay({ maskAllText: false });                             // records form input
LogRocket.identify(user.id, { email: user.email, ssn: user.ssn });
```

Downstream services (Sentry, LogRocket, Datadog, Rollbar) become unintended PII processors — often crossing GDPR / CCPA boundaries into a whole new compliance posture.

**Severity:** **High** (Critical if PII includes SSN, card number, government ID, health data).

**Fix:** use a `safeLog()` helper that redacts sensitive keys before shipping anything to a log or telemetry sink. Reference implementation: `templates/safe-log.ts`. Playbook: `guides/05-remediation-playbooks.md` §safeLog.

**Keys to redact by default:** `ssn`, `socialSecurityNumber`, `taxId`, `cardNumber`, `card_number`, `cvv`, `cvc`, `password`, `token`, `apiKey`, `secret`, `authorization`, `cookie`, `pin`, `dob`, `dateOfBirth`, `driverLicense`, `passport`.

---

## C3 — PII in URL Query Parameters

**What it is:** sensitive data in GET URLs. URLs are stored in server logs, CDN logs, browser history, analytics, and `Referer` headers to every outbound link.

**Vulnerable:**
```
GET /api/password-reset?email=john@example.com&token=abc123
GET /users?ssn=123-45-6789
```

**Fix:** use POST with request body for any sensitive identifier. For password reset, use a single opaque token in the path segment (`/reset/<token>`) that maps server-side to the email, not the email itself in the query string.

**Severity:** **High**.

**Scan for:** `router.query.(email|ssn|phone|token|password|card)` or `req.query.(...)` accessing sensitive field names in GET routes.

---

## C4 — Over-Fetching Database Records

**What it is:** ORM queries that return all columns by default — including fields the caller never needs (and the caller's consumer never had authorization to see).

**Vulnerable:**
```ts
const user = await prisma.user.findUnique({ where: { id } });
// returns id, email, passwordHash, stripeCustomerId, ssnEnc, internalNotes, ...
return Response.json(user);
```

**Fix:** always use an explicit `select:` (or equivalent) at the boundary. Define a DTO type that enumerates what's OK to leave the server.

```ts
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, displayName: true, avatarUrl: true },
});
```

**Severity:** **High** if the over-fetched fields are PII. **Medium** if merely inefficient.

---

## C5 — Stripe / Payment Processing Violations (PCI DSS)

This is the single costliest category to get wrong. The compliance tier swings from **SAQ A** (~22 self-assessed controls) to **SAQ D** (~300 controls + external ASV scans + quarterly pen tests) the moment raw card data touches your server. Research: `research/2026-04-24-stripe-pci-dss.md`.

### Critical — raw card data on your server

Any of these is **Critical**:
- `req.body.cardNumber`, `req.body.cvv`, `req.body.cvc`, `req.body.exp_month`, `req.body.exp_year`.
- A database column named `card_number`, `cvv`, `cvc`, `pan`, or similar.
- A Stripe charge created with a raw card string instead of a token / PaymentMethod ID.
- Card data logged anywhere (stdout, files, analytics).

**Fix:** migrate to Stripe Elements / Payment Element / Checkout. Card data flows directly from the user's browser to Stripe; your server only ever sees `pm_*` or `pi_*` tokens. Delete the card columns. Rotate Stripe keys. Re-run the audit.

### Critical — missing webhook signature verification

```ts
// vulnerable
const event = JSON.parse(body);

// correct
const event = stripe.webhooks.constructEvent(
  body,
  req.headers.get('stripe-signature'),
  process.env.STRIPE_WEBHOOK_SECRET!
);
```

Without verification, any attacker can POST a forged `checkout.session.completed` event and trigger entitlement grants (subscription upgrades, credit issuance, etc.).

### Worked example

`examples/critical-pci-violation.md` walks the full Critical triage — vulnerable code, finding text, severity rationale, remediation diff.

---

## C6 — Unencrypted PII in Client-Side Storage

**What it is:** storing sensitive data in `localStorage` / `sessionStorage`, both of which are plain-text accessible to any JavaScript on the page (and therefore to any XSS payload).

**Vulnerable:**
```ts
localStorage.setItem('user', JSON.stringify({
  id, email, ssn, cardToken, phone,
}));
```

**Fix:**
- Never store PII or auth tokens in `localStorage` / `sessionStorage`.
- Session state: use an `httpOnly` + `secure` + `sameSite` cookie (`guides/03-owasp-top-10.md` B3.5).
- Profile data needed across pages: fetch from server per session, or cache only non-sensitive fields client-side.

**Severity:** **High**.

**Scan for:** `localStorage.setItem(`, `sessionStorage.setItem(` in files under `src/components/**`, `app/**`, especially those touching profile or payment flows.

---

## C7 — Missing Field-Level Authorization

**What it is:** resolver or endpoint returns a field the caller should not see.

**GraphQL vulnerable:**
```ts
const resolvers = {
  User: {
    ssn: (parent) => parent.ssn,           // no role check
    bankAccount: (parent) => parent.bankAccount,
    internalNotes: (parent) => parent.internalNotes,
  },
};
```

**Fix:** guard each sensitive field:
```ts
const resolvers = {
  User: {
    ssn: (parent, _, ctx) => {
      if (ctx.user.id !== parent.id && ctx.user.role !== 'admin') return null;
      return parent.ssn;
    },
  },
};
```

Or apply `graphql-shield` rules centrally. Better: split sensitive fields into a `UserPrivate` type that's only accessible through an authorized path.

**REST vulnerable:** endpoints that return the full user row when only display fields were needed. Same fix pattern as C4 — explicit `select:`, DTO types.

**Severity:** **High** (Critical if the field is financial or government-ID).

---

## C8 — Server Components Leaking Data to the Client Bundle

**What it is:** a Next.js Server Component passes an ORM model object as a prop to a `'use client'` component. Server Component return values are serialized into the JavaScript bundle sent to the browser — the client receives every field of the model, not just the ones it renders.

**Vulnerable:**
```tsx
// app/profile/page.tsx (Server Component)
export default async function ProfilePage({ params }) {
  const user = await prisma.user.findUnique({ where: { id: params.id } });
  return <UserProfile user={user} />;
}

// components/UserProfile.tsx
'use client';
export function UserProfile({ user }) { return <h1>{user.displayName}</h1>; }
```

The browser receives `user.email`, `user.ssn`, `user.stripeCustomerId`, `user.passwordHash` — even though the UI only uses `user.displayName`.

**Fix:**
```tsx
// app/profile/page.tsx
import 'server-only';
export default async function ProfilePage({ params }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: { displayName: true, avatarUrl: true }, // DTO
  });
  return <UserProfile user={user} />;
}
```

Put `import 'server-only'` in every data-access module so that accidentally importing it from a client component fails at build time.

**Severity:** **High** (Critical if sensitive fields end up in the serialized payload).

---

## C9 — GDPR / Compliance Gaps

Research: `research/2026-04-24-gdpr-17-20.md`.

### C9.1 Right to Erasure (GDPR Article 17)

- **Required:** a `DELETE /api/user` endpoint or equivalent that performs a **hard delete** (not just `deletedAt = NOW()`). Must cascade to analytics, CRM, payment processors, Sentry/LogRocket user records, and — within the backup window — backups.
- **Required:** an audit-log entry recording that the erasure was performed (tamper-evident).
- **Severity:** **Medium** generally. **Critical** if the product stores EU-user personal data on a paid tier (from the Command Brief's explicit rule).

### C9.2 Right to Data Portability (GDPR Article 20)

- **Required:** authenticated endpoint (`GET /api/user/export`) returning a structured, machine-readable copy (JSON preferred) of the data the user provided — profile, posts, uploads, orders.
- **Must be rate-limited** to prevent enumeration.
- **Should deliver via signed short-TTL URL** if the payload is large.
- **Severity:** **Medium**.

### C9.3 Other gaps

- No consent tracking for third-party data sharing → **Medium**.
- No documented retention policy (logs stored indefinitely) → **Medium**.

---

## See also

- `guides/05-remediation-playbooks.md` — canonical fixes for every pattern above.
- `templates/safe-log.ts` — PII-redacting logger reference implementation.
- `examples/critical-pci-violation.md` — C5 worked case.
