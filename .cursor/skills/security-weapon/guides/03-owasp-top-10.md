# 03 — OWASP Top 10:2025 in Next.js / TypeScript / Node.js (Catalog B)

The OWASP Top 10 refreshed in 2025 (`research/2026-04-24-owasp-top-10-2025.md`). Two new categories (Supply Chain Failures, Mishandling of Exceptional Conditions) and SSRF consolidated into Broken Access Control. The catalog below keeps every pattern from the Angel body and re-slots them against the 2025 list so the Weapon stays current.

> Mapping quick-ref: **A01** Broken Access Control · **A02** Security Misconfiguration · **A03** Software Supply Chain Failures · **A04** Cryptographic Failures · **A05** Injection (incl. XSS) · **A06** Insecure Design · **A07** Identification & Authentication Failures · **A08** Software & Data Integrity Failures · **A09** Logging & Monitoring Failures · **A10** Mishandling of Exceptional Conditions.

---

## B1 — Injection (A05:2025, consolidates XSS + SQLi + Command + NoSQL)

### B1.1 SQL Injection

**Vulnerable:**
```ts
const users = await db.query(`SELECT * FROM users WHERE email = '${email}'`);
const users = await db.query('SELECT * FROM users WHERE id = ' + id);
```

**Secure:**
```ts
const users = await db.query('SELECT * FROM users WHERE email = $1', [email]);
const users = await prisma.user.findMany({ where: { email } });
```

**Scan for:** `db.query(`, `connection.query(`, `pool.query(` followed by template literals or `+` concatenation.

**Severity:** **High**.

### B1.2 NoSQL Injection (MongoDB)

**Vulnerable:**
```ts
UserModel.find({ username: req.query.username });
// attacker sends ?username[$ne]=null → returns all users
```

**Secure:**
```ts
UserModel.find({ username: { $eq: String(req.query.username) } });
// or use Zod .string() coercion first
```

**Scan for:** `.find(`, `.findOne(`, `.update(` with direct user input not wrapped in `$eq`.

**Severity:** **High**.

### B1.3 Command Injection

**Vulnerable:**
```ts
exec(`ls -l ${req.query.folder}`);
```

**Secure:**
```ts
execFile('/usr/bin/ls', ['-l', sanitizedFolder]);
// or avoid shell entirely:
await fs.readdir(path.resolve(ALLOWED_DIR, sanitizedFolder));
```

**Scan for:** `child_process.exec(`, `spawn(` with template literals containing user input.

**Severity:** **High**.

### B1.4 XSS via `dangerouslySetInnerHTML`

**Vulnerable:**
```tsx
<div dangerouslySetInnerHTML={{ __html: userPost.content }} />
```

**Secure:**
```tsx
import DOMPurify from 'isomorphic-dompurify';
const clean = DOMPurify.sanitize(userPost.content, {
  ALLOWED_TAGS: ['p','b','i','em','strong','a','ul','ol','li','br'],
  ALLOWED_ATTR: ['href','target','rel'],
});
<div dangerouslySetInnerHTML={{ __html: clean }} />;
```

Centralize in a `<SafeHTML />` wrapper (see `guides/05-remediation-playbooks.md`).

React's JSX text interpolation (`{value}`) auto-escapes — the risk is only the explicit `dangerouslySetInnerHTML` opt-out.

**Severity:** **High**. Research: `research/2026-04-24-dompurify-xss.md`.

---

## B2 — Cryptographic Failures (A04:2025)

- **Weak password hashing:** `crypto.createHash('md5')` or `sha1` for passwords → **High**. Use `bcrypt` (saltRounds ≥12), `argon2`, or `scrypt`.
- **Missing HTTPS enforcement:** no `Strict-Transport-Security` header → **Medium**.
- **Hardcoded secrets:** string literals resembling API keys, JWT secrets, DB connection strings in source → **Critical** (and rotate).

**Scan for:** `crypto.createHash('md5')`, `crypto.createHash('sha1')` applied to auth-adjacent values; `const .* (secret|key|password) .*= '[^']{16,}'`.

---

## B3 — Broken Authentication (A07:2025)

### B3.1 JWT — `alg: none`

**Vulnerable:** `jwt.verify(token, secret, { algorithms: ['HS256', 'none'] })` → unsigned tokens accepted. **Critical**.

### B3.2 JWT — RS256 → HS256 Algorithm Confusion

**Vulnerable:** `jwt.verify(token, secretOrPublicKey)` with no `algorithms:` pin. Attacker flips header to HS256, signs with the public key as HMAC secret, forged token validates.

**Secure:**
```ts
jwt.verify(token, process.env.JWT_SECRET, {
  algorithms: ['HS256'],      // pin single algorithm
  issuer: 'your-app',
  audience: 'your-api',
});
```

Research: `research/2026-04-24-jwt-algorithm-confusion.md`.

### B3.3 JWK Header Injection

**Vulnerable:** `jwt.verify(token, decoded.header.jwk)` — never use a key derived from the token itself. **Critical**.

### B3.4 Session Fixation

**Vulnerable:** assigning session data without regenerating the session ID first.
```ts
req.session.userId = user.id;        // vulnerable
```
**Secure:**
```ts
await new Promise<void>(r => req.session.regenerate(() => r()));
req.session.userId = user.id;
```

### B3.5 Cookie Flags

Every session / auth cookie must set all three:

| Flag | Purpose |
|---|---|
| `httpOnly: true` | Prevents JS access (mitigates XSS session theft) |
| `secure: true` (or `NODE_ENV === 'production'`) | HTTPS only |
| `sameSite: 'Lax'` or `'Strict'` | CSRF protection |

Missing any → **High**.

**Scan for:** `res.cookie(`, `cookieStore.set(`, `session({` and read the options object.

---

## B4 — Broken Access Control / IDOR (A01:2025)

**Pattern:** Route accepts an ID, reads/mutates the matching resource, without verifying ownership.

**Vulnerable:** `db.findById(req.params.id)` — no `session.user.id === resource.ownerId` check.

**Every route handler accepting an ID parameter must enforce:**
```
authenticated AND (owner OR admin)
```

For state-changing operations, the enforcement scope goes into the query itself:
```ts
await prisma.document.delete({
  where: { id: docId, userId: session.user.id }, // scoped delete
});
```

**Severity:** **High** (Critical if the resource contains financial data or PII).

**Multi-tenant leakage** is a subclass: queries that filter by `userId` but not `tenantId` / `organizationId`. Enforce both in every query in a multi-tenant codebase. See `guides/04-pii-and-financial.md` C7 for field-level-auth parallels.

Worked example: `examples/high-idor-finding.md`.

---

## B5 — Security Misconfiguration (A02:2025, now #2)

### B5.1 Missing Security Headers

Required in `next.config.js` (or `middleware.ts` CSP flow):

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` (tune per app)
- `Content-Security-Policy` (see below)

For Node.js/Express: `helmet()` middleware is the default answer.

Missing any → **Medium** (per-header). Research: `research/2026-04-24-nextjs-security-headers.md`.

### B5.2 CSP — `'unsafe-inline'` and `'unsafe-eval'`

`'unsafe-inline'` in `script-src` defeats most of CSP's XSS mitigation → **Medium**. Use nonces (`middleware.ts` CSP nonce pattern) instead.

`'unsafe-eval'` allows `eval` and `new Function(...)` → **High** unless there is a documented legitimate need (e.g., WASM-to-JS interop).

### B5.3 `NODE_ENV` not `production` in deployment

Leaks verbose error messages and disables optimizations. **Medium**.

---

## B6 — Software Supply Chain Failures (A03:2025, NEW)

- `npm audit --json --audit-level=high` — any Critical/High advisory = block ship.
- CVE check against `research/cve-watchlist.md` Tier 1 list.
- Newly-added dependencies with <100 weekly downloads: investigate for typosquatting / hallucinated deps (see `guides/02-vibe-coding-patterns.md` A5).
- `.cursor/rules/**` and AI rules files: scan for hidden Unicode (A4).
- `package.json` `scripts`: any `postinstall` that runs network calls = investigate.

Research: `research/2026-04-24-semgrep-tooling.md`.

---

## B7 — Broken Access Control (A01:2025, business logic subclass)

### B7.1 Price / Quantity Manipulation

**Vulnerable:** trusting `req.body.totalPrice` or `req.body.amount` as the source of truth for a charge.

**Secure:** recompute on the server from canonical data (product catalog, quantity × unit price stored server-side).

**Negative quantities / amounts** must be rejected at the validation boundary. Zod `.number().int().positive()` or equivalent.

**Severity:** **Critical** (direct financial loss).

---

## B8 — Prototype Pollution (A08:2025 Software & Data Integrity)

Full treatment lives in `guides/02-vibe-coding-patterns.md` A8. Defenses: Zod `.strict()`, `Object.hasOwn`, `Object.create(null)`, Node `--disable-proto=delete`.

Severity **High** (privilege escalation downstream).

Research: `research/2026-04-24-prototype-pollution.md`.

---

## B9 — Path Traversal (A01:2025)

**Vulnerable:** `fs.readFile(path.join('/uploads', req.query.file))` — attacker sends `file=../../etc/passwd`.

**Secure:**
```ts
const ALLOWED = path.resolve('/app/uploads');
const requested = path.resolve(ALLOWED, String(req.query.file));
if (!requested.startsWith(ALLOWED + path.sep)) throw new Error('Path traversal');
const content = await fs.readFile(requested);
```

**Severity:** **High** (arbitrary file read — can escalate to RCE depending on the files).

---

## B10 — Logging & Monitoring Failures (A09:2025) + Mishandling Exceptions (A10:2025)

### B10.1 Verbose Error Responses

**Vulnerable:**
```ts
res.status(500).json({ error: err.message, stack: err.stack });
```

**Secure:**
```ts
console.error('[route]', err);                             // server-side only
return Response.json({ error: 'Internal server error' }, { status: 500 });
```

Stack traces reveal file paths, library versions, and sometimes secrets. **Medium** severity — but **High** if the error message contains user tokens, PII, or SQL fragments.

Worked example: `examples/low-verbose-error.md` (Medium-severity walkthrough).

### B10.2 Insufficient Logging

Auth events (login, logout, password change, permission change, payment) must be logged server-side with timestamp, user ID (or hash), and IP. No logging → **Medium**. Logs containing raw PII → **High** (see `guides/04-pii-and-financial.md` C2).

---

## See also

- `guides/04-pii-and-financial.md` — PII and financial exposure have their own catalog.
- `guides/05-remediation-playbooks.md` — canonical before/after for every rule here.
- `examples/` — one worked case per severity tier.
