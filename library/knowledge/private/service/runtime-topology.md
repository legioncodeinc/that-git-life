# Runtime topology

- **Category:** Reference
- **Status:** Canonical
- **Last updated:** 2026-05-23

How TGL runs after install: processes, ports, files on disk, scheduled jobs.

---

## Processes

A single Node process. No worker forks. Fastify handles HTTP and background jobs use `node-cron` + an in-process job queue (see `src/service/jobs/`).

Process lifecycle:

1. **Boot** — auto-start hook fires `node <install>/bin/tgl.js start --daemon`.
2. **Init** — open SQLite, run migrations, bind to `127.0.0.1:3050`.
3. **Idle** — Fastify serves the web app + API; cron triggers scheduled scans.
4. **Shutdown** — `tgl stop` sends SIGTERM; process flushes logs and closes the DB.

The daemon never daemonizes itself — the OS hook does the daemonization. We just run in the foreground and let the hook handle PID + logging.

---

## Ports & sockets

| Bind | Port | Direction |
|---|---|---|
| `127.0.0.1` | 3050 | Inbound HTTP from the user's browser + CLI |

Nothing else listens. We do **not** bind `0.0.0.0`. If port 3050 is taken, the service exits with `EPORT_IN_USE` and the CLI prints `tgl start --port <n>` as the remediation.

---

## Files & directories

| Path | Purpose |
|---|---|
| `~/.tgl/tgl.db` | SQLite database. |
| `~/.tgl/api-token` | Local API token. Mode `0600`. |
| `~/.tgl/logs/service.log` | Rolling log file (Pino → daily rotate). |
| `~/.tgl/logs/service.<date>.log` | Rotated daily files; kept 30 days. |
| `~/.tgl/skills-remote/` | Mirror of `the-notorious-llama/global-skills`. |
| `~/.tgl/backups/` | DB backups produced by `tgl backup`. |
| `<github-root>/.ssh-keys/` | TGL-generated SSH key pair. |

On Windows replace `~/.tgl` with `%APPDATA%\tgl`.

---

## Scheduled jobs (cron)

| Cron | Job |
|---|---|
| `0 3 * * *` | Full repo scan (all tracked, unignored repos). Configurable via `settings.scan_cadence_cron`. |
| `0 4 * * *` | Remote skill sync. |
| `0 5 * * *` | npm update check; surfaces as an in-UI prompt. |
| `0 5 * * 0` | Weekly `VACUUM` of SQLite. |

Cron times are local time (the OS hook injects `TZ=` if needed).

---

## Threading model

`better-sqlite3` is synchronous. HTTP handlers that touch the DB are short and return quickly. Long-running operations (scans, standardizer runs, sync) push work onto the in-process job queue and respond with 202 + job ID (see API contract §8).

The job queue is single-threaded — one job runs at a time. Scans of multiple repos are sequential within a job to keep disk and git contention low.

---

## Crash + restart

- The OS hook (ADR-005) restarts the process on crash.
- On unclean shutdown, the next boot:
  - Marks any `status = 'running'` jobs as `failed` with `error: "service restarted"`.
  - Logs a warning.
- The DB is durable across crashes thanks to SQLite WAL mode (`PRAGMA journal_mode=WAL`).
