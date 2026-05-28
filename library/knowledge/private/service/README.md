---
ai_description: |
  Backend service for that-git-life. Node + Fastify HTTP server listening on
  127.0.0.1:3050 (loopback only — never bind 0.0.0.0). Persists state in
  SQLite via better-sqlite3 and stores secrets (GitHub PAT) in the OS keychain
  via keytar. Use api-contract.md as the source of truth for endpoints, and
  database-schema.md for tables and migrations.
human_description: |
  Reference for the backend service: API endpoints, database tables, runtime
  behavior. Cursor should read both files here before writing service code.
---

# service/

| Document | Purpose |
|---|---|
| [`api-contract.md`](api-contract.md) | REST endpoints, request/response shapes, error envelope. |
| [`database-schema.md`](database-schema.md) | SQLite tables, columns, indexes, migration policy. |
| [`runtime-topology.md`](runtime-topology.md) | Process model, ports, IPC, scheduled jobs. |
