# How to run migrations locally

> Category: How-to Guide | Version: 1.0 | Date: May 2026 | Status: Active

Step-by-step runbook for creating, previewing, applying, and rolling back database migrations during local development. Covers the 80% case; see [migrations-production.md](migrations-production.md) for prod procedures.

**Related:**
- [kb-database-schema.md](../architecture/database-schema.md) — schema overview
- `prisma/schema.prisma`
- `db/migrations/`

---

## Prerequisites

- Node 20+ and the repo's `npm install` has completed.
- A running local Postgres (see [how-to-start-local-stack.md](how-to-start-local-stack.md)).
- `.env` file at repo root with `DATABASE_URL` pointing at the local DB.

## Create a new migration

### Step 1 — Edit the schema

Edit `prisma/schema.prisma`. Add your model, field, enum, or index.

```diff
 model User {
   id        String   @id @default(uuid())
   email     String   @unique
+  exportedAt DateTime?
 }
```

### Step 2 — Generate the migration

```bash
npx prisma migrate dev --name add_user_exported_at
```

This does three things:

1. Diffs `prisma/schema.prisma` against the current DB state.
2. Writes a new SQL file to `prisma/migrations/<timestamp>_add_user_exported_at/migration.sql`.
3. Applies the SQL to your local DB.
4. Regenerates the Prisma client.

### Step 3 — Review the generated SQL

Open `prisma/migrations/<timestamp>_add_user_exported_at/migration.sql` and confirm:

- The change matches your intent.
- No destructive operations on existing data (no `DROP`, no `NOT NULL` on an existing column without `DEFAULT`).
- Index additions use `CONCURRENTLY` if they target a large table.

If the SQL looks wrong, edit it directly and re-run `npx prisma migrate dev` with `--create-only` next time to skip auto-apply.

## Preview without applying

```bash
npx prisma migrate dev --create-only
```

Writes the SQL file but does not apply it. Useful when you want to hand-edit the SQL before running.

## Apply a pending migration

```bash
npx prisma migrate dev
```

Applies any unapplied migrations to the local DB.

## Roll back

Prisma does not support automatic rollbacks. Two options:

### Option A — Reset to a clean state (destroys all local data)

```bash
npx prisma migrate reset
```

Drops the schema, re-runs every migration, runs the seed script if configured. Use this when your local DB is scratch.

### Option B — Hand-rollback

1. Write a new migration that reverses the bad one.
2. Apply it.
3. Mark the original as "rolled back" in a comment in its SQL file.

Never edit an already-applied migration's SQL. Create a new one.

## Seed data

```bash
npx prisma db seed
```

Runs the seed script defined in `package.json` under `prisma.seed`. See `prisma/seed.ts` for what it populates.

## Common pitfalls

| Symptom | Cause | Fix |
|---|---|---|
| `Error: P1001` | DB not running | Start local stack |
| `Error: P3006` (failed migration) | SQL error in the generated file | Read the error, fix the SQL, reset |
| Prisma client out of date after pull | Someone else added a migration | `npx prisma generate && npx prisma migrate dev` |
| Migration applies locally but fails in CI | CI uses `migrate deploy`, which is stricter | Ensure the migration is committed and the CI DB is empty |

## Related code

- `prisma/schema.prisma` — source of truth for the schema.
- `prisma/migrations/` — generated SQL files.
- `prisma/seed.ts` — seed script.

## Related docs

- [migrations-production.md](migrations-production.md) — how prod migrations work.
- [kb-database-schema.md](../architecture/database-schema.md) — schema overview.

## Changelog

- v1.0 (2026-05) — Initial version.
