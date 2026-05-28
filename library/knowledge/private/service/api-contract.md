# API contract — `/api/v1`

- **Category:** Reference
- **Status:** Canonical
- **Last updated:** 2026-05-23

Inventory of every REST endpoint the Fastify service exposes at `http://localhost:3050`. Shape rules live in [`../standards/api-contract-conventions.md`](../standards/api-contract-conventions.md). All endpoints require the `X-TGL-Token` header.

---

## 1. Handshake & health

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/health` | Liveness probe. Returns `{ "health": { "ok": true, "version": "x.y.z" } }`. No auth. |
| GET | `/api/v1/handshake` | Issues the web UI's session token. Only callable with `Origin: http://localhost:3050`. |
| GET | `/api/v1/doctor` | Diagnostics: hook status, PAT present, last scan, DB schema version, disk usage. |

## 2. Onboarding

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/onboarding` | Full onboarding state — checklist items, current step, % complete. |
| POST | `/api/v1/onboarding/checklist/:id` | Body `{ done: boolean }`. Toggle a checklist item. |
| POST | `/api/v1/onboarding/github-root` | Body `{ path: "<absolute path>" }`. Set the GitHub root folder. |
| POST | `/api/v1/onboarding/github-pat` | Body `{ pat: "<token>" }`. Store the PAT in the OS keychain. |
| POST | `/api/v1/onboarding/ssh-key` | Trigger SSH key generation + GitHub upload. Returns `{ key: { fingerprint, uploadedAt } }`. |
| POST | `/api/v1/onboarding/complete` | Mark onboarding as done. Fails if checklist incomplete. |

## 3. Repositories

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/repos` | List tracked repos with `?ignored=true|false` filter. |
| GET | `/api/v1/repos/:id` | One repo's full detail incl. latest findings. |
| POST | `/api/v1/repos/discover` | Re-scan the GitHub root and add any new git repos found. |
| POST | `/api/v1/repos/:id/ignore` | Body `{ ignored: boolean }`. Toggle the ignore flag. |
| POST | `/api/v1/repos/:id/scan` | Run the four scanner checks against this repo. Returns 202 + job ID. |
| POST | `/api/v1/repos/:id/standardize` | Run the standardizer. Body `{ dryRun: boolean }`. Returns 202 + job ID. |
| POST | `/api/v1/repos/:id/standardize/scaffold-new` | For brand-new directories: create + standardize in one step. |

## 4. Settings

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/settings` | All settings. |
| PUT | `/api/v1/settings` | Replace any settings the body contains. |
| POST | `/api/v1/settings/root-folder` | Change the GitHub root folder. Re-discovers repos. |
| POST | `/api/v1/settings/ide` | Switch IDE between cursor and claude-code. |
| POST | `/api/v1/settings/skill-sync` | Body `{ enabled: boolean }`. Toggle remote skill sync. |

## 5. Jobs

Long-running operations return 202 with a job ID. The job table is in-memory; jobs older than 24 h are pruned.

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/jobs/:id` | Job status: `pending | running | succeeded | failed`, plus `result` when complete. |
| GET | `/api/v1/jobs?status=running` | List recent jobs. |

## 6. Skills

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/skills` | Installed skills with source (`bundled` or `remote`) and last-synced timestamp. |
| POST | `/api/v1/skills/sync` | Manually trigger a remote sync. Returns 202 + job ID. |
| POST | `/api/v1/skills/:id/disable` | Disable a specific skill (move out of the IDE's global dir). |

## 7. Updates

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/updates/check` | Look up the latest published version on npm. |
| POST | `/api/v1/updates/install` | Run `npm i -g @thenotoriousllama/that-git-life@latest`. Service self-restarts via the OS hook. |

## 8. Logs

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/logs?level=info&limit=200` | Tail of the service log. |

## 9. Shape examples

### Repo (response)

```json
{
  "repo": {
    "id": "01H...",
    "path": "/Users/m/GitHub/that-git-life",
    "name": "that-git-life",
    "ignored": false,
    "lastScannedAt": "2026-05-23T12:30:00Z",
    "lastStandardizedAt": "2026-05-23T12:30:00Z",
    "schemaVersion": 2,
    "health": "green",
    "openFindings": 0,
    "remote": "git@github.com:the-notorious-llama/that-git-life.git"
  }
}
```

### Finding

```json
{
  "id": "01H...",
  "repoId": "01H...",
  "checkId": "uncommitted-changes",
  "severity": "warn",
  "message": "3 unstaged changes in src/service/index.ts",
  "details": { "files": ["src/service/index.ts", "..."] },
  "createdAt": "2026-05-23T12:30:00Z",
  "resolvedAt": null
}
```

### Job (response)

```json
{
  "job": {
    "id": "job_01H...",
    "kind": "scan",
    "status": "running",
    "startedAt": "2026-05-23T12:30:00Z",
    "progress": 0.4
  }
}
```
