# Template: Slot Backlog-Flip Fragment

**File:** `ai-tools/.batch-state/slot-NN-backlog-flip.md`

**Purpose:** Contains the exact SEARCH/REPLACE pair the orchestrator applies to `ai-tools/proposed-angels-backlog.md` to flip the entry's checkbox from `[ ]` to `[x]`.

---

## Format

The file contains exactly two lines:

```
SEARCH:### [ ] N. guardian-name
REPLACE:### [x] N. guardian-name
```

Where `N` is the **unpadded** position number (as it appears in the backlog heading — the backlog uses `1.` not `001.`), and `guardian-name` is the kebab-case Angel name.

### Example (nextjs-guardian, position 1)

```
SEARCH:### [ ] 1. nextjs-guardian
REPLACE:### [x] 1. nextjs-guardian
```

### Example (api-builder-guardian, position 12)

```
SEARCH:### [ ] 12. api-builder-guardian
REPLACE:### [x] 12. api-builder-guardian
```

---

## How the orchestrator uses this file

After all slots in a batch have written `.done` signals, the orchestrator:

1. Reads each `slot-NN-backlog-flip.md` for successful slots.
2. For each file, extracts the SEARCH line (after the `SEARCH:` prefix) and the REPLACE line (after the `REPLACE:` prefix).
3. Applies a `StrReplace` on `ai-tools/proposed-angels-backlog.md` with that exact pair.

The SEARCH string must be unique in the backlog (it is — each heading appears exactly once). This guarantees idempotent, race-free application.

---

## Important note on NNN vs N

The queue file uses zero-padded 3-digit NNN (e.g. `001`). The backlog file uses unpadded N in headings (e.g. `1.`). The SEARCH/REPLACE in this fragment must use the **unpadded backlog form**, not the zero-padded queue form.
