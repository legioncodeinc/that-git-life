# ADR-004 — SQLite for app state, OS keychain for secrets

- **Status:** Accepted
- **Date:** 2026-05-23
- **Decision owner:** Mario Aldayuz
- **Supersedes:** —

## Context

TGL persists: chosen GitHub root folder, list of tracked repos, ignored folders, onboarding-checklist progress, last scan results per repo, settings (auto-update channel, scan cadence), and a GitHub Personal Access Token used to upload the SSH key and (later) read repo metadata.

We need a storage approach that survives reboots, supports concurrent reads from the service + occasional writes from the CLI, and keeps the PAT out of any file the user might `cat` or commit by accident.

## Decision

- **App state → SQLite** via `better-sqlite3`, stored at:
  - macOS / Linux: `~/.tgl/tgl.db`
  - Windows: `%APPDATA%\tgl\tgl.db`
- **Secrets → OS keychain** via `keytar`:
  - Service name: `that-git-life`
  - Account key: `github-pat` (for the GitHub PAT)
- **Migrations** are versioned and applied on service start. Migration files live at `src/service/migrations/<NNNN>-<slug>.sql` with a `schema_version` row in a `_meta` table.

## Why

- **SQLite is the right shape for single-user local state.** Embedded, transactional, zero-config. `better-sqlite3` is synchronous which is fine for a single-user app and dramatically simpler than callback/promise sqlite bindings.
- **Keychain for the PAT means the secret never lives in a file we own.** A user who `rm -rf ~/.tgl` does not leak credentials. Backups of `~/.tgl/` don't carry the PAT to a sync service.
- **`%APPDATA%` and `~/.tgl/` follow OS conventions** so power users find the data where they expect.

## Schema sketch

Full schema lives in `library/knowledge/private/service/database-schema.md`. Highlights:

- `settings(key TEXT PRIMARY KEY, value TEXT)`
- `repos(path TEXT PRIMARY KEY, name TEXT, is_ignored INTEGER, last_scanned_at INTEGER, ...)`
- `findings(id INTEGER PK, repo_path TEXT, check_id TEXT, severity TEXT, message TEXT, created_at INTEGER, resolved_at INTEGER)`
- `onboarding_steps(id TEXT PRIMARY KEY, label TEXT, status TEXT, completed_at INTEGER)`
- `_meta(key TEXT PRIMARY KEY, value TEXT)` — holds `schema_version`

## Consequences

- We accept the keytar native-module dependency and its prebuild matrix.
- Linux users without libsecret get a clear error during install and a fallback path to enter the PAT into a file mode-600'd at `~/.tgl/.pat` (documented as second-choice).
- Database file is small (kilobytes for a normal user); we ship periodic `VACUUM` on a weekly cron.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| JSON file in `~/.tgl/state.json` | No transactional safety; concurrent writes from CLI + service corrupt easily. |
| LevelDB / lmdb | Heavier dependency for no real win at this scale. |
| Postgres | Comically overkill. |
| `.env`-style file for the PAT | Trivially leaks via `cat`, `ls`, accidental commit. |
| Encrypt the PAT with a user-derived passphrase | Adds a passphrase prompt every boot. Awful UX. |
