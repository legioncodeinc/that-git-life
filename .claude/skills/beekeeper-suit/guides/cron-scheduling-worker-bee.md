# Cron Scheduling Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `cron-scheduling-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/cron-scheduling-worker-bee.md`](../../agents/cron-scheduling-worker-bee.md)
**Stinger:** [`.cursor/skills/cron-scheduling-stinger/`](../../skills/cron-scheduling-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`cron-scheduling-worker-bee` owns scheduled-job work end to end: cron expression authoring and auditing, platform-specific limit compliance (Vercel Cron, Cloudflare Cron Triggers, GitHub Actions `schedule:`, pg_cron, BullMQ), distributed-cron correctness (split-brain prevention, exactly-once execution), timezone and DST safety, retry-on-failure patterns, and the observability loop (heartbeat monitoring, missed-run alerting). It does not own CI/CD pipeline design or background jobs triggered by queue messages without a fixed schedule. When cron jobs interact with pipelines, this Bee owns the schedule and `devops-worker-bee` owns the pipeline.

## Trigger phrases

Route to `cron-scheduling-worker-bee` when the user says any of:

- "write a cron expression"
- "set up Vercel Cron"
- "my cron job runs twice"
- "GitHub Actions schedule is drifting"
- "add monitoring for my scheduled job"
- "cron and DST issue"
- "distributed cron"
- "idempotent cron handler"

Or when the request implicitly involves any recurring scheduled task, missed-run alerting, platform cron limits, or exactly-once execution semantics.

## Do NOT route when

- The request is about CI/CD pipeline design with no time-based scheduling component — that belongs to `devops-worker-bee`.
- The request is about background jobs triggered by queue messages without a fixed schedule — no Bee owns this yet; handle inline.
- The request is about database schema design for job metadata tables — that belongs to `db-worker-bee`.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- Target platform (Vercel, Cloudflare, GitHub Actions, pg_cron, BullMQ, or POSIX) — required to apply correct platform limits and syntax
- Deployment topology (number of replicas or regions) — required before prescribing any distributed-cron fix
- Desired schedule in plain English or an existing cron expression to audit
- Timezone intent — defaults to UTC if not stated; any non-UTC choice must be explicitly confirmed by the user

## Outputs the Bee produces

- Authored or audited cron expression with a plain-English explanation, placed inline or in the target config file (e.g., `vercel.json`, GitHub Actions workflow YAML)
- Distributed-cron correctness code (Postgres advisory lock or Redis SETNX with fencing token) added to the handler file
- Observability integration (Healthchecks.io or Cronitor start/success/fail pings) wired into the job handler
- Per-job specification document using `templates/cron-job-spec.md`, written to the project or surfaced inline
- Codebase audit report (when requested) written to `cron-scheduling-stinger/reports/`

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- Never generate a cron expression without explaining it in plain English — cron bugs caused by misread expressions are a top source of production incidents.
- Always ask about deployment topology before prescribing a distributed-cron fix — a single-container deployment and a 3-region active-active cluster need different solutions.
- UTC is the safe default; local timezone must be explicitly justified — flag any non-UTC schedule and ask the user to confirm intent.
- Heartbeat monitoring is mandatory for business-critical jobs — alert on missed runs, not just on errors.
- Retry handlers must be idempotent — before adding retry logic, verify the job handler is safe to run twice; if not, prescribe idempotency keys or upsert patterns first.
- Decouple the trigger from the work for long-running jobs — if a cron job risks exceeding the platform's execution limit, trigger a queue message and return fast.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
