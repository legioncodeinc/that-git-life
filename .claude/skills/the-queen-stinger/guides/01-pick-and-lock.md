# 01 - Pick and Lock

The operational core of `the-queen`. This guide covers Steps 1 and 2 of the Command Brief's ACTION list: picking the top queue row and locking it into `in-process` BEFORE doing any phase work.

## Step 1: Pick the top row from the queue

Open `ai-tools/proposed-bees-queue.md`. The file has YAML frontmatter (lines 1-40 roughly) followed by a body of rows. Each row has the exact form:

```
NNN|worker-bee-name
```

where `NNN` is a zero-padded 3-digit position number and `worker-bee-name` is the kebab-case Bee name.

The top row is the lowest `NNN` still present. The queue is monotonic by `pickup_protocol`'s contract: positions are never reused and never inserted in the middle. the proposal step only ever appends to the bottom.

Capture three things from the picked row:

1. `NNN` -- the position number (preserve the zero-padding).
2. `worker-bee-name` -- the Bee name as it appears in the row.
3. The full row text `NNN|worker-bee-name` -- this is what you will move.

If the body of the queue is empty (no rows below the YAML frontmatter), STOP. Emit a final report stating "queue empty, no work to do" and end the run. Do not proceed to Step 2.

## Step 2: Lock the row into in-process BEFORE any phase work

This step has THREE atomic sub-operations that must all complete before any phase is invoked.

### Sub-step 2a: Delete the picked row from `proposed-bees-queue.md`

Edit the queue file to remove the EXACT row text `NNN|worker-bee-name`. Do not delete the surrounding rows. Do not renumber. Do not reorder.

Use the StrReplace tool on the queue file. The `old_string` is the row line plus the trailing newline; the `new_string` is the empty string. This produces a clean delete that leaves the surrounding rows untouched.

### Sub-step 2b: Update the queue's YAML frontmatter

After the row delete, edit the YAML frontmatter to reflect the new state:

- Decrement `totals.rows` by 1.
- Set `date_updated:` to today's ISO date (YYYY-MM-DD).
- Set `last_updated_by:` to `the-queen`.

These three fields together make the frontmatter a self-consistent header. If you skip them, the next invocation will see a body row count that disagrees with the frontmatter, which is the trigger for one of the failure modes in `guides/10-failure-modes.md`.

### Sub-step 2c: Append the row to `proposed-bees-in-process.md`

Append a single line to `ai-tools/proposed-bees-in-process.md`:

```
NNN|worker-bee-name
```

If the in-process file does not exist yet, create it with an empty first line then write the row. If the file is non-empty when you arrive, STOP and route to `examples/recovery-from-crashed-prior-run.md` (more in `guides/10-failure-modes.md`).

After Sub-step 2c completes, the row is in `in-process` and not in `queue`. The "make invalid states impossible" invariant from `guides/00-principles.md` is preserved.

## Why move-before-work matters

The move-before-work pattern is the agent-layer equivalent of an atomic claim. By the time the first phase (command-center) is invoked, the queue row has already been removed from the queue, so a sibling invocation entering at the same moment would either:

- See a different top row, OR
- See the non-empty in-process file and refuse to start.

Both outcomes are safe. The pattern is documented in Platformatic's FileStorage (`research/external/2026-05-20-platformatic-filestorage-queue.md`):

> "Multiple workers can safely dequeue from the same filesystem. Worker lists queue files sorted by sequence. Worker attempts atomic `rename()` to claim file. Only one worker succeeds (OS guarantees atomicity). Failed workers try the next file."

`the-queen`'s markdown-row move is the moral equivalent. The semantics: claim before work, never work before claim.

## Why NOT use flock or advisory locks

You might wonder why `the-queen` does not just grab a `flock()` on the queue file. The answer is that OS-level locks have failure modes that markdown moves do not. Cursor's engineering team documents the contention pattern that doomed their first multi-agent design (`research/external/2026-05-20-cursor-self-driving-codebases.md`):

> "When agents with equal roles share a coordination file, they hold locks too long, forget to release them, and don't understand locking significance. Locking causes extreme contention where 20 agents slow to 1-3 agent throughput."

The move-before-work pattern:

- Survives crashes (the row sits visibly in `in-process` until a human or a recovery step resolves it).
- Avoids lock-holding contention (there is no lock to hold).
- Produces an audit trail (the in-process row IS the audit record).
- Works across all platforms and filesystems (no `flock` portability concerns).

The trade-off is that two simultaneous invocations CAN both try to delete the same row; only one will succeed in the StrReplace (the other will fail to find the row to delete because it has already been removed). That failure mode is documented in `guides/10-failure-modes.md` under "two the-queen invocations race on the same queue row" and the recovery is to verify in-process for duplicate rows and clean up manually.

## Common mistakes

- **Reading the queue body but not picking the TOP row.** Always pick the lowest `NNN` still present. Do not skip rows even if a higher-numbered row looks more interesting.
- **Updating in-process BEFORE deleting from queue.** This produces a transient state where the row is in BOTH files, which is an invalid state per `guides/00-principles.md`. Order: delete from queue FIRST, then append to in-process. If the delete fails (because a sibling already claimed it), the append is skipped automatically.
- **Forgetting to update the queue's YAML frontmatter `totals.rows`.** This produces a desync between the body row count and the declared count. The next invocation may see this and refuse to start.
- **Renumbering remaining rows.** NEVER. Positions are permanent. The queue is monotonic-with-holes by design.

## On contract drift between this guide and the queue file

The research surfaced a stale section in `ai-tools/proposed-bees-queue.md`'s YAML frontmatter. The `pickup_protocol` text in the queue file describes a ONE-stage lifecycle (queue -> completed directly). The Command Brief and this guide specify a TWO-stage lifecycle (queue -> in-process -> completed).

`the-queen` follows the TWO-stage lifecycle. Treat the queue file's `pickup_protocol` text as out-of-date documentation that needs a manual edit (suggested wording: replace "appends the row to `proposed-bees-completed.md` with a status marker and ISO date" with "appends the row to `proposed-bees-in-process.md`; the row moves to `proposed-bees-completed.md` only after all five phases succeed via `the-queen`'s close-out step").

Flag this drift in the final report of the first invocation; do not silently fix it (you only edit the file's body during Sub-step 2a, not its frontmatter prose).
