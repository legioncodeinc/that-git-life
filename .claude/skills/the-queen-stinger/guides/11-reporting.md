# 11 - Reporting

Step 11 of the Command Brief's ACTION list. After close-out, emit a final summary message to the caller and end the run.

The final report is `the-queen`'s only output to the caller. The tracking-file mutations and on-disk artifacts are the durable products; the report is the human-readable receipt. Make it concise, complete, and structured so an orchestrator (or human) can decide what to do next.

## Required content

The final report has six sections, in this order:

### 1. One-line summary

Open with a single line stating what happened, in past tense, with the position number and worker-bee name. Examples:

- `Forged Bee 001|nextjs-worker-bee. Pipeline complete.`
- `Queue empty. No work to do.`
- `Cycle stopped at Phase 2 (stinger-forge). Row 005|vite-worker-bee remains in-process with marker.`

### 2. Tracking-file deltas

A table showing the four tracking files and what changed in each:

| File | Before | After |
|---|---|---|
| `proposed-bees-queue.md` | Top row was `NNN\|worker-bee-name` | Row removed; new top row is `MMM\|next-worker-bee-name` (or "queue empty") |
| `proposed-bees-in-process.md` | Empty | Row was appended then removed; file is now empty |
| `proposed-bees-completed.md` | Empty / N rows | Row appended; file now has N+1 rows |
| `proposed-bees-backlog.md` | `### [ ] N. worker-bee-name` | `### [x] N. worker-bee-name` |

If the cycle failed mid-run, the "After" column reflects the partial state.

### 3. Artifacts produced

A list of the five durable artifacts, with paths:

- Command Brief: `ai-tools/command-briefs/<worker-bee-name>-command-brief.md`
- Stinger folder: `ai-tools/skills/<stinger-name>/` (with subfolder counts: e.g., `guides/ (12 files)`, `examples/ (2 files)`, `research/ (19 files)`)
- Bee file: `ai-tools/agents/<worker-bee-name>.md`
- beekeeper-suit's roster row: added to `ai-tools/skills/beekeeper-suit/SKILL.md` (with line number if possible)
- beekeeper-suit-side guide: `ai-tools/skills/beekeeper-suit/guides/<worker-bee-name>.md`

For a failed cycle, list only the artifacts that were produced and mark the missing ones.

### 4. Phase timing

A small table of phase wall-clock durations:

| Phase | Worker | Duration | Status |
|---|---|---|---|
| 1 | command-center | 0:01:23 | OK |
| 1.5 | scripture-historian | 0:12:45 | OK |
| 2 | stinger-forge | 0:08:11 | OK |
| 3 | bee-creator | 0:01:02 | OK |
| 4 | hive-registrar | 0:00:18 | OK |
| 10 (close-out) | the-queen | 0:00:05 | OK |

This is informative, not load-bearing. If wall-clock data is not available, omit the table.

### 5. Flags and warnings

A bullet list of anything noteworthy that did not block close-out:

- Documentation drift detected (e.g., the queue file's `pickup_protocol` is stale; see `guides/01-pick-and-lock.md`).
- Phase produced an over-long SKILL.md (>500 lines).
- Search query count was 6 instead of the recommended 5-7 (informative only).
- Other items that warrant human follow-up but do not invalidate the Bee.

If there are no flags, write "No flags or warnings."

### 6. Next steps for the orchestrator

A short sentence telling the orchestrator (or human) what to do next:

- `Cycle complete. Invoke the-queen again to process the next queue entry, or stop here.`
- `Cycle paused at Phase 2. Resolve the failure (see in-process row marker) and re-invoke.`
- the proposal step

This section is the EXPLICIT statement of `the-queen`'s stop rule. By writing the next-steps line, the Bee makes clear that it does not auto-advance. The orchestrator decides.

## Format and tone

The report goes to the caller as a single message in the chat. Use markdown formatting:

- H2 sections for each of the six required parts.
- Tables for the deltas, artifacts, and timing.
- Bullet lists for flags and the next-steps line.
- Code spans for file paths and row text.
- No em dashes, no en dashes (this is a repo-wide rule).

Length target: 50 to 150 lines for a happy-path run; longer for failure modes that need to explain the partial state.

## The stop line

End the report with a single explicit line:

> `the-queen stopped. Awaiting next invocation.`

This is the signal to the orchestrator that the run is over. Do NOT continue with chat after this line. Do NOT recursively invoke `the-queen`. Do NOT pick up the next queue entry.

This line is load-bearing per `guides/00-principles.md` non-negotiable #7 ("Stop after hive-registrar"). Without it, the orchestrator might assume `the-queen` is still working and wait indefinitely.

## A note on context compaction

If `the-queen` is invoked for a deep-tier cycle that takes hours, context compaction may erase the early steps of the run before close-out. The final report becomes hard to assemble.

Mitigation: re-read the four tracking files at report time. They are the source of truth for the deltas. Re-read the five artifact paths to confirm existence. The five durable artifacts ARE the durable run state; the report is a summary of them.

This is the markdown-state-machine pattern from the research: persist state to disk at checkpoints, do not rely on in-memory continuity. See `research/external/2026-05-20-markdown-files-as-state-machines.md` for the canonical argument.
