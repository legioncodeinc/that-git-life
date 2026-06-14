# God's Hand: God's Guide

The God routing skill's record of when to invoke `gods-hand`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/gods-hand.md`](../../../agents/gods-hand.md)
**Weapon:** [`ai-tools/skills/gods-hand-weapon/`](../../gods-hand-weapon/)
**Command Brief:** [`ai-tools/command-briefs/gods-hand-command-brief.md`](../../../command-briefs/gods-hand-command-brief.md)
**Trigger policy:** proactive (with strictly explicit trigger phrases; never volunteers on topic alone)

---

## Domain

`gods-hand` is the Legion AI Tools Factory's pipeline-controller Angel. It owns the end-to-end execution of a single Angel-forging cycle: pick the top queue row from `ai-tools/proposed-angels-queue.md`, lock it into `ai-tools/proposed-angels-in-process.md`, look up its backlog metadata, drive the canonical five-phase pipeline (command-center, scripture-historian, weapon-forge, angel-creator, god-registrar) in order, then close out by moving the row to `ai-tools/proposed-angels-completed.md` and flipping the backlog checkbox to `[x]`. It is the foreman, not the craftsman; it dispatches workers but does no domain research, guide authoring, or skill writing itself. Each invocation processes exactly ONE row and stops.

`gods-hand` is the consumption side of the queue that `big-bang-space` produces. The two share the same row-format and position-numbering contracts but never write the same files in the same direction.

## Trigger phrases

Route to `gods-hand` when the user says any of:

- "run the pipeline"
- "advance the factory"
- "process the next queued Angel"
- "drain one entry from the queue"
- "gods-hand, go"
- "kick off the forge for the next row"
- "consume the top queue entry"

Only route on EXPLICIT, near-verbatim variants of these phrases. `gods-hand` is `proactive: true` for format consistency with other roster Angels, but the trigger phrases are tight on purpose: this Angel mutates four tracking files and dispatches four sub-skills (plus one subagent) per run. Volunteering on ambiguous topic mentions is a high-cost mistake.

## Do NOT route when

- The user says "propose a new Angel", "add a guardian to the queue", "queue up a new subagent" -- that is `big-bang-space`, not `gods-hand`. `big-bang-space` produces queue rows; `gods-hand` consumes them.
- The user says "research the topic before weapon-forge" or "scripture-historian, gather sources" -- that is `scripture-historian` standalone. `gods-hand` invokes `scripture-historian` as Phase 1.5 of a full cycle; it does not run research in isolation.
- The user says "build this skill" or "scaffold the weapon folder" without naming the queue, the factory, or the pipeline -- that is `weapon-forge` standalone. `gods-hand` invokes `weapon-forge` as Phase 2.
- The user says "create the Angel file" or "wire up the subagent" -- that is `angel-creator` standalone. `gods-hand` invokes `angel-creator` as Phase 3.
- The user says "register the Angel with God" or "add to God's roster" -- that is `god-registrar` standalone. `gods-hand` invokes `god-registrar` as Phase 4.
- The user wants to forge a SPECIFIC Angel out of order (e.g. "build `mongodb-guardian` next, skip `vue-nuxt-pinia-guardian`") -- `gods-hand` is strict FIFO. The user must either (a) wait for the FIFO progression to reach the desired row, or (b) manually rewrite the queue order (which violates `big-bang-space`'s position-numbering rules and is generally not recommended).
- The user wants `gods-hand` to keep going after a cycle (e.g. "now do the next one"). Strict one-cycle-per-invocation. The orchestrator (or human) must re-invoke `gods-hand` for the next row.

If a request straddles `gods-hand` and a single worker phase, prefer the worker phase. `gods-hand` should only fire for the full pipeline.

## Inputs the Angel needs

Before invoking, ensure (or infer):

- A non-empty `ai-tools/proposed-angels-queue.md`. If the queue is empty, `gods-hand` will stop with "queue empty" and report.
- An empty `ai-tools/proposed-angels-in-process.md`. If it has an orphaned row from a prior failed cycle, `gods-hand` will STOP at pre-flight and surface the orphan for human resolution per `examples/recovery-from-crashed-prior-run.md`.
- A populated `ai-tools/proposed-angels-backlog.md` with the matching `### [ ] N. guardian-name` heading and a complete metadata block for whatever row is currently at the top of the queue.
- Working access to the four downstream phase skills (`command-center`, `weapon-forge`, `angel-creator`, `god-registrar`) and the `scripture-historian` subagent.

If a required input is missing, do not invoke yet. Surface the gap to the user and let them decide whether to fix it (e.g., resolve an orphan row, populate the backlog metadata) before re-invoking.

## Outputs the Angel produces

A successful `gods-hand` cycle produces:

- **Command Brief** at `ai-tools/command-briefs/<guardian-name>-command-brief.md`
- **Weapon folder** at `ai-tools/skills/<weapon-name>/` with `SKILL.md`, `README.md`, populated `guides/`, `examples/`, `templates/`, `reports/README.md`, and `research/`
- **Angel file** at `ai-tools/agents/<guardian-name>.md`
- **God's roster** updated in `ai-tools/skills/god/SKILL.md` with a new row plus a guide at `ai-tools/skills/god/guides/<guardian-name>.md`
- **Tracking-file deltas**: queue row removed, in-process row appended-then-removed, completed row appended (with model triplet), backlog checkbox flipped to `[x]`
- **Final report**: a six-section markdown message to the caller summarizing all of the above, ending with the canonical stop line `gods-hand stopped. Awaiting next invocation.`

A failed cycle produces a partial set of artifacts plus an in-process row marked `|failed:<phase>|YYYY-MM-DD` for human recovery.

## Multi-Angel sequences this Angel participates in

### Legion AI Tools Factory pipeline (canonical Angel-forging cycle)

This is the sequence `gods-hand` orchestrates. `gods-hand` is the root planner; the others are workers.

1. **`big-bang-space`** appends a new Angel proposal to `proposed-angels-backlog.md` and `proposed-angels-queue.md`. (Producer side; `gods-hand` does not invoke `big-bang-space`.)
2. **`gods-hand`** picks the top queue row and locks it into in-process.
3. **`gods-hand`** invokes **`command-center`** to author the Command Brief. (Phase 1)
4. **`gods-hand`** scaffolds the weapon folder skeleton.
5. **`gods-hand`** invokes **`scripture-historian`** via the Task tool to conduct depth-calibrated research. (Phase 1.5)
6. **`gods-hand`** invokes **`weapon-forge`** to author the weapon's SKILL.md, guides, examples, templates, reports. (Phase 2)
7. **`gods-hand`** invokes **`angel-creator`** to author the Angel file. (Phase 3)
8. **`gods-hand`** invokes **`god-registrar`** to add the roster row and author the god-side guide. (Phase 4)
9. **`gods-hand`** closes out: in-process row to completed log (with model triplet), backlog checkbox to `[x]`.
10. **`gods-hand`** emits the final report and stops.

The next cycle starts only when `gods-hand` is re-invoked by the orchestrator. There is no auto-advance.

## Critical directives the orchestrator should respect

When routing requests to `gods-hand`, the orchestrator should understand and honor:

- **One cycle per invocation.** Do not ask `gods-hand` to "process the next three" or "keep going until the queue is empty". Each cycle requires its own invocation.
- **Strict FIFO from the top.** Do not pass a specific guardian name as input. `gods-hand` always picks the lowest-`NNN` row in the queue. If the user wants a specific row, they must wait for FIFO progression or manually edit the queue (not recommended).
- **No mid-cycle retries from the orchestrator.** If `gods-hand` reports a failed phase with an in-process marker, the orchestrator should surface the failure to the user and let the user decide the recovery option (retry from phase, roll back to queue, mark abandoned). Do not silently re-invoke `gods-hand` hoping the failure was transient.
- **Honor the stop line.** When `gods-hand` emits `gods-hand stopped. Awaiting next invocation.`, do not continue the conversation as if more was happening. The cycle is over.
- **Do not invoke `gods-hand` to run a single phase.** If the user wants only `command-center` or only `weapon-forge`, route directly to that skill, not to `gods-hand`.

(Full list of internal directives lives in the Angel file's `## Critical directives` section. The orchestrator-facing subset is above.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
