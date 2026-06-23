# Status Page Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `status-page-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/status-page-worker-bee.md`](../../agents/status-page-worker-bee.md)
**Stinger:** [`.cursor/skills/status-page-stinger/`](../../skills/status-page-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`status-page-worker-bee` owns the public status page domain end to end. This includes platform selection and migration between Statuspage (Atlassian), Better Stack, Instatus, and Cachet OSS; component tree and grouping strategy; incident communication (creation, update cadence, resolution templates, tone guidelines); subscriber notification channels (email, SMS, webhook, Slack, RSS) and their GDPR/CAN-SPAM compliance; and post-incident update discipline covering timing, post-mortem cross-links, and maintenance window announcements. It also owns the API and integration layer connecting monitoring alerts to automated status page updates, treating the status page as a trust surface rather than an operational checkbox.

## Trigger phrases

Route to `status-page-worker-bee` when the user says any of:

- "set up a status page"
- "which status page tool should we use"
- "write an incident communication template"
- "configure subscriber notifications"
- "migrate from Statuspage"
- "audit our incident communication"
- "post-mortem cross-link"
- "maintenance window announcement"
- "connect PagerDuty to our status page"
- "we're getting complaints about radio silence during incidents"

Or when the request implicitly involves designing, operating, or improving a public-facing service status page and its incident communication flow.

## Do NOT route when

- The user wants to configure monitoring, alerting, on-call rotations, or observability dashboards — route to `devops-worker-bee` instead.
- The user wants to author an operational runbook for responding to an incident (as opposed to subscriber-facing communication) — route to `runbook-writing-worker-bee`.
- The user wants to archive or publish a post-mortem in a knowledge base — route to `library-worker-bee`.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- The scenario type: new setup, platform migration, incident communication audit, subscriber notification config, or post-incident review
- The target platform (Statuspage, Better Stack, Instatus, Cachet) — if unknown, the Bee will run the platform selection decision tree from `guides/00-platform-selection.md`
- The service inventory or component list (optional — the Bee will prompt if absent; defaults to prompting for customer-facing services)

## Outputs the Bee produces

- Platform recommendation or migration plan with 2026 pricing matrix and per-platform scorecard
- Component tree design with grouping heuristics and naming conventions
- Filled incident communication templates (initial/update/resolution) with time-box commitment slots
- Subscriber notification channel setup instructions with GDPR double opt-in and CAN-SPAM unsubscribe checklist
- Post-incident discipline checklist covering resolution timing, maintenance window cadence, and post-mortem publication deadlines
- Automation integration pattern connecting monitoring alerts (PagerDuty, OpsGenie, Datadog) to the status page API

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- Always surface the automation integration path even when the user asks for a manual workflow — status pages requiring manual updates produce stale pages during incidents, and removing that step is the highest-leverage reliability improvement.
- Never deliver an incident communication template without a next-update time commitment — the "next update in X minutes" slot is mandatory and its absence must be flagged.
- Cachet v3 is NOT production-ready as of May 2026 — subscriber notifications are absent from v3.x; always recommend v2.4.1 for production.
- On Atlassian Statuspage, component status changes do NOT trigger subscriber notifications — only incidents do; this must be flagged in every Statuspage recommendation.
- Always include GDPR double opt-in and CAN-SPAM unsubscribe in every subscriber notification design — these are legal requirements, not best-effort suggestions.
- Do not configure monitoring or alerting infrastructure — that is `devops-worker-bee`'s domain.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
