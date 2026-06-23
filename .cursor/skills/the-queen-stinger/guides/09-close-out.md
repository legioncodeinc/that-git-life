# 09 - Close Out

Step 10 of the Command Brief's ACTION list. After all five phases (1, 1.5, 2, 3, 4) succeed, transition the row from `in-process` to `completed` and flip the backlog checkbox to `[x]`.

This is the final transition in the state machine described in `guides/00-principles.md`. After close-out, the proposal is in the `Completed` state and no further work happens on this row.

## Step 10a: Verify all five phases produced their artifacts

Before any tracking-file mutation, double-check that the five durable artifacts all exist on disk:

1. `ai-tools/command-briefs/<worker-bee-name>-command-brief.md` (from Phase 1)
2. `ai-tools/skills/<stinger-name>/research/research-summary.md` (from Phase 1.5)
3. `ai-tools/skills/<stinger-name>/SKILL.md` (from Phase 2)
4. `ai-tools/agents/<worker-bee-name>.md` (from Phase 3)
5. New roster row in `ai-tools/skills/beekeeper-suit/SKILL.md` plus `ai-tools/skills/beekeeper-suit/guides/<worker-bee-name>.md` (from Phase 4)

If any of these is missing, do NOT close out. STOP and route to `guides/10-failure-modes.md`. Closing out a partial cycle would mark the backlog `[x]` for an Bee that does not actually exist.

## Step 10b: Delete the row from `proposed-bees-in-process.md`

Open `ai-tools/proposed-bees-in-process.md` and delete the line `NNN|worker-bee-name` (or `NNN|worker-bee-name|failed:<phase>|...` if the row carries a failure marker from a prior partial cycle; but at this point in a happy-path run, the row should be clean).

Use StrReplace. The `old_string` is the exact row line plus its trailing newline. The `new_string` is the empty string.

After deletion, the in-process file should be empty (no non-blank rows). Verify this. A non-empty in-process file after close-out indicates either:

- An older orphaned row from a crashed prior cycle (which should have prevented this cycle from starting -- see `guides/10-failure-modes.md`).
- A bug in the move-before-work step (Sub-step 2c in `guides/01-pick-and-lock.md`) where the row was appended twice.

Either way, surface the anomaly in the final report.

## Step 10c: Append the row to `proposed-bees-completed.md`

Append a single line to `ai-tools/proposed-bees-completed.md` with the canonical completed-row format:

```
NNN|worker-bee-name|completed|YYYY-MM-DD|research:<research-model-id>|analyst:<analyst-model-id>|builder:<builder-model-id>
```

The exact format is documented in `templates/completed-row.md`. The model identifiers come from the backlog metadata (Step 3 of the ACTION list, captured in `guides/02-backlog-lookup.md`). Including them in the row enables downstream cost and quality analytics without requiring a separate journal.

If `proposed-bees-completed.md` was empty at the start of this cycle, it now contains exactly one line. Subsequent cycles append rows to the bottom.

## Step 10d: Flip the backlog checkbox to `[x]`

Open `ai-tools/proposed-bees-backlog.md` and find the entry's heading:

```
### [ ] N. worker-bee-name
```

(Note: the backlog uses non-zero-padded `N`, the queue uses zero-padded `NNN`. See `guides/02-backlog-lookup.md` for the format mismatch.)

Replace the `[ ]` with `[x]`:

```
### [x] N. worker-bee-name
```

Do NOT modify anything else in the backlog entry. The four metadata lines, the Purpose, and the search queries remain unchanged. They are the historical record of the Bee's authoring inputs.

After this edit, the state-machine transition is complete:

| Before close-out | After close-out |
|---|---|
| `queue.md`: row absent | `queue.md`: row absent (unchanged from lock step) |
| `in-process.md`: row present | `in-process.md`: row absent |
| `completed.md`: row absent | `completed.md`: row present with full metadata line |
| `backlog.md`: heading `[ ]` | `backlog.md`: heading `[x]` |

## Step 10e: Update tracking-file frontmatter (optional)

`the-queen` could also touch the YAML frontmatter of `proposed-bees-completed.md` and `proposed-bees-backlog.md` to record:

- `date_updated:` (today's ISO date)
- `last_updated_by: the-queen`

For the queue file, the frontmatter was already updated in Sub-step 2b of the pick-and-lock guide. For the in-process file, the frontmatter is optional (most cycles do not need a counted total). For the completed file, an incrementing `totals.rows` is useful for at-a-glance "how many Bees have been forged?" answers.

This step is recommended but not load-bearing. If the tracking files do not have frontmatter blocks, do not add them in this step.

## Why close-out is its own step

You might wonder why the close-out is not just "Phase 5" alongside the other phases. The answer: the other phases dispatch external workers. Close-out is purely `the-queen`'s administrative work. Keeping it separate:

- Makes the partial-failure recovery clear (a failure during close-out is qualitatively different from a failure during a worker phase).
- Keeps `the-queen`'s reporting clean (the final report enumerates four worker phases plus the close-out).
- Allows `the-queen` to be tested with a stub worker pipeline by verifying just the close-out step.

## Failure modes specific to close-out

- **Close-out partially completes.** For example, the row is appended to `completed.md` but the backlog checkbox flip fails. The state machine is in an inconsistent state. Recovery: complete the missing transition manually, or roll back the partial transition. Do NOT silently retry the entire close-out (you might double-append to `completed.md`).
- **The five artifacts exist but one is a stub.** For example, `SKILL.md` exists with only YAML frontmatter and no body. `the-queen`'s checks should have caught this at the relevant phase boundary, but if it slips through, flag in the final report and recommend a manual re-run of the affected phase.
- **The completed-row format is wrong.** Future cycles may have trouble parsing the row. Flag and recommend a manual fix.

Next step after close-out: emit the final report (`guides/11-reporting.md`) and end the run.
