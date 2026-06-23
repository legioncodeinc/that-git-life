---
source_url: https://website.understandingdata.com/markdown-files-as-state-machines/
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: critical
topic: markdown-state-machine
stinger: the-queen-stinger
---

# Markdown Files as State Machines for AI Development Workflows

## Summary
James Phoenix at Just Understanding Data argues that markdown files can function as reliable state machines for orchestrating multi-step AI development workflows. The key insight: prose instructions fail because LLMs treat them as suggestions; numbered steps with explicit branching, checkpoint markers, and disk-persisted session state produce repeatable, context-resilient automation. Direct prior art for the the-queen-stinger's `guides/` structure: the-queen IS a state machine encoded in markdown that survives context compaction by writing state to the four tracking files between phases.

## Key quotations / statistics

- Core insight: "A structured markdown file can function as a reliable state machine for orchestrating multi-step AI development workflows. The key insight: prose instructions fail because LLMs treat them as suggestions. Numbered steps with explicit branching logic, checkpoint markers, and disk-persisted session state produce repeatable, context-resilient automation."
- Anti-pattern: "Early attempts at workflow automation via CLAUDE.md used descriptive prose ('fetch the ticket, then create a branch'). Claude treated these as loose guidance, not executable steps. The result was inconsistent behavior, especially after context compaction wiped in-memory state."
- Recommended pattern: "Replace narrative prose with explicit decision trees and numbered steps. The markdown structure itself does what an interpreter would do in a traditional programming language. Each step has a defined trigger, action, and exit condition. Claude executes them sequentially rather than interpreting intent from paragraphs."
- Branching: "Rather than 'handle reopened tickets appropriately,' the markdown encodes branching logic: scan comments for signals like 'bug,' 'doesn't work,' or 'sent back,' then route to a Plan subagent with structured context highlighting the specific issues."
- Checkpoint markers (LOAD-BEARING for the-queen): "Dual persistence survives context compaction: `.claude-session/TICKET-XXX.json` tracks workflow state, current step, and session metadata. `.claude-session/TICKET-XXX-plan.md` stores implementation tasks as checkboxes (the canonical progress tracker). When context compacts, Claude re-reads these files and resumes from the exact step and task."
- State machine framing: "The markdown structure constrains the LLM's execution path the same way types constrain a compiler. Instead of hoping the model interprets prose correctly, you encode the workflow as a finite state machine where each state has defined transitions."
- Closing insight: "If you want an AI agent to do something complex and do it reliably, the answer is not better prose instructions. It is more structured ones. Encode workflows as numbered steps with explicit branching, persist state to disk at checkpoints, and design for context compaction as a guaranteed event, not an edge case."

## Annotations for stinger-forge
- `guides/00-principles.md` should cite this source as the theoretical justification for the the-queen-stinger design. The four tracking files (queue, in-process, completed, backlog) are the checkpoint files. The 11-step ACTION list in the Command Brief is the numbered-step state machine. Context compaction during a long cycle (especially around scripture-historian which can take minutes) is the threat model.
- The "make invalid states impossible" framing supports the move-before-work invariant: there is no valid state where a row exists in both queue.md AND in-process.md. The transition is atomic at the agent layer. `guides/01-pick-and-lock.md` should restate this with explicit before/after diagrams.
- The dual-persistence pattern (JSON session state + markdown checkpoint file) does NOT exactly match the-queen's design. the-queen uses a single layer: the four tracking files ARE both the state and the audit log. There is no separate session JSON. This is intentional simplification, but `stinger-forge` should consider whether a `.the-queen-session.json` file would be useful for resuming an interrupted cycle. Recommendation: document this as a deferred enhancement in `guides/10-failure-modes.md` under "Future work: session resume." The current design's recovery story is the in-process.md row plus the partial artifacts on disk (e.g., command brief exists but no research folder = cycle crashed between Phase 1 and Phase 1.5).
- The "branching logic with explicit signal detection" pattern from this source informs `guides/10-failure-modes.md`. Each failure mode should have an explicit trigger ("if in-process.md is non-empty", "if command-center did not produce a brief", "if scripture-historian's final message lacks the handoff line") rather than a vague "if something goes wrong."
- This source is the single strongest prose argument for the entire the-queen-stinger design philosophy. Cite it prominently in `guides/00-principles.md`.
