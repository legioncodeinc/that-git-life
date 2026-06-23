---
source_url: file:///c:/Users/mario/GitHub/legion-code/ai-tools/agents/scripture-historian.md
retrieved_on: 2026-05-20
source_type: internal-repo
authority: official
relevance: critical
topic: phase-15-worker
stinger: the-queen-stinger
---

# scripture-historian (Phase 1.5 worker subagent)

## Summary
`scripture-historian` is the worker subagent `the-queen` dispatches in Phase 1.5 via the Task tool. It is the only Bee-typed worker in the pipeline (all four other phases dispatch SKILLS, not subagents). This means `the-queen` invokes `scripture-historian` differently from the other four phases: it uses `Task` with `subagent_type="scripture-historian"` and waits for the handoff line ("Research for `<bee-name>` is complete..."). The file establishes the depth-tier rubric (shallow / normal / deep / extreme), the time-window rule (6 months default, 12 months max), and the exact handoff protocol `the-queen` must wait for.

## Key quotations / statistics

- Frontmatter `proactive: true` with extensive trigger phrase list -- `the-queen`'s Phase 1.5 invocation prompt must hit at least one of these phrases ("Run research before stinger-forge for `<bee-name>`", "scripture-historian, gather sources for `<stinger-name>`", "Pre-research the stinger", "Fill the research folder before building", "command-center is done, research first", "Conduct the literature sweep for the new Bee").
- First action: "Read these three things in order before any research begins: 1. Command Brief at `ai-tools/command-briefs/<bee-name>-command-brief.md`. ... 2. Backlog entry in `ai-tools/proposed-bees-backlog.md`. ... 3. Stinger target folder at `ai-tools/skills/<stinger-name>/research/`. If the folder does not exist, create it (and only it)."
- Critical directive: "If the depth tier is missing from BOTH the Command Brief frontmatter and the backlog entry, STOP and ask the caller which tier to use. Without a depth tier you cannot calibrate budget, and an uncalibrated research run wastes hours and tokens."
- Handoff line (exact format): "Research for `<bee-name>` is complete at `ai-tools/skills/<stinger-name>/research/` (<N> files, depth: <tier>, window: <N> months). Ready to hand off to **stinger-forge**."
- Failure-mode refusal: "Caller asks you to author `SKILL.md` or guides. Refuse. Route them to `stinger-forge`."
- Pairing table row: "Pipeline neighbors | the proposal step (proposes Bees) -> `command-center` (writes Brief) -> **`scripture-historian`** (gathers research) -> `stinger-forge` (builds skill) -> `bee-creator` (writes subagent file) -> `hive-registrar` (registers with beekeeper-suit)" -- this is the canonical pipeline diagram.

## Annotations for stinger-forge
- `guides/05-phase-15-scripture-historian.md` must document the Task-tool invocation pattern (different from the other four phases which dispatch skills). Include:
  - Tool: `Task` with `subagent_type="scripture-historian"`.
  - Prompt template: name the Bee/Stinger pair, point at the Command Brief, restate the depth tier, list the five search queries, name the research output folder, declare the critical reminders ("Stay in your lane", "One source = one file", "Cite, never paraphrase").
  - Success indicator: the exact handoff line "Research for `<bee-name>` is complete at `ai-tools/skills/<stinger-name>/research/` (<N> files, depth: <tier>, window: <N> months). Ready to hand off to **stinger-forge**."
  - Failure indicator: any mention of "STOP", "auth error", or missing depth tier in the subagent's final message.
- Cross-validate: this Bee file's `proactive: true` + extensive description is the canonical Bee-spawning-Bee pattern. `the-queen`'s Bee file should also be `proactive: true` but with on-demand invocation language (NOT auto-volunteered), per the Command Brief's NOTES section: "Trigger policy: on-demand. `the-queen` is invoked explicitly by an orchestrator or by direct user command; it should NOT volunteer because it mutates four tracking files and dispatches four sub-skills per run."
- The 4-tier depth rubric in this file is the source of truth that `command-center` and the proposal step both reference. `the-queen` does NOT pick the depth; it READS the depth from the backlog/brief and passes it to `scripture-historian`. `guides/05-phase-15-scripture-historian.md` should state this read-not-write boundary explicitly.
