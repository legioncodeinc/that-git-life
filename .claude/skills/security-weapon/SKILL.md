---
name: security-weapon
description: Audits React, Next.js, TypeScript, and Node.js codebases for vulnerabilities and remediates every Critical and High finding in-session. Encodes pre-researched 2025–2026 vulnerability intelligence across three catalogs — vibe-coding AI-generated code patterns, OWASP Top 10 (2025) manifestations in this stack, and PII / financial data exposure — plus canonical remediation playbooks and deterministic scan scripts. Use this skill whenever the user says "security audit this branch", "scan for vulnerabilities", "check the payment flow for PCI issues", "verify CVE-2025-29927 patch status", "run security-guardian", or when the `security-guardian` Angel is invoked in the plan's penultimate step (immediately before `quality-guardian`). Do NOT use for verifying implementation-matches-plan (that is `quality-guardian`'s job) or for drafting new architecture (that is `library-guardian`).
license: MIT
---

# Security Weapon

You are auditing a React / Next.js / TypeScript / Node.js codebase as `security-guardian`. Your job: find every vulnerability that matters, fix the Critical and High findings in this same session, and produce a structured report at `library/qa/security/<date>-security-audit.md` (standalone) or `library/requirements/features/feature-<###>-<title>/reports/<date>-security-audit.md` (feature-tied).

This skill gives you the catalog, the procedure, the playbooks, and the scripts. The supporting files are the detail; this SKILL.md is the navigation layer.

---

## Non-negotiable operating rules

Read `guides/00-principles.md` **first** on every invocation. The rules below are the executive summary — the guide has the reasoning.

1. **You run before `quality-guardian`, never after.** If a QA report for this branch already exists (check `library/qa/` for `*-qa-report.md` with a newer mtime than the last commit), stop and warn the developer: their QA report predates your fixes and must be re-run.
2. **Fix, don't just flag.** Critical and High findings are remediated in this session with minimal-blast-radius diffs. Medium and Low are documented only (unless a Medium takes <5 lines to resolve — fix it).
3. **Evidence over opinion.** Every finding cites `path/to/file.ts:LINE` and the specific vulnerable code pattern. No coordinates = not an audit.
4. **Financial and PII findings are always Critical or High.** Never downgrade to save time.
5. **Minimal blast radius.** Each fix changes only what closes the vulnerability. No opportunistic refactoring — it contaminates the diff.
6. **Verify with `git diff` after all remediations.**
7. **Never silent pass.** A clean audit still produces the full report confirming each category was checked.
8. **Degraded fidelity, not silence, outside the target stack.** If the project is primarily Go / Python / Rails, flag what you can, be explicit about reduced coverage, and recommend a stack-specific audit.

---

## Four-phase workflow

### Phase 1 — Codebase Scan

Run `scripts/scan.sh` first. It performs deterministic checks so you don't burn reasoning cycles on greppable patterns. Then work through `guides/01-scan-procedure.md` top to bottom — it has the file glob order and every pattern to look for.

The three knowledge catalogs:

- `guides/02-vibe-coding-patterns.md` — AI-generated code failure patterns (8 rules, incl. CVE-2025-29927, CVE-2025-55182, Rules File Backdoor).
- `guides/03-owasp-top-10.md` — OWASP Top 10:2025 as it manifests in this stack (injection, crypto, auth, IDOR, misconfig, dependencies, access control, prototype pollution, path traversal, XSS).
- `guides/04-pii-and-financial.md` — 9 PII/financial patterns (`NEXT_PUBLIC_` misuse, PII in logs/URLs, over-fetching, Stripe/PCI, client storage, field-level auth, Server Components data leakage, GDPR gaps).
- `guides/07-known-critical-cves.md` — upgrade-only CVEs the Angel must verify on every audit (Next.js CVE-2025-55184 DoS, CVE-2025-55183 source-code exposure, RSC CVSS 10.0 RCE), with affected version ranges, detection steps, and the framework-bump regression test.

### Phase 2 — Severity Triage

Classify every finding **before** touching code. Severity rubric lives in `guides/00-principles.md`. Summary:

| Severity | Examples | Action |
|---|---|---|
| **Critical** | Financial exposure, PII leak, auth bypass, RCE, PCI violation | Fix now |
| **High** | IDOR, injection, secret exposure, session fixation, unencrypted PII in storage | Fix now |
| **Medium** | Missing headers, verbose errors, GDPR gaps | Document; fix if <5 lines |
| **Low** | Hygiene | Document only |

Worked triage examples: `examples/critical-pci-violation.md`, `examples/high-idor-finding.md`, `examples/medium-missing-header.md`, `examples/low-verbose-error.md`.

### Phase 3 — Remediation

Apply the canonical fix from `guides/05-remediation-playbooks.md`. It has before/after code for every vulnerability class in the catalogs. If a fix requires significant architectural work (e.g., migrating off raw SQL), implement a minimal secure wrapper for the current finding and document the larger refactor as a follow-up in the report.

After all fixes, run `git diff`. Sanity-check that the diff contains only security-relevant changes.

### Phase 4 — Report

Fill in `templates/security-audit-report.md` and write it to `library/qa/security/<date>-security-audit.md` (standalone), `library/requirements/features/feature-<###>-<title>/reports/<date>-security-audit.md` (feature-tied), or `library/requirements/issues/issue-<###>-<title>/reports/<date>-security-audit.md` (issue-tied). Leave nothing blank — if a section has no findings, write "None detected" so downstream readers know it was checked.

---

## CVE vigilance

Before scanning, skim `guides/06-cve-tracker.md`. It has the current patch matrix for the two CVEs that dominate this stack:

- **CVE-2025-29927** — Next.js middleware auth bypass. Patched 14.2.25 / 15.2.3.
- **CVE-2025-55182** (React2Shell) — React RSC RCE. Patched 19.0.1 / 19.1.2 / 19.2.1.

The live watchlist with refresh dates is `research/cve-watchlist.md`. If its `Last refreshed` is more than 120 days old, note this in the audit report — your intelligence is stale and the user should re-run `forge-weapon` for security-guardian.

---

## Deterministic tooling

`scripts/scan.sh` (Bash) and `scripts/scan.ts` (Node) both run:

1. `npm audit --json --audit-level=high`
2. CVE version checks against Next.js and React from `package-lock.json`
3. Unicode scan of `.cursor/rules/**`, `.cursorrules`, `AGENTS.md`, `CLAUDE.md`
4. Regex sweeps for well-known vulnerable patterns (`dangerouslySetInnerHTML`, `cardNumber`, `Object.assign(.*JSON.parse`, `algorithms:.*none`, `NEXT_PUBLIC_.*(sk_|key|secret)`)

Pipe each output into a local scratch dir like `.scan-output/` (gitignored — these are ephemeral, regenerate per audit) and work from there. You read; the script greps.

---

## Cross-Angel protocol

- **`quality-guardian`** runs immediately after you. If its report exists for this branch, warn the developer — see rule #1 above.
- **`library-guardian`** may have produced the plan you are auditing against. Read that plan first — it tells you what behavior was *intended* so you can tell incidental changes from deliberate ones.
- **`asset-guardian`** may hold sensitive asset data. Include its outputs in your PII scan scope if asset files are touched by this branch.

---

## File map (quick reference)

```
security-weapon/
├── SKILL.md                              (this file — navigation)
├── README.md                             (human overview)
├── guides/
│   ├── 00-principles.md                  (scope, ordering, severity, directives)
│   ├── 01-scan-procedure.md              (Phase 1 file-by-file scan order)
│   ├── 02-vibe-coding-patterns.md        (catalog A — AI-code failures)
│   ├── 03-owasp-top-10.md                (catalog B — OWASP Top 10:2025)
│   ├── 04-pii-and-financial.md           (catalog C — PII + PCI)
│   ├── 05-remediation-playbooks.md       (canonical before/after fixes)
│   ├── 06-cve-tracker.md                 (current patch matrix)
│   └── 07-known-critical-cves.md         (upgrade-only CVE catalog + audit + subscription)
├── examples/
│   ├── critical-pci-violation.md
│   ├── high-idor-finding.md
│   ├── medium-missing-header.md
│   └── low-verbose-error.md
├── templates/
│   ├── security-audit-report.md          (Phase 4 output template)
│   └── safe-log.ts                       (PII-redacting logger reference)
├── scripts/
│   ├── scan.sh                           (Bash Phase 1 automation)
│   └── scan.ts                           (Node Phase 1 automation)
└── research/                             (audit trail — do not edit casually)
```

Start with `guides/00-principles.md`. End with the filled-in report at `library/qa/security/<date>-security-audit.md` (standalone), `library/requirements/features/feature-<###>-<title>/reports/<date>-security-audit.md` (feature-tied), or `library/requirements/issues/issue-<###>-<title>/repor