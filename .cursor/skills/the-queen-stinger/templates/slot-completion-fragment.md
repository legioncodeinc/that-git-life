# Template: Slot Completion Fragment

**File:** `ai-tools/.batch-state/slot-NN-completion.md`

**Purpose:** Contains the exact line the orchestrator appends to `ai-tools/proposed-bees-completed.md` to record the successful forging of this Bee.

---

## Format

The file contains exactly one line:

```
NNN|worker-bee-name|completed|YYYY-MM-DD|research:<research-model>|analyst:<analyst-model>|builder:<builder-model>
```

Where:
- `NNN` — zero-padded 3-digit position number (matches queue format)
- `worker-bee-name` — kebab-case Bee name
- `completed` — literal status marker
- `YYYY-MM-DD` — ISO date of completion
- `research:<model>` — the Research Model from the backlog metadata block
- `analyst:<model>` — the Analyst Model from the backlog metadata block
- `builder:<model>` — the Builder Model from the backlog metadata block

### Example (nextjs-worker-bee)

```
001|nextjs-worker-bee|completed|2026-05-20|research:grok-4.3|analyst:claude-opus-4-7-thinking-max|builder:claude-opus-4-7-thinking-max
```

### Example (terminal-bash-worker-bee)

```
018|terminal-bash-worker-bee|completed|2026-05-20|research:gemini-3.5-flash|analyst:claude-4.6-sonnet-medium-thinking|builder:gpt-5.3-codex-xhigh
```

---

## How the orchestrator uses this file

After all slots in a batch have written `.done` signals, the orchestrator:

1. Reads each `slot-NN-completion.md` for successful slots.
2. Collects all lines in batch-order (by slot number ascending).
3. Appends all collected lines to `ai-tools/proposed-bees-completed.md` in one write.

This batch-append avoids per-slot races on the shared completed log and ensures the log is always in a consistent state after each batch.

---

## Failure slots

Slots that write `.failed` instead of `.done` do NOT get a completion entry. Their row stays `[ ]` in the backlog and they are excluded from the append step. They can be re-run manually with a standard the-queen invocation.
