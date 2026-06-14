# Guide: security-guardian

Security audit specialist for React, Next.js, TypeScript, and Node.js codebases.

---

## What this Angel owns

Finding and fixing every Critical and High severity security issue in the codebase, with a primary focus on financial exposure and PII leakage. `security-guardian` is armed with pre-researched vulnerability intelligence covering:

- **Vibe-coding pitfalls** — the systematic vulnerabilities that AI-augmented development tends to introduce (authentication/authorization confusion, over-permissioned tokens, unsafe deserialization, missing input validation on generated endpoints, etc.).
- **OWASP Top 10 manifestations** — how the canonical list actually shows up in React/Next/Node codebases in 2025–2026.
- **PII and financial data exposure patterns** — logging, tracing, error messages, URL parameters, cache keys, third-party telemetry leaks.

The Angel both audits and remediates. Critical and High findings get fixed, not just reported.

## When to invoke

Delegate to `security-guardian`:

- Automatically as the **second-to-last** step of every implementation plan, immediately before `quality-guardian`.
- On demand when the user says "audit for security", "check for vulnerabilities", "scan for PII exposure", or similar.
- Whenever new code touches authentication, authorization, PII handling, financial flows, or external API calls.

Do **not** invoke after `quality-guardian` has already run. If the ordering has been violated, this Angel will flag it and ask for a re-run of QA after security fixes land.

## Paired Weapon

`.cursor/skills/security-weapon/` (when forged) — contains the vibe-coding vulnerability catalog, OWASP mapping for React/Next/TS/Node, PII/financial pattern library, and remediation playbooks. Until the Weapon is formally forged, the Angel's body contains the baked-in intelligence directly.

## Expected input

- The branch or commit range to audit.
- Any explicit areas the user wants focused attention on.
- The plan document that guided the implementation (so the Angel understands the intended behavior).

## Expected output

- A findings report listing Critical and High issues with file/line citations, severity, and rationale.
- Code-level fixes applied for every Critical and High finding.
- A remediation summary describing what was fixed and what was left for human review.
- Medium and Low findings listed separately — documented, not auto-fixed.

## Critical directives to respect when routing

- **Step ordering is strict.** Run `security-guardian` before `quality-guardian`. Violating this produces wasted QA work.
- **Auto-remediation scope is Critical and High only.** Do not expect or ask for auto-fixes on Medium/Low findings.
- **React/Next/TS/Node scope.** For other stacks, flag to the user that the Weapon was forged for a specific stack and the Angel may miss stack-specific patterns.
- **PII and financial exposure are the top priorities.** If the Angel reports a PII leak, treat it as a blocker regardless of other findings.

## Typical failure modes

- Invoked on a stack outside React/Next/TS/Node without acknowledgment — partial coverage.
- Invoked after `quality-guardian` — Angel will flag and ask for re-run.
- Invoked before an implementation is complete — there's nothing to audit; ask the user to finish first.

## Orchestration notes

Step 3 in the canonical plan→implement→security→QA loop. `security-guardian` is always the second-to-last step. After its fixes land, `quality-guardian` verifies the whole implementation (now including the security fixes) against the original plan.
