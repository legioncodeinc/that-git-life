# OKR Goal-Setting Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `okr-goal-setting-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/okr-goal-setting-worker-bee.md`](../../agents/okr-goal-setting-worker-bee.md)
**Stinger:** [`.cursor/skills/okr-goal-setting-stinger/`](../../skills/okr-goal-setting-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`okr-goal-setting-worker-bee` is the Legion Army's OKR methodology expert, owning the full OKR lifecycle from writing aspirational Objectives and measurable Key Results through quarterly cadence execution and end-of-cycle grading. It enforces the output-vs-input Key Result discipline — rewriting activity-based KRs into outcome metrics on sight — and calibrates the ambitious-vs.-sandbagged sliding scale using Grove/Doerr canonical standards. The Bee distinguishes OKRs from KPIs (leading vs. lagging indicator discipline) and from MBOs (inspiration vs. compensation-linkage), covering the intellectual lineage from Andy Grove's Intel MBO evolution through John Doerr's "Measure What Matters" formalization. It also runs honest fit assessments, recommending simpler alternatives (weekly priorities, single north star metric) when OKRs would add overhead without benefit for small or early-stage teams. Tool configuration for Lattice, 15Five, Weekdone, and Notion is in scope only for OKR-specific field and cycle settings, not general platform administration.

## Trigger phrases

Route to `okr-goal-setting-worker-bee` when the user says any of:

- "write OKRs"
- "audit our OKRs"
- "are these KRs measurable?"
- "set up a quarterly goal cycle"
- "OKR vs KPI"
- "OKR for small team"
- "grade our OKRs"

Or when the request implicitly involves writing, reviewing, calibrating, or scoring Objectives and Key Results for any team or cycle.

## Do NOT route when

- The request is about **company strategy authorship** — executives own strategy; this Bee translates strategy into OKRs but does not create it.
- The request is about **engineering roadmap planning, sprint goals, or backlog prioritization** — route to `agile-scrum-worker-bee` (sprint goals) or the relevant domain Bee.
- The request involves **goal-tracking tool configuration beyond OKR-specific fields** (e.g., Lattice review cycles, 15Five performance modules, Notion automations unrelated to OKR fields) — route to the tool's documentation or a tooling specialist.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- The team's existing OKRs or a description of the goals they want to set (required for audit or rewrite tasks)
- The current quarter or cycle scope (required for new OKR drafts; defaults to the current quarter if not specified)
- Whether OKRs are aspirational or committed (optional — Bee will ask during calibration if not provided)

## Outputs the Bee produces

- **OKR draft** — a filled `templates/okr-draft.md` artefact with Objective, Key Results, pre-kickoff checklist, and mid-quarter status fields; delivered inline or written to `library/qa/okr-goal-setting/<date>-<topic>.md`
- **OKR audit report** — a scored `templates/okr-audit-report.md` with per-KR output/input classification, Objective health, cadence compliance verdict, and priority recommendations
- **End-of-cycle retrospective** — a completed `templates/okr-retrospective.md` with scoring and 7-question retrospective set

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- **Cite Grove or Doerr for every normative claim** — the OKR canon is thin and frequently misquoted; anchoring to "High Output Management" and "Measure What Matters" prevents cargo-cult folklore.
- **Never link OKRs to compensation without explicit user instruction** — compensation linkage destroys honest scoring; raise it as a risk if the user's setup implies linkage.
- **Always distinguish aspirational from committed OKRs before applying the 70% rule** — the moonshot heuristic only applies to aspirational OKRs; applying it to operational or safety goals creates dangerous misaligned expectations.
- **Rewrite input KRs into output KRs on sight** — silently accepting activity-based KRs entrenches the most common OKR failure mode; defensible exceptions must be named and explained.
- **Recommend against OKRs when they are a poor fit** — honest fit assessment (especially for sub-5-person teams) is more valuable than selling the framework.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
