# 06 - Phase 2: stinger-forge

Step 7 of the Command Brief's ACTION list. After the Command Brief is written and the research folder is fully populated, invoke the `stinger-forge` skill to author the stinger's `SKILL.md` plus its supporting guides, examples, templates, and reports.

## What `stinger-forge` does

`stinger-forge` is the Phase 2 worker skill. It is documented at:

- `ai-tools/skills/stinger-forge/SKILL.md` (repo-local copy)
- `~/.cursor/skills-cursor/stinger-forge/SKILL.md` (global Cursor skills cache)

The skill takes a Command Brief and a populated `research/` folder, names the Stinger (already named by `command-center`, just verified), and authors the rest of the stinger folder:

- `SKILL.md` at the stinger root with YAML frontmatter and the master-index body.
- `guides/00-...` through `guides/NN-...` as numbered procedure files, one per major verb in the brief's ACTION section.
- `examples/` with at least one happy-path and one edge-case worked example.
- `templates/` with reusable stubs the Bee will fill in.
- `reports/README.md` and any pre-baked report shapes.

The skill is intentionally bounded: it does NOT touch the `research/` folder (that is `scripture-historian`'s territory) and it does NOT touch the Bee file (that is `bee-creator`'s).

## Inputs `the-queen` passes to `stinger-forge`

`stinger-forge` reads from disk; `the-queen` just needs to tell it WHERE to read. Pass:

- The Bee name.
- The Stinger name.
- The Command Brief path: `ai-tools/command-briefs/<worker-bee-name>-command-brief.md`.
- The Stinger folder path: `ai-tools/skills/<stinger-name>/`.

The skill discovers the research folder automatically as a subdirectory of the stinger folder. It MUST refuse to proceed if `research/` is empty -- the older version of `stinger-forge` (pre-scripture-historian) would conduct its own research; the current version requires `scripture-historian`'s output to exist.

## Expected output

After `stinger-forge` completes, the following MUST exist:

```
ai-tools/skills/<stinger-name>/SKILL.md
ai-tools/skills/<stinger-name>/README.md
ai-tools/skills/<stinger-name>/guides/00-principles.md (or similar)
ai-tools/skills/<stinger-name>/guides/[remaining numbered guides]
ai-tools/skills/<stinger-name>/examples/[at least one]
ai-tools/skills/<stinger-name>/templates/[any templates the brief proposed]
ai-tools/skills/<stinger-name>/reports/README.md
```

`the-queen` verifies:

1. `SKILL.md` exists, is non-empty, and has a YAML frontmatter with `name` and `description` fields.
2. `SKILL.md` is under approximately 500 lines (Cursor's recommendation for skill files; over-stuffing degrades triggering reliability).
3. At least one file exists in `guides/`.
4. At least one file exists in `examples/`.
5. The `research/` folder is untouched (no new files written there by `stinger-forge`; that would be a contract violation).

If any check fails, STOP and route to `guides/10-failure-modes.md` under "stinger-forge failed."

## Why the order matters

`stinger-forge` reads:

1. The Command Brief (for ACTION, EXPECTED OUTPUT, SUBAGENT CRITICAL DIRECTIVES).
2. The research folder's `research-summary.md` (for the executive summary of available sources).
3. The research folder's `index.md` (for the manifest of which source informs which guide).
4. Individual source files in `research/internal/` and `research/external/` (read on demand as guides are written).

If `stinger-forge` ran before `scripture-historian`, it would have nothing to read in steps 2-4. The phase order is non-negotiable.

## Failure modes specific to this phase

- **`SKILL.md` exceeds 500 lines.** Cursor's progressive-disclosure pattern requires moving detail into `guides/`. Either the brief had too much in IDEAS / SUGGESTIONS, or the skill author over-inlined. Flag in the final report but do NOT block close-out; the over-long SKILL.md still works, just sub-optimally.
- **No examples written.** Examples are part of the skill specification. Flag in the final report and recommend a follow-up pass.
- **Research folder was modified.** This is a contract violation. STOP and surface; the research-vs-skill separation is load-bearing for the audit trail.
- **Guides reference files that do not exist** (e.g., a guide cites `templates/foo.md` but `templates/foo.md` was never written). Flag in the final report; broken internal references degrade Bee performance.

## Implementation note for `the-queen`

Like Phase 1, "invoking" `stinger-forge` from `the-queen` typically means a skill load:

1. Read `ai-tools/skills/stinger-forge/SKILL.md`.
2. Follow its instructions to author the stinger's files.
3. Verify the expected-output list.

The full stinger-authoring logic is in `stinger-forge`'s skill content, not duplicated here. This guide's role is to specify the contract at the boundary: what `the-queen` hands in, what `the-queen` verifies coming out.
