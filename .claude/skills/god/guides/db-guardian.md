# Guide: db-guardian

PostgreSQL data architecture engineer — schema, indexing, zero-downtime migrations, ORM choice, and serverless DB platform selection.

---

## What this Angel owns

`db-guardian` designs, reviews, and migrates PostgreSQL-shaped data layers from greenfield schema through production. It is Postgres-first, opinionated, and rigorous about migration safety. Its territory:

- **Schema design** — types (`jsonb`, arrays, enums, ranges, custom types), constraints (PK, FK, `CHECK`, `EXCLUDE`), normalization with explicit denormalization, audit columns.
- **Indexing** — B-tree (default + FK + status) / GiST (ranges + geometry) / GIN (`jsonb` + FTS) / BRIN (large append-only) / partial / covering / expression — chosen via a decision tree per workload.
- **Migrations** — expand-backfill-contract, `pgroll` for online migrations, lock-class table per DDL, no destructive single-step DDL on tables > 1M rows.
- **Partitioning** — range / list / hash, partition pruning, attach / detach, when to reach for it.
- **Performance & pooling** — autovacuum tuning, bloat detection, `EXPLAIN (ANALYZE, BUFFERS)`, PgBouncer transaction vs session mode for serverless.
- **Special-purpose Postgres** — `pgvector` storage decision (handed off to `ai-platform-guardian`), Postgres FTS, logical replication / CDC, TimescaleDB / Tiger Data for time-series.
- **ORM choice** — Drizzle vs Prisma vs raw SQL — workload-shaped, with explicit migration story and N+1 risk callouts.
- **Serverless platform choice** — Supabase / Neon / Turso / PlanetScale / CockroachDB Serverless / Tiger Data — workload-to-platform matching.

It does not author PRDs, audit RLS / PII / encryption-at-rest, consume the data layer in components, or own RAG retrieval. Those surface as flagged handoffs to `library-guardian`, `security-guardian`, `react-guardian`, and `ai-platform-guardian` respectively.

## When to invoke

Delegate to `db-guardian` when the user:

- Says "design this schema", "review this migration", "is this index right?", "should this be `jsonb` or columns?".
- Asks about adding a NOT NULL column, changing a column type, or any DDL on a large table — anywhere expand-backfill-contract is the answer.
- Wants a Drizzle vs Prisma vs raw SQL ADR.
- Wants a Supabase vs Neon vs Turso vs PlanetScale vs CockroachDB vs Tiger Data platform pick.
- Has a slow query and an `EXPLAIN (ANALYZE, BUFFERS)` plan, or needs help reading one.
- Asks about PgBouncer transaction vs session mode, or about why serverless Lambdas keep killing the database.
- Touches `pgvector` storage shape (column type + index family) — db-guardian picks the storage; `ai-platform-guardian` picks retrieval.

Do **not** invoke for PRD authoring of the schema — that's `library-guardian`'s domain (db-guardian implements *after* the PRD lands).

Do **not** invoke for security audits of RLS policies, PII columns, encryption-at-rest, or audit-log compliance — that's `security-guardian`'s domain. db-guardian *designs* RLS hooks and *flags* PII; security-guardian *audits*.

Do **not** invoke for component-level data-layer choices (TanStack Query keys, RSC vs route loader, optimistic updates) — that's `react-guardian`. db-guardian flags N+1 risks at the schema/query level and hands off.

Do **not** invoke for RAG pipelines, chunking, reranking, or retrieval evaluation — that's `ai-platform-guardian`. db-guardian picks `pgvector` + index family and stops.

## Paired Weapon

`.cursor/skills/db-weapon/` — contains the master index (SKILL.md) with invocation modes (design / migration / performance audit / platform-choice) and severity rubric, 9 layered guides covering schema → indexing → migrations → partitioning → performance/pooling → special-purpose → ORM → platform, worked examples (greenfield schema, zero-downtime NOT NULL, platform walkthrough), output templates (schema spec, migration plan, expand-backfill-contract checklist, index decision tree, Drizzle and Prisma starters, PgBouncer config, ADR), deterministic SQL and shell scripts (`analyze-query-plan.sh`, `audit-missing-indexes.sql`, `bloat-check.sql`), and the dated research trail.

## Expected input

- The schema, migration set, query plan, or platform-choice question. Greenfield or brownfield.
- The Postgres major version (or permission to read it) — lock behavior, `pgroll` capability, `pgvector` index types differ across majors.
- Optional: workload shape (read-heavy / write-heavy / mixed / time-series / vector), expected row counts at 12 / 24 / 36 months, RPO / RTO, geographic distribution, budget band.
- Optional: existing migration tool (`drizzle-kit`, `prisma migrate`, `pgroll`, raw SQL).
- Access to: existing DDL or ORM schema, recent migrations, `EXPLAIN (ANALYZE, BUFFERS)` for problem queries, `pg_stat_user_indexes`, pooler config, `package.json` for ORM versions.

## Expected output

- Findings classified per the severity rubric: must-fix / should-refactor / style.
- Every finding cites `schema.sql:LN` (or migration / ORM file) plus a guide section, research note, or external URL.
- For greenfield: filled-in `templates/schema-spec.md` + a starter `schema.ts` (Drizzle) or `schema.prisma` from `templates/`.
- For migrations: `templates/migration-plan.md` with lock classes per DDL, gated by `templates/expand-backfill-contract-checklist.md`.
- For indexing audits: report at the host repo's `library/qa/db/<date>-indexing-audit.md` (standalone) or `library/requirements/features/feature-<###>-<title>/reports/<date>-indexing-audit.md` (feature-tied), listing missing / redundant / bloated indexes with `EXPLAIN` evidence.
- For performance audits: autovacuum + bloat + hot-query findings with prioritized remediation.
- For ORM ADR: `templates/ADR.md` with N+1 risk callout and migration story.
- For platform choice: `examples/serverless-platform-choice-walkthrough.md`-shaped decision matrix.
- Explicit handoff lines for any finding that belongs to another Angel (`library-guardian`, `security-guardian`, `react-guardian`, `ai-platform-guardian`, `quality-guardian`).

## Critical directives to respect when routing

- **Postgres-first by default.** Do not ask db-guardian to bend the schema around an ORM limitation when a `jsonb` column, partial index, or `EXCLUDE` constraint solves it cleanly in the database.
- **Every FK gets an index.** Postgres does not auto-create them. db-guardian will flag this as must-fix; do not contest the call.
- **No destructive single-step DDL on tables > 1M rows.** If the request is "add a NOT NULL column", expect db-guardian to return an expand-backfill-contract plan, not a one-liner. That is the correct answer.
- **`EXPLAIN (ANALYZE, BUFFERS)` is mandatory for performance findings.** Pass the plan in the prompt or grant access to run it. Do not accept "this is slow" as input.
- **Connection pooling is mandatory for serverless.** If the user is on Lambda / Vercel / Cloudflare Workers without PgBouncer (or a managed pooler), expect a must-fix.
- **Security and RAG are surfaced, not audited.** db-guardian flags PII, RLS gaps, encryption-at-rest, and embedding-storage decisions, then hands off. Do not ask db-guardian to author the RLS audit or the RAG retrieval pipeline.

## Typical failure modes

- Invoked for PRD authoring — route to `library-guardian` first, then back to db-guardian for implementation.
- Invoked for a deep MySQL or MongoDB review — db-guardian produces reduced-coverage output and flags "REDUCED COVERAGE". Route MySQL to a stack-specific reviewer (db-guardian handles MySQL only at the PlanetScale platform-choice layer with caveats).
- Invoked for component-level data-layer decisions — route to `react-guardian`. db-guardian's territory ends at the query / schema; the boundary at the React edge is react-guardian's.
- Invoked for the full RAG pipeline — db-guardian picks `pgvector` storage and stops; route the rest to `ai-platform-guardian`.
- Invoked without a Postgres version — db-guardian will ask, because lock behavior on `ADD COLUMN ... NOT NULL DEFAULT <expr>` and `pgvector` index availability differ across majors.
- Invoked without query plans on a performance question — db-guardian will refuse to assert without `EXPLAIN (ANALYZE, BUFFERS)`. Provide the plan or grant access.

## Orchestration notes

db-guardian sits at the data-architecture layer of the implementation loop:

**`library-guardian` (schema PRD) → `db-guardian` (schema + migration + indexes) → `react-guardian` (data-layer consumption) → `security-guardian` (RLS / PII / encryption audit) → `quality-guardian` (post-migration verification).**

For embedding-heavy work, `db-guardian` handles the `pgvector` storage decision and hands retrieval / chunking / reranking to `ai-platform-guardian`. For time-series workloads, `db-guardian` owns the schema and hands the platform pick (Tiger Data) in the same pass.

For "production is on fire" invocations (slow query, dying connections, table bloat), db-guardian inverts the layering — start at platform/pooling, then indexes, then schema. Architectural cleanup follows once the fire is out.

For greenfield schemas, db-guardian can run independently of the implementati