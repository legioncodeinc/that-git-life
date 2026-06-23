# 04 - Phase 1: command-center

Step 4 of the Command Brief's ACTION list. After the queue row is locked into `in-process` and the backlog metadata is captured, invoke the `command-center` skill to author the new Command Brief.

## What `command-center` does

`command-center` is the Phase 1 worker skill of the Legion AI Tools Factory. It is documented at:

- `ai-tools/skills/command-center/SKILL.md` (repo-local copy)
- `~/.cursor/skills-cursor/command-center/SKILL.md` (global Cursor skills cache)

The skill takes a worker-bee name and a stinger name, copies the repo-root template `command-brief-template.md` into `ai-tools/command-briefs/`, renames it to `<worker-bee-name>-command-brief.md`, populates the YAML frontmatter, and either conducts a conversational interview with the user (if invoked interactively) or pre-fills sections from a structured payload (if invoked by `the-queen`).

When `the-queen` is the caller, the brief MUST be authored from the backlog metadata without further user interaction. The Command Brief is then handed off to `scripture-historian` (Phase 1.5) for research.

## Inputs `the-queen` passes to `command-center`

The backlog lookup in `guides/02-backlog-lookup.md` produced these values. Pass them all to `command-center`:

| Input | Source |
|---|---|
| `worker-bee-name` | Queue row, e.g. `nextjs-worker-bee` |
| `stinger-name` | Derived per `guides/03-naming-contracts.md`, e.g. `nextjs-stinger` |
| `backlog_position` | `NNN` from the queue row (e.g. `001`) |
| `research_depth` | One of `shallow` / `normal` / `deep` / `extreme` |
| `research_model` | Model ID, e.g. `grok-4.3` |
| `analyst_model` | Model ID, e.g. `claude-opus-4-7-thinking-max` |
| `builder_model` | Model ID, e.g. `claude-opus-4-7-thinking-max` |
| `purpose` | The `**Purpose:**` sentence from the backlog entry |
| `search_queries` | The 5-7 quoted queries from the backlog entry |

These map directly to the Command Brief's YAML frontmatter fields. The Purpose sentence becomes the brief's H1 elevator pitch. The search queries are written into the brief's `REFERENCE MATERIAL` section as the seed reading list for `scripture-historian`.

## Expected output

After `command-center` completes, the following MUST exist on disk:

```
ai-tools/command-briefs/<worker-bee-name>-command-brief.md
```

The file must contain:

- YAML frontmatter with all eight fields populated (`angel_name`, `stinger_name`, `research_depth`, `research_model`, `analyst_model`, `builder_model`, `backlog_position`, `created`, `created_by: command-center`).
- An H1 heading `# <worker-bee-name> Command Brief`.
- A populated `## Bee (subagent)` half with IDENTITY & RESPONSIBILITY, EXPECTED INPUT, ACTION, EXPECTED OUTPUT, and SUBAGENT CRITICAL DIRECTIVES sections.
- A populated `## Stinger (skill)` half with REFERENCE MATERIAL, IDEAS / SUGGESTIONS / QUESTIONS, and NOTES sections.

`the-queen` verifies the file exists and is non-empty before proceeding to Phase 1.5. If the file is missing or is a stub (only frontmatter and template placeholders), STOP and surface the failure to the caller. Route to `guides/10-failure-modes.md` under "command-center did not produce a brief."

## Why this phase runs first

The Command Brief is the contract document. Every subsequent phase reads it:

- `scripture-historian` reads the brief to learn the domain context and to find the seed reading list.
- `stinger-forge` reads the brief to learn what guides to write and what the EXPECTED OUTPUT shape should be.
- `bee-creator` reads the brief to populate the Bee file's IDENTITY & RESPONSIBILITY, EXPECTED INPUT, ACTION, EXPECTED OUTPUT, and CRITICAL DIRECTIVES sections.
- `hive-registrar` reads the brief to populate the beekeeper-suit-side guide.

If the brief is missing or wrong, every later phase is built on sand. This is why `the-queen` runs the file-existence check before proceeding.

## Failure recovery

If `command-center` fails:

- The queue row is already in `in-process` (per the move-before-work invariant). Do NOT roll it back to the queue silently. Leave it in `in-process` with a status marker: append `|failed:command-center|YYYY-MM-DD` to the row line. The recovery procedure is documented in `guides/10-failure-modes.md`.
- The Command Brief may or may not exist on disk. If it exists as a stub, leave it; the human reviewer can complete it manually or delete it and re-run the cycle.
- Emit the final report (`guides/11-reporting.md`) with the partial state. Do NOT proceed to Phase 1.5.

## Implementation note for `the-queen`

In practice, when `the-queen` is itself a Cursor subagent, "invoking" `command-center` means one of two things:

1. **Skill load:** Read `ai-tools/skills/command-center/SKILL.md` and follow its instructions to write the Command Brief directly. This is the simpler path when `the-queen` and `command-center` share execution context.
2. **Subagent delegation via Task:** Call `Task(subagent_type="...", prompt="...")` if `command-center` is implemented as a subagent rather than a skill. Currently `command-center` is a skill, not a subagent, so option 1 is the canonical path.

The skill-vs-subagent distinction is documented in the research at `research/external/2026-05-20-cursor-subagents-docs.md` and `research/external/2026-05-20-cursor-skills-docs.md`. For Phase 1, use option 1.
