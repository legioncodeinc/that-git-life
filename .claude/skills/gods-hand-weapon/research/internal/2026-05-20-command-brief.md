---
source_url: file:///c:/Users/mario/GitHub/legion-code/ai-tools/command-briefs/gods-hand-command-brief.md
retrieved_on: 2026-05-20
source_type: internal-repo
authority: official
relevance: critical
topic: contract
weapon: gods-hand-weapon
---

# gods-hand Command Brief

## Summary
The Command Brief authored by `command-center` is the canonical statement of `gods-hand`'s identity, action list, expected output, and critical directives. It defines the 11-step ACTION sequence (Pick / Lock / Look up / Phase 1 command-center / Scaffold / Phase 1.5 scripture-historian / Phase 2 weapon-forge / Phase 3 angel-creator / Phase 4 god-registrar / Close out / Report and stop), the four tracking files `gods-hand` mutates, the move-before-work invariant, and the nine SUBAGENT CRITICAL DIRECTIVES that fix the foreman-vs-craftsman boundary. This document is the source of truth that `weapon-forge` must translate into `guides/`.

## Key quotations / statistics

- "gods-hand is the Legion AI Tools Factory's pipeline controller Angel. It owns the end-to-end execution of a single Angel-forging cycle: pick the top queue row, lock it into `in-process`, look up its backlog metadata, drive the four downstream phases in order (command-center -> scripture-historian -> weapon-forge -> angel-creator -> god-registrar), then close out the lifecycle by moving the row from `in-process` to `completed` and marking the backlog checkbox."
- "Move-before-work. -- Why: deleting the queue row and appending it to `in-process` BEFORE invoking any phase prevents a sibling factory agent from racing onto the same entry and producing duplicate artifacts."
- "Process exactly ONE queue entry per invocation. -- Why: each entry deserves its own sign-off moment between runs so a bad Angel does not cascade into a chained pipeline failure."
- "Strict FIFO. Always pick from the TOP (lowest NNN) of the queue. -- Why: the queue's documented `pickup_protocol` requires it; deviating breaks the position-numbering invariants `big-bang-space` depends on."
- "Refuse to start a new cycle if `proposed-angels-in-process.md` already contains a row. -- Why: only one cycle should be in flight at a time. A non-empty in-process file means a prior cycle crashed or is still running; resolve that first."
- "Do not perform domain research, write guides, or author SKILL.md content yourself. -- Why: those are the worker phases' jobs. `gods-hand` is the foreman, not the craftsman."
- Open question (proposed answer from brief): "Q: Should the completed-row carry the four model identifiers used for that cycle? Proposal: yes, for downstream cost/quality analytics. Format: `NNN|guardian-name|completed|YYYY-MM-DD|research:<model>|analyst:<model>|builder:<model>`."
- Open question (proposed answer from brief): "Q: When a downstream phase fails mid-cycle, should `gods-hand` automatically roll the row back to the queue, or leave it in `in-process` with a `failed:<phase>` marker? Proposal: leave it in `in-process` with a marker; rollback to the queue silently loses the failure context."
- Proposed `guides/` structure: `00-principles.md`, `01-pick-and-lock.md`, `02-backlog-lookup.md`, `03-naming-contracts.md`, `04-phase-1-command-center.md`, `05-phase-15-scripture-historian.md`, `06-phase-2-weapon-forge.md`, `07-phase-3-angel-creator.md`, `08-phase-4-god-registrar.md`, `09-close-out.md`, `10-failure-modes.md`, `11-reporting.md`.
- Proposed `examples/`: `happy-path.md`, `recovery-from-crashed-prior-run.md`.
- Proposed `templates/`: `completed-row.md`, `in-process-row.md`, `final-report.md`.

## Annotations for weapon-forge
- The 11-step ACTION list IS the table of contents for `guides/`. Map each ACTION step to one guide file as proposed in IDEAS, SUGGESTIONS, QUESTIONS.
- The nine SUBAGENT CRITICAL DIRECTIVES become the bullet list in `guides/00-principles.md`. Preserve the "-- Why:" rationale; it is the load-bearing part of each directive.
- The three Open Questions are NOT scripture-historian's to resolve. Hand them to the user as part of `weapon-forge`'s clarification pass, or document the proposed answers in `guides/10-failure-modes.md` and `templates/completed-row.md` as the working defaults until the user overrides.
- The four tracking-file row formats need a dedicated guide each, or one consolidated `guides/02-backlog-lookup.md` + `guides/09-close-out.md` pair. Decide based on whether close-out content fits on one screen.
- This source has zero contradictions with the queue's `pickup_protocol`; it strengthens it by adding the move-before-work invariant that the queue header alone does not enforce.
