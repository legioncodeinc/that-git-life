# Example: Full Audit — Small Team SaaS Repo (Happy Path)

*Demonstrates: full audit invocation, all eight dimensions, ranked remediation list.*
*Research cited: all dimension guides.*

## Invocation

User: "Run a full GitHub repo health audit on `acme-corp/saas-app`."

Angel declares scope: "Running full audit in **Local clone + gh CLI mode**. I have repo read access via `gh auth login`. Branch protection data will be retrieved via GitHub REST API."

---

## Audit Report: acme-corp/saas-app

**Audit date:** 2026-05-20
**Data collection mode:** Local clone + gh CLI
**Coverage gaps:** None

### Overall Score: 74/100

| # | Dimension | Raw Score | Weight | Weighted |
|---|---|---|---|---|
| 1 | Branch protection / rulesets | 8/10 | 20% | 16.0 |
| 2 | Commit quality | 6/10 | 15% | 9.0 |
| 3 | CODEOWNERS | 8/10 | 15% | 12.0 |
| 4 | CI workflow density | 7/10 | 15% | 10.5 |
| 5 | Docs presence | 8/10 | 10% | 8.0 |
| 6 | Repository settings | 6/10 | 10% | 6.0 |
| 7 | Issue/PR templates | 8/10 | 8% | 6.4 |
| 8 | .gitignore coverage | 8/10 | 7% | 5.6 |
| | **Total** | | | **73.5 ≈ 74** |

### Branching Strategy (qualitative)

**Observed:** GitHub Flow — feature branches from `main`, PR-based merges.
**Open branches:** 3 (avg age: 1.5 days).
**Stale branches (> 30 days):** 1 — `feat/old-analytics-refactor` (47 days).
**Assessment:** Clean, consistent with GitHub Flow.

### Per-dimension findings

*(abbreviated for example — full detail in each dimension section)*

**Branch protection (8/10):** Ruleset on `main`. Missing `dismiss_stale_reviews` and `required_linear_history`.

**Commit quality (6/10):** 72% CC adherence. No `commitlint` in CI. 4 generic commits ("wip", "update").

**CODEOWNERS (8/10):** Present at `.github/CODEOWNERS`. `terraform/` has no owner.

**CI density (7/10):** `pr-ci.yml` has lint + test + build, no security scan. `deploy.yml` has no timeout.

**Docs (8/10):** README, CONTRIBUTING, LICENSE present. Missing `SECURITY.md`.

**Settings (6/10):** All three merge types allowed. Auto-delete branches off. Push protection enabled. Secret scanning enabled.

**Templates (8/10):** Bug + feature issue templates present. PR template missing "Type of change" section.

**.gitignore (8/10):** Node patterns covered. Python `__pycache__/` missing despite Python scripts in `scripts/`.

---

### Remediation Plan (ranked by impact ÷ effort)

| Priority | Finding | Impact | Effort | Action |
|---|---|---|---|---|
| 1 | Auto-delete branches off | 3 | 1 | Settings > General > Pull Requests > check "Automatically delete head branches" |
| 2 | `SECURITY.md` missing | 3 | 1 | Add `.github/SECURITY.md` using GitHub template |
| 3 | `terraform/` has no CODEOWNERS entry | 3 | 1 | Add `terraform/ @acme-corp/platform-team` to `.github/CODEOWNERS` |
| 4 | Python .gitignore patterns missing | 2 | 1 | Append Python patterns from github.com/github/gitignore |
| 5 | Security scan missing in CI | 4 | 2 | Add `dependency-review` action to `pr-ci.yml` — see `guides/05-ci-workflows.md` |
| 6 | All merge types allowed | 3 | 1 | Disable "Allow merge commits" in Settings > General |
| 7 | `dismiss_stale_reviews` disabled | 3 | 1 | Enable in branch ruleset settings |
| 8 | No `commitlint` in CI | 3 | 2 | Add `commitlint` + `@commitlint/config-conventional` — see `guides/03-commit-quality.md` |
| 9 | PR template missing "Type of change" | 2 | 1 | Edit `.github/pull_request_template.md` |
| 10 | `deploy.yml` has no timeout | 2 | 1 | Add `timeout-minutes: 20` to deploy jobs |

**Handoffs:**
- Items 5 and 10: CI architecture → invoke `devops-guardian` for full workflow audit.

---

*Total estimated remediation time (items 1-9, minus devops-guardian handoff): ~2.5 hours.*
