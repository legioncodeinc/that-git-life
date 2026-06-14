# 07 — Known Critical CVEs (upgrade-immediately catalog)

**Last refreshed:** 2026-04-25
**Refresh cadence:** every 90 days, or immediately on any new Next.js / React advisory.

This guide tracks CVEs whose remediation is **upgrade now** rather than "patch in code." It complements `06-cve-tracker.md` — that guide is the live patch matrix the Angel skims on every run; this guide is the deeper "here is what each CVE actually does and how the Angel detects it" reference. Read this when a `pnpm audit` or `npm audit` finding lands on a CVE in the catalog below.

If `Last refreshed` above is more than **120 days** stale, surface this in the audit report's Executive Summary and recommend re-running `forge-weapon` for `security-guardian`.

---

## Why a separate "upgrade-immediately" catalog?

`05-remediation-playbooks.md` covers **code-pattern fixes** (sanitize input, pin JWT algorithm, redact PII in logs). Some CVEs cannot be fixed in code — the framework itself is broken and only an upgrade closes the hole. This guide lists those, with version ranges and detection steps.

---

## Tier 0 — Active exploitation, CVSS ≥ 9, no code fix possible

### CVSS 10.0 — React Server Components RCE (CVE-2025-55182, "React2Shell")

- **Component:** `react`, `react-server`, plus `react-server-dom-webpack` / `react-server-dom-parcel` / `react-server-dom-turbopack`.
- **Affected:** React 19.0.0, 19.0.1, 19.1.0, 19.1.1, 19.1.2, 19.2.0, 19.2.1.
- **Patched:** **19.0.2 / 19.1.3 / 19.2.2** (or later in each line).
- **CVSS:** 10.0.
- **Companion CVE in Next.js:** CVE-2025-66478 (next package bundling vulnerable React) — covered in `06-cve-tracker.md`.
- **Exploitation surface:** any default `create-next-app` deployment that uses the App Router or RSC. No developer code required for exposure.
- **Observed impact:** shell establishment, environment-variable exfiltration, AWS IMDS credential theft, China-nexus actors observed in the wild.
- **Source:** `research/2026-04-24-cve-2025-55182-react2shell.md`; React advisory <https://react.dev/blog/2025/12/11/denial-of-service-and-source-code-exposure-in-react-server-components>.

Detection: see "Audit procedure" below. Upgrade target: latest patched within your React minor.

---

## Tier 1 — Next.js 2025 catalog (upgrade required)

### CVE-2025-55184 — Next.js Denial of Service via React Server Components

- **Component:** `next` (App Router; React Server Components deserialization path).
- **Affected versions:**
  - `>= 13.3` (Pages Router unaffected — confirm App Router usage before downgrading severity)
  - 14.x (all)
  - 15.0.x, 15.1.x, 15.2.x, 15.3.x, 15.4.x, 15.5.x
  - 16.0.x
  - 15.x and 16.x canary builds
- **First patched:** 14.2.34, 15.0.6, 15.1.10, 15.2.7, 15.3.7, 15.4.9, 15.5.8, 16.0.9, 15.6.0-canary.59, 16.1.0-canary.17. (Some sources also reference a follow-up incomplete-patch CVE-2025-67779 — confirm the upgrade target includes that fix; Vercel's bulletin lists the consolidated targets as 14.2.35 / 15.0.7 / 15.1.11 / 15.2.8 / 15.3.8 / 15.4.10 / 15.5.9 / 16.0.10 / 15.6.0-canary.60.)
- **CVSS:** 7.5 (High).
- **Exploitation surface:** a malicious HTTP request to any App Router endpoint can hang the server process and exhaust CPU. No developer code needed beyond having the App Router enabled.
- **Why no code fix:** the bug is in React Flight protocol deserialization, which the framework owns. Application code cannot work around it.
- **Source:** Vercel Security Bulletin <https://vercel.com/kb/bulletin/security-bulletin-cve-2025-55184-and-cve-2025-55183>; GitHub advisory GHSA-mwv6-3258-q52c <https://github.com/vercel/next.js/security/advisories/GHSA-mwv6-3258-q52c>; Aikido write-up <https://www.aikido.dev/blog/react-next-js-dos-vulnerability-cve-2025-55184>.

### CVE-2025-55183 — Next.js Source Code Exposure via Server Functions

- **Component:** `next` Server Actions / Server Functions; `react-server-dom-*` packages.
- **Affected versions:** Next.js 15.0.x, 15.1.x, 15.2.x, 15.3.x, 15.4.x, 15.5.x, 16.0.x (and matching canaries). **14.x is NOT affected** by 55183 — only 55184 applies there.
- **First patched:** 15.0.6, 15.1.10, 15.2.7, 15.3.7, 15.4.9, 15.5.8, 16.0.9, 16.1.0-canary.19. (Consolidated targets per Vercel: 15.0.7 / 15.1.11 / 15.2.8 / 15.3.8 / 15.4.10 / 15.5.9 / 16.0.10.)
- **CVSS:** 5.3 (Medium).
- **Exploitation surface:** a crafted HTTP request to a vulnerable Server Function can return the function's compiled source code. Triggered when the Server Function reference is implicitly or explicitly stringified (template literals, error paths, log lines, query-builder coercion). Pages Router unaffected.
- **What leaks:** business logic, hardcoded constants, and any literal secrets baked into Server Action source. **`process.env.SECRET` runtime values are NOT exposed**, but secrets hardcoded into source are.
- **Why no code fix:** React's fix installs a `toString()` override on server references. Application code cannot reliably patch this surface.
- **Source:** Vercel Security Bulletin (same URL as above); NVD <https://nvd.nist.gov/vuln/detail/CVE-2025-55183>; Snyk <https://security.snyk.io/vuln/SNYK-JS-NEXT-14400644>.

---

## Audit procedure — detect affected versions in this codebase

Run these in order during Phase 1. Outputs go to a local ephemeral scratch dir (e.g., `.scan-output/`, gitignored) per the standard scan workflow.

### Step 1 — Identify lockfile

```bash
ls package-lock.json pnpm-lock.yaml yarn.lock 2>/dev/null
```

The lockfile (not `package.json`) is the source of truth. `package.json` shows ranges; `pnpm-lock.yaml` / `package-lock.json` shows the resolved version actually installed.

### Step 2 — Resolve `next` and `react`

```bash
# pnpm
pnpm why next 2>&1 | head -30
pnpm why react 2>&1 | head -30

# npm
npm ls next react --all 2>&1 | head -30
```

If `next` is at any version listed under "Affected versions" above, the project is vulnerable. Same for `react` against CVE-2025-55182.

### Step 3 — Confirm App Router usage (gates 55184 + 55183 severity)

```bash
test -d app && echo "App Router: yes" || echo "App Router: no"
test -d src/app && echo "src/app present" || true
grep -RIn "use server" app src/app 2>/dev/null | head -5  # Server Actions
```

If only Pages Router is in use (`pages/` directory and no `app/`), CVE-2025-55183 does not apply, and CVE-2025-55184 only applies if any RSC-aware code path is reachable. Document this in the report.

### Step 4 — Identify hardcoded secrets in Server Actions (amplifier for 55183)

```bash
grep -RIn "use server" app src/app 2>/dev/null | cut -d: -f1 | sort -u | xargs -I{} grep -EHn "(sk_live|sk_test|api[_-]?key|secret|password|token)\s*[:=]\s*['\"]" {} 2>/dev/null
```

Any hit means a Server Action contains a hardcoded credential that **will leak** under 55183. Severity escalates to Critical regardless of CVSS, per `00-principles.md` rule #4.

### Step 5 — Recommend the upgrade target

Pick from this matrix (Vercel-consolidated, includes the 55184 follow-up patch):

| Current minor | Upgrade to |
|---|---|
| 14.x (any 14.x ≥ 13.3 surface) | **14.2.35** |
| 15.0.x | **15.0.7** |
| 15.1.x | **15.1.11** |
| 15.2.x | **15.2.8** |
| 15.3.x | **15.3.8** |
| 15.4.x | **15.4.10** |
| 15.5.x | **15.5.9** |
| 16.0.x | **16.0.10** |
| 15.x canary (PPR) | **15.6.0-canary.60** |
| 16.x canary | **16.1.0-canary.19** |

For React, target the latest patched within the project's React 19 minor (19.0.2+, 19.1.3+, or 19.2.2+).

### Step 6 — Regression test that must accompany every framework bump

For any Next.js or React major/minor upgrade, the audit report must require:

1. **Build succeeds:** `pnpm build` (or `npm run build`) completes without error.
2. **Smoke test:** the app's primary auth flow + one Server Action round-trip succeed under `pnpm start` against the new build.
3. **Type check:** `pnpm tsc --noEmit` reports no new errors.
4. **Lock-file freshness:** `pnpm-lock.yaml` / `package-lock.json` is committed alongside the upgrade — never let CI resolve the new version.
5. **Sub-dependency check:** re-run `pnpm why react` and `pnpm why next` after the bump to confirm transitive resolution actually moved.

A framework bump without these five checks is a half-finished remediation. The audit report should call it out as `NEEDS REGRESSION TEST` rather than passing.

---

## Subscription pattern — how to track future advisories

The Angel reads `06-cve-tracker.md` on every run and this guide on demand. Both stay current via a manual quarterly refresh. The owner of that refresh follows this routine:

### Authoritative sources (in priority order)

1. **Next.js GitHub Security Advisories** — <https://github.com/vercel/next.js/security/advisories>. Every Next.js CVE lands here first. RSS / Atom feed available.
2. **Vercel Security Bulletins** — <https://vercel.com/kb/bulletin>. Vercel publishes consolidated bulletins (often with a fuller upgrade matrix than the GHSA entry alone). The 55184/55183 bulletin at <https://vercel.com/kb/bulletin/security-bulletin-cve-2025-55184-and-cve-2025-55183> is the canonical example.
3. **React Security Advisories** — <https://github.com/facebook/react/security/advisories> and the React blog at <https://react.dev/blog>. The RSC RCE / DoS / source-disclosure advisories are published here in parallel with Vercel bulletins.
4. **Next.js blog** — <https://nextjs.org/blog>. Security-relevant patch releases land here with CVE references.
5. **NVD** — <https://nvd.nist.gov/vuln/search>. Search `next.js`, `react`, and any specific CVE ID. Gives the canonical CPE/affected-version JSON.
6. **GitHub Security Advisories database** — <https://github.com/advisories>. Filter by ecosystem npm and package `next` or `react`.

### `npm audit` cadence

Every project this Angel audits should run, at minimum:

- **CI gate:** `pnpm audit --audit-level=high` (or `npm audit --audit-level=high`) on every PR. Fail the build on High or Critical findings. (`scripts/scan.sh` already does this in Phase 1.)
- **Weekly Renovate / Dependabot scan:** automated PRs for any `next` or `react` patch release. Approve same-day for Tier 0 / Tier 1 advisories.
- **Quarterly manual sweep:** the security-weapon owner refreshes `06-cve-tracker.md` + this guide against the six sources above.

### What "subscription" looks like in practice

Pick one of:

- **GitHub watch** (lowest friction): "Watch → Custom → Security alerts" on `vercel/next.js` and `facebook/react`. New advisories arrive in your inbox within minutes of publication.
- **RSS feed** (preferred for an automation pipeline): the GHSA Atom feed at `https://github.com/vercel/next.js/security/advisories.atom` and `https://github.com/facebook/react/security/advisories.atom`.
- **Vercel changelog email**: subscribe at <https://vercel.com/changelog>. Less granular but catches release announcements that include CVE fixes.

When a Tier 0 / Tier 1 advisory drops, the response sequence is:

1. Owner adds the CVE to `06-cve-tracker.md` Tier 1 / Tier 0.
2. Owner adds the detailed entry to this guide if there's nothing actionable in code — i.e., it's an upgrade-only fix.
3. Owner runs `forge-weapon` for security-guardian to refresh `Last refreshed` dates and review `scripts/scan.sh` version-check logic.
4. Audit report templates pick up the new check on next Angel invocation.

---

## Cross-references

- `06-cve-tracker.md` — the live patch matrix (skim first on every run).
- `02-vibe-coding-patterns.md` — AI-generated code failure patterns (some overlap with CVE-induced surfaces).
- `05-remediation-playbooks.md` — code-pattern fixes (NOT applicable to the upgrade-only CVEs in this guide).
- `research/cve-watchlist.md` — source-of-truth refresh log.
- `research/2026-04-25-nextjs-cves-2025.md` — research note backing this guide's 55184/55183 entries.
- `research/2026-04-24-cve-2025-55182-react2shell.md` — research note backing the Tier 0 RCE.

---

*Citations:* every CVE entry in this guide cites at least the official Vercel/GitHub advisory URL and one independent third-party analysis (Aikido, Snyk, NVD). Refer to those URLs for the authoritative version matrix at any future date.
