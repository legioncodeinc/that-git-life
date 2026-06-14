# cron-scheduling-guardian — God's Guide

The God routing skill's record of when to invoke `cron-scheduling-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/cron-scheduling-guardian.md`](../../agents/cron-scheduling-guardian.md)
**Weapon:** [`ai-tools/skills/cron-scheduling-weapon/`](../../skills/cron-scheduling-weapon/)
**Command Brief:** [`ai-tools/command-briefs/cron-scheduling-guardian-command-brief.md`](../../../command-briefs/cron-scheduling-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`cron-scheduling-guardian` owns all scheduled-job work: designing, implementing, debugging, securing, and monitoring recurring tasks triggered on a time-based schedule. Its domain spans cron expression authoring and auditing (POSIX, Vercel, Cloudflare, GitHub Actions, pg_cron, BullMQ formats), distributed-cron correctness (split-brain prevention, leader election, idempotency, exactly-once guarantees), timezone and DST safety (UTC discipline, spring-forward/fall-back cliff handling), retry-on-failure patterns (exponential backoff with jitter, dead-letter handling, idempotent handler design), and the observability loop (Healthchecks.io heartbeat integration, Cronitor setup, self-hosted heartbeat tables, missed-run alerting).

## Trigger phrases

Route to `cron-scheduling-guardian` when the user says any of:

- "Write a cron expression for..."
- "Set up Vercel Cron"
- "Configure Cloudflare Cron Triggers"
- "My cron job runs twice" / "cron is running twice"
- "GitHub Actions schedule is drifting"
- "Add monitoring for my scheduled job"
- "Cron and DST issue"
- "Distributed cron exactly-once"
- "Cron job silently failed"
- "Idempotent cron handler"
- "Audit all our scheduled jobs"
- "Set up Healthchecks.io for cron"

Or when the request implicitly involves a recurring, time-triggered task.

## Do NOT route when

- The user asks about CI/CD pipeline design (build/deploy/test automation) — that is `devops-guardian`. `cron-scheduling-guardian` only overlaps when a GitHub Actions `schedule:` trigger is involved; even then, the pipeline shape is `devops-guardian`'s.
- Background jobs triggered by queue messages without a fixed schedule — no dedicated Angel yet; handle inline.
- Database schema design for job metadata tables — that is `db-guardian`. `cron-scheduling-guardian` can prescribe the heartbeat table schema, but deep schema design belongs to `db-guardian`.
- General Cloudflare Workers development (not schedule-related) — that is not in `cron-scheduling-guardian`'s scope; handle inline.

If a request straddles scheduling and CI/CD (e.g., "I want to run my database backup every night from GitHub Actions"), route to `cron-scheduling-guardian` for the schedule and monitoring design, and optionally invoke `devops-guardian` for the workflow file structure.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- What the scheduled job does (a one-sentence description of its purpose)
- How often it should run (or an existing cron expression to review)
- The deployment platform (Vercel, Cloudflare, GitHub Actions, server-side Node.js, Postgres, etc.)
- For distributed deployments: the number of replicas or regions running the scheduler
- For timezone-sensitive schedules: the required timezone and whether DST matters

If the deployment platform is unknown, ask before prescribing a distributed-cron fix — the leader-election pattern differs significantly by platform.

## Outputs the Angel produces

- A reviewed or authored cron expression with a plain-English translation and platform-compatibility notes
- A distributed-cron fix (leader-election code or idempotency key table schema) where applicable
- Observability setup code (Healthchecks.io / Cronitor integration + heartbeat table schema if self-hosted)
- A retry-and-failure-handling design (backoff strategy, dead-letter mechanism, decouple-trigger-from-work if needed)
- For audits: a risk-assessment matrix (one row per job) and a prioritized action plan using `templates/cron-job-spec.md`

## Multi-Angel sequences this Angel participates in

- **Cron + security audit:** `cron-scheduling-guardian` designs and implements the scheduled job → `security-guardian` audits for PII exposure in job payloads, insecure CRON_SECRET handling, and authentication bypass risks.
- **Cron + database schema:** `cron-scheduling-guardian` prescribes the `job_runs` / `cron_heartbeats` table shape → `db-guardian` reviews indexing strategy, partitioning for large tables, and migration safety.
- **GitHub Actions schedule + CI/CD:** `cron-scheduling-guardian` owns the `schedule:` trigger, `workflow_dispatch` fallback, and heartbeat monitoring → `devops-guardian` owns the rest of the workflow file.

## Critical directives the orchestrator should respect

- Always ask about deployment topology before prescribing a distributed-cron fix.
- Never generate a cron expression without explaining it in plain English.
- UTC is the safe default; flag non-UTC schedules and ask the user to confirm intent.
- Heartbeat monitoring is mandatory for business-critical jobs — alert on missed runs, not just on errors.
- Verify idempotency before adding retry logic.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
