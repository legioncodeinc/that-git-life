# Template: Slot Roster-Add Fragment

**File:** `ai-tools/.batch-state/slot-NN-roster-add.md`

**Purpose:** Contains exactly the table row hive-registrar would have written to `ai-tools/skills/beekeeper-suit/SKILL.md`. The orchestrator appends this to the roster table after all slots in the batch complete.

---

## Format

The file contains a single markdown table row with three pipe-delimited columns, no leading/trailing blank lines:

```
| <worker-bee-name> | <one-line purpose (≤120 chars)> | <trigger phrase 1>; <trigger phrase 2>; <trigger phrase 3> |
```

### Column definitions

1. **worker-bee-name** — the kebab-case Bee name (e.g. `nextjs-worker-bee`). Must match the `name:` frontmatter field in the Bee file.
2. **purpose** — one sentence distilled from the backlog's `**Purpose:**` line. Keep under 120 characters. No trailing period.
3. **trigger phrases** — 2-4 semicolon-separated phrases the user would say to invoke this Bee. Derived from the backlog Purpose + the Command Brief's trigger-phrase section.

### Example (nextjs-worker-bee)

```
| nextjs-worker-bee | Next.js 15+ App Router authority — Server Components, Route Handlers, PPR, caching, deploy targets | "review Next.js code"; "Next.js App Router"; "upgrade to Next.js 15"; "Server Components architecture" |
```

---

## How the orchestrator uses this file

After all slots in a batch have written `.done` signals, the orchestrator:

1. Loads `ai-tools/skills/beekeeper-suit/SKILL.md`.
2. Finds the roster table (the `## Roster` section or equivalent).
3. Appends the content of `slot-NN-roster-add.md` as the last row of the table.
4. Invokes the `hive-registrar` skill for beekeeper-suit-guide authorship (the guide file at `ai-tools/skills/beekeeper-suit/guides/<worker-bee-name>.md` must also be created — hive-registrar does this step, not the slot agent).

**Note:** The slot agent writes this fragment; hive-registrar reads it during the serial phase and handles the `beekeeper-suit/guides/` file. They are complementary, not redundant.
