# Agile Scrum Guardian — God's Guide

The God routing skill's record of when to invoke `agile-scrum-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/agile-scrum-guardian.md`](../../agents/agile-scrum-guardian.md)
**Weapon:** [`ai-tools/skills/agile-scrum-weapon/`](../../skills/agile-scrum-weapon/)
**Command Brief:** [`ai-tools/command-briefs/agile-scrum-guardian-command-brief.md`](../../../command-briefs/agile-scrum-guardian-command-brief.md)
**Trigger policy:** on-demand

---

## Domain

`agile-scrum-guardian` owns the full Scrum methodology surface: Sprint ceremonies (Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective, Backlog Refinement), Scrum roles (Scrum Master, Product Owner, Developers), artefacts (Product Backlog, Sprint Backlog, Increment), and commitments (Product Goal, Sprint Goal, Definition of Done). It conducts honest "is this actually Scrum?" audits grounded in the Scrum Guide 2020, coaches estimation techniques (Fibonacci, Planning Poker, T-shirt sizing, #NoEstimates), writes and audits Definitions of Done calibrated to team maturity (startup to enterprise), diagnoses anti-patterns (Zombie Scrum, HiPPO PO, no Sprint Goal, velocity gaming, absent SM), and recommends framework fit from a data-backed decision matrix (Scrum vs ScrumBan vs Kanban vs Shape Up). It does not configure project management tooling, implement CI/CD pipelines, or perform code review.

## Trigger phrases

Route to `agile-scrum-guardian` when the user says any of:

- "audit our Scrum process"
- "is this Scrum?"
- "is this actually Scrum?"
- "write our Definition of Done"
- "Sprint Planning help"
- "our retrospectives don't produce anything"
- "should we switch to Kanban" (when the team is currently on Scrum)
- "Scrum anti-patterns"
- "estimation coaching"
- "Fibonacci story points"
- "Sprint Goal help"
- "Zombie Scrum"
- "our velocity is going up but delivery isn't"
- "daily standup is a status report"
- "we stopped doing retrospectives"
- "is ScrumBan right for us?"

Or when the request involves Scrum ceremony health, Scrum role definition, Definition of Done authorship, or retrospective facilitation format selection.

## Do NOT route when

- The request is about Jira, ClickUp, Linear, or Azure DevOps configuration — those are tooling concerns outside this Angel's scope; handle inline or route to the team's tooling documentation
- The request is primarily about Kanban metrics, WIP limits, or flow-metric optimization without a Scrum context — route to **kanban-flow-guardian**
- The request is about code review, security review, or testing strategy — route to **security-guardian**, **react-guardian**, or **python-guardian**
- The request is about CI/CD implementation of DoD gates — `agile-scrum-guardian` defines the DoD requirement; route CI/CD implementation to **devops-guardian**
- The request is about general project management (budget, resourcing, roadmaps) without a Scrum framework context — handle inline

If a request straddles `agile-scrum-guardian` and `kanban-flow-guardian` (e.g., "should we add WIP limits to our Scrum board?"), prefer `agile-scrum-guardian` for the framework decision, then hand off to `kanban-flow-guardian` for Kanban-specific implementation guidance.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- Description of the team's current process (ceremonies run, cadences, roles filled, or not)
- Optional: specific ceremony or artefact to audit or improve
- Optional: team size, product domain, and engineering maturity
- Optional: specific anti-patterns the team suspects
- Optional: existing DoD, Sprint retrospective notes, or backlog health indicators

If the request is vague ("audit our process"), the Angel will ask one clarifying question to scope the audit before proceeding.

## Outputs the Angel produces

- **Scrum audit report** — scored compliance table, anti-pattern findings, DoD assessment, framework recommendation, priority action plan (using `templates/scrum-audit-report.md`)
- **Definition of Done** — maturity-tiered template (startup or enterprise) with team-specific adjustments
- **Sprint Planning agenda** — time-boxed agenda with Sprint Goal framing exercise
- **Retrospective format selection and facilitation guide** — one of six formats with facilitation notes and action item template
- **Framework recommendation** — Scrum / ScrumBan / Kanban / Shape Up with one-paragraph rationale
- **Estimation coaching output** — technique selection, calibration table, velocity gaming diagnosis

## Multi-Angel sequences this Angel participates in

- **Agile process setup** — `agile-scrum-guardian` defines the Scrum process (ceremonies, DoD, estimation); `devops-guardian` implements CI/CD gates referenced in the DoD; `kanban-flow-guardian` handles WIP-limit implementation if the team migrates to ScrumBan or Kanban
- **Post-plan execution audit** — after a feature is shipped, `quality-guardian` verifies the implementation against the plan; `agile-scrum-guardian` reviews whether the team's process supported or hindered delivery

## Critical directives the orchestrator should respect

- Always cite the Scrum Guide 2020 for normative claims; label community practices as such
- Never prescribe Scrum to a team for whom the framework selection matrix says it is a poor fit
- Retrospective action items must have an owner and a target sprint — do not accept vague outputs
- Hand tooling questions to the team's own tooling documentation or handle inline; do not route to a non-existent tooling Angel

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
