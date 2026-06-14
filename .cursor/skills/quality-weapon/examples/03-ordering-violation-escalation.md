# Example 03 — Ordering Violation (Invoked Before `security-guardian`)

Demonstrates the Angel's behavior when it detects it was invoked before `security-guardian` ran. The Angel does NOT proceed with a full audit — it writes a short ordering-violation report and halts.

**Illustrates guides:** `00-principles.md` rule #6 (Run after `security-guardian`, never before).

---

## Input — Invocation context

User's message:

> "Hey, can you QA the work on the new admin export feature? I'm in a hurry, let's skip security this time."

Plan file: `library/requirements/features/feature-021-admin-export/prd-feature-021-admin-export.md` (exists, covers an admin data-export feature).

Diff: ~240 lines across 6 files, including a new authenticated API route and a Prisma query.

Signals detected:

- No security report exists in `library/requirements/features/feature-021-admin-export/reports/` (e.g., `<date>-security-report.md`).
- No commits on the branch with `security:` prefix or mentions of `security-guardian`.
- The user's message explicitly says "skip security."

---

## Output — Ordering-Violation Report

Written to `library/requirements/features/feature-021-admin-export/reports/2026-04-24-qa-report.md`.

```markdown
# QA Report: feature-021 admin-export — ORDERING VIOLATION

**Plan document:** `library/requirements/features/feature-021-admin-export/prd-feature-021-admin-export.md`
**Audit date:** 2026-04-24
**Base branch:** `main`
**Head:** `feat/admin-export`
**Auditor:** quality-guardian
**Status:** HALTED — security-guardian has not run

## Summary

This audit was halted because `security-guardian` has not run against this implementation. `quality-guardian` runs after `security-guardian` in the plan → implement → security → QA loop; inverting the order wastes the QA pass, because security fixes routinely invalidate the QA snapshot (e.g., a security fix refactors authz, which `quality-guardian` already verified). The feature touches a new authenticated API route and a Prisma query, both of which are exactly the surface area a security review must cover first.

## Recommended next step

1. Invoke `security-guardian` against this branch.
2. Address any Critical security findings.
3. Re-invoke `quality-guardian`. The full QA audit will run at that point.

## Why the "skip security" request was not honored

The ordering constraint is absolute per the `quality-guardian` principles (see the Angel's guide `00-principles.md`). "In a hurry" is the most common reason security is skipped, and it's also the most common reason post-deploy security incidents happen. Running QA on an un-securitied implementation produces a false-confidence green scorecard that masks real risk. If a security review is genuinely blocked (e.g., `security-guardian` itself is broken), escalate that — don't route around it.

## What was NOT audited

- Completeness against `library/requirements/features/feature-021-admin-export/prd-feature-021-admin-export.md`: not evaluated.
- Correctness of the implementation: not evaluated.
- Traceability table: not produced.
- Files Changed summary: not produced.

A full QA report will be generated when `security-guardian` has completed and this skill is re-invoked.

## Signals detected

- No security report present in `library/requirements/features/feature-021-admin-export/reports/`.
- No commits on `feat/admin-export` with a `security:` prefix or `security-guardian` mention.
- Invoking user requested "skip security this time."
```

---

## Why the audit looks this way

- **Halt instead of audit.** `guides/00-principles.md` rule #6 says: "If the Angel detects it was invoked first, it flags the ordering violation and recommends re-running after security fixes land." This is that behavior.
- **Short report, not skipped entirely.** A missing report is indistinguishable from a missing audit (`00-principles.md` rule #4). Writing the ordering-violation report gives the invoker a paper trail.
- **Does not override the user.** The user asked to skip security. The Angel refused, kindly but firmly. This is one of the few places the Angel overrides user instructions — and the reason is in the report.
- **No traceability table.** Because the full audit did not run, the table would be misleading (either empty or half-filled). Explicitly stating "not produced" is more honest than producing a partial table.
- **Filename matches a normal QA report.** `library/requirements/features/feature-021-admin-export/reports/2026-04-24-qa-report.md` — a re-run on the same date appends a slug suffix (per `guides/06-report-writing.md`); a re-run on a later date produces a sibling file. The title line makes the halt obvious either way.
