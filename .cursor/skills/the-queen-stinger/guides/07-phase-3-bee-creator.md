# 07 - Phase 3: bee-creator

Step 8 of the Command Brief's ACTION list. After the stinger folder is built, invoke the `bee-creator` skill to author the Cursor subagent file (the Bee).

## What `bee-creator` does

`bee-creator` is the Phase 3 worker skill. It is documented at:

- `ai-tools/skills/bee-creator/SKILL.md` (repo-local copy)
- `~/.cursor/skills-cursor/bee-creator/SKILL.md` (global Cursor skills cache)

The skill takes a Command Brief and a populated Stinger folder (with at minimum `SKILL.md`, `guides/`, `examples/`, `templates/`, `reports/`, and `research/`), and authors the Bee file at:

```
ai-tools/agents/<worker-bee-name>.md
```

The Bee file has YAML frontmatter (with `name`, `description`, and `proactive` fields) and a body broken into standard sections: Identity & responsibility, Paired Stinger, Procedure, Critical directives, Escalation, References to skill files. The References to skill files section enumerates every Read-able file in the Stinger folder so the Bee knows what to consult.

## Inputs `the-queen` passes to `bee-creator`

`bee-creator` reads from disk; `the-queen` tells it where:

- The Bee name (which becomes the agent file name).
- The Stinger name (which determines the path it walks).
- The Command Brief path: `ai-tools/command-briefs/<worker-bee-name>-command-brief.md`.
- The Stinger folder path: `ai-tools/skills/<stinger-name>/`.
- The trigger policy: `proactive: true` (default for domain Bees) or `proactive: false` / `on-demand` (for Bees that should not volunteer). The default unless the Command Brief states otherwise is `proactive: true`.

## Expected output

After `bee-creator` completes, the following MUST exist:

```
ai-tools/agents/<worker-bee-name>.md
```

The file must contain:

- YAML frontmatter with `name: <worker-bee-name>`, a triggering `description` field, and `proactive: true | false`.
- An H1 heading with the Bee's display name.
- An `## Identity & responsibility` section (2-4 sentences distilled from the brief).
- A `## Paired Stinger` section linking to the stinger folder.
- A `## Procedure` section as numbered steps, each naming the guide in the Stinger folder that covers the step in depth.
- A `## Critical directives` section with each directive lifted verbatim from the brief plus a one-line "why".
- A `## Escalation` section enumerating when to surface to the user instead of guessing.
- A `## References to skill files` section listing every file in the Stinger folder grouped by subfolder, with one-line descriptions.

`the-queen` verifies:

1. The Bee file exists and is non-empty.
2. The YAML frontmatter has all three required fields populated.
3. The body has all six standard sections.
4. The References section enumerates files from `guides/`, `examples/`, `templates/`, and `research/` of the Stinger folder.
5. `SKILL.md` is explicitly referenced as the master index.

If any check fails, STOP and route to `guides/10-failure-modes.md` under "bee-creator failed."

## Trigger policy decision

`bee-creator` decides between `proactive: true` and `proactive: false`. The default decision rule (from the research and `bee-creator`'s own SKILL.md):

- **`proactive: true`** for most domain Bees. A well-scoped Bee should be trusted to volunteer when its domain is touched.
- **`proactive: false`** for Bees that are expensive to run, mutate state irreversibly, or should only be invoked after explicit user consent.

For `the-queen` itself, the recommendation in `research/research-summary.md` open question #5 is `proactive: true` with strictly explicit trigger phrases (e.g. "run the pipeline", "advance the factory") rather than topic-driven phrases. This honors both the format consistency with other Bees and the human-explicit-trigger intent in the original Command Brief.

For new Bees being forged in routine cycles, `bee-creator` will decide based on the Command Brief's NOTES section (which the `command-center` interview should have populated).

## Why the order matters

`bee-creator` reads from the Stinger folder. If Phase 2 (`stinger-forge`) had not yet run, there would be no `guides/`, `examples/`, or `templates/` to reference. The phase order is non-negotiable.

`bee-creator` does NOT modify the Stinger folder. It only reads from it. If `the-queen` detects modifications to the Stinger folder after Phase 3, that is a contract violation.

## Failure modes specific to this phase

- **Description in YAML frontmatter is generic ("helps with X", "handles Y").** The description IS the triggering mechanism; vague descriptions mean the orchestrator cannot predict when the Bee fires. Flag in the final report and recommend a manual review of the Bee file's description.
- **References section omits some files in the Stinger folder.** The Bee will not know to read them. Flag and recommend a re-author or manual patch.
- **Trigger policy is missing.** The `proactive:` field is required. STOP if missing; re-invoke with explicit policy decision.

## Implementation note for `the-queen`

Like Phases 1 and 2, Phase 3 is a skill load. `the-queen` reads `ai-tools/skills/bee-creator/SKILL.md` and follows its instructions to author the Bee file. The skill is short (~150 lines) and self-contained.
