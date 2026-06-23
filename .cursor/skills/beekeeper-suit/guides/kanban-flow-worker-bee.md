# Kanban Flow Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `kanban-flow-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/kanban-flow-worker-bee.md`](../../agents/kanban-flow-worker-bee.md)
**Stinger:** [`.cursor/skills/kanban-flow-stinger/`](../../skills/kanban-flow-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`kanban-flow-worker-bee` owns the Kanban method surface end to end across any software delivery context — from a solo developer's personal board to a multi-team enterprise value stream. It covers WIP limit definition and enforcement, flow-metric calculation and interpretation (cycle time, lead time, throughput, flow efficiency, WIP age), Little's Law diagnostics, visual-board design (column structure, explicit policies, blocker markers, class of service), replenishment and cadence meetings, cumulative-flow-diagram interpretation, and tool-specific implementation for Linear, Jira, GitHub Projects, Azure DevOps Boards, and Trello. Its intellectual lineage runs from the Toyota Production System through David J. Anderson's 2010 formalization to the 2026 practitioner landscape. It does not own sprint/scrum ceremonies, CI/CD pipeline design, database schema for a custom metrics store, or implementation of custom Kanban tooling in code.

## Trigger phrases

Route to `kanban-flow-worker-bee` when the user says any of:

- "set up WIP limits" / "our WIP keeps climbing" / "team has too much in flight"
- "calculate cycle time" / "why is our cycle time so long" / "how do I measure lead time"
- "apply Little's Law to our board"
- "design our Kanban board" / "help us design our Kanban columns" / "we need WIP limits"
- "Kanban vs Scrum" / "should we use Kanban or Scrum"
- "our WIP is always exceeded" / "we can't predict when work will finish"

Or when the request implicitly involves Kanban board design, flow-metric analysis, WIP management, class-of-service policies, or cumulative-flow-diagram interpretation.

## Do NOT route when

- The user asks about sprint planning, velocity, retrospectives, or Scrum ceremonies — no peer Scrum Bee exists yet; surface the gap and handle inline or offer to address it directly.
- The user needs CI/CD pipeline design or deployment infrastructure — route to `devops-worker-bee`.
- The user wants a database schema for storing flow metrics — route to `db-worker-bee`.
- The user wants to build a custom Kanban application in React or Python — handle the board design here, then route implementation to `react-worker-bee` or `python-worker-bee`.
- The user is asking about Prometheus / Grafana / Datadog metric dashboards for infrastructure monitoring — that is the monitoring stack, not Kanban flow.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- Target tool (Linear, Jira, GitHub Projects, Azure DevOps Boards, Trello, or custom) — required before prescribing any configuration steps.
- Current board structure or team workflow description — required to audit the current state.
- Historical WIP or throughput data — required before setting any WIP limit; if absent, the Bee will explain how to gather two weeks of data first rather than prescribing an arbitrary number.
- Primary question or goal (e.g., reduce cycle time, set up WIP limits, interpret a CFD, choose between Kanban and Scrum) — optional if the user's intent is clear from context; the Bee will ask one targeted clarifying question if ambiguous.

## Outputs the Bee produces

- Board design spec — column / WIP limit / policy / done-definition table using `templates/board-design-spec.md`.
- Flow metrics report — computed metrics summary with interpretation using `templates/flow-metrics-report.md`.
- Little's Law forecast table — WIP-scenario forecast using `templates/littles-law-forecast.md`.
- Class-of-service policy card — four-tier reference card using `templates/class-of-service-card.md`.
- Tool configuration guide — exact configuration steps with known-bug caveats for the confirmed target tool.

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- Always surface WIP limits before any other recommendation; without WIP limits the system is a task list, not Kanban.
- Never prescribe a WIP limit without grounding it in throughput data or capacity; if no data exists, instruct the user to gather two weeks of data first.
- Distinguish cycle time from lead time every time both are used; define which clock starts and stops for each metric in the team's specific workflow.
- Apply Little's Law (L = λW) only when the system is in steady state; if >20% of WIP is blocked or the expedite queue is active, flag the non-steady-state condition before running the formula.
- Always confirm the target tool before prescribing configuration steps; Linear, Jira, and GitHub Projects have materially different WIP-limit support models.
- Do not conflate the Kanban Method with a Kanban board; a Scrum team using a board without explicit policies and WIP limits is NOT practising Kanban.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
