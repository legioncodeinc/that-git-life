---
source_url: https://github.com/rstudio/filequeue/blob/main/filequeue.go
retrieved_on: 2026-05-20
source_type: github-readme
authority: practitioner
relevance: high
topic: file-queue-atomic-move
stinger: the-queen-stinger
---

# rstudio/filequeue (Go implementation of FIFO file queue)

## Summary
A 7-star Go library implementing a concurrent-safe FIFO file queue. The implementation is ~50 lines of Go and is one of the cleanest known illustrations of the atomic-rename-as-claim pattern. Push writes a timestamped file; Pop sorts by name and uses `os.Rename` with a random suffix to atomically claim an item. Cross-validates Platformatic's pattern in a different language with a much smaller surface area. Useful as a "minimum viable implementation" reference for the-queen's mental model.

## Key quotations / statistics

- Type definition: "type Queue interface { Len() (int, error); Pop() ([]byte, error); Push([]byte) error }"
- Underlying type: "type FileQueue struct { baseDir string }" -- a single directory, FIFO ordering via filename timestamps.
- Push semantics: "// Push writes the item bytes to a timestamped file, returning any error from os.WriteFile. func (fq *FileQueue) Push(b []byte) error { fullPath := filepath.Join(fq.baseDir, fmt.Sprintf('%v.item', time.Now().UnixNano())); return os.WriteFile(fullPath, b, 0644) }"
- Pop semantics (load-bearing): 
  ```go
  // Pop returns the least-recently added item, if available.
  // ...
  // If an item is popped, presumably by another consumer, before it may be read, 
  // then the next available item known at the time the item list was built will be tried.
  for _, loopItem := range items {
      fullPath := filepath.Join(fq.baseDir, item)
      tmpPath := fmt.Sprintf("%s.pop-%v", fullPath, rand.Float64())
      if err := os.Rename(fullPath, tmpPath); err != nil {
          continue  // someone else claimed it
      }
      itemBytes, err := os.ReadFile(tmpPath)
      // ...
      return itemBytes, nil
  }
  ```
- Listing: "func (fq *FileQueue) listItemsSorted() ([]string, error) { ... sort.Strings(items); return items, nil }" -- FIFO is enforced by sorting filenames lexicographically (timestamps are ordered).
- README claim: "Golang concurrent-safe FIFO queue backed with files | 7 stars | Go."

## Annotations for stinger-forge
- This source is the simplest illustration of the move-before-work invariant: `os.Rename` is the atomic claim, and if Rename fails (because another process beat you to it), you try the next file. `guides/01-pick-and-lock.md` should cite this as the minimal example, with a footnote that the-queen achieves the same semantic via "delete row N from queue.md AND append row N to in-process.md as a single agent-level operation" rather than via OS rename.
- The "sort.Strings" FIFO ordering is the same mechanism the-queen uses: the queue.md rows are sorted by NNN (zero-padded), so reading the FIRST row is the lowest NNN, which is the oldest entry. Document this in `guides/01-pick-and-lock.md`.
- Worth noting that filename-based FIFO requires zero-padded sortable keys, which is why the queue's `row_format: "NNN|worker-bee-name (3-digit zero-padded id, ...)"` mandates zero-padding. Lexicographic sort over `001`, `010`, `100` works; over `1`, `10`, `100` it would re-order `1, 10, 100` to `1, 10, 100` correctly but it would put `1, 2, ..., 9, 10, 11, ...` as `1, 10, 11, ..., 2, 20, ..., 3, ...` which is wrong. The zero-padding is load-bearing for FIFO.
- This source has zero contradictions with the Command Brief. It is a smaller-scale confirmation of the Platformatic pattern.
- Lower relevance than Platformatic only because the implementation is smaller and less battle-tested (7 stars). Cite both: Platformatic for production rigor, rstudio/filequeue for conceptual clarity.
