# Runbook Writing Guardian — God's Guide

The God routing skill's record of when to invoke `runbook-writing-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/runbook-writing-guardian.md`](../../agents/runbook-writing-guardian.md)
**Weapon:** [`ai-tools/skills/runbook-writing-weapon/`](../../skills/runbook-writing-weapon/)
**Command Brief:** [`ai-tools/command-briefs/runbook-writing-guardian-command-brief.md`](../../../command-briefs/runbook-writing-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`runbook-writing-guardian` owns the authoring, auditing, and maintenance of operational runbooks — the exact-command, decision-tree documents that on-call engineers execute when alerts fire. Its defining principle is the no-implied-context rule: a runbook is only valid if an engineer who has never seen the system can execute it blind in under five minutes. It enforces exact-command discipline (every flag, namespace, and service name must be explicit), mandatory escalation paths (named contact, channel, and SLA — never "escalate if needed"), rollback for every state-changing step, and the runbook-as-test mandate (untested runbooks are prominently flagged as hypotheses). Its scope is the document itself: structure, content, testability, and freshness. Incident management tooling and infrastructure provisioning belong to `devops-guardian`; documentation culture beyond the runbook format belongs to `library-guardian`.

## Trigger phrases

Route to `runbook-writing-guardian` when the user says any of:

- "Write a runbook for [service/alert]"
- "Audit this runbook"
- "Our runbooks are out of date"
- "We need a runbook for this alert"
- "Turn this postmortem into a runbook"
- "Schedule a game day / exercise our runbooks"
- "Our on-call docs are weak / missing / wrong"
- "The runbook has never been tested"
- "Add rollback steps to this runbook"
- "Our escalation path in this runbook is wrong"

Or when a postmortem action item explicitly calls for a new or updated runbook.

## Do NOT route when

- The user wants to configure PagerDuty, OpsGenie, or another incident management tool → `devops-guardian`
- The user wants to provision infrastructure or write deployment procedures → `devops-guardian` owns the infrastructure knowledge; this Angel documents it only after the user confirms the procedure
- The user wants to design blameless postmortem process, retro culture, or psychological safety norms → `library-guardian`
- The user wants to design a general documentation site, knowledge base, or wiki structure → `library-guardian`
- The runbook involves PCI/HIPAA compliance review of the commands themselves → after authoring, surface to `security-guardian` for audit

If a request straddles runbook authorship and infrastructure decisions, prefer `runbook-writing-guardian` to produce the document and embed a `[TODO: validate with devops-guardian]` placeholder where infrastructure knowledge is needed.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- An alert name, symptom description, or service name identifying what the runbook covers (required)
- Optionally: an existing runbook draft or stub to audit or rewrite
- Optionally: a link to the service's architecture docs, deployment repo, or monitoring dashboard
- Optionally: a postmortem report that triggered the runbook request
- Target audience signal: senior SRE, junior on-call rotation member, or mixed (defaults to mixed if not specified)

If the alert name or service is missing and cannot be inferred from context, ask the user to supply it before proceeding.

## Outputs the Angel produces

- **Primary deliverable:** A markdown runbook document written to the user's designated runbook folder (typically `docs/runbooks/`, `runbooks/`, or a wiki page)
- **Audit report:** When auditing an existing runbook, an inline diff or annotated version with every no-implied-context violation flagged
- **Test status tag:** A `## TEST STATUS` header in every runbook indicating last-exercised date, environment, and outcome (or `UNTESTED` if never exercised)
- **Postmortem links:** Cross-references to relevant postmortem documents embedded in the runbook

## Multi-Angel sequences this Angel participates in

- **On-call readiness audit** — `runbook-writing-guardian` authors or audits runbooks; `devops-guardian` validates the infrastructure commands embedded in those runbooks; `security-guardian` reviews runbooks touching PCI/HIPAA-sensitive operations.
- **Postmortem action item closure** — When a postmortem produces a "write/update runbook" action item, `runbook-writing-guardian` authors the document; `library-guardian` may archive the postmortem in the knowledge base.

## Critical directives the orchestrator should respect

- Never use implied commands; every step must be exactly copy-pasteable
- Never skip the escalation path; every runbook must name a contact, channel, and SLA
- Always include rollback for every state-changing step, or an explicit irreversibility acknowledgment
- Mark untested runbooks with a prominent `## TEST STATUS: UNTESTED` header
- Apply the five-minute rule: a runbook requiring more than five minutes to parse well enough to execute is too long

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
