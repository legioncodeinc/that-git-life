# 08 - Phase 4: hive-registrar

Step 9 of the Command Brief's ACTION list. After the Bee file is written, invoke the `hive-registrar` skill to register the Bee with beekeeper-suit's roster.

## What `hive-registrar` does

`hive-registrar` is the Phase 4 (final pipeline phase) worker skill. It is documented at:

- `ai-tools/skills/hive-registrar/SKILL.md` (repo-local copy)
- `~/.cursor/skills-cursor/hive-registrar/SKILL.md` (global Cursor skills cache)

The skill performs exactly two atomic operations:

1. **Add a roster row** to the Roster table in `ai-tools/skills/beekeeper-suit/SKILL.md`. The row contains the Bee name, a one-line domain summary, trigger keywords, and a link to the new Bee's guide.
2. **Author a guide file** at `ai-tools/skills/beekeeper-suit/guides/<worker-bee-name>.md` from the template `ai-tools/skills/beekeeper-suit/templates/guide-template.md`. The guide is the orchestrator's reference for when to invoke the Bee.

After Phase 4, the new Bee is discoverable. The primary Cursor orchestrator can route to it by reading beekeeper-suit's roster.

## Inputs `the-queen` passes to `hive-registrar`

`hive-registrar` reads from disk; `the-queen` tells it where:

- The Bee name.
- The Stinger name.
- The Command Brief path: `ai-tools/command-briefs/<worker-bee-name>-command-brief.md`.
- The Bee file path: `ai-tools/agents/<worker-bee-name>.md`.
- The Stinger folder path: `ai-tools/skills/<stinger-name>/`.

The skill discovers everything else by reading these inputs.

## Expected output

After `hive-registrar` completes, the following MUST exist:

1. A new row in the Roster table in `ai-tools/skills/beekeeper-suit/SKILL.md`. The row appears in alphabetical-by-Bee-name order or appended to the bottom of the table (per `hive-registrar`'s own convention; check the skill's SKILL.md for the rule).
2. A new file at `ai-tools/skills/beekeeper-suit/guides/<worker-bee-name>.md` populated from the template.

`the-queen` verifies:

1. Search `ai-tools/skills/beekeeper-suit/SKILL.md` for the new Bee's name. There should be exactly one match (the new roster row).
2. Verify `ai-tools/skills/beekeeper-suit/guides/<worker-bee-name>.md` exists and is non-empty.
3. The guide file has all six standard sections from the template (Domain, Trigger phrases, Do NOT route when, Inputs the Bee needs, Outputs the Bee produces, Multi-Bee sequences this Bee participates in, Critical directives the orchestrator should respect).
4. The beekeeper-suit SKILL.md's "N Bees registered" count (in the footnote below the table) is incremented by 1.

If any check fails, STOP and route to `guides/10-failure-modes.md` under "hive-registrar failed."

## Roster row authoring rules

The roster table in `beekeeper-suit/SKILL.md` has four columns:

| Column | Content |
|---|---|
| Bee | The `name:` frontmatter value of the Bee, in backticks, e.g. `` `nextjs-worker-bee` `` |
| Domain | One sentence summarizing the Bee's scope. Distilled from the Command Brief's IDENTITY & RESPONSIBILITY. |
| Trigger keywords | A semicolon-separated list of trigger phrases, each in double quotes, e.g. `"build a website", "scaffold a Next.js site"` |
| Guide | A markdown link to the guide file, e.g. `[guides/nextjs-worker-bee.md](guides/nextjs-worker-bee.md)` |

`hive-registrar` authors this row from the Command Brief and the Bee file's `description` frontmatter field.

## beekeeper-suit-side guide file authoring rules

The guide is authored from `ai-tools/skills/beekeeper-suit/templates/guide-template.md`. The template has placeholders that `hive-registrar` substitutes:

- `{{Bee Display Name}}` -- the H1 display name from the Bee file.
- `{{bee-name}}` -- the kebab-case Bee name.
- `{{stinger-name}}` -- the kebab-case Stinger name.
- `{{proactive | on-demand}}` -- the trigger policy from the Bee file's frontmatter.
- The Domain paragraph -- distilled from IDENTITY & RESPONSIBILITY (3-5 sentences).
- The Trigger phrases bullet list -- 3 to 7 phrases the user might say to invoke the Bee.
- The Do NOT route when section -- 2 to 4 anti-trigger phrases or competing Bees.
- The Inputs / Outputs / Multi-Bee sequences / Critical directives sections -- lifted from the Command Brief and Bee file.

## Failure modes specific to this phase

- **Roster row appears twice.** Indicates a partial prior run wrote one row and the current run wrote another. Manual cleanup; remove the older one.
- **Guide file already exists.** Same diagnosis. Either the prior run partially completed, or there is a genuine name collision (which `guides/03-naming-contracts.md` should have caught). Surface for the caller.
- **The Roster table's "N Bees registered" count is wrong.** Minor footnote error. Flag in the final report; manual fix is a one-line edit.

## Why this phase runs last

`hive-registrar` makes the Bee discoverable by the orchestrator. Before this phase, the Bee exists on disk but nothing routes to it. Once this phase completes, the next user request that matches the Bee's domain will trigger it.

The pipeline ends here. `the-queen`'s remaining work is administrative (close-out, report), not Bee-forging.

## Implementation note for `the-queen`

Like the prior phases, Phase 4 is a skill load. `the-queen` reads `ai-tools/skills/hive-registrar/SKILL.md` and follows its instructions to add the roster row and author the guide.
