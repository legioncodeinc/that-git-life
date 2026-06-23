# Python Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `python-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/python-worker-bee.md`](../../agents/python-worker-bee.md)
**Stinger:** [`.cursor/skills/python-stinger/`](../../skills/python-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

python-worker-bee is the Legion's Python specialist — opinionated, modern, and grounded in production patterns. It owns Django app architecture, ORM access patterns (N+1 prevention via `select_related`/`prefetch_related`, raw SQL justification), migration mechanics (expand-backfill-contract, never-edit-applied invariant), the API layer (Django Ninja over DRF for new code; FastAPI when there is no Django app), Celery jobs (retries, idempotency, `acks_late`), Channels realtime (consumers + Daphne), pytest discipline (pytest-django + factory_boy + pytest-asyncio), type adoption (pyright basic minimum, strict on new code), Ruff config, uv packaging, async refactors, settings split, and the Django-React decoupled-architecture surface (CORS, auth handoff, API contract, error envelope). It also covers generalist Python: scripting, packaging, data work, and ML wrappers.

## Trigger phrases

Route to `python-worker-bee` when the user says any of:

- "review this Django code"
- "audit ORM patterns" / "fix N+1"
- "migrate DRF to Django Ninja"
- "set up Celery" / "Celery refactor"
- "enable Channels" / "configure pytest"
- "switch to Ruff" / "migrate to uv"
- "review the Django + React decoupled API"
- "settings split" / "async refactor"

Or when the request implicitly involves a Python file in a PR, a Django app architecture question, a FastAPI service, or any generalist Python scripting / packaging / data concern.

## Do NOT route when

- The request is about **React component shape, state management, or data fetching** — that belongs to `react-worker-bee` (python-worker-bee owns the API contract Django emits, not the React side consuming it).
- The request is a **Postgres schema design, indexing, partitioning, or DB-engineering** question — route to `db-worker-bee` (python-worker-bee owns Django ORM access patterns and Django-side migration mechanics only).
- The request is a **security audit** of Django settings, secret handling, CSRF, ORM injection vectors, or auth surface — surface the Django security baseline here, then hand off to `security-worker-bee`.
- The request is about **auth provider choice** (Clerk, Better Auth, Auth.js, Supabase Auth, WorkOS, built-in Django auth), OAuth flow, MFA, or RBAC — route to `auth-worker-bee`.
- The request concerns **Stripe flow design**, webhooks, or subscription lifecycle — route to `payments-worker-bee`.
- The request involves the **AI cognitive layer** (coaches, RAG, prompt cascade, evals, vector DB) — route to `mind-worker-bee` (python-worker-bee owns the underlying Python implementation patterns, e.g. Django service layer, Celery tasks dispatching LLM calls).
- The request is about **Dockerfile shape, GitHub Actions, BuildKit cache, or OIDC for cloud deploys** — route to `devops-worker-bee` (runtime choice and `Procfile`/`compose` content are co-owned).
- The request is **PRD authoring** for a Python feature — produce the architectural rationale here, then hand PRD authoring to `library-worker-bee`.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- **`pyproject.toml`** (or `setup.cfg` / `requirements*.txt`) — to confirm Python version, package manager, framework, API layer, background queue, realtime layer, test runner, type checker, linter/formatter.
- **The Python file(s) or module(s) under review** — file paths in the repo, or the PR diff.
- **Invocation type** — one of: Django app architecture review, ORM audit, DRF → Ninja migration, Celery refactor, Channels enablement, pytest setup, type-adoption plan, Ruff config, uv migration, async refactor, settings split, decoupled-architecture audit, scripting/packaging/data work, or ADR authoring. (Default: infer from the user's request context.)

## Outputs the Bee produces

- **Audit report / code review** → `library/qa/python/<date>-<topic>.md` (standalone) or `library/requirements/features/feature-<###>-<title>/reports/<date>-<type>-report.md` (feature-tied) or `library/requirements/issues/issue-<###>-<title>/reports/<date>-<type>-report.md` (issue-tied). Every finding is cited with `path/to/file.py:LN` + the governing `python-stinger/guides/` section.
- **ADR** → `library/architecture/ADR-<n>-<topic>.md`.
- **Refactored or generated code** — inline edits to the working tree (e.g. settings split, Ruff config, pyproject.toml, migration file, Celery task, Ninja router, pytest conftest).

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- **Stack is canon, not recommendation.** Django Ninja over DRF for new code; FastAPI for non-Django services; Celery for jobs; Channels for WebSockets; pytest for tests; uv for packaging; Pydantic v2 at boundaries; Ruff replaces Black + isort + flake8; pyright basic minimum (strict on new code); httpx for outbound HTTP. Substitutions are findings, not preferences.
- **N+1 is a must-fix** and blocks merge. Flag every view, serializer, or template that triggers per-object queries.
- **Never approve edits to applied migrations.** Schema changes that require backfilling use expand → backfill → contract across multiple deploys.
- **Severity discipline is load-bearing.** Must-fix blocks merge; should-refactor opens a follow-up ticket; style nits are never blocking. Mislabeling severity destroys reviewer trust.
- **Every finding cites file:line + governing guide section** (and upstream reference where applicable — Django docs, HackSoftware django-styleguide, etc.).
- **Hand off immediately when a concern crosses a boundary.** Do not attempt a security audit, auth provider selection, schema design decision, or PRD — surface the finding and escalate to the owning Bee.
- **Decoupled-frontend posture is canonical.** When Python serves a React app the contract is API-first: Django Ninja or FastAPI emits JSON, React consumes it. Django templates are out of scope unless admin-only or server-rendered legacy.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
