---
source_url: https://gist.github.com/pwillis-els/b01b22f1b967a228c31db3cf2789ee13
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: three-stage-lifecycle
stinger: the-queen-stinger
---

# Simple Atomic File Locking in Linux (Maildir pattern)

## Summary
The Maildir three-directory pattern (tmp / new / cur) is the closest classical analog to the-queen's three-file pattern (queue / in-process / completed). This gist explains the qmail-derived approach: a file is born in tmp, moved to new as a hard link, then claimed into cur by another atomic hard link. The pattern works across NFS, survives crashes, and has been production-validated for ~30 years in mail servers. Older than the rest of the queue references (2021) but still authoritative because Maildir is the canonical spec.

## Key quotations / statistics

- Three-directory definition: "There are three directories: tmp, new, cur."
- Step 1 (creation): "A process 123 creates a new file A in directory tmp. A is a file name which should be unique. Only process 123 knows that this file exists. Once the process is done writing to the file, the process moves to step 2."
- Step 2 (publish to new): "Process 123 creates a hard link from tmp/A into new/A, and then removes tmp/A. At this point it is expected that some other process may now 'do something' with the file in the new directory, typically reading the file."
- Step 3 (claim into cur): "A new process 456 creates a hard link of new/A into cur/A. `link()` is an atomic operation, even over NFS, so we can be sure that the operation will fail if another process already successfully `link()`ed the file. If the operation succeeds, we can be sure that our process 456 has exclusive control of this file now. (Note: `rename()` is not atomic over NFS, which is why we use `link()`)"
- Cleanup: "At this point the 456 process can safely remove new/A if it wants that file to no longer be processed by new processes. Even if another process had already seen new/A and began to lock it, it would fail due to cur/A already existing."
- Summary line: "Using this method you can implement an atomic locking queue by linking files."
- Stale-lock guidance: "To deal with the first two problems, Maildir format suggests a naming convention to include unique information such as the PID of a process, a timestamp, and potentially a random identifier. This prevents conflicting files from causing bugs, and allows a separate process to clean up stale files."

## Annotations for stinger-forge
- The three-stage Maildir lifecycle (tmp -> new -> cur) is structurally identical to the-queen's three-stage lifecycle (queue -> in-process -> completed). Document this mapping in `guides/00-principles.md`:
  - Maildir `tmp/` -> nothing direct (the-queen doesn't have a "draft" stage; the row is born in `queue.md` by the proposal step).
  - Maildir `new/` -> `proposed-bees-queue.md` (visible to all, claimable by any consumer).
  - Maildir `cur/` -> `proposed-bees-in-process.md` (exclusively owned by one consumer at a time).
  - Maildir delete-after-cur (no equivalent dir, file is in cur) -> `proposed-bees-completed.md` (archive after work is done).
- The NFS caveat (link is atomic, rename is not) does NOT apply to the-queen because the queue files live in a single working directory on a local filesystem and the move semantics are at the agent layer (markdown editing), not at the OS layer. Document this difference in `guides/00-principles.md` so the user doesn't expect Maildir-grade NFS guarantees.
- The stale-lock recovery guidance maps directly to the-queen's "Refuse to start a new cycle if proposed-bees-in-process.md already contains a row" rule. The in-process row IS a potential stale lock if a prior cycle crashed. `guides/10-failure-modes.md` should reference Maildir's stale-lock cleanup as prior art for the recovery procedure: examine the row, decide if work was completed (look for the artifacts on disk), then either move the row to completed.md manually or back to queue.md for a re-run.
- This source is from 2021 (older than the 6-month default window), included because Maildir is a generational spec that hasn't drifted and is the canonical reference for the pattern. The recency cap is not violated in spirit because Maildir's stability is the reason it's worth citing 25 years after the original spec.
