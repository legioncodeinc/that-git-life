---
source_url: https://github.com/robertsfeir/atelier-pipeline
retrieved_on: 2026-05-20
source_type: github-readme
authority: practitioner
relevance: high
topic: multi-agent-prior-art
stinger: the-queen-stinger
---

# atelier-pipeline (Multi-Agent Orchestration for Claude Code + Cursor)

## Summary
Real-world open-source multi-agent orchestration plugin for Claude Code and Cursor. Defines 10+ specialized agents (Eva = pipeline orchestrator, Robert = product, Sable = UX, Cal = architect, Colby = engineer, Roz = QA, Poirot = blind reviewer, Agatha = documentation, Ellis = commits, Distillator = compression, Sentinel = security). Direct prior art for `the-queen`: Eva plays the same role as the-queen (pipeline orchestrator, dispatches specialists in order). The plugin also documents Cursor-specific limitations on Agent spawning that `the-queen-stinger` should be aware of.

## Key quotations / statistics

- 13-agent roster: "Eva, Robert, Sable, Cal, Colby, Roz, Poirot, Agatha, Ellis, Distillator, Sentinel, Darwin, Deps."
- Eva's role: "Eva orchestrates" (introduction line). She is the explicit "Pipeline Orchestrator / DevOps" -- the foreman role `the-queen` plays.
- Skills-vs-subagents framing: "Skills run in the main conversation thread (Claude Code or Cursor) for conversational work. Subagents run in their own context windows for focused execution. Some agents have both modes -- conversational for authoring, subagent for verification."
- Cursor limitation (CRITICAL FOR THE-QUEEN): "On Cursor, subagents run as skills in the main thread since Cursor does not support Agent spawning. All agents are available on both platforms."
- Compatibility matrix excerpt:
  - "Agent Teams (parallel wave execution) | Yes (experimental) | Not available"
  - "Distributed routing (Agent spawning by Sarah/Colby) | Yes | Not available"
  - "Worktrees | Yes | Not available"
  - All in column "Cursor" returning Not Available.
- Distributed routing rule: "Sarah and Colby are exceptions. These two agents use an explicit `tools` allowlist instead of `disallowedTools`. Their allowlists include scoped `Agent(...)` access, which grants them the ability to spawn specific subagents directly without routing through Eva."
- File structure: "For Cursor: the same structure installs into `.cursor/` with rules using `.mdc` extension and frontmatter."
- Enforcement hooks: "Six enforcement hooks. Three PreToolUse hooks (path enforcement, sequencing, git ops), one SubagentStop hook (DoR/DoD warnings), one PreCompact hook (compaction marker), and one [...]."

## Annotations for stinger-forge
- The Cursor limitation "subagents run as skills in the main thread since Cursor does not support Agent spawning" is OUT OF DATE as of Cursor 2.4+. Cursor now fully supports custom subagents at `.cursor/agents/<name>.md`, which is exactly how `scripture-historian` lives in this repo. `stinger-forge` should NOT cite this part of atelier-pipeline as current; it is left here because the rest of the plugin's orchestration design IS still relevant prior art.
- Eva-as-orchestrator IS the canonical pattern `the-queen` implements. `guides/00-principles.md` can cite this: "atelier-pipeline's Eva is the closest commodity equivalent of the-queen: a dedicated orchestrator that owns phase transitions but never does domain work itself."
- The "Sarah and Colby can spawn subagents directly" pattern is NOT what the-queen wants. the-queen spawns scripture-historian directly (via Task tool) but does NOT delegate that spawning to a sub-skill. The current design is simpler and matches the foreman-vs-craftsman boundary.
- The six-enforcement-hooks pattern is interesting but NOT used by the-queen-stinger. The Command Brief's NOTES explicitly says "Trigger policy: on-demand. the-queen is invoked explicitly by an orchestrator or by direct user command; it should NOT volunteer." This is the human-explicit-trigger model, the opposite of hook-driven automation.
- 17 stars on GitHub (as of retrieval); not a mainstream open-source project but a serious practitioner artifact. Useful as one data point of prior art, not as authoritative spec.
