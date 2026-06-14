# kanban-flow-guardian — God's Guide

The God routing skill's record of when to invoke `kanban-flow-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/kanban-flow-guardian.md`](../../agents/kanban-flow-guardian.md)
**Weapon:** [`ai-tools/skills/kanban-flow-weapon/`](../../skills/kanban-flow-weapon/)
**Command Brief:** [`ai-tools/command-briefs/kanban-flow-guardian-command-brief.md`](../../../command-briefs/kanban-flow-guardian-command-brief.md)
**Trigger policy:** on-demand

---

## Domain

`kanban-flow-guardian` owns the Kanban method surface end to end: WIP limit design and enforcement, flow-metric calculation and interpretation (cycle time, lead time, throughput, flow efficiency, WIP age), Little's Law diagnostics (L = λW), visual-board design (column structure, explicit policies, blocker notation, class-of-service swimlanes), replenishment and cadence meetings, and the Toyota/Lean lineage that gives Kanban its theoretical grounding. It covers tool-specific implementation for Linear, Jira Software, GitHub Projects, and Azure DevOps Boards. It does NOT own sprint/scrum ceremonies, CI/CD pipeline design, database schema for flow-metric storage, or implementation of custom Kanban tooling in code.

## Trigger phrases

Route to `kanban-flow-guardian` when the user says any of:

- "set up WIP limits"
- "our WIP keeps climbing / team has too much in flight"
- "calculate cycle time" / "what's our throughput?"
- "apply Little's Law"
- "design our Kanban board / columns"
- "Kanban vs Scrum — which fits us better?"
- "why is our flow efficiency so low?"
- "help us read our cumulative flow diagram"
- "class of service / expedite policy"
- "how do I configure Kanban in Linear / Jira / GitHub Projects?"

Or when the request implicitly involves WIP limits, flow metrics, or Kanban board design.

## Do NOT route when

- The request is about sprint planning, velocity, retrospectives, or backlog refinement — Scrum ceremonies; no peer Angel exists yet; handle inline or note the gap.
- The request is about CI/CD deployment pipeline design or DevOps automation — route to `devops-guardian`.
- The request is about building a custom Kanban application in React or Python — route to `react-guardian` or `python-guardian` after handling the board design.
- The request is about database schema for storing flow metrics in a custom analytics store — route to `db-guardian`.
- The request is about project management tooling configuration unrelated to Kanban (Jira epic hierarchy, GitHub Issues triage without a board, Linear roadmaps) — handle inline.

If a request straddles Kanban board design and code implementation, prefer `kanban-flow-guardian` for the process/methodology layer and hand off the implementation layer to the appropriate coding Angel.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- **Target tool**: Linear, Jira, GitHub Projects, Azure DevOps Boards, Trello, or custom — required before prescribing configuration steps.
- **Current board structure**: column names, existing WIP limits (or absence), types of work tracked.
- **Problem statement**: "our WIP is always exceeded", "we can't predict delivery dates", "Kanban vs Scrum decision", etc.
- **Flow metrics data** (optional, but strongly preferred for any numerical prescription): CSV export from the tool, or a described current cycle time and throughput.
- **Team size and work types** (optional): feature / bug / tech-debt / support mix; any existing SLAs or classes of service.

If the target tool is missing and the user is asking for tool configuration steps, `kanban-flow-guardian` will ask for it before proceeding.

## Outputs the Angel produces

- **Board design spec** — markdown table: column, WIP limit, explicit policy, done definition.
- **Flow metrics report** — computed or estimated cycle time (p50/p85/p95), throughput (weekly), flow efficiency %, and top-three improvement recommendations.
- **Little's Law forecast table** — predicted cycle time under 3-5 WIP scenarios with steady-state caveats.
- **Class-of-service policy card** — four-tier reference (Standard, Fixed-Date, Expedite, Intangible) with entry criteria and visual markers.
- **Tool configuration guide** — step-by-step instructions for the target tool including known caveats (Linear no-native-enforcement, Jira swimlane bug, GitHub visual-only limits).

## Multi-Angel sequences this Angel participates in

- **Kanban + metrics store**: `kanban-flow-guardian` designs the board and metric calculations; `db-guardian` designs the schema for storing historical flow data.
- **Kanban + custom tooling**: `kanban-flow-guardian` authors the board spec and policy design; `react-guardian` or `python-guardian` implements the custom application.
- **Process + delivery audit**: `kanban-flow-guardian` audits the human delivery process (WIP, flow); `devops-guardian` audits the automated deployment pipeline; together they cover the full value stream.

## Critical directives the orchestrator should respect

- Always surface WIP limits before any other recommendation — without them, what the user has is a task list, not Kanban.
- Never prescribe a WIP limit without grounding in throughput data or capacity; ask for data if absent.
- Confirm the target tool before providing any configuration steps — tool WIP-limit support varies significantly.
- Apply Little's Law only in steady state; flag non-steady-state (>20% blocked WIP, active expedite overload) before computing L = λW.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
