# 06 - Phase 2: weapon-forge

Step 7 of the Command Brief's ACTION list. After the Command Brief is written and the research folder is fully populated, invoke the `weapon-forge` skill to author the weapon's `SKILL.md` plus its supporting guides, examples, templates, and reports.

## What `weapon-forge` does

`weapon-forge` is the Phase 2 worker skill. It is documented at:

- `ai-tools/skills/weapon-forge/SKILL.md` (repo-local copy)
- `~/.cursor/skills-cursor/weapon-forge/SKILL.md` (global Cursor skills cache)

The skill takes a Command Brief and a populated `research/` folder, names the Weapon (already named by `command-center`, just verified), and authors the rest of the weapon folder:

- `SKILL.md` at the weapon root with YAML frontmatter and the master-index body.
- `guides/00-...` through `guides/NN-...` as numbered procedure files, one per major verb in the brief's ACTION section.
- `examples/` with at least one happy-path and one edge-case worked example.
- `templates/` with reusable stubs the Angel will fill in.
- `reports/README.md` and any pre-baked report shapes.

The skill is intentionally bounded: it does NOT touch the `research/` folder (that is `scripture-historian`'s territory) and it does NOT touch the Angel file (that is `angel-creator`'s).

## Inputs `gods-hand` passes to `weapon-forge`

`weapon-forge` reads from disk; `gods-hand` just needs to tell it WHERE to read. Pass:

- The Angel name.
- The Weapon name.
- The Command Brief path: `ai-tools/command-briefs/<guardian-name>-command-brief.md`.
- The Weapon folder path: `ai-tools/skills/<weapon-name>/`.

The skill discovers the research folder automatically as a subdirectory of the weapon folder. It MUST refuse to proceed if `research/` is empty -- the older version of `weapon-forge` (pre-scripture-historian) would conduct its own research; the current version requires `scripture-historian`'s output to exist.

## Expected output

After `weapon-forge` completes, the following MUST exist:

```
ai-tools/skills/<weapon-name>/SKILL.md
ai-tools/skills/<weapon-name>/README.md
ai-tools/skills/<weapon-name>/guides/00-principles.md (or similar)
ai-tools/skills/<weapon-name>/guides/[remaining numbered guides]
ai-tools/skills/<weapon-name>/examples/[at least one]
ai-tools/skills/<weapon-name>/templates/[any templates the brief proposed]
ai-tools/skills/<weapon-name>/reports/README.md
```

`gods-hand` verifies:

1. `SKILL.md` exists, is non-empty, and has a YAML frontmatter with `name` and `description` fields.
2. `SKILL.md` is under approximately 500 lines (Cursor's recommendation for skill files; over-stuffing degrades triggering reliability).
3. At least one file exists in `guides/`.
4. At least one file exists in `examples/`.
5. The `research/` folder is untouched (no new files written there by `weapon-forge`; that would be a contract violation).

If any check fails, STOP and route to `guides/10-failure-modes.md` under "weapon-forge failed."

## Why the order matters

`weapon-forge` reads:

1. The Command Brief (for ACTION, EXPECTED OUTPUT, SUBAGENT CRITICAL DIRECTIVES).
2. The research folder's `research-summary.md` (for the executive summary of available sources).
3. The research folder's `index.md` (for the manifest of which source informs which guide).
4. Individual source files in `research/internal/` and `research/external/` (read on demand as guides are written).

If `weapon-forge` ran before `scripture-historian`, it would have nothing to read in steps 2-4. The phase order is non-negotiable.

## Failure modes specific to this phase

- **`SKILL.md` exceeds 500 lines.** Cursor's progressive-disclosure pattern requires moving detail into `guides/`. Either the brief had too much in IDEAS / SUGGESTIONS, or the skill author over-inlined. Flag in the final report but do NOT block close-out; the over-long SKILL.md still works, just sub-optimally.
- **No examples written.** Examples are part of the skill specification. Flag in the final report and recommend a follow-up pass.
- **Research folder was modified.** This is a contract violation. STOP and surface; the research-vs-skill separation is load-bearing for the audit trail.
- **Guides reference files that do not exist** (e.g., a guide cites `templates/foo.md` but `templates/foo.md` was never written). Flag in the final report; broken internal references degrade Angel performance.

## Implementation note for `gods-hand`

Like Phase 1, "invoking" `weapon-forge` from `gods-hand` typically means a skill load:

1. Read `ai-tools/skills/weapon-forge/SKILL.md`.
2. Follow its instructions to author the weapon's files.
3. Verify the expected-output list.

The full weapon-authoring logic is in `weapon-forge`'s skill content, not duplicated here. This guide's role is to specify the contract at the boundary: what `gods-hand` hands in, what `gods-hand` verifies coming out.
