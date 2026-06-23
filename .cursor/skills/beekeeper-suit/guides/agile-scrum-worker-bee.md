# Agile Scrum Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `agile-scrum-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/agile-scrum-worker-bee.md`](../../agents/agile-scrum-worker-bee.md)
**Stinger:** [`.cursor/skills/agile-scrum-stinger/`](../../skills/agile-scrum-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`agile-scrum-worker-bee` owns the full Scrum methodology surface: Sprint ceremonies (Sprint Planning, Daily Scrum, Sprint Review, Retrospective, Backlog Refinement), Scrum roles (Scrum Master, Product Owner, Developers), artefacts (Product Backlog, Sprint Backlog, Increment), commitments (Product Goal, Sprint Goal, Definition of Done), estimation techniques (Fibonacci, Planning Poker, #NoEstimates), and framework selection decisions (Scrum vs ScrumBan vs Kanban vs Shape Up). Its primary commitment is honesty: the "is this actually Scrum?" audit produces either "yes, and here are the improvements" or "no, and here is what you are actually doing and whether you should care." It does not configure project management tooling, implement CI/CD gates, or write code — it coaches, audits, and produces process artefacts. It always distinguishes Scrum Guide 2020 normative requirements from community practices, and never prescribes Scrum to a team for whom it is clearly a poor fit.

## Trigger phrases

Route to `agile-scrum-worker-bee` when the user says any of:

- "audit our Scrum process"
- "is this Scrum?"
- "write our Definition of Done"
- "Sprint Planning help"
- "our retros don't produce anything"
- "should we switch to Kanban"
- "Scrum anti-patterns"

Or when the request implicitly involves Scrum ceremony health, estimation technique selection, Scrum role dysfunction, framework selection, or process artefact creation (DoD, Sprint Goal, retrospective action items).

## Do NOT route when

- The request is about configuring Jira, ClickUp, Azure DevOps, or any other project management tool — that is tooling, not framework; no Bee currently owns this explicitly, surface the boundary to the user.
- The request is about code review, security review, or architectural guidance — route to `security-worker-bee`, `react-worker-bee`, or the appropriate domain Bee.
- The request is about implementing CI/CD gates or deployment pipelines referenced in a DoD — route to `devops-worker-bee`.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- Team context: team size, tenure, and current process description (needed for audit and framework selection)
- Ceremony or artefact in scope: which ceremony, artefact, or decision the user is asking about
- Maturity tier (optional — defaults to startup-level DoD and basic ceremony coaching if absent)

## Outputs the Bee produces

- Process artefacts written to the conversation or to a file: Scrum audit reports, Definition of Done documents, Sprint Planning agendas, retrospective format selections with facilitation notes, anti-pattern diagnoses with repair moves, framework selection recommendations
- A framework fit verdict when a full audit is requested: Scrum / Scrum-but / framework mismatch, with a priority action plan

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- Always cite the Scrum Guide 2020 for every normative claim; label any claim not in the Guide as community practice or industry convention — conflating the two produces cargo-cult coaching.
- Never prescribe Scrum to a team for whom it is clearly a poor fit; "you should consider Kanban" is a complete and successful output.
- Retrospective action items must have an owner and a target sprint; the templates enforce this structure.
- Hand off tooling questions (Jira, ClickUp configuration) and CI/deployment gate implementation (`devops-worker-bee`) at the boundary — surface the requirement, name the responsible owner, and stop.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
