# Guide 12 — Slot Mode (Parallel Batch Execution)

## Purpose

Slot mode lets the orchestrator run multiple gods-hand instances in parallel, each owning exactly one queue row, without any write races on the shared tracking files.

It is activated when the orchestrator passes `slot=NN` (two-digit zero-padded) in the invocation prompt. Default behavior (no slot) is unchanged.

---

## Preconditions (orchestrator's responsibility before spawning slots)

Before spawning any slot, the orchestrator must:

1. Dequeue the row from `proposed-angels-queue.md` (delete the line, decrement `totals.rows`, bump `date_updated`, set `last_updated_by = gods-hand-orchestrator`).
2. Write `ai-tools/proposed-angels-in-process-slot-NN.md` containing exactly one line: `NNN|guardian-name`.
3. Ensure `ai-tools/.batch-state/` exists (create if absent).

These steps are performed atomically for all N slots in the batch before any slot is launched.

---

## Slot agent protocol (11 steps)

When invoked with `slot=NN`:

### Step 1 — Read slot file
Read `ai-tools/proposed-angels-in-process-slot-NN.md`. Parse the single line `NNN|guardian-name`. This is the assigned row.

### Step 2 — Look up backlog metadata
Find `### [ ] NNN. guardian-name` in `proposed-angels-backlog.md` (note the backlog uses unpadded N, not zero-padded NNN). Capture the four metadata lines (Research Depth, Research Model, Analyst Model, Builder Model), the Purpose sentence, and the search queries. See `guides/02-backlog-lookup.md` for full protocol. Validate per the four sanity checks there.

### Step 3 — Phase 1: command-center
Load and run `command-center` skill. Author `ai-tools/command-briefs/<guardian-name>-command-brief.md`. Verify it exists and is non-empty. On failure: write `slot-NN.failed` with `failed:command-center`, preserve slot file, stop.

### Step 4 — Scaffold weapon folder
Create `ai-tools/skills/<weapon-name>/` with the five canonical subfolders: `examples/`, `guides/`, `reports/`, `research/`, `templates/`. Derive the weapon name per `guides/03-naming-contracts.md`. On naming conflict: write `slot-NN.failed` with `failed:naming-conflict`, stop.

### Step 5 — Phase 1.5: scripture-historian
Dispatch via `Task(subagent_type="scripture-historian", ...)`. Wait for handoff. Verify `research/` is populated. On failure: write `slot-NN.failed` with `failed:scripture-historian`, preserve slot file, stop.

### Step 6 — Phase 2: weapon-forge
Load and run `weapon-forge` skill. Verify `SKILL.md` exists and all subfolders have at least one file. On failure: write `slot-NN.failed` with `failed:weapon-forge`, stop.

### Step 7 — Phase 3: angel-creator
Load and run `angel-creator` skill. Verify `ai-tools/agents/<guardian-name>.md` exists with valid frontmatter. On failure: write `slot-NN.failed` with `failed:angel-creator`, stop.

### Step 8 — Write fragment files
Write all three fragments to `ai-tools/.batch-state/`:

**`slot-NN-roster-add.md`** — one complete table row for `ai-tools/skills/god/SKILL.md`. Use the exact format from `templates/slot-roster-add-fragment.md`:
```
| <guardian-name> | <one-line purpose> | <trigger phrase 1>; <trigger phrase 2> |
```

**`slot-NN-backlog-flip.md`** — two lines:
```
SEARCH:### [ ] NNN. guardian-name
REPLACE:### [x] NNN. guardian-name
```
(Use the actual NNN and guardian-name, zero-padded for SEARCH to match the backlog format. Note: backlog uses unpadded N in the heading, so use unpadded N in both SEARCH and REPLACE.)

**`slot-NN-completion.md`** — one line per `templates/completed-row.md`:
```
NNN|guardian-name|completed|YYYY-MM-DD|research:<research-model>|analyst:<analyst-model>|builder:<builder-model>
```

### Step 9 — Verify all five artifacts
Before closing out, verify all five durable artifacts exist on disk:
1. `ai-tools/command-briefs/<guardian-name>-command-brief.md`
2. `ai-tools/skills/<weapon-name>/SKILL.md`
3. `ai-tools/agents/<guardian-name>.md`
4. `ai-tools/.batch-state/slot-NN-roster-add.md`
5. `ai-tools/.batch-state/slot-NN-completion.md`

If any is missing, write `slot-NN.failed` with `failed:artifact-verification`, preserve slot file, stop.

### Step 10 — Delete slot file and write done signal
Delete `ai-tools/proposed-angels-in-process-slot-NN.md`. Write `ai-tools/.batch-state/slot-NN.done` with a single line: `NNN|guardian-name|completed|YYYY-MM-DD`.

### Step 11 — Emit slot summary and stop
Emit a brief markdown summary: slot number, row processed, phases completed, artifacts written, wall-clock time estimate, any warnings. End with the canonical stop line:

```
gods-hand slot-NN stopped. Awaiting orchestrator consolidation.
```

---

## Orchestrator protocol (post-slot)

After all slots in a batch have written `.done` or `.failed` signals:

1. **Serial god-registrar**: For each successful slot (has `.done`), read `slot-NN-roster-add.md` and invoke `god-registrar` once. The fragment file contains exactly the text god-registrar would produce. god-registrar writes it to `ai-tools/skills/god/SKILL.md` and creates `ai-tools/skills/god/guides/<guardian-name>.md`.

2. **Append to completed log**: Read all `slot-NN-completion.md` fragments from successful slots. Append them to `ai-tools/proposed-angels-completed.md` in one write.

3. **Flip backlog checkboxes**: Read each `slot-NN-backlog-flip.md` fragment. Apply each SEARCH→REPLACE pair to `proposed-angels-backlog.md`.

4. **Clean up**: Delete all `slot-NN.*` files and the batch's `.batch-state/` contents. (If all 231 are done, delete `.batch-state/` entirely.)

5. **Surface failures**: For any slot with a `.failed` signal, log the row and failed phase. Do NOT append to completed or flip the checkbox. The row remains available for a manual re-run via a standard (non-slot) gods-hand invocation pointed at the preserved slot file.

---

## Failure recovery

| Failure | Recovery |
|---|---|
| `.failed` file present, slot file preserved | Manually re-run: `gods-hand slot=NN` pointing at the existing slot file, or convert to standard gods-hand run |
| Fragment files written but `.done` missing | Re-run the slot; idempotent writes to per-Angel artifact paths |
| god-registrar fails during serial phase | Retry just the god-registrar call for that slot's roster-add fragment |
| Orchestrator crashed mid-batch | Read which `.done` files exist; re-run missing slots; then re-apply orchestrator consolidation steps |

---

## File naming conventions

- Slot files: `ai-tools/proposed-angels-in-process-slot-01.md` through `slot-99.md`
- Fragment dir: `ai-tools/.batch-state/`
- Fragments: `slot-NN-roster-add.md`, `slot-NN-backlog-flip.md`, `slot-NN-completion.md`
- Signals: `slot-NN.done`, `slot-NN.failed`

The `.batch-state/` directory is transient. It does not persist between batches. The orchestrator deletes it after consolidation.
