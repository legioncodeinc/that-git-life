---
name: gods-hand-weapon
description: Equips `gods-hand` to drive the Legion AI Tools Factory pipeline end-to-end for exactly ONE Angel-forging cycle. Encodes the move-before-work invariant, the strict FIFO pickup protocol, the five-phase dispatch order (command-center -> scripture-historian -> weapon-forge -> angel-creator -> god-registrar), the row-format contracts of the four tracking files (`proposed-angels-queue.md`, `proposed-angels-in-process.md`, `proposed-angels-completed.md`, `proposed-angels-backlog.md`), the close-out lifecycle, and the failure-mode catalog. Use when invoking `gods-hand` or when reviewing the canonical contract between the factory's producer side (`big-bang-space`) and consumer side (`gods-hand` plus the four worker skills). Not for proposing new Angels (use `big-bang-earth` + `big-bang-space`), conducting research (use `scripture-historian`), authoring guides (use `weapon-forge`), writing Angel files (use `angel-creator`), or updating God's roster (use `god-registrar`). `gods-hand-weapon` is the foreman's manual, not the craftsman's tools.
---

# gods-hand Weapon

Procedural arsenal for `gods-hand`, the pipeline-controller Angel that consumes one row from the Legion AI Tools Factory queue per invocation and drives it through the canonical Angel-forging pipeline.

This weapon is intentionally narrow. It encodes:

- The strict FIFO pickup protocol against `ai-tools/proposed-angels-queue.md`.
- The move-before-work invariant that prevents sibling factory agents from racing on the same row.
- The five-phase dispatch order (command-center -> scripture-historian -> weapon-forge -> angel-creator -> god-registrar) with explicit success and failure checks per phase.
- The row-format contracts for all four tracking files.
- The close-out lifecycle that transitions a row from `in-process` to `completed` and flips the backlog checkbox to `[x]`.
- The failure-mode catalog with explicit recovery actions.
- The reporting contract for the final summary message.

It does NOT encode any product-domain knowledge. The worker phases own all substantive content.

## When this weapon applies

Load this weapon when `gods-hand` is invoked. Typical triggers:

- "Run the pipeline."
- "Process the next queued Angel."
- "Advance the factory."
- "Drain one entry from the queue."
- "gods-hand, go."

Do NOT load it for:

- Proposing new Angels into the queue (that is `big-bang-space` plus `big-bang-earth`).
- Editing an existing backlog entry (no Angel owns this today; manual edit only).
- Researching a domain (that is `scripture-historian`).
- Writing guides or `SKILL.md` content (that is `weapon-forge`).
- Authoring an Angel file (that is `angel-creator`).
- Mutating God's roster directly (that is `god-registrar`).

## First action when this weapon is loaded

Read these in order before doing anything else:

1. **`guides/00-principles.md`** -- the move-before-work invariant, the one-entry-per-invocation rule, the foreman vs craftsman boundary, the hierarchical-orchestration justification. Cite-able from the Cursor Engineering "self-driving codebases" blog and the markdown-state-machine prior art (see `research/external/`).
2. **`guides/01-pick-and-lock.md`** -- the exact protocol for reading the top queue row, deleting it from the queue, appending to `in-process`, and updating the queue's YAML frontmatter. This is the operational core of the weapon.
3. **`guides/10-failure-modes.md`** -- the catalog of "what to do if X" because failure modes cascade and the earlier the Angel knows the recovery story, the cleaner the run.

Then walk the rest of the guides in order. Each phase guide (`04-` through `08-`) is short on purpose: the substantive logic lives inside the worker skill or subagent, not here. `gods-hand-weapon`'s job is to specify the contract at the boundary.

## Folder layout

```text
gods-hand-weapon/
+- SKILL.md                          (this file)
+- README.md                         (one-page human overview)
+- guides/
|  +- 00-principles.md               (foreman vs craftsman, move-before-work, hierarchy)
|  +- 01-pick-and-lock.md            (Step 1-2 of ACTION)
|  +- 02-backlog-lookup.md           (Step 3 of ACTION)
|  +- 03-naming-contracts.md         (weapon name derivation, uniqueness checks)
|  +- 04-phase-1-command-center.md   (Step 4 of ACTION)
|  +- 05-phase-15-scripture-historian.md (Step 6 of ACTION; uses Task tool, not skill load)
|  +- 06-phase-2-weapon-forge.md     (Step 7 of ACTION)
|  +- 07-phase-3-angel-creator.md    (Step 8 of ACTION)
|  +- 08-phase-4-god-registrar.md    (Step 9 of ACTION)
|  +- 09-close-out.md                (Step 10 of ACTION: in-process -> completed, backlog [x])
|  +- 10-failure-modes.md            (queue empty, in-process non-empty, phase fails, naming conflict, etc.)
|  +- 11-reporting.md                (Step 11 of ACTION: final summary message format)
+- examples/
|  +- happy-path.md                  (worked end-to-end run from "queue has X at top" to "Angel registered")
|  +- recovery-from-crashed-prior-run.md (what to do when in-process is non-empty on entry)
+- templates/
|  +- in-process-row.md              (canonical row format for in-process tracking file)
|  +- completed-row.md               (canonical row format for completed tracking file, with model triplet)
|  +- final-report.md                (stdout summary message shape)
+- reports/
|  +- README.md                      (what past-run summaries look like; accumulates over time)
+- research/                         (populated by scripture-historian; weapon-forge does not author)
   +- research-plan.md
   +- research-summary.md
   +- index.md
   +- internal/                      (6 source notes on canonical contract surfaces)
   +- external/                      (10 source notes on Cursor primitives, multi-agent prior art, FIFO mechanics)
```

## Critical directives (lifted from the Command Brief)

These are the non-negotiables. They are repeated verbatim in `guides/00-principles.md` with full justification and citations.

- **Process exactly ONE queue entry per invocation.** Why: each entry deserves its own human sign-off moment between runs.
- **Strict FIFO. Always pick from the TOP of the queue.** Why: the queue's documented `pickup_protocol` requires it.
- **Move-before-work.** Why: prevents sibling factory agents from racing onto the same entry.
- **Never modify queue body ordering or renumber.** Why: positions are permanent identifiers.
- **Always read the backlog metadata block.** Why: model identifiers and depth tier are inputs downstream skills consume.
- **Run the five phases in order; never skip or reorder.** Why: each phase consumes the previous phase's output.
- **Stop after god-registrar.** Why: the user explicitly requires a human review window between cycles.
- **Refuse to start a new cycle if `proposed-angels-in-process.md` already contains a row.** Why: only one cycle in flight at a time.
- **Update tracking files atomically per step.** Why: partial updates produce a desync that is hard to recover from.
- **Do not perform domain research, write guides, or author `SKILL.md` content yourself.** Why: `gods-hand` is the foreman, not the craftsman.

## Slot mode (parallel batch execution)

Slot mode is an additive, non-breaking extension for running multiple gods-hand instances in parallel. It is activated when the orchestrator passes `slot=NN` in the invocation prompt. Full protocol in `guides/12-slot-mode.md`.

**Contract summary:**

| Surface | Slot-mode behavior |
|---|---|
| `proposed-angels-in-process.md` | Never touched (orchestrator manages) |
| `proposed-angels-queue.md` | Never touched (orchestrator already dequeued) |
| `proposed-angels-completed.md` | Never touched (orchestrator appends batch-atomically) |
| `proposed-angels-backlog.md` | Never touched (orchestrator flips batch-atomically) |
| `proposed-angels-in-process-slot-NN.md` | Read on entry, deleted on success/written with failure marker on fail |
| `ai-tools/.batch-state/slot-NN-roster-add.md` | Written: ready-to-append god-roster row |
| `ai-tools/.batch-state/slot-NN-backlog-flip.md` | Written: SEARCH/REPLACE pair for backlog checkbox flip |
| `ai-tools/.batch-state/slot-NN-completion.md` | Written: completed-log entry with model triplet |
| `ai-tools/.batch-state/slot-NN.done` | Written as final signal on success |
| `ai-tools/.batch-state/slot-NN.failed` | Written instead of .done when a phase fails |
| `god-registrar` skill | NOT invoked; orchestrator runs it serially after all slots complete |

The three fragment files are the slot's contribution to the shared tracking state. The orchestrator applies them batch-atomically after all `.done` signals are present.

## Open contract drift (from research)

The research surfaced one contradiction between the Command Brief and the existing queue file that `gods-hand` MUST flag the first time it runs:

- `ai-tools/proposed-angels-queue.md`'s `pickup_protocol` describes a ONE-stage lifecycle (queue -> completed).
- The Command Brief and this weapon specify a TWO-stage lifecycle (queue -> in-process -> completed).

Treat the two-stage lifecycle as authoritative for `gods-hand`'s behavior. Note the drift in the first invocation's final report and recommend that the user (or `big-bang-space`'s owner) update the queue file's frontmatter `pickup_protocol` text to match. The fix is documentation-only; the row-format contract is unchanged.

## Pairing

| Role | Artifact |
|---|---|
| This weapon | `ai-tools/skills/gods-hand-weapon/` |
| Paired Angel | `ai-tools/agents/gods-hand.md` |
| Command Brief | `ai-tools/command-briefs/gods-hand-command-brief.md` |
| Producer-side counterpart (proposes queue rows) | `ai-tools/agents/big-bang-space.md` + `ai-tools/skills/big-bang-earth/` |
| Phase 1 worker (skill) | `ai-tools/skills/command-center/` |
| Phase 1.5 worker (subagent, via Task) | `ai-tools/agents/scripture-historian.md` |
| Phase 2 worker (skill) | `ai-tools/skills/weapon-forge/` |
| Phase 3 worker (skill) | `ai-tools/skills/angel-creator/` |
| Phase 4 worker (skill) | `ai-tools/skills/god-registrar/` |
| Queue file (read top, delete row) | `ai-tools/proposed-angels-queue.md` |
| In-process tracking file (append, then delete) | `ai-tools/proposed-angels-in-process.md` |
| Completed log (append on close-out) | `ai-tools/proposed-angels-completed.md` |
| Backlog (flip checkbox on close-out) | `ai-tools/proposed-angels-backlog.md` |

---

*Forged by `weapon-forge` from `gods-hand-command-brief.md` and `research/`. Part of the Legion AI Tools Factory by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
