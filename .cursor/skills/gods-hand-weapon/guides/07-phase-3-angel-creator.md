# 07 - Phase 3: angel-creator

Step 8 of the Command Brief's ACTION list. After the weapon folder is built, invoke the `angel-creator` skill to author the Cursor subagent file (the Angel).

## What `angel-creator` does

`angel-creator` is the Phase 3 worker skill. It is documented at:

- `ai-tools/skills/angel-creator/SKILL.md` (repo-local copy)
- `~/.cursor/skills-cursor/angel-creator/SKILL.md` (global Cursor skills cache)

The skill takes a Command Brief and a populated Weapon folder (with at minimum `SKILL.md`, `guides/`, `examples/`, `templates/`, `reports/`, and `research/`), and authors the Angel file at:

```
ai-tools/agents/<guardian-name>.md
```

The Angel file has YAML frontmatter (with `name`, `description`, and `proactive` fields) and a body broken into standard sections: Identity & responsibility, Paired Weapon, Procedure, Critical directives, Escalation, References to skill files. The References to skill files section enumerates every Read-able file in the Weapon folder so the Angel knows what to consult.

## Inputs `gods-hand` passes to `angel-creator`

`angel-creator` reads from disk; `gods-hand` tells it where:

- The Angel name (which becomes the agent file name).
- The Weapon name (which determines the path it walks).
- The Command Brief path: `ai-tools/command-briefs/<guardian-name>-command-brief.md`.
- The Weapon folder path: `ai-tools/skills/<weapon-name>/`.
- The trigger policy: `proactive: true` (default for domain Angels) or `proactive: false` / `on-demand` (for Angels that should not volunteer). The default unless the Command Brief states otherwise is `proactive: true`.

## Expected output

After `angel-creator` completes, the following MUST exist:

```
ai-tools/agents/<guardian-name>.md
```

The file must contain:

- YAML frontmatter with `name: <guardian-name>`, a triggering `description` field, and `proactive: true | false`.
- An H1 heading with the Angel's display name.
- An `## Identity & responsibility` section (2-4 sentences distilled from the brief).
- A `## Paired Weapon` section linking to the weapon folder.
- A `## Procedure` section as numbered steps, each naming the guide in the Weapon folder that covers the step in depth.
- A `## Critical directives` section with each directive lifted verbatim from the brief plus a one-line "why".
- A `## Escalation` section enumerating when to surface to the user instead of guessing.
- A `## References to skill files` section listing every file in the Weapon folder grouped by subfolder, with one-line descriptions.

`gods-hand` verifies:

1. The Angel file exists and is non-empty.
2. The YAML frontmatter has all three required fields populated.
3. The body has all six standard sections.
4. The References section enumerates files from `guides/`, `examples/`, `templates/`, and `research/` of the Weapon folder.
5. `SKILL.md` is explicitly referenced as the master index.

If any check fails, STOP and route to `guides/10-failure-modes.md` under "angel-creator failed."

## Trigger policy decision

`angel-creator` decides between `proactive: true` and `proactive: false`. The default decision rule (from the research and `angel-creator`'s own SKILL.md):

- **`proactive: true`** for most domain Angels. A well-scoped Angel should be trusted to volunteer when its domain is touched.
- **`proactive: false`** for Angels that are expensive to run, mutate state irreversibly, or should only be invoked after explicit user consent.

For `gods-hand` itself, the recommendation in `research/research-summary.md` open question #5 is `proactive: true` with strictly explicit trigger phrases (e.g. "run the pipeline", "advance the factory") rather than topic-driven phrases. This honors both the format consistency with other Angels and the human-explicit-trigger intent in the original Command Brief.

For new Angels being forged in routine cycles, `angel-creator` will decide based on the Command Brief's NOTES section (which the `command-center` interview should have populated).

## Why the order matters

`angel-creator` reads from the Weapon folder. If Phase 2 (`weapon-forge`) had not yet run, there would be no `guides/`, `examples/`, or `templates/` to reference. The phase order is non-negotiable.

`angel-creator` does NOT modify the Weapon folder. It only reads from it. If `gods-hand` detects modifications to the Weapon folder after Phase 3, that is a contract violation.

## Failure modes specific to this phase

- **Description in YAML frontmatter is generic ("helps with X", "handles Y").** The description IS the triggering mechanism; vague descriptions mean the orchestrator cannot predict when the Angel fires. Flag in the final report and recommend a manual review of the Angel file's description.
- **References section omits some files in the Weapon folder.** The Angel will not know to read them. Flag and recommend a re-author or manual patch.
- **Trigger policy is missing.** The `proactive:` field is required. STOP if missing; re-invoke with explicit policy decision.

## Implementation note for `gods-hand`

Like Phases 1 and 2, Phase 3 is a skill load. `gods-hand` reads `ai-tools/skills/angel-creator/SKILL.md` and follows its instructions to author the Angel file. The skill is short (~150 lines) and self-contained.
