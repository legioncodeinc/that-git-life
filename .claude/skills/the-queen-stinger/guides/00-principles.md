# 00 - Principles

The non-negotiable rules that govern every `the-queen` invocation. Read this guide on every cycle; the rest of the stinger assumes you have internalized these principles.

## The foreman vs craftsman boundary

`the-queen` is the factory foreman. It does not research, design, code, audit, or author any product-domain content. Its job is to dispatch the worker phases in the correct order, watch each phase report success, and update the tracking files between phases.

This separation is intentional and is rooted in published Cursor engineering practice. As Cursor's own engineering team writes on self-driving codebases (see `research/external/2026-05-20-cursor-self-driving-codebases.md`), planning and execution stay in separate layers. Before any phase runs, the row is deleted from `proposed-bees-queue.md` AND appended to `proposed-bees-in-process.md`.

The invariant exists because there is no OS-level lock on a markdown file. If two `the-queen` invocations were to read the queue concurrently, both would see the same top row. The move-before-work pattern is the agent-layer equivalent of an atomic rename: by the time phase work begins, the row is verifiably in `in-process` and not in `queue`, so a second invocation entering at the same moment would see a different top row OR refuse to start (because the in-process file is non-empty).

Production prior art for this pattern lives in Platformatic FileStorage (see `research/external/2026-05-20-platformatic-filestorage-queue.md`):

> "Multiple workers can safely dequeue from the same filesystem:
> 1. Worker lists queue files sorted by sequence
> 2. Worker attempts atomic rename to claim file
> 3. Only one worker succeeds (OS guarantees atomicity)
> 4. Failed workers try the next file"

`the-queen`'s markdown-row move is the moral equivalent. The semantics are the same: claim before work, never work before claim.

Why NOT use OS-level file locks (flock, ADVISORY locks)? Cursor engineering documents the failure modes (`research/external/2026-05-20-cursor-self-driving-codebases.md`):

> "When agents with equal roles share a coordination file, they hold locks too long, forget to release them, and don't understand locking significance. Locking causes extreme contention where 20 agents slow to 1-3 agent throughput."

The move-before-work pattern survives crashes (the row sits visibly in `in-process` until a human or a recovery step resolves it), avoids lock-holding contention, and produces an audit trail that does not require log mining. It is structurally simpler than locks AND more robust under failure.

## Hierarchical orchestration beats peer coordination

`the-queen` is the root of a planner-worker hierarchy. The worker phases never talk to each other directly. Each worker hands its output back to `the-queen` via the on-disk artifact (Command Brief, research folder, stinger folder, Bee file, roster row). `the-queen` is the only entity that reads multiple workers' outputs.

This matters because:

1. Each worker can be invoked independently for debugging or rerun.
2. Each worker's output is a verifiable artifact (the Command Brief either exists or it does not).
3. Adding a sixth phase (or removing one) only changes `the-queen`'s phase list, not the workers.
4. A worker failure is local; it never cascades through worker-to-worker calls.

This is the same architecture Cursor's engineering team converged on:

> "The final design uses a recursive planner-worker hierarchy where a root planner owns the full scope, spawns subplanners for subdivided work, and workers pick up individual tasks on their own repo copies. Workers submit handoff reports back to planners containing findings, concerns, and deviations."

For `the-queen`'s single-cycle scope, "handoff reports" are the artifacts on disk.

## Markdown files as a state machine

The four tracking files are not loose documentation. They are a finite state machine encoded in markdown. Each Bee proposal has exactly four observable states:

| State | Where the row lives |
|---|---|
| Proposed | `proposed-bees-backlog.md` (with `### [ ] N. name`) AND `proposed-bees-queue.md` (with `NNN\|name`) |
| In-flight | `proposed-bees-backlog.md` (still `[ ]`) AND `proposed-bees-in-process.md` (with `NNN\|name`) |
| Completed | `proposed-bees-backlog.md` (now `[x]`) AND `proposed-bees-completed.md` (with `NNN\|name\|completed\|YYYY-MM-DD\|...`) |
| Failed mid-cycle | `proposed-bees-backlog.md` (still `[ ]`) AND `proposed-bees-in-process.md` (with `NNN\|name\|failed:<phase>`) |

There is no fifth state. There is no state where the row is in BOTH `queue` AND `in-process`. There is no state where the row is in `completed` AND `in-process`. The move-before-work invariant is what makes invalid states impossible.

This state-machine framing is the right mental model for the entire stinger. As Phoenix argues (`research/external/2026-05-20-markdown-files-as-state-machines.md`):

> "The markdown structure constrains the LLM's execution path the same way types constrain a compiler. Instead of hoping the model interprets prose correctly, you encode the workflow as a finite state machine where each state has defined transitions."

> "If you want an AI agent to do something complex and do it reliably, the answer is not better prose instructions. It is more structured ones. Encode workflows as numbered steps with explicit branching, persist state to disk at checkpoints, and design for context compaction as a guaranteed event, not an edge case."

The tracking files ARE the checkpoint files. `the-queen` survives context compaction by re-reading them.

## The ten non-negotiables

These are stated tersely. The rest of the stinger expands each.

1. **Process exactly ONE queue entry per invocation.** Never auto-advance.
2. **Strict FIFO. Always pick from the TOP of the queue.**
3. **Move-before-work.** Delete queue row, append to in-process, BEFORE any phase invocation.
4. **Never modify queue body ordering or renumber.** Positions are permanent identifiers.
5. **Always read the backlog metadata block** before invoking command-center.
6. **Run the five phases in order; never skip or reorder.**
7. **Stop after hive-registrar.** Emit the final report, then end the run. Do not loop.
8. **Refuse to start a new cycle if `proposed-bees-in-process.md` already contains a non-blank row.**
9. **Update tracking files atomically per step.** No partial writes that leave the state machine in a hybrid state.
10. **Do not perform domain research, write guides, or author SKILL.md content yourself.** Foreman, not craftsman.

If a directive ever conflicts with caller pressure to "just keep going" or "skip the research phase, it is shallow anyway", reread this section. The directives are load-bearing.
