# Scanner checks spec

- **Category:** Reference
- **Status:** Canonical
- **Last updated:** 2026-05-23

The scanner runs a fixed set of checks against every tracked, unignored repo. Each check emits zero or more findings into the shared findings table. The dashboard rolls findings up into the per-repo "health" indicator.

---

## Finding shape

```ts
type Finding = {
  id: string;            // ULID
  repoId: string;
  checkId: string;       // see catalog below
  severity: 'error' | 'warn' | 'info';
  message: string;       // human-readable; <= 140 chars
  details?: unknown;     // structured payload (files, hashes, branch names, etc.)
  createdAt: string;     // ISO
  resolvedAt: string | null;
};
```

Findings are **idempotent**: re-running a check that would produce an identical finding does **not** create a new row — it updates the existing one's `updatedAt` (not part of the public schema; tracked internally). When a check no longer produces a finding it produced before, the old finding is marked `resolved_at = now`.

---

## Health roll-up

Per-repo health is derived from open findings:

| Open findings | Health |
|---|---|
| Any `error` | `red` |
| Any `warn`, no `error` | `yellow` |
| Only `info` or none | `green` |

---

## Check catalog

### 1. Uncommitted / unpushed changes

Reads `git status --porcelain=v2` and `git rev-list @{u}..` per branch.

| `checkId` | Severity | Triggers when |
|---|---|---|
| `git-uncommitted-changes` | warn | `git status --porcelain=v2` returns non-empty. Message includes file count. |
| `git-unpushed-commits` | warn | Current branch has commits not in `origin/<branch>`. Message includes count. |
| `git-untracked-files` | info | New files exist that are not in `.gitignore` and not staged. |
| `git-detached-head` | warn | Repo HEAD is detached. |

Details payload: `{ branch, ahead, behind, files: string[] }`.

False-positive rules: ignore `.tgl` / `.tgl-*` workspaces if the repo is TGL itself. Skip submodule paths.

---

### 2. Standardization drift (vs Schema v2)

Re-uses the validator from the standardizer (see `behavior-spec.md` §5). One finding per validator failure.

| `checkId` | Severity | Triggers when |
|---|---|---|
| `drift-tree-shape` | error | A required folder from Schema v2 §1 is missing. |
| `drift-readme-missing` | error | A required README is missing. |
| `drift-headmatter-shape` | error | A README lacks the YAML headmatter block or has an unparseable one. |
| `drift-headmatter-empty` | warn | `ai_description` or `human_description` is empty. |
| `drift-naming-prd` | error | A file under `requirements/` violates PRD naming. |
| `drift-naming-ird` | error | A file under `issues/` violates IRD naming. |
| `drift-naming-adr` | error | An ADR filename violates the `ADR-<n>-<slug>.md` pattern. |
| `drift-sacred-notes` | warn | Files appear in `library/notes/` that look agent-authored (heuristic; see below). |
| `drift-meta-missing` | warn | `library/_meta.yaml` is missing or unparseable. |

Sacred-notes heuristic: a `notes/` file authored within 5 minutes of a `tgl standardize` run that wasn't committed by the user is suspect. Used cautiously — false positives only generate `warn`.

---

### 3. Stale branches

Reads `git branch -vv` plus per-branch last commit timestamps.

| `checkId` | Severity | Triggers when |
|---|---|---|
| `branch-stale-90d` | info | A branch hasn't moved in 90 days and is not the default branch. |
| `branch-behind-main` | warn | A branch is more than 50 commits behind `origin/main` (configurable). |
| `branch-orphaned` | info | A local branch has no upstream and the upstream was deleted on remote. |
| `repo-stale-pull` | info | The local working copy hasn't been `pull`-ed in 30 days (heuristic: latest fetch + local commit timestamp). |

---

### 4. Light secrets / `.env` exposure

Pure regex + filename heuristics. We are explicitly **not** trying to be a full secret scanner — this is a sanity net.

| `checkId` | Severity | Triggers when |
|---|---|---|
| `secret-env-committed` | error | A `.env` (or `.env.*` excluding `.env.example`) is tracked by git. |
| `secret-aws-key-like` | error | Any committed file contains `AKIA[0-9A-Z]{16}`. |
| `secret-github-token-like` | error | Any committed file contains `ghp_[0-9A-Za-z]{36}` or `github_pat_[0-9A-Za-z_]{40,}`. |
| `secret-private-key-like` | error | A committed file starts with `-----BEGIN (RSA |EC |OPENSSH |)PRIVATE KEY-----`. |
| `secret-suspicious-filename` | warn | A committed file matches `.*\.(pem|key|p12|pfx)$` or is named `id_rsa`, `id_ed25519`, etc. |

Details payload: `{ path, lineHint }`. We never include the matched secret value in details.

False-positive rules: skip files in `__fixtures__/`, `test/`, `tests/`, `__tests__/`, and `examples/`. Skip docs that contain inline examples in fenced code blocks if the example is wrapped in `<!-- secret-scan: ignore -->` markers.

---

## Execution model

- Checks are pure functions: `(repoPath: string, ctx: ScanContext) => Promise<Finding[]>`.
- They run sequentially per repo (low memory + git contention) but repos are processed in parallel up to `os.cpus().length`.
- Each check has a per-repo timeout of 30 s; a timeout produces a `scanner-timeout` finding at `warn`.
- Scans are atomic per repo: results are committed in a single transaction. Partial results are never visible.

---

## CLI surface

```bash
tgl scan                              # all tracked, unignored repos
tgl scan <repo>                       # one repo
tgl scan --check git-uncommitted-changes  # one check across all repos
tgl scan --since 2026-05-01           # show findings opened since
```

The same scans are reachable from the web UI as per-repo and "Scan all" actions, and run automatically by the daily cron.
