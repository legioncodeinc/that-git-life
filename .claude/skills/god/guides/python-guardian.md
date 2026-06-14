# Python Guardian — God's Guide

The God routing skill's record of when to invoke `python-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/python-guardian.md`](../../../agents/python-guardian.md)
**Weapon:** [`ai-tools/skills/python-weapon/`](../../python-weapon/)
**Command Brief:** [`ai-tools/command-briefs/python-guardian-command-brief.md`](../../../command-briefs/python-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`python-guardian` is the Army's Python specialist — opinionated, modern, grounded in production patterns rather than tutorial tropes. It enforces a canonical stack: Django + Django Ninja + FastAPI + Celery + Channels + pytest + uv + Pydantic v2 + Ruff + pyright + httpx + factory_boy. Its remit covers Django app architecture, ORM access patterns (N+1 prevention via `select_related` / `prefetch_related`, raw SQL only with justification), migration mechanics (expand-backfill-contract; never edit applied migrations), the API layer (Django Ninja over DRF for new code; FastAPI when there's no Django app), Celery jobs (retries, idempotency, `acks_late`), Channels realtime (consumers + Daphne), pytest discipline, type adoption, Ruff configuration, uv migration, async refactors, settings split, and the Django + React decoupled-architecture surface (CORS, auth handoff, API contract). Opinionation is the product — the Angel says "use X, not Y" with reasoning and a source, not "here are options."

## Trigger phrases

Route to `python-guardian` when the user says any of:

- "Review this Django code" / "Audit this Django app"
- "Audit ORM patterns" / "Fix N+1 queries"
- "Migrate DRF to Django Ninja"
- "Set up Celery" / "Refactor Celery tasks"
- "Enable Channels" / "Add WebSockets to Django"
- "Configure pytest for Django"
- "Switch to Ruff" / "Migrate to uv" / "Migrate from Poetry to uv"
- "Set up pyright" / "Adopt strict type checking"
- "Review the Django + React decoupled API"
- "Convert this view to async"
- "Split settings into base/dev/prod"
- Anything touching a `.py` file in a PR for a Django, FastAPI, Flask, Celery, or Channels codebase

Or when the request implicitly involves Python architecture, Python stack choices, or any of the canonical-stack tools above.

## Do NOT route when

- The user wants React component shape, state management, or data fetching — that is `react-guardian`.
- The user wants Postgres schema design, indexing, or partitioning — that is `db-guardian`. (Django ORM access patterns + Django-side migration mechanics stay here; schema design belongs to db-guardian.)
- The user wants a security audit of Django settings, secrets, CSRF, or ORM injection vectors — surface and hand off to `security-guardian`. (This Angel ensures the security baseline is in place; security-guardian audits.)
- The user wants to pick or configure an auth provider (Clerk, Better Auth, Auth.js, Supabase Auth, WorkOS, OAuth flow design) — that is `auth-guardian`. (Python wiring of the chosen provider stays here.)
- The user wants Stripe flow design, webhook architecture, or subscription lifecycle — that is `payments-guardian`. (Python SDK wiring stays here.)
- The user wants AI cognitive infrastructure, RAG, prompt cascade, or evals — that is `mind-guardian`. (The Python service-layer or Celery task that hosts the cognitive code is co-owned; the cognitive design is mind-guardian.)
- The user wants Dockerfile shape, CI pipelines, BuildKit cache, or OIDC for cloud deploys — that is `devops-guardian`. (Runtime choice — gunicorn vs uvicorn vs daphne — is co-owned.)
- The user wants PRD or IRD authoring — that is `library-guardian`. (Architectural rationale that feeds into the PRD stays here.)
- The user wants post-implementation QA against a plan — that is `quality-guardian`. (The pytest suite this Angel designs becomes that audit's evidence.)

If the request straddles boundaries (e.g., "audit our Django + React app end to end"), prefer routing to `python-guardian` first for the API surface and Django side, then chain to `react-guardian` for the frontend.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- The Python codebase (current branch or specified range).
- Access to `pyproject.toml` (or `setup.cfg` / `requirements*.txt` if uv hasn't landed yet), `manage.py`, `settings/`, `INSTALLED_APPS`, `pytest.ini` / pyproject `[tool.pytest.ini_options]`, `pyrightconfig.json` or `mypy.ini` if present, `ruff.toml` if present, the full app tree.
- Optional: specific focus (Django app review, DRF → Ninja migration, Celery refactor, Channels enablement, pytest setup, type-adoption plan, Ruff config, uv migration, async refactor, settings split, decoupled-architecture audit).
- Optional: constraints (Python version pin, target deployment, sync vs async preference, legacy tooling that must be preserved).
- **Conditional, may be missing without blocking:** `Dockerfile` / `docker-compose.yml` (cross-reference with `devops-guardian` when present).

If the codebase access is missing, do not invoke yet — ask the user to point at the repo or paste the relevant file paths.

## Outputs the Angel produces

- **Standalone reviews / audits** → `library/qa/python/<date>-<topic>.md` (e.g., `2026-05-19-django-app-review.md`).
- **Feature-tied reviews** → `library/requirements/features/feature-<###>-<title>/reports/<date>-<type>-report.md`.
- **Issue-tied reviews** → `library/requirements/issues/issue-<###>-<title>/reports/<date>-<type>-report.md`.
- **ADRs** → `library/architecture/ADR-<n>-<topic>.md` (Context / Decision / Consequences / Alternatives Considered).
- **Refactor proposal** → architectural rationale here; PRD authoring hands off to `library-guardian`.
- **Code-review comments** → file:line classified per the severity rubric (must-fix / should-refactor / style).
- **Migration plans** → phased steps with parity checklists (DRF → Ninja, Poetry → uv, sync → async).

Every finding cites (a) `path/to/file.py:LN` in the user's codebase and (b) the relevant guide in `python-weapon/guides/` plus, where applicable, the upstream reference (Django docs, HackSoftware django-styleguide, etc.).

## Multi-Angel sequences this Angel participates in

- **Full-stack Python + React audit** — `python-guardian` reviews the API surface, Django architecture, ORM patterns, and the decoupled-architecture wiring; `react-guardian` reviews the frontend it serves; `db-guardian` reviews the Postgres schema underneath; `security-guardian` audits secrets/CSRF/settings. Sequence is `python-guardian` → `react-guardian` → `db-guardian` → `security-guardian` for a fresh codebase; reorder as the specific findings demand.
- **DRF → Django Ninja migration** — `python-guardian` produces the phased migration plan with the parity checklist; `library-guardian` writes the PRD; `quality-guardian` audits the migrated endpoints against the plan post-implementation.
- **Async refactor** — `python-guardian` produces the view-by-view async-justification audit; `devops-guardian` co-owns the runtime change (gunicorn → uvicorn / daphne); `db-guardian` confirms the schema/migration implications of any new patterns.
- **Channels enablement** — `python-guardian` writes the consumer + routing + channel-layer config; `devops-guardian` deploys Daphne; `auth-guardian` confirms the auth flow on WebSocket connections.
- **Django security baseline** — `python-guardian` ensures the `SECURE_*` settings, Argon2 hasher, settings split, secrets-from-env are in place; `security-guardian` audits the broader surface (CSRF, ORM injection vectors, OAuth flow review).

## Critical directives the orchestrator should respect

- **Stack is canon, not recommendation.** Django Ninja for new APIs; FastAPI for non-Django services; Celery for jobs; Channels for WebSockets; pytest for tests; uv for packaging; Pydantic v2 at boundaries; Ruff over Black + isort + flake8; pyright basic minimum (strict on new code); httpx for outbound HTTP. The Angel will not present "options with trade-offs" for these — substitutions require an ADR.
- **N+1 is a must-fix.** The Angel will block merge on N+1 patterns, raw SQL without justification, edited applied migrations, secrets in code, missing `transaction.atomic()` on multi-write operations, untyped boundaries (function takes `dict` instead of a Pydantic model), bare `except:`, mutable default arguments.
- **Migrations are sacred.** The Angel will refuse to edit an applied migration. Schema-with-data changes use expand → backfill → contract over multiple deploys.
- **Severity is credibility.** Calling a style nit "must-fix" destroys trust. The Angel classifies every finding (must-fix / should-refactor / style) per the rubric in `guides/00-principles.md`.
- **Opinionation is the product.** The Angel says "use X, not Y" with reasoning. The `references/` folder exists for awareness of the alternatives it doesn't pick — not to invite substitution.
- **Hand off the moment a question crosses a boundary.** When the user asks about React shape, schema indexing, auth provider choice, Stripe design, AI cognitive layer, or CI pipelines, the Angel names the right Angel and stops at the boundary.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
