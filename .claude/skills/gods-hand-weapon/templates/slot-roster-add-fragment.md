# Template: Slot Roster-Add Fragment

**File:** `ai-tools/.batch-state/slot-NN-roster-add.md`

**Purpose:** Contains exactly the table row god-registrar would have written to `ai-tools/skills/god/SKILL.md`. The orchestrator appends this to the roster table after all slots in the batch complete.

---

## Format

The file contains a single markdown table row with three pipe-delimited columns, no leading/trailing blank lines:

```
| <guardian-name> | <one-line purpose (≤120 chars)> | <trigger phrase 1>; <trigger phrase 2>; <trigger phrase 3> |
```

### Column definitions

1. **guardian-name** — the kebab-case Angel name (e.g. `nextjs-guardian`). Must match the `name:` frontmatter field in the Angel file.
2. **purpose** — one sentence distilled from the backlog's `**Purpose:**` line. Keep under 120 characters. No trailing period.
3. **trigger phrases** — 2-4 semicolon-separated phrases the user would say to invoke this Angel. Derived from the backlog Purpose + the Command Brief's trigger-phrase section.

### Example (nextjs-guardian)

```
| nextjs-guardian | Next.js 15+ App Router authority — Server Components, Route Handlers, PPR, caching, deploy targets | "review Next.js code"; "Next.js App Router"; "upgrade to Next.js 15"; "Server Components architecture" |
```

---

## How the orchestrator uses this file

After all slots in a batch have written `.done` signals, the orchestrator:

1. Loads `ai-tools/skills/god/SKILL.md`.
2. Finds the roster table (the `## Roster` section or equivalent).
3. Appends the content of `slot-NN-roster-add.md` as the last row of the table.
4. Invokes the `god-registrar` skill for god-guide authorship (the guide file at `ai-tools/skills/god/guides/<guardian-name>.md` must also be created — god-registrar does this step, not the slot agent).

**Note:** The slot agent writes this fragment; god-registrar reads it during the serial phase and handles the `god/guides/` file. They are complementary, not redundant.
