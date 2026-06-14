# Worked Example — Medium: Missing Security Header (HSTS)

Demonstrates: `guides/03-owasp-top-10.md` B5 · `guides/01-scan-procedure.md` Step 4 · `guides/05-remediation-playbooks.md` §Security headers · Medium-severity "fix if cheap" judgment call.

---

## Scenario

Routine audit of a Next.js 15 project. No code change in the branch touches configuration, but the scan procedure requires checking `next.config.js` for baseline security headers.

## Vulnerable configuration discovered

`next.config.js`:

```js
/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.example.com' }],
  },
  // no headers() export
};
```

The project is deployed over HTTPS (production domain uses a wildcard cert), but there is no `Strict-Transport-Security` header. On first visit, a downgrade attacker could MITM the initial HTTP → HTTPS redirect. Also missing: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, CSP.

## Finding text (report-ready)

> - [ ] **Security Misconfiguration — Missing HSTS header** `next.config.js` — No `Strict-Transport-Security` header configured. First-visit downgrade / MITM risk on initial navigation. Additional missing baseline headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Content-Security-Policy`.

## Severity rationale

**Medium.** No direct data leak or bypass, but a well-known defense-in-depth gap. The Medium threshold says: **document; fix only if the patch is under ~5 lines** — here it is. Fixing in this session.

## Remediation diff (applied in-session)

```diff
--- a/next.config.js
+++ b/next.config.js
@@ -1,7 +1,27 @@
 /** @type {import('next').NextConfig} */
+const securityHeaders = [
+  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
+  { key: 'X-Content-Type-Options', value: 'nosniff' },
+  { key: 'X-Frame-Options', value: 'DENY' },
+  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
+  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
+];
+
 module.exports = {
   reactStrictMode: true,
   images: {
     remotePatterns: [{ protocol: 'https', hostname: 'cdn.example.com' }],
   },
+  async headers() {
+    return [{ source: '/:path*', headers: securityHeaders }];
+  },
 };
```

CSP is deliberately not set here — a proper CSP requires nonces generated in `middleware.ts`, which is >5 lines and carries a real risk of breaking third-party scripts. Document as follow-up.

## What goes in the audit report

Since the Medium was fixed in-session (under the 5-line threshold), promote it into the "Medium Findings — fixed in this session" sub-list:

- [x] **Security Misconfiguration — Missing baseline headers** `next.config.js` — Added HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy via `headers()` export. CSP deferred (requires nonce flow in middleware).

Under **Recommended Follow-Up (architectural):**

- Implement Content-Security-Policy with per-request nonces via `middleware.ts`. Requires an audit of third-party scripts (analytics, tag manager) to ensure they function under a strict CSP.
