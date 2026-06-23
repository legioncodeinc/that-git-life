# 05 - Phase 1.5: scripture-historian

Step 6 of the Command Brief's ACTION list (and an interlude between Phase 1 and Phase 2). After the Command Brief is written and the stinger folder is scaffolded, invoke the `scripture-historian` subagent to conduct depth-calibrated research.

This is the ONLY phase that uses the Task tool instead of a skill load. The asymmetry is intentional and is documented below.

## What `scripture-historian` does

`scripture-historian` is the Phase 1.5 worker subagent. Its job is to download, summarize, and categorize 2026-current sources for the new Bee/Stinger pair's domain, then file them into `ai-tools/skills/<stinger-name>/research/`. It does NOT author `SKILL.md` or guides; that is `stinger-forge`'s job.

The subagent's full contract lives at `ai-tools/agents/scripture-historian.md`. Read it before Phase 1.5 if you need the depth-tier rubric, the file shape, the tool-availability rules, or the handoff line format.

## Why this phase uses Task, not skill load

Cursor's documentation distinguishes skills from subagents. From `research/external/2026-05-20-cursor-subagents-docs.md`:

- A **skill** is loaded into the current agent's context. The current agent executes the skill's instructions in its own conversation.
- A **subagent** is dispatched via the Task tool. The subagent runs in a separate context with its own conversation history, tools, and (sometimes) its own model.

`scripture-historian` is implemented as a subagent because:

1. The research workload is large enough at `normal`, `deep`, and `extreme` tiers to benefit from context isolation.
2. The subagent can run with a different model than `the-queen` (per the Command Brief's `research_model` field).
3. Research tool calls (Firecrawl, Exa) are bursty; isolating them avoids polluting `the-queen`'s context with tool transcripts.

The other four phases (`command-center`, `stinger-forge`, `bee-creator`, `hive-registrar`) are skills because their workloads are bounded, deterministic file-authoring tasks that benefit from shared context with `the-queen`.

## Inputs `the-queen` passes to `scripture-historian`

Construct a Task tool call with `subagent_type="scripture-historian"` and a prompt that contains:

- The Bee name and Stinger name.
- The exact path to the Command Brief at `ai-tools/command-briefs/<worker-bee-name>-command-brief.md`.
- The exact path to the research output folder at `ai-tools/skills/<stinger-name>/research/`.
- The depth tier from the backlog metadata.
- A reminder of the handoff-line format the subagent must emit on completion.

A worked example prompt is in `examples/happy-path.md`.

## Expected output

After `scripture-historian` completes, the following MUST exist:

```
ai-tools/skills/<stinger-name>/research/research-plan.md
ai-tools/skills/<stinger-name>/research/research-summary.md
ai-tools/skills/<stinger-name>/research/index.md
ai-tools/skills/<stinger-name>/research/[internal-or-external]/<dated-files>.md
```

The `research-plan.md` is the audit trail of which queries the subagent ran. The `research-summary.md` is the executive summary `stinger-forge` reads first. The `index.md` is the manifest of all source files. The dated `.md` files in `internal/` and `external/` subfolders are one-source-per-file research notes with YAML frontmatter.

The subagent's final message must end with the handoff line:

> "Research for `<worker-bee-name>` is complete at `ai-tools/skills/<stinger-name>/research/` (<N> files, depth: <tier>, window: <N> months). Ready to hand off to **stinger-forge**."

`the-queen` verifies (a) the four required files exist, (b) the subfolders contain at least one source file each (or one of them is empty with a documented reason in the summary), and (c) the handoff line is present in the subagent's response. If any check fails, STOP and route to `guides/10-failure-modes.md` under "scripture-historian failed."

## Depth tier and budget expectations

`scripture-historian`'s own contract documents the four depth tiers. As a `the-queen` operator, you do not need to memorize them, but you should know roughly:

| Depth | Wall-clock | Files written | When to expect this tier |
|---|---|---|---|
| `shallow` | 5-15 minutes | 5-10 source files plus 3 metadata files | Procedural / orchestration stingers; well-bounded domains. |
| `normal` | 20-45 minutes | ~100 source files plus 3 metadata files | Daily-driver enforcement, audit, template work. |
| `deep` | 1-3 hours | Thousands of files | Integral architectural role; wrong decisions create technical debt. |
| `extreme` | Multiple hours | Exhaustive | Catastrophic blast radius if mishandled. |

If the depth tier is `deep` or `extreme`, expect `scripture-historian` to confirm acceptance with the caller in a short pre-flight message before starting. `the-queen` should not interfere with that exchange; it is between the subagent and the user.

## Failure modes specific to this phase

- **Firecrawl or Exa auth error.** The subagent will stop and surface. Route to `guides/10-failure-modes.md`; recovery is for the user to run `firecrawl login --browser` or `/exa-setup`, then re-invoke the cycle from this phase.
- **Depth tier missing from BOTH Command Brief frontmatter and backlog.** The subagent will stop and ask. This indicates a bug upstream; `command-center` should have populated the frontmatter from the backlog. Surface for the caller to investigate.
- **Subagent returns without the handoff line.** Treat as failure even if files exist on disk; the subagent's contract requires the handoff line as the success signal. Re-invoke or skip with a flag (and document in the final report).

## Why this phase exists at all

In the early factory pipeline (before `scripture-historian` was added in late 2025), `stinger-forge` did its own research. The separation makes the pipeline more debuggable:

- Research failures are isolated from skill-authoring failures.
- A different model can be used for research (typically faster, web-search-grounded models) vs skill authoring (typically larger, reasoning-heavy models).
- The research folder is a durable artifact that can be regenerated independently of the rest of the skill.

The `stinger-forge` SKILL.md still has a "Step 3: Conduct research" header from before the split, but the inline instructions defer to `scripture-historian`. See `guides/06-phase-2-stinger-forge.md` for the implication: `stinger-forge` does NOT re-run research; it consumes what is already in `research/`.
