# Status Page Guardian — God's Guide

The God routing skill's record of when to invoke `status-page-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/status-page-guardian.md`](../../agents/status-page-guardian.md)
**Weapon:** [`ai-tools/skills/status-page-weapon/`](../../skills/status-page-weapon/)
**Command Brief:** [`ai-tools/command-briefs/status-page-guardian-command-brief.md`](../../../command-briefs/status-page-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`status-page-guardian` owns the public status page lifecycle: platform selection (Statuspage/Atlassian, Better Stack, Instatus, Cachet OSS), component tree and grouping strategy, incident communication templates (initial/update/resolution with time-box commitments), subscriber notification channel setup and GDPR/CAN-SPAM compliance (email, SMS, webhook, Slack), post-incident update discipline (resolution timing, post-mortem cross-links, maintenance window announcements), and the API/automation layer connecting monitoring tools to the status page. It treats the status page as a trust surface, not a checkbox, and always enforces the 5-minute acknowledge rule and the automation-first philosophy.

## Trigger phrases

Route to `status-page-guardian` when the user says any of:

- "Set up a status page for our SaaS"
- "Which status page tool should we use — Statuspage vs Better Stack vs Instatus?"
- "We're migrating away from Statuspage"
- "Write me an incident communication template"
- "Configure subscriber SMS notifications for our status page"
- "Our incident updates are confusing — audit them"
- "We're getting complaints about radio silence during incidents"
- "Write a maintenance window announcement"
- "Connect PagerDuty / Datadog / OpsGenie to our status page"
- "Post-mortem cross-link pattern"
- "Set up webhooks for our status page subscribers"
- "Is Cachet a good choice for our status page?"

Or when the request involves any external communication about service health to customers or users.

## Do NOT route when

- The user wants to configure PagerDuty alerting rules, OpsGenie routing, Datadog monitors → `devops-guardian`
- The user wants to design on-call rotations or incident response processes → `devops-guardian`
- The user wants to write a runbook for responding to an incident (not communicating it externally) → `runbook-writing-guardian`
- The user wants to archive post-mortems in the knowledge base → `library-guardian`
- The user wants to configure SLO/SLI dashboards or observability pipelines → `devops-guardian`

If a request straddles monitoring setup AND status page communication, prefer `status-page-guardian` for the communication layer and route the monitoring configuration to `devops-guardian`.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- Hosting/budget context: SaaS or self-hosted; Atlassian ecosystem or not; OSS mandate or not (required for platform selection)
- Existing monitoring stack (required for automation integration recommendations)
- Service/component inventory (required for component tree design)
- Optionally: existing status page URL to audit
- Optionally: incident communication drafts to review

If platform selection is the goal and no constraints are known, ask: "Do you have an Atlassian/PagerDuty ecosystem, an OSS mandate, or a budget ceiling?" before proceeding.

## Outputs the Angel produces

- Platform recommendation with tradeoff table and decision rationale
- Component tree design (markdown list)
- Three incident communication templates (initial, update, resolution) with fill-in guides
- Subscriber notification configuration guide or code snippet
- GDPR/CAN-SPAM compliance checklist
- Post-incident discipline checklist
- Status page audit report (for audit requests) at `docs/status-page/audit-[date].md`

## Multi-Angel sequences this Angel participates in

- **New SaaS product setup** — `status-page-guardian` sets up the status page; `devops-guardian` configures the monitoring that feeds it; `runbook-writing-guardian` authors the on-call runbook for responding to the incidents the status page communicates.
- **Post-incident review** — `status-page-guardian` handles the external communication discipline; `library-guardian` archives the post-mortem in the knowledge base.

## Critical directives the orchestrator should respect

- Always flag the Statuspage limitation: component status changes do NOT trigger subscriber notifications; only incidents do
- Always include a next-update time commitment in any incident template
- Never recommend Cachet v3.x for production subscriber notification use (feature absent as of May 2026)
- Always include GDPR/CAN-SPAM compliance in subscriber notification designs

(Full list in `ai-tools/agents/status-page-guardian.md` — `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
