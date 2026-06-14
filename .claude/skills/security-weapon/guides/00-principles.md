# 00 — Principles

These are the operating rules for every security audit. Read this first, every time.

---

## Ordering — non-negotiable

**`security-guardian` runs immediately before `quality-guardian`.**

Why: `quality-guardian` verifies the whole implementation against the plan. If your fixes land after its report, that report is stale — it verified unfixed code. Running out of order silently invalidates QA.

**What to do if you detect the ordering is already broken:**

1. Check `library/qa/` for a file matching `*-qa-report.md` or `*-quality-report.md` for this branch.
2. Compare its mtime to the most recent commit on the branch.
3. If the QA report exists and is newer than your last commit but predates yours:
   - **Stop.** Do not run the audit silently.
   - Warn the developer: "A QA report for this branch already exists. Security fixes were not in scope when it was produced. Once I finish this audit, `quality-guardian` must be re-run."
   - Proceed only after acknowledging the ordering inversion in the audit report's Executive Summary.

---

## Scope

**In scope (full fidelity):** React, Next.js, TypeScript, Node.js codebases. Every rule in the guides is tuned for this stack.

**Out of scope (degraded fidelity, not silence):** Go, Python, Ruby, Rust, PHP, Java back-ends. You can still spot universal patterns (hardcoded secrets, missing HTTPS, PII in logs) but you should NOT pretend the OWASP Top 10 Next.js-specific patterns apply verbatim. When auditing such a codebase, open the Executive Summary with:

> "Scope note: this project includes non-Next.js server code (Go/Python/etc.). I checked for universal patterns (hardcoded secrets, PII in logs, dependency CVEs) but recommend a stack-specific security audit for full coverage of [specific framework]."

**Out of scope (delegate to another Angel):**
- Verifying implementation matches plan → `quality-guardian`
- Architectural planning / design documents → `library-guardian`
- Asset pipeline correctness → `asset-guardian`

---

## Severity rubric

| Severity | What qualifies | Remediation action |
|---|---|---|
| **Critical** | Financial exposure, PII leak to external parties, authentication bypass, RCE, PCI DSS violation (raw card on server), secrets committed to repo, unpatched Tier 1 CVE in `research/cve-watchlist.md` | Fix in this session. No exceptions. |
| **High** | IDOR / broken object-level auth, SQL/NoSQL/command injection, session fixation, token or secret exposure, unencrypted PII in client storage, XSS via unsanitized `dangerouslySetInnerHTML`, missing JWT algorithm whitelist, Server Actions missing auth, missing Stripe webhook signature | Fix in this session. No exceptions. |
| **Medium** | Missing security headers, verbose error responses, GDPR erasure/portability gaps, missing rate limits, over-fetching without direct PII impact, `'unsafe-inline'` in CSP | Document in report. Fix only if the patch is under ~5 lines. |
| **Low** | Non-sensitive hygiene — unused deps, inconsistent cookie `Path`, dead auth code | Document only. |

### Never-downgrade rule

**Financial and PII findings are Critical or High by construction.** Never downgrade them to save session time. The blast radius of a leaked SSN, card number, or OAuth token dwarfs the cost of thorough remediation. If a finding feels "borderline Critical / High" and the data involved is PII or money, the correct answer is Critical.

---

## Core directives (carried from Command Brief)

1. **Fix, don't just flag.** Critical and High are remediated in-session. A report that says "found but didn't fix" defeats the Angel's purpose.
2. **Evidence over opinion.** Every finding cites `path/to/file.ts:LINE` and quotes the specific vulnerable code. Reports without coordinates are not audits.
3. **Minimal blast radius.** Each fix changes only the lines necessary to close the vulnerability. No opportunistic refactoring — it contaminates the diff and risks breaking unrelated behavior.
4. **Verify after fixing.** Run `git diff` after all remediations to confirm no unintended changes snuck in. Screenshot the diff summary into the report's "Files Changed" table.
5. **Never silent pass.** Even a clean audit produces the full report confirming each category was checked. An empty scorecard is suspicious; explicit "None detected" per category is credibility.
6. **Minimum-two sources for claims.** If you cite a statistic or CVE in the report, it must trace to either `research/cve-watchlist.md` or a dated note in `research/`. No folk knowledge.

---

## When the rulebook is silent

If you encounter a pattern not covered by any guide in this Weapon:

1. Classify it provisionally using the severity rubric (be conservative — when in doubt, go High).
2. Document it in the report under "Recommended Follow-Up (architectural)" even if you fix it in-session.
3. Note it in `research/open-questions.md` for the next `forge-weapon` pass to extend the catalog.

Your job is to make the codebase safer today, not to wait for a rule that fits exactly.

---

## See also

- `guides/01-scan-procedure.md` — how to execute Phase 1 mechanically.
- `examples/critical-pci-violation.md` — worked Critical triage example.
- `examples/medium-missing-header.md` — worked "fix if cheap, else document" example.
- `research/cve-watchlist.md` — is your intelligence still fresh?
