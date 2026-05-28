# PRD-005: Repository scanner

- **Status:** backlog
- **Owner:** Cursor
- **Depends on:** PRD-002 (service), PRD-004 (validator from the standardizer)

## 1. Problem

The brief calls for "scan repository for issues" — a routine and on-demand health check across every tracked repo. We need an engine that runs the four agreed-upon check categories (uncommitted/unpushed, drift vs Schema v2, stale branches, light secrets), produces a normalized finding stream, and persists results so the dashboard can roll them up.

## 2. Goals

- Pluggable check architecture: each check is a pure function.
- One normalized `Finding` shape across all checks.
- Per-repo + multi-repo runs, both synchronous (CLI single-repo) and queued (multi-repo).
- Findings are idempotent (no duplicates; auto-resolve when the underlying issue goes away).
- Health roll-up per repo: `red | yellow | green`.

## 3. Non-goals

- Replacing dedicated tools (TruffleHog, gitleaks, ESLint). We're a sanity net, not a full SAST.
- Real-time scans (no file watcher kicking off mid-edit scans). Scans run on cron + on demand.
- Customizable check thresholds in v1 (everything is hardcoded with sensible defaults; settings come later).

## 4. User stories

- "As a user, I open the dashboard and immediately see which repos need attention."
- "As a user, I click 'Scan now' and findings populate within seconds."
- "As Cursor, I read findings off the API and propose fixes."

## 5. Scope

### In scope

- `src/scanner/` module with one file per check (per `checks-spec.md`).
- Scanner orchestrator (per-repo runner, multi-repo parallel runner).
- Findings persistence + idempotency (upsert by `(repo_id, check_id, dedupe_key)`).
- Auto-resolve when a previously-open finding no longer reproduces.
- Per-check timeout (30 s).
- API: `POST /api/v1/repos/:id/scan`, `POST /api/v1/repos/scan-all`, `GET /api/v1/repos/:id/findings`.
- CLI: `tgl scan [repo]`, `tgl scan --check <id>`, `tgl scan --since <date>`.
- Daily cron registration (uses PRD-002's cron plumbing).

### Out of scope

- The dashboard finding UI (PRD-006).
- Auto-fix flows (we surface findings, we don't fix them).
- Repo discovery / inventory (handled in PRD-006).

## 6. Acceptance criteria

- [ ] All four check categories from the checks spec are implemented with unit tests against fixture repos.
- [ ] Re-running a scan that produces the same findings does not create duplicate rows.
- [ ] Resolving a finding (issue fixed in the repo) auto-sets `resolved_at` on the next scan.
- [ ] Per-check timeout kicks in and emits a `scanner-timeout` finding instead of hanging.
- [ ] Multi-repo scans parallelize up to `os.cpus().length`.
- [ ] Health roll-up is correct per spec (any error → red; any warn → yellow; else green).
- [ ] CLI `tgl scan` prints a human-friendly table grouped by repo + severity.
- [ ] Daily cron is registered and visible in `tgl doctor`.

## 7. File-level deliverables

- `src/scanner/index.ts` — public API.
- `src/scanner/orchestrator.ts` — single + multi runner.
- `src/scanner/findings.ts` — upsert + auto-resolve logic.
- `src/scanner/checks/git-uncommitted-changes.ts`
- `src/scanner/checks/git-unpushed-commits.ts`
- `src/scanner/checks/git-untracked-files.ts`
- `src/scanner/checks/git-detached-head.ts`
- `src/scanner/checks/drift.ts` — wraps the standardizer validator from PRD-004.
- `src/scanner/checks/branch-stale-90d.ts`
- `src/scanner/checks/branch-behind-main.ts`
- `src/scanner/checks/branch-orphaned.ts`
- `src/scanner/checks/repo-stale-pull.ts`
- `src/scanner/checks/secret-env-committed.ts`
- `src/scanner/checks/secret-aws-key-like.ts`
- `src/scanner/checks/secret-github-token-like.ts`
- `src/scanner/checks/secret-private-key-like.ts`
- `src/scanner/checks/secret-suspicious-filename.ts`
- `src/scanner/__fixtures__/` — toy git repos.
- `src/scanner/__tests__/*`
- `src/service/routes/scan.routes.ts`
- `src/cli/scan.ts`

## 8. Sequenced steps

1. Implement the `Finding` upsert + auto-resolve logic with tests.
2. Implement the four git-state checks against fixtures.
3. Implement the drift check by importing the standardizer validator (PRD-004).
4. Implement the four stale-branch checks.
5. Implement the five secrets checks.
6. Build the orchestrator (single + multi).
7. Add CLI + service routes.
8. Register the daily cron.
9. Write the QA artifact at `qa/prd-005-repository-scanner-qa.md`.

## 9. Risks

| Risk | Mitigation |
|---|---|
| Secret regex produces false positives on test fixtures or docs. | The "skip in `__fixtures__/`, `test/`, etc." rules from `checks-spec.md` §4; documented in the spec. |
| `git status --porcelain=v2` output varies by git version. | Parse defensively; add fixtures from git ≥ 2.30. |
| Parallel scans contend on a single physical disk. | Use a small concurrency cap (`os.cpus().length`, max 4 by default). |

## 10. References

- `library/knowledge/private/scanner/checks-spec.md`
- `library/knowledge/private/standardizer/behavior-spec.md` §5 (validator reuse)
- `library/knowledge/private/service/database-schema.md` (findings table)
