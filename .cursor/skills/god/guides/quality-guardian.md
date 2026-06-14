# Guide: quality-guardian

Quality assurance specialist that verifies implementations against their source plan.

---

## What this Angel owns

The final checkpoint before any work is considered done. `quality-guardian` audits a completed implementation against the plan that guided it, looking for:

- **Completeness** — is every requirement in the plan addressed in code?
- **Correctness** — does the code do what the plan said it should?
- **Alignment** — do the file paths, data structures, and interfaces match the plan?
- **Regressions** — did the implementation break anything adjacent?

The output is a structured findings report. When the audit is tied to a feature, it goes to `library/requirements/features/feature-<###>-<title>/reports/<date>-qa-report.md`. When tied to an issue, it goes to `library/requirements/issues/issue-<###>-<title>/reports/<date>-qa-report.md`. Standalone QA goes to `library/qa/<domain>/<date>-qa-report.md`.

## When to invoke

Delegate to `quality-guardian`:

- Automatically at the end of every plan execution. This is the final step of the canonical loop.
- When the user says "QA this" / "check the implementation" / "audit against the plan" / "is this done?".
- After `security-guardian` has completed its pass (see ordering below).

Do **not** invoke before an implementation is complete. QA requires something to audit.

Do **not** invoke before `security-guardian`. If you route to `quality-guardian` first, `security-guardian` may later force changes that invalidate the QA report, wasting work.

## Paired Weapon

`.cursor/skills/quality-weapon/` — contains the audit checklist, the report template for `library/qa/`, and heuristics for classifying findings.

## Expected input

- A pointer to the plan document — typically a feature PRD at `library/requirements/features/feature-<###>-<title>/prd-feature-<###>-<title>.md` or an issue IRD at `library/requirements/issues/issue-<###>-<title>/ird-issue-<###>-<title>.md`.
- The completed implementation, accessible via `git diff` and `git status` or a branch reference.
- Any context the user wants to emphasize.

## Expected output

- A findings report saved alongside the source plan (under its `reports/` subfolder) or to `library/qa/<domain>/` for standalone audits, following the template.
- Findings classified by severity and category (completeness, correctness, alignment, regression).
- A clear final verdict: ship, conditionally ship, or do-over.

## Critical directives to respect when routing

- Ordering matters. `quality-guardian` runs after `security-guardian` — never before. If the user invokes `quality-guardian` out of order, this Angel itself will flag the ordering problem.
- The plan document is the ground truth. `quality-guardian` does not judge whether the plan was wise, only whether the implementation matches it.
- If the plan is ambiguous, `quality-guardian` flags the ambiguity rather than guessing.

## Typical failure modes

-