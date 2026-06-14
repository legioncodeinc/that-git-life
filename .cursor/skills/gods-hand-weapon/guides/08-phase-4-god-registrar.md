# 08 - Phase 4: god-registrar

Step 9 of the Command Brief's ACTION list. After the Angel file is written, invoke the `god-registrar` skill to register the Angel with God's roster.

## What `god-registrar` does

`god-registrar` is the Phase 4 (final pipeline phase) worker skill. It is documented at:

- `ai-tools/skills/god-registrar/SKILL.md` (repo-local copy)
- `~/.cursor/skills-cursor/god-registrar/SKILL.md` (global Cursor skills cache)

The skill performs exactly two atomic operations:

1. **Add a roster row** to the Roster table in `ai-tools/skills/god/SKILL.md`. The row contains the Angel name, a one-line domain summary, trigger keywords, and a link to the new Angel's guide.
2. **Author a guide file** at `ai-tools/skills/god/guides/<guardian-name>.md` from the template `ai-tools/skills/god/templates/guide-template.md`. The guide is the orchestrator's reference for when to invoke the Angel.

After Phase 4, the new Angel is discoverable. The primary Cursor orchestrator can route to it by reading God's roster.

## Inputs `gods-hand` passes to `god-registrar`

`god-registrar` reads from disk; `gods-hand` tells it where:

- The Angel name.
- The Weapon name.
- The Command Brief path: `ai-tools/command-briefs/<guardian-name>-command-brief.md`.
- The Angel file path: `ai-tools/agents/<guardian-name>.md`.
- The Weapon folder path: `ai-tools/skills/<weapon-name>/`.

The skill discovers everything else by reading these inputs.

## Expected output

After `god-registrar` completes, the following MUST exist:

1. A new row in the Roster table in `ai-tools/skills/god/SKILL.md`. The row appears in alphabetical-by-Angel-name order or appended to the bottom of the table (per `god-registrar`'s own convention; check the skill's SKILL.md for the rule).
2. A new file at `ai-tools/skills/god/guides/<guardian-name>.md` populated from the template.

`gods-hand` verifies:

1. Search `ai-tools/skills/god/SKILL.md` for the new Angel's name. There should be exactly one match (the new roster row).
2. Verify `ai-tools/skills/god/guides/<guardian-name>.md` exists and is non-empty.
3. The guide file has all six standard sections from the template (Domain, Trigger phrases, Do NOT route when, Inputs the Angel needs, Outputs the Angel produces, Multi-Angel sequences this Angel participates in, Critical directives the orchestrator should respect).
4. The God SKILL.md's "N Angels registered" count (in the footnote below the table) is incremented by 1.

If any check fails, STOP and route to `guides/10-failure-modes.md` under "god-registrar failed."

## Roster row authoring rules

The roster table in `god/SKILL.md` has four columns:

| Column | Content |
|---|---|
| Angel | The `name:` frontmatter value of the Angel, in backticks, e.g. `` `nextjs-guardian` `` |
| Domain | One sentence summarizing the Angel's scope. Distilled from the Command Brief's IDENTITY & RESPONSIBILITY. |
| Trigger keywords | A semicolon-separated list of trigger phrases, each in double quotes, e.g. `"build a website", "scaffold a Next.js site"` |
| Guide | A markdown link to the guide file, e.g. `[guides/nextjs-guardian.md](guides/nextjs-guardian.md)` |

`god-registrar` authors this row from the Command Brief and the Angel file's `description` frontmatter field.

## God-side guide file authoring rules

The guide is authored from `ai-tools/skills/god/templates/guide-template.md`. The template has placeholders that `god-registrar` substitutes:

- `{{Angel Display Name}}` -- the H1 display name from the Angel file.
- `{{angel-name}}` -- the kebab-case Angel name.
- `{{weapon-name}}` -- the kebab-case Weapon name.
- `{{proactive | on-demand}}` -- the trigger policy from the Angel file's frontmatter.
- The Domain paragraph -- distilled from IDENTITY & RESPONSIBILITY (3-5 sentences).
- The Trigger phrases bullet list -- 3 to 7 phrases the user might say to invoke the Angel.
- The Do NOT route when section -- 2 to 4 anti-trigger phrases or competing Angels.
- The Inputs / Outputs / Multi-Angel sequences / Critical directives sections -- lifted from the Command Brief and Angel file.

## Failure modes specific to this phase

- **Roster row appears twice.** Indicates a partial prior run wrote one row and the current run wrote another. Manual cleanup; remove the older one.
- **Guide file already exists.** Same diagnosis. Either the prior run partially completed, or there is a genuine name collision (which `guides/03-naming-contracts.md` should have caught). Surface for the caller.
- **The Roster table's "N Angels registered" count is wrong.** Minor footnote error. Flag in the final report; manual fix is a one-line edit.

## Why this phase runs last

`god-registrar` makes the Angel discoverable by the orchestrator. Before this phase, the Angel exists on disk but nothing routes to it. Once this phase completes, the next user request that matches the Angel's domain will trigger it.

The pipeline ends here. `gods-hand`'s remaining work is administrative (close-out, report), not Angel-forging.

## Implementation note for `gods-hand`

Like the prior phases, Phase 4 is a skill load. `gods-hand` reads `ai-tools/skills/god-registrar/SKILL.md` and follows its instructions to add the roster row and author the guide.
