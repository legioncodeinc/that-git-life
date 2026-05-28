# Database schema

- **Category:** Reference
- **Status:** Canonical
- **Last updated:** 2026-05-23

SQLite schema for `~/.tgl/tgl.db` (Windows: `%APPDATA%\tgl\tgl.db`). Managed by `better-sqlite3`. Migrations apply on service start.

---

## Tables

### `_meta`

Tracks the schema version and other singleton state.

```sql
CREATE TABLE _meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
-- seeded rows: ('schema_version', '1'), ('install_id', '<ulid>')
```

### `settings`

Free-form key/value pairs for service settings.

```sql
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
-- typical keys:
--   github_root           absolute path of chosen GitHub root
--   ide                   'cursor' | 'claude-code'
--   skill_sync_enabled    '0' | '1'
--   scan_cadence_cron     '0 3 * * *'
--   auto_update_enabled   '0' | '1'
--   onboarding_complete   '0' | '1'
```

### `repos`

Inventory of git repositories under the GitHub root.

```sql
CREATE TABLE repos (
  id TEXT PRIMARY KEY,                       -- ULID
  path TEXT NOT NULL UNIQUE,                 -- absolute path
  name TEXT NOT NULL,
  remote TEXT,                               -- git@github.com:...
  ignored INTEGER NOT NULL DEFAULT 0,        -- 0 | 1
  schema_version INTEGER,                    -- 2 if standardized; NULL if not
  last_scanned_at INTEGER,
  last_standardized_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX idx_repos_ignored ON repos(ignored);
CREATE INDEX idx_repos_scanned ON repos(last_scanned_at);
```

### `findings`

Output of scanner runs. One row per detected issue.

```sql
CREATE TABLE findings (
  id TEXT PRIMARY KEY,                       -- ULID
  repo_id TEXT NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
  check_id TEXT NOT NULL,                    -- 'uncommitted-changes', 'drift-readme-missing', etc.
  severity TEXT NOT NULL,                    -- 'error' | 'warn' | 'info'
  message TEXT NOT NULL,
  details_json TEXT,                         -- structured payload
  created_at INTEGER NOT NULL,
  resolved_at INTEGER
);

CREATE INDEX idx_findings_repo ON findings(repo_id);
CREATE INDEX idx_findings_open ON findings(repo_id, resolved_at) WHERE resolved_at IS NULL;
CREATE INDEX idx_findings_check ON findings(check_id);
```

### `onboarding_steps`

State for the first-boot checklist.

```sql
CREATE TABLE onboarding_steps (
  id TEXT PRIMARY KEY,                       -- 'signup-github', 'signup-cloudflare', etc.
  label TEXT NOT NULL,
  url TEXT,                                  -- affiliate URL
  required INTEGER NOT NULL DEFAULT 1,
  done INTEGER NOT NULL DEFAULT 0,
  done_at INTEGER,
  sort_order INTEGER NOT NULL
);
```

Seeded by the migration with the canonical signup list (GitHub, Cloudflare, GoDaddy, Claude.ai, Obsidian, IDE plan).

### `jobs`

Long-running operation tracking.

```sql
CREATE TABLE jobs (
  id TEXT PRIMARY KEY,                       -- 'job_01H...'
  kind TEXT NOT NULL,                        -- 'scan' | 'standardize' | 'sync-skills' | ...
  status TEXT NOT NULL,                      -- 'pending' | 'running' | 'succeeded' | 'failed'
  progress REAL NOT NULL DEFAULT 0,
  payload_json TEXT,                         -- inputs
  result_json TEXT,                          -- outputs
  error_json TEXT,
  started_at INTEGER,
  finished_at INTEGER,
  created_at INTEGER NOT NULL
);

CREATE INDEX idx_jobs_status ON jobs(status);
```

Pruned by a daily cron: rows with `created_at` older than 24 h are deleted unless `status = 'running'`.

### `skills`

Inventory of installed skills, sourced from bundle + remote sync.

```sql
CREATE TABLE skills (
  id TEXT PRIMARY KEY,                       -- skill folder name
  source TEXT NOT NULL,                      -- 'bundled' | 'remote'
  ide TEXT NOT NULL,                         -- 'cursor' | 'claude-code'
  version TEXT,                              -- from skill's frontmatter
  installed_at INTEGER NOT NULL,
  updated_at INTEGER,
  disabled INTEGER NOT NULL DEFAULT 0,
  hash TEXT                                  -- last-known content hash
);
```

---

## Migrations

Migration files live at `src/service/db/migrations/<NNNN>-<slug>.sql`. The runner is custom and minimal:

1. Read the current `schema_version` from `_meta`.
2. Apply every migration with a higher number, in order, inside a single transaction.
3. Update `schema_version` at the end.

Each migration is **forward-only**. We don't ship down-migrations — a corrupted DB can be reset with `tgl reset --keep-secrets`, which deletes `tgl.db` (and re-runs onboarding) without touching the keychain.

---

## Backup & restore

- `tgl backup` writes a timestamped copy of `tgl.db` to `~/.tgl/backups/`.
- `tgl restore <file>` swaps in a backup after stopping the service.
- Backups are kept locally only. No cloud sync by default.
