---
source_url: file:///c:/Users/mario/GitHub/legion-code/ai-tools/agents/scripture-historian.md
retrieved_on: 2026-05-20
source_type: internal-repo
authority: official
relevance: critical
topic: phase-15-worker
weapon: gods-hand-weapon
---

# scripture-historian (Phase 1.5 worker subagent)

## Summary
`scripture-historian` is the worker subagent `gods-hand` dispatches in Phase 1.5 via the Task tool. It is the only Angel-typed worker in the pipeline (all four other phases dispatch SKILLS, not subagents). This means `gods-hand` invokes `scripture-historian` differently from the other four phases: it uses `Task` with `subagent_type="scripture-historian"` and waits for the handoff line ("Research for `<angel-name>` is complete..."). The file establishes the depth-tier rubric (shallow / normal / deep / extreme), the time-window rule (6 months default, 12 months max), and the exact handoff protocol `gods-hand` must wait for.

## Key quotations / statistics

- Frontmatter `proactive: true` with extensive trigger phrase list -- `gods-hand`'s Phase 1.5 invocation prompt must hit at least one of these phrases ("Run research before weapon-forge for `<angel-name>`", "scripture-historian, gather sources for `<weapon-name>`", "Pre-research the weapon", "Fill the research folder before building", "command-center is done, research first", "Conduct the literature sweep for the new Angel").
- First action: "Read these three things in order before any research begins: 1. Command Brief at `ai-tools/command-briefs/<angel-name>-command-brief.md`. ... 2. Backlog entry in `ai-tools/proposed-angels-backlog.md`. ... 3. Weapon target folder at `ai-tools/skills/<weapon-name>/research/`. If the folder does not exist, create it (and only it)."
- Critical directive: "If the depth tier is missing from BOTH the Command Brief frontmatter and the backlog entry, STOP and ask the caller which tier to use. Without a depth tier you cannot calibrate budget, and an uncalibrated research run wastes hours and tokens."
- Handoff line (exact format): "Research for `<angel-name>` is complete at `ai-tools/skills/<weapon-name>/research/` (<N> files, depth: <tier>, window: <N> months). Ready to hand off to **weapon-forge**."
- Failure-mode refusal: "Caller asks you to author `SKILL.md` or guides. Refuse. Route them to `weapon-forge`."
- Pairing table row: "Pipeline neighbors | `big-bang-space` (proposes Angels) -> `command-center` (writes Brief) -> **`scripture-historian`** (gathers research) -> `weapon-forge` (builds skill) -> `angel-creator` (writes subagent file) -> `god-registrar` (registers with God)" -- this is the canonical pipeline diagram.

## Annotations for weapon-forge
- `guides/05-phase-15-scripture-historian.md` must document the Task-tool invocation pattern (different from the other four phases which dispatch skills). Include:
  - Tool: `Task` with `subagent_type="scripture-historian"`.
  - Prompt template: name the Angel/Weapon pair, point at the Command Brief, restate the depth tier, list the five search queries, name the research output folder, declare the critical reminders ("Stay in your lane", "One source = one file", "Cite, never paraphrase").
  - Success indicator: the exact handoff line "Research for `<angel-name>` is complete at `ai-tools/skills/<weapon-name>/research/` (<N> files, depth: <tier>, window: <N> months). Ready to hand off to **weapon-forge**."
  - Failure indicator: any mention of "STOP", "auth error", or missing depth tier in the subagent's final message.
- Cross-validate: this Angel file's `proactive: true` + extensive description is the canonical Angel-spawning-Angel pattern. `gods-hand`'s Angel file should also be `proactive: true` but with on-demand invocation language (NOT auto-volunteered), per the Command Brief's NOTES section: "Trigger policy: on-demand. `gods-hand` is invoked explicitly by an orchestrator or by direct user command; it should NOT volunteer because it mutates four tracking files and dispatches four sub-skills per run."
- The 4-tier depth rubric in this file is the source of truth that `command-center` and `big-bang-space` both reference. `gods-hand` does NOT pick the depth; it READS the depth from the backlog/brief and passes it to `scripture-historian`. `guides/05-phase-15-scripture-historian.md` should state this read-not-write boundary explicitly.
