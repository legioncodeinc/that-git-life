# 05 — CI Workflow Density Audit

*Research basis: `research/external/01-github-rulesets-docs.md` (required status checks), `research/external/05-repo-security-settings.md` (dependency review)*

> **Scope boundary:** This guide audits workflow *presence and density* — are the right stages configured, and are they triggered correctly? It does NOT audit workflow architecture (Dockerfile hygiene, reusable workflow design, OIDC, cache backends). Hand those to `devops-guardian`.

## What to inspect

For each workflow file in `.github/workflows/`:

1. **Triggers:** `push`, `pull_request`, `schedule`, `workflow_dispatch` — are the right events covered?
2. **Stage coverage:** Does the workflow have at least lint, test, and build stages?
3. **Missing stages:** Security scan, dependency review, E2E tests, type check?
4. **Timeout settings:** Missing timeouts allow runaway jobs.
5. **Artifact retention:** Are build artifacts retained for debugging?
6. **Required status check alignment:** Are the workflows referenced in branch protection `required_status_checks`?

## Data collection

```bash
# List all workflow files
ls .github/workflows/

# List triggers for each workflow
for f in .github/workflows/*.yml; do
  echo "=== $f ==="; grep -A 10 '^on:' "$f"; done

# Check jobs in each workflow
for f in .github/workflows/*.yml; do
  echo "=== $f jobs ==="; grep '^  [a-z].*:$' "$f"; done
```

## Density scoring rubric

Score each active workflow out of 10, then average across all workflows:

| Stage present | Points |
|---|---|
| Lint (ESLint, Ruff, etc.) | +2 |
| Type check (tsc, pyright, mypy) | +2 |
| Unit/integration tests | +2 |
| Build (compile, next build, docker build) | +2 |
| Security scan (Trivy, Snyk, CodeQL, dependency-review) | +2 |

Deductions:
- No `timeout-minutes` on any job: -1
- Workflow not referenced in required_status_checks: -1 per workflow
- Workflow triggers only `push` to main (no PR trigger): -1

## Report section template

```markdown
### CI Workflow Density (Score: X/10)

**Workflows found:** 2 (pr-ci.yml, deploy.yml)

| Workflow | Triggers | Lint | Type | Test | Build | Security | Timeout | In required checks |
|---|---|---|---|---|---|---|---|---|
| pr-ci.yml | pull_request | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| deploy.yml | push:main | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | N/A |

**Findings:**
- RECOMMEND: Add `dependency-review` action to `pr-ci.yml` to block PRs that introduce vulnerable dependencies.
- RECOMMEND: Add `timeout-minutes: 20` to `deploy.yml` jobs to prevent runaway deployments.
- HAND OFF: `devops-guardian` — `deploy.yml` uses deprecated `actions/cache@v2`; recommend upgrading to v4 and evaluating Depot for build acceleration.
```

## Handoff trigger

When findings include Dockerfile issues, workflow architecture improvements (reusable workflows, OIDC), or cache/runner optimization — explicitly name `devops-guardian` in the finding and do not prescribe the solution. Example:
> "Workflow architecture issue: `pr-ci.yml` rebuilds Docker base image on every run with no cache backend configured. Recommend invoking `devops-guardian` to evaluate BuildKit cache mounts and Depot integration."
