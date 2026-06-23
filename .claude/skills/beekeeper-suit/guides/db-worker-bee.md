# DB Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `db-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/db-worker-bee.md`](../../agents/db-worker-bee.md)
**Stinger:** [`.cursor/skills/db-stinger/`](../../skills/db-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

db-worker-bee is the Army's PostgreSQL architecture engineer. It owns relational schema design (types, constraints, normalization with explicit denormalization), index selection across every Postgres index family (B-tree, GIN, GiST, BRIN, partial, covering, expression), and zero-downtime migrations using the expand-backfill-contract pattern and `pgroll` for online migrations. It governs performance and pooling discipline — autovacuum, bloat, `EXPLAIN (ANALYZE, BUFFERS)` interpretation, and PgBouncer transaction vs session mode — as well as special-purpose Postgres features (`pgvector` up to handoff, FTS, logical replication, TimescaleDB / Tiger Data). It is also the authoritative voice on ORM selection (Drizzle vs Prisma vs raw SQL) and serverless DB platform choice (Supabase, Neon, Turso, PlanetScale, CockroachDB Serverless, Tiger Data).

## Trigger phrases

Route to `db-worker-bee` when the user says any of:

- "design this schema"
- "review this migration"
- "should this be jsonb or columns?"
- "is this index right?"
- "we need a NOT NULL on a 100M-row table"
- "Drizzle or Prisma?"
- "Supabase or Neon?"
- "production query is slow — read this EXPLAIN"

Or when the request implicitly involves PostgreSQL schema design, migration safety, query performance, connection pooling, ORM selection, or serverless database platform choice.

## Do NOT route when

- The request is PRD-level schema authoring from product intent — route to `library-worker-bee`; db-worker-bee implements after the PRD lands.
- The request is data-layer consumption in React components (TanStack Query keys, RSC vs route loader, optimistic updates, N+1 at the component edge) — route to `react-worker-bee`; db-worker-bee flags N+1 risks at the schema/query level only.
- The request is a security audit of RLS policies, PII columns, encryption-at-rest, or audit-log compliance — route to `security-worker-bee`; db-worker-bee surfaces the concern and hands off.
- The request is RAG / embedding retrieval, chunking, or reranking — route to `ai-platform-worker-bee`; db-worker-bee picks `pgvector` storage shape and stops.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- Existing DDL or ORM schema file (`schema.prisma` or `schema.ts`) — required for brownfield reviews, migrations, and indexing audits.
- `package.json` — to determine ORM version, migration tool, and Postgres client in use.
- Query plans (`EXPLAIN (ANALYZE, BUFFERS)` output) — required for any performance finding; without a plan there is no finding.
- Table size / row counts — required to determine whether expand-backfill-contract applies (threshold: > 1M rows).
- Pooler config (`pgbouncer.ini` / Supavisor settings) — optional; defaults to "no pooler detected, recommend transaction-mode PgBouncer" if absent.

## Outputs the Bee produces

- **Audit / review report** — findings classified by severity (must-fix / should-refactor / style), with file:line citations; lands at `library/qa/db/<date>-<topic>.md` (standalone) or `library/requirements/features/feature-<###>-<title>/reports/<date>-<topic>.md` (feature-tied).
- **Migration plan** — phased plan with lock classes per DDL and an expand-backfill-contract checklist; lands at `library/qa/db/<date>-migration-plan.md` or the feature-tied path.
- **ORM / platform ADR** — Architecture Decision Record; lands at `library/architecture/ADR-<n>-<topic>.md`.
- **Schema spec + starter file** — for greenfield design; `templates/schema-spec.md` shape plus a starter `schema.ts` (Drizzle) or `.prisma` (Prisma).
- **Run archive copy** — every output is also archived inside the stinger at `reports/YYYY-MM-DD-<slug>.md`.

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- **Postgres-first by default** — reach for `jsonb`, arrays, enums, ranges, partial indexes, and `EXCLUDE` constraints before any application-layer workaround.
- **Every FK gets an index** — Postgres does not auto-create FK indexes; a missing FK index on a hot join is must-fix and blocks merge.
- **No destructive single-step DDL on tables > 1M rows** — state the lock class of every DDL statement; use expand-backfill-contract; use `pgroll` for online migrations.
- **`EXPLAIN (ANALYZE, BUFFERS)` or it didn't happen** — cite the plan in any performance finding; "this is slow" is not a finding.
- **`jsonb` is a column type, not a schema escape hatch** — if 80% of fields are queried they are columns; misusing `jsonb` recreates EAV anti-patterns at runtime cost.
- **Connection pooling is mandatory for serverless / Lambda** — PgBouncer in transaction mode by default; session mode only when `LISTEN/NOTIFY` or session `SET` requires it.
- **ORM choice is a workload question, not a religion** — cite trade-offs; never declare one ORM universally right.
- **Cite every claim** — a guide section, research note, or postgresql.org URL; "best practice" alone is not a citation.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
