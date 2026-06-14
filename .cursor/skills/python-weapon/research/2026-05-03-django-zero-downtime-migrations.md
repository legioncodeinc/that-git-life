# 2026-05-03 — Django zero-downtime migrations (expand → backfill → contract)

## Sources

- https://docs.djangoproject.com/en/stable/howto/writing-migrations/ — official writing-migrations docs
- https://palakorn.com/blog/zero-downtime-database-migrations/ — Mar 2026 expand/contract playbook
- http://journal.rjevski.io/zero-downtime-django-database-change-strategies — Django-specific transition states
- https://github.com/django-pg-zero-downtime-migrations/django-pg-zero-downtime-migrations — Django-tuned safety wrapper
- https://github.com/charettes/django-syzygy — pre/post-deploy migration tooling

## Summary

**The five-phase rule:** every schema change is a campaign, not an atomic event. Each phase ships as its own deploy:

1. **Expand** — add the new shape (column, table) **alongside** the old. Nullable, with a default if write-compatibility matters.
2. **Dual-write** — application writes both old and new shapes.
3. **Backfill** — batched copy of old → new. Run from a job runner (Celery), not from inside a migration. Batch + throttle + paginate by key + checkpoint. Never one giant `UPDATE`.
4. **Switch reads** — application reads from new (behind a feature flag, ramped 1% → 10% → 50% → 100%). Keep the old read path live.
5. **Contract** — drop the old column / table. Only after the rollback horizon (often a week+) has passed.

**Django-specific pitfalls:**

- **`AddField` with a default** triggers a full-table rewrite on older Postgres versions — locks the table. Use Django 5+'s `db_default`, or hand-roll: nullable add → backfill → set NOT NULL in a separate migration.
- **`RunPython` in the migration file** is acceptable for tiny tables (< 10K rows). For anything larger, do the data move from a one-off Celery task or management command and keep the migration purely structural.
- **Never edit an applied migration.** Once it's deployed anywhere, it's frozen. Add a new migration that does the change.
- **`atomic=False`** on a migration is required to use `CONCURRENTLY` (Postgres index creation that doesn't block writes). `RunSQL` with `atomic=False` is the canonical bypass.
- **`migrate --check`** in CI to detect unapplied migrations on the working branch.

**Tooling:**

- `django-pg-zero-downtime-migrations` — overrides the schema editor to refuse unsafe operations (full-table locks, default value rewrites) and emits the safe-version DDL.
- `django-syzygy` — splits a single migration into pre-deploy and post-deploy phases automatically.

## Key facts the active guides depend on

- The expand/contract pattern is **not optional** for production schema changes against a hot table.
- Backfills live in jobs, not migrations.
- Migrations are sacred — never edited after deploy.

## Relevance to the Weapon

- **`guides/04-django-migrations.md`** — `makemigrations` + `migrate`, `RunPython`, `RunSQL`, expand-backfill-contract, `--check` in CI, never-edit-applied invariant.
- **`scripts/audit-applied-migrations.py`** — verify no edits to migrations already deployed.
- **`templates/django-migration-runpython.py`** — canonical data-migration shape with batching.

## Pull quote

> "Treat schema changes as week-long campaigns, not atomic events — every phase ships as its own deploy. Follow the five-phase expand/contract loop: expand, dual-write, backfill, switch reads, contract. Never run a statement that triggers a full-table rewrite or holds ACCESS EXCLUSIVE on a hot table." — palakorn.com expand/contract playbook (March 2026).
