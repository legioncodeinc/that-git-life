# PRD-002: Service core

- **Status:** backlog
- **Owner:** Cursor
- **Depends on:** PRD-001 (install bootstraps the package which the service ships in)

## 1. Problem

The web UI needs a backend that persists state, talks to git + GitHub, and runs scheduled jobs. The brief says "service running on uncommon port 3050." We need a Fastify HTTP server, SQLite store, secret storage, and the foundational job + logging plumbing — built once and reused by every later PRD.

## 2. Goals

- Bootable Fastify service on `127.0.0.1:3050` (HTTP, per ADR-003).
- SQLite-backed state at `~/.tgl/tgl.db`, with versioned migrations (per ADR-004).
- GitHub PAT stored in OS keychain via `keytar`.
- Standard request/response shape, error envelope, local-only auth via `X-TGL-Token`.
- Pino-based logging with daily rotation.
- In-process job queue for long-running operations (returns 202 + job ID).
- Cron registration plumbing (jobs themselves are defined in later PRDs).

## 3. Non-goals

- Implementing any specific feature endpoints (scan, standardize, etc.) — those live in their own PRDs.
- A worker process or queue worker. Single Node process.
- HTTPS, TLS, or any non-loopback binding.

## 4. User stories

- "As Cursor, I can run `tgl start` and hit `GET /api/v1/health` to confirm the service is up."
- "As Cursor, I can write a new route file and have it auto-mounted under `/api/v1/<feature>/*`."
- "As Cursor, I can submit a long-running job and poll `/api/v1/jobs/:id` for status."

## 5. Scope

### In scope

- Fastify bootstrap with CORS off, body limit, schema validation, request logging.
- `127.0.0.1`-only binding, port 3050, env override.
- Local-auth middleware (`X-TGL-Token`).
- SQLite + migrations runner.
- `keytar` wrapper for PAT storage.
- Logger (Pino + rotation).
- Job queue + `/api/v1/jobs/*` endpoints.
- `tgl start` / `tgl stop` / `tgl status` CLI commands.

### Out of scope

- `/api/v1/onboarding/*` (PRD-003).
- `/api/v1/repos/*` (PRDs 004, 005, 006).
- `/api/v1/skills/*` (PRD-009 + PRD-008).
- Auto-start hooks (PRD-007).

## 6. Acceptance criteria

- [ ] `tgl start` boots in < 1.5 s on a modern machine.
- [ ] `GET /api/v1/health` returns 200 with `{ "health": { "ok": true, "version": "..." } }`.
- [ ] The service binds to `127.0.0.1` only. Connecting from another machine fails.
- [ ] Every other route requires `X-TGL-Token`; calls without the header return 401.
- [ ] Migrations run on start; `_meta.schema_version` reflects the latest.
- [ ] A test that submits a fake job sees `pending → running → succeeded` transitions through `/api/v1/jobs/:id`.
- [ ] Service writes to `~/.tgl/logs/service.log` and rotates after 24 h.
- [ ] `keytar.setPassword` / `getPassword` round-trip works on all three platforms.
- [ ] `tgl stop` triggers a clean SIGTERM shutdown with DB closed.

## 7. File-level deliverables

- `src/service/index.ts` — Fastify bootstrap, plugin registration, listen.
- `src/service/plugins/auth.ts` — `X-TGL-Token` middleware.
- `src/service/plugins/error-envelope.ts` — converts thrown errors into the standard envelope.
- `src/service/plugins/job-queue.ts` — in-process FIFO queue + `/api/v1/jobs/*` routes.
- `src/service/db/index.ts` — better-sqlite3 wrapper + migration runner.
- `src/service/db/migrations/0001-init.sql` — initial schema (see `database-schema.md`).
- `src/service/secrets/keytar.ts` — thin wrapper around `keytar` with typed `Secret` enum.
- `src/shared/logger.ts` — Pino with `pino-roll` daily rotation.
- `src/cli/start.ts` — `tgl start` command.
- `src/cli/stop.ts` — `tgl stop` command.
- `src/cli/status.ts` — `tgl status` command (hits health).

## 8. Sequenced steps

1. Scaffold `src/service/`, `src/shared/`, `src/cli/`.
2. Build the logger and config (env + defaults).
3. Build the DB + migration runner; commit `0001-init.sql`.
4. Build the keytar wrapper with a typed `Secret` enum.
5. Bootstrap Fastify; add health and handshake routes.
6. Add the auth plugin and error-envelope plugin.
7. Implement the in-process job queue + jobs routes.
8. Implement `tgl start | stop | status`.
9. Write integration tests against a temp SQLite + ephemeral keychain (mock).
10. Write the QA artifact at `qa/prd-002-service-core-qa.md`.

## 9. Risks

| Risk | Mitigation |
|---|---|
| `keytar` prebuilds break on a new platform. | Fall back to a mode-0600 file at `~/.tgl/.secrets` with a loud warning. |
| Port 3050 is already in use. | Surface `EPORT_IN_USE`; suggest `tgl start --port <n>`. |
| Migration runner runs partially and fails midway. | Wrap each migration in a transaction; on failure, roll back and stop. |

## 10. References

- ADR-001, ADR-003, ADR-004 — stack, transport, storage.
- `library/knowledge/private/standards/api-contract-conventions.md`
- `library/knowledge/private/service/api-contract.md`
- `library/knowledge/private/service/database-schema.md`
- `library/knowledge/private/service/runtime-topology.md`
