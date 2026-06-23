---
source_url: https://cursor.com/docs/subagents
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: cursor-subagents
stinger: the-queen-stinger
---

# Subagents | Cursor Docs

## Summary
Canonical Cursor documentation for subagents. Defines subagent fundamentals (specialized AI assistants Cursor's agent can delegate tasks to), foreground vs background mode, the orchestrator pattern (which is exactly what `the-queen` implements), and Cursor 2.5+ nested subagent support. The orchestrator pattern section is direct prior art: a parent agent coordinates planner / implementer / verifier subagents in sequence with structured handoffs.

## Key quotations / statistics

- "Subagents are specialized AI assistants that Cursor's agent can delegate tasks to. Each subagent operates in its own context window, handles specific types of work, and returns its result to the parent agent. Use subagents to break down complex tasks, do work in parallel, and preserve context in the main conversation."
- Mode table: "Foreground -- Blocks until the subagent completes. Returns the result immediately. Best for: Sequential tasks where you need the output. Background -- Returns immediately. The subagent works independently. Best for: Long-running tasks or parallel workstreams."
- Built-in subagents: "Cursor includes three built-in subagents: `explore` for codebase search, `bash` for running shell commands, and `browser` for browser automation via MCP."
- Subagent benefits: "Context isolation -- Intermediate output stays in the subagent. The parent only sees the final summary. Model flexibility -- The explore subagent uses a faster model by default. ... Specialized configuration -- Each subagent has prompts and tool access tuned for its specific task. Cost efficiency -- Faster models cost less."
- Subagent file locations: "Project subagents | `.cursor/agents/` | Current project only ... `.claude/agents/` | Current project only (Claude compatibility) ... `.codex/agents/` | Current project only (Codex compatibility) ... User subagents | `~/.cursor/agents/` | All projects for current user."
- Frontmatter fields: "`name`, `description`, `model` (string, default: `inherit`, or a specific model), `readonly` (boolean, default: `false`, restricts write permissions), `is_background` (boolean, default: `false`, runs in background without blocking)."
- Orchestrator pattern (direct quote): "For complex workflows, a parent agent can coordinate multiple specialist subagents in sequence: 1. Planner analyzes requirements and creates a technical plan. 2. Implementer builds the feature based on the plan. 3. Verifier confirms the implementation matches requirements. Each handoff includes structured output so the next agent has clear context."
- Nested launches: "Yes. Since Cursor 2.5, subagents can launch child subagents to create a tree of coordinated work." -- but "Nested launches require Task tool ... current mode, and hooks or tool policies can block spawning."
- Skill-vs-subagent decision table: "You need context isolation for long research tasks ... Running multiple workstreams in parallel ... The task requires specialized expertise across many steps -- use SUBAGENTS. The task is single-purpose (generate changelog, format) ... You want a quick, repeatable action ... The task completes in one shot -- use SKILLS."

## Annotations for stinger-forge
- `guides/00-principles.md` should cite the orchestrator pattern verbatim. `the-queen` is the canonical Cursor orchestrator: it does NOT do domain work itself, it dispatches the planner/implementer/verifier (in our case: command-center / stinger-forge / quality-via-the-Bee-build-out).
- `guides/05-phase-15-scripture-historian.md` should explicitly use "foreground mode" framing for the scripture-historian dispatch. The phase BLOCKS until research is complete; that is foreground semantics.
- The skill-vs-subagent table justifies why `scripture-historian` is a subagent (context-heavy, multi-step, isolated context window) while the other four phases are skills (single-purpose, one-shot per phase). `guides/00-principles.md` should restate this rationale because it explains the asymmetry in how `the-queen` dispatches Phase 1.5 vs Phases 1/2/3/4.
- Frontmatter `readonly: false` is correct for `the-queen` (it must mutate four tracking files). `is_background: false` is correct (the user wants the cycle to complete and stop, not run in the background). `model: inherit` is the safe default.
- Cursor 2.5+ nested launches: `the-queen` does not need nested launches; it dispatches `scripture-historian` once per cycle. But the fact that Cursor SUPPORTS the pattern means future expansions (e.g., `the-queen` spawning quality-worker-bee after hive-registrar) are feasible.
