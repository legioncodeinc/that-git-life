# 10 - Failure Modes

The catalog of "what to do if X" for every failure mode `the-queen` might encounter. Each entry has a trigger, a diagnosis, and a recovery procedure.

The earlier in the cycle `the-queen` recognizes a failure, the cheaper the recovery. Use this guide as a checklist whenever a step does not produce its expected output.

## Pre-flight failures (before Step 1)

### F0.1: Queue is empty

- **Trigger:** `ai-tools/proposed-bees-queue.md` body has no rows below the YAML frontmatter.
- **Diagnosis:** All proposed Bees are either in-flight or completed. Nothing to do.
- **Recovery:** Emit a final report stating "queue empty, no work to do" and end the run. Do not error; this is a normal terminal state.

### F0.2: In-process is non-empty (orphaned row from prior cycle)

- **Trigger:** `ai-tools/proposed-bees-in-process.md` has one or more non-blank lines on entry.
- **Diagnosis:** A prior cycle crashed mid-run or did not complete close-out. The row visible in in-process tells you which Bee was being processed and (if it has a `|failed:<phase>` marker) which phase failed.
- **Recovery:** STOP this cycle. Do NOT pick a new queue row. Surface the orphaned row to the caller and route to `examples/recovery-from-crashed-prior-run.md`. The human reviewer decides whether to:
  - Re-invoke `the-queen` to retry from the failed phase (manual, not automatic).
  - Roll back the orphan row to the queue (delete from in-process, prepend to queue body, increment queue's `totals.rows`).
  - Mark the orphan as abandoned (delete from in-process, leave backlog `[ ]` to be re-tried later, no `completed.md` entry).

### F0.3: Queue frontmatter `totals.rows` disagrees with body count

- **Trigger:** Counting the rows in the queue body produces a number different from the `totals.rows` value in YAML frontmatter.
- **Diagnosis:** A prior write was partial. Either the body was edited without updating the frontmatter, or vice versa.
- **Recovery:** Flag in the final report. The discrepancy does not block this cycle's work because `the-queen` picks rows from the body directly, not from the frontmatter count. However, a future cycle reading the frontmatter for guards could be misled. Recommend the user (or the proposal step's owner) reconcile the count.

## Pick-and-lock failures (Step 1-2)

### F1.1: Queue row text contains unexpected characters

- **Trigger:** A row line does not match the `NNN|worker-bee-name` format (e.g., extra fields, lowercase failures, missing pipe).
- **Diagnosis:** Probably a manual edit gone wrong, or the proposal step produced a malformed row.
- **Recovery:** STOP. Surface for the caller to fix the row. Do not attempt to repair the row automatically; the position number and worker-bee name are load-bearing identifiers.

### F1.2: Two `the-queen` invocations race on the same queue row

- **Trigger:** During Sub-step 2a (delete row from queue), the StrReplace fails because the row text is not present.
- **Diagnosis:** A sibling `the-queen` invocation already deleted the same row.
- **Recovery:** The first-to-delete wins. The second invocation should:
  1. Re-read the queue. The top row may now be a different row.
  2. Check `in-process.md` for two duplicate rows (this is the race signature). If two rows of the same worker-bee-name are present, manual cleanup is needed: delete the duplicate, leave the original to proceed normally.
  3. If `in-process.md` has only one row of the same worker-bee-name AND it was just appended by the OTHER invocation, this invocation should STOP per F0.2 (in-process non-empty refusal).

### F1.3: Append to in-process fails

- **Trigger:** Sub-step 2c fails to write the row to `ai-tools/proposed-bees-in-process.md`.
- **Diagnosis:** Filesystem permission issue, disk full, or the file is locked by another process.
- **Recovery:** STOP. The queue row has already been deleted (Sub-step 2a) but the in-process append failed. The row is in limbo. Surface for the caller; manual recovery is to either re-attempt the append or write the row back to the queue.

## Backlog lookup failures (Step 3)

### F2.1: Backlog entry heading not found

- **Trigger:** Searching `ai-tools/proposed-bees-backlog.md` for `### [ ] N. <worker-bee-name>` (or `### [x] N. <worker-bee-name>`) returns zero matches.
- **Diagnosis:** Queue and backlog are out of sync. The queue row references an Bee that does not exist in the backlog.
- **Recovery:** STOP. The cycle cannot proceed without backlog metadata. Roll back the in-process row to the queue (this is the only failure mode where rollback is appropriate; the queue row should not have existed in the first place). Surface for the caller to investigate the desync.

### F2.2: Backlog entry checkbox is already `[x]`

- **Trigger:** The matching heading is found but its checkbox shows `[x]`.
- **Diagnosis:** The Bee was already completed but the queue still had its row. Another desync.
- **Recovery:** STOP. Delete the in-process row (do NOT roll back to queue; the queue row was the wrong one). Surface for the caller. The completed Bee's artifacts should already exist on disk; no further forging is needed.

### F2.3: Metadata block is incomplete

- **Trigger:** One of the four metadata lines (Research Depth, Research Model, Analyst Model, Builder Model) is missing or has an unrecognized value.
- **Diagnosis:** Backlog entry was authored without the full metadata block, or values drift away from the canonical set.
- **Recovery:** STOP. Surface for the caller to fix the backlog entry. Default-guessing the missing values wastes downstream budget.

### F2.4: Search query count is below 5 or above 7

- **Trigger:** The bullet list of queries below the metadata block has fewer than 5 or more than 7 entries.
- **Diagnosis:** Below 5 is a hard rule violation. Above 7 is a soft rule violation (the backlog's authoring rule is 5-7).
- **Recovery:** Below 5: STOP and ask the caller. Above 7: proceed but flag in the final report.

## Phase-specific failures (Steps 4 through 9)

### F3.1: Phase did not produce its expected artifact

- **Trigger:** After invoking phase N, the expected output file (see the phase-N guide) is missing or empty.
- **Diagnosis:** Phase failed silently, was interrupted, or returned without writing.
- **Recovery:** STOP. Mark the in-process row with `|failed:<phase-name>|YYYY-MM-DD` so a future recovery cycle can re-enter at the right phase. Surface for the caller.

### F3.2: Phase modified files outside its contract

- **Trigger:** After invoking phase N, files outside phase N's expected output are modified.
- **Diagnosis:** The phase has over-stepped. Examples: `stinger-forge` modifies `research/`, `bee-creator` modifies the Stinger folder, `hive-registrar` modifies the Bee file.
- **Recovery:** STOP. Surface as a contract violation. The Bee may still be usable, but the audit trail is corrupted. Recommend either reverting the cross-phase modifications or starting the cycle over.

### F3.3: Scripture-historian Firecrawl or Exa auth error

- **Trigger:** Scripture-historian's final message includes an auth-failure surface.
- **Diagnosis:** External research tools are not authenticated.
- **Recovery:** STOP. Surface to the caller; they need to run `firecrawl login --browser` or `/exa-setup` and re-invoke the cycle. The in-process row stays in place; mark with `|failed:scripture-historian-auth|YYYY-MM-DD`.

### F3.4: Scripture-historian depth tier missing

- **Trigger:** Scripture-historian's pre-flight check reports that the depth tier is missing from both the Command Brief's frontmatter and the backlog entry.
- **Diagnosis:** Command-center did not propagate the depth tier from the backlog into the Command Brief's frontmatter. This is a Phase 1 bug.
- **Recovery:** STOP. Manually patch the Command Brief's frontmatter with the depth tier from the backlog. Re-invoke scripture-historian.

## Close-out failures (Step 10)

### F4.1: One of the five durable artifacts is missing

- **Trigger:** Step 10a verification finds one of the five required artifacts is absent.
- **Diagnosis:** A phase's success was reported but the artifact does not exist on disk.
- **Recovery:** STOP. Do NOT close out. Treat this as a phase failure for the relevant phase and surface for the caller.

### F4.2: Partial close-out (some steps done, others not)

- **Trigger:** Step 10b succeeded but Step 10c or 10d failed.
- **Diagnosis:** The state machine is in an inconsistent intermediate state.
- **Recovery:** Re-attempt the missing close-out step manually. If 10b is done but 10c is not, the row has vanished entirely; append it to `completed.md`. If 10c is done but 10d is not, flip the backlog checkbox to `[x]` manually.

### F4.3: Backlog checkbox flip fails

- **Trigger:** Step 10d's StrReplace cannot find the `### [ ] N. <worker-bee-name>` heading.
- **Diagnosis:** Either the heading was already flipped to `[x]` (probably by a prior partial close-out), or the heading text drifted.
- **Recovery:** If the heading is already `[x]`, the close-out was effectively complete; proceed. If the heading is missing entirely, surface for the caller; the backlog is corrupted.

## Reporting failures

### F5.1: Final report cannot be assembled

- **Trigger:** Step 11 fails because some required state is missing (e.g., the row position number was never captured).
- **Diagnosis:** A prior step did not persist state. Unlikely if Steps 1-10 succeeded, but possible if a recovery path was followed.
- **Recovery:** Emit whatever report you can. Better an incomplete report than no report.

## A note on rollback vs leave-with-marker

Two recovery strategies appear repeatedly in this catalog:

1. **Roll back to queue:** Move the in-process row back to the queue body. Used when the queue row should not have been picked in the first place (F2.1).
2. **Leave with marker:** Append `|failed:<phase>|YYYY-MM-DD` to the in-process row. Used when work was started but did not complete (F3.1, F3.3, F3.4).

The "leave with marker" strategy is preferred for most mid-cycle failures because it preserves the failure context for the human reviewer. Rolling back to queue silently loses information about which phase failed and why. The Command Brief's open question #3 (resolved per `research/research-summary.md`) is the authoritative source: leave-with-marker is the default; rollback is reserved for the specific case where the queue row itself was invalid.
