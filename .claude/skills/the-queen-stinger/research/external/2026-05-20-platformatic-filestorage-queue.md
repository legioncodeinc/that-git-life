---
source_url: https://mintlify.com/platformatic/job-queue/api/storage/file-storage
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: file-queue-atomic-move
stinger: the-queen-stinger
---

# FileStorage - Platformatic Job Queue

## Summary
Canonical reference for a production file-based FIFO queue with atomic move semantics. Platformatic's FileStorage uses subfolders (`queue/`, `processing/`, `jobs/`, `results/`, `errors/`, `workers/`) and atomic `rename()` to claim jobs. The dequeue mechanic ("worker lists queue files sorted by sequence, worker attempts atomic rename to claim file, only one worker succeeds, failed workers try the next file") IS THE EXACT PATTERN `the-queen` implements at the markdown-file level. The naming convention `{sequence}-{jobId}.msg` mirrors `NNN|worker-bee-name`. Strongest external evidence for the move-before-work invariant.

## Key quotations / statistics

- Subfolder layout: "`queue/` - Pending jobs / `processing/` - Jobs being processed by workers / `jobs/` - Job state files / `results/` - Job results / `errors/` - Job errors / `workers/` - Worker registrations / `notify/` - Notification files."
- Atomic write guarantee: "All writes use `fast-write-atomic` for crash safety: // Atomic write: creates temp file, then renames. Crash resistant: Partial writes never corrupt existing files. Race condition safe: Multiple processes can write safely. Atomic operations: Rename is atomic on most filesystems."
- File naming conventions: "Queue files: `{sequence}-{jobId}.msg` (sequence ensures FIFO order). State files: `{jobId}.state` (contains state string). Result files: `{jobId}.result` + `{jobId}.ttl`. Error files: `{jobId}.error` + `{jobId}.ttl`. Worker files: `{workerId}.worker` (contains expiry timestamp). Notify files: `{jobId}-{timestamp}.notify`. Lock files: `{lockKey}.lock` (JSON with ownerId and expiresAt)."
- Dequeue race-condition handling (LOAD-BEARING quote):
  ```
  Multiple workers can safely dequeue from the same filesystem:
  1. Worker lists queue files sorted by sequence
  2. Worker attempts atomic `rename()` to claim file
  3. Only one worker succeeds (OS guarantees atomicity)
  4. Failed workers try the next file
  ```
- Atomic claim code sample:
  ```typescript
  // Atomic claim - only one succeeds
  try {
    await rename(
      '/var/lib/queue/queue/000000000001-job123.msg',
      '/var/lib/queue/processing/worker-1/job123.msg'
    )
    // Success - this worker got the job
  } catch {
    // Another worker claimed it, try next file
  }
  ```
- Leader election (informative but not needed for the-queen): "Implements file-based leader election for cleanup coordination. Only one FileStorage instance performs TTL cleanup to avoid duplicate work. ... Lock renewal: Leader renews every 3 seconds (TTL is 10 seconds). Automatic failover: If leader crashes, lock expires and follower takes over."

## Annotations for stinger-forge
- `guides/01-pick-and-lock.md` should cite this source as the canonical proof that the move-before-work pattern is correct, language-independent, and production-tested. Platformatic uses `rename()`; the-queen uses markdown edits (delete row from queue.md, append to in-process.md). The semantics are the same: one entity at a time, atomic transition.
- The subfolder mapping is the same conceptual model the-queen uses, but the-queen uses FILES instead of folders: `queue.md` is the `queue/` folder, `in-process.md` is the `processing/` folder, `completed.md` is `jobs/` + `results/` combined. `guides/00-principles.md` can present this as an explicit table mapping Platformatic concepts to the-queen concepts.
- Crucial difference: Platformatic uses one file per job; the-queen uses one row per Bee. The atomicity guarantee is weaker in the-queen (markdown editing is not atomic in the OS sense), but the practical safety is equivalent because:
  1. Only ONE invocation of the-queen should run at a time (the Command Brief's "process exactly ONE queue entry per invocation" rule).
  2. The in-process.md file's single-line lock (the Command Brief's "Refuse to start a new cycle if proposed-bees-in-process.md already contains a row") provides the lock semantics.
  3. The user-in-the-loop between cycles is the human-level concurrency control.
- The Leader Election section is NOT applicable to the-queen because there is only one the-queen role and no automatic failover semantics. Don't cite it as relevant prior art.
- `guides/10-failure-modes.md` should include "Two the-queen invocations race on the same queue row" as a failure mode with the recovery: "Both will see the same top row. The first to delete it from queue.md wins. The second's append to in-process.md will succeed and produce a duplicate row, which is the trigger for the 'in-process non-empty' refusal on the next cycle. Manual cleanup required: delete the duplicate in-process row, restart the cycle for the queue entry that didn't actually start work."
