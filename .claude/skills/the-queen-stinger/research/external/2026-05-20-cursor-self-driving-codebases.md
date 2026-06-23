---
source_url: https://www.engineering.fyi/article/towards-self-driving-codebases
retrieved_on: 2026-05-20
source_type: blog
authority: official
relevance: critical
topic: multi-agent-orchestration
stinger: the-queen-stinger
---

# Towards self-driving codebases (Cursor Engineering Blog)

## Summary
Cursor's own engineering team's writeup of their multi-agent system. Critical because it documents EXACTLY the anti-patterns `the-queen` must avoid: equal-role peer coordination, shared coordination files with locking, agents holding locks too long. The recommended pattern (recursive planner-worker with structured handoff reports) is the architectural blueprint `the-queen` partially inherits. The key insight: hierarchical structures with a single owner who delegates and receives handoffs beat peer coordination at any scale.

## Key quotations / statistics

- Scale claim: "The system peaked at approximately 1,000 commits per hour across 10M tool calls over one week with minimal human intervention" (paraphrased from the article's intro).
- Anti-pattern (peer coordination with locks): "When agents with equal roles share a coordination file, they hold locks too long, forget to release them, and don't understand locking significance. Locking causes extreme contention where 20 agents slow to 1-3 agent throughput. The lack of structure means no agent takes on complex tasks -- they avoid conflict by opting for smaller, safer changes rather than taking project ownership."
- Recommended pattern: "The final design uses a recursive planner-worker hierarchy where a root planner owns the full scope, spawns subplanners for subdivided work, and workers pick up individual tasks on their own repo copies. Workers submit handoff reports back to planners containing findings, concerns, and deviations. This eliminates cross-talk and global synchronization overhead while maintaining full ownership through the chain."
- Worker isolation rule: "Design worker agents to operate on isolated copies of the repository and communicate results only through structured handoff reports rather than direct inter-agent communication. This eliminates coordination overhead, prevents cross-talk, and makes the system anti-fragile since individual agent failures don't cascade to others."
- Lock criticism: "Relying on equal-role self-coordination with shared state files and locking mechanisms. Agents consistently held locks too long, forgot to release them, and performed illegal lock operations. Locking is narrowly correct and easy to get wrong, and more prompting didn't help fix this fundamental coordination challenge."
- Single-role rule: "Give each agent a single, well-defined role rather than overloading one agent with multiple responsibilities. The continuous executor failed because it was simultaneously asked to plan, explore, research, spawn tasks, check workers, review code, merge outputs, and judge completion. Separating into dedicated planners and workers eliminated pathological behaviors."

## Annotations for stinger-forge
- `guides/00-principles.md` should cite this source as direct prior art justifying `the-queen`'s hierarchical design. The Command Brief's foreman-vs-craftsman boundary IS the recursive planner-worker hierarchy at the Bee-forging-cycle scale: `the-queen` is the root planner, the four skills + scripture-historian are the workers, each worker returns a structured handoff (the artifact on disk: brief / research folder / skill files / agent file / roster row).
- The lock criticism is load-bearing: `the-queen` deliberately does NOT use OS-level locking. Its move-before-work invariant (delete from queue, append to in-process BEFORE invoking phases) is the file-rename-as-lock pattern, which is structurally simpler than OS locks and survives crashes (the row sits in in-process visible to humans). Document this in `guides/01-pick-and-lock.md`. `guides/00-principles.md` should cite this as "industry confirmation of the architectural choice."
- The "workers operate on isolated copies" rule does NOT apply to `the-queen` directly because it writes to four globally-visible tracking files. The reason this works at the the-queen scale is the move-before-work atomic claim: once a row is in in-process, no sibling can pick it up. The "isolation" is in the queue/in-process/completed transition rather than in separate file copies.
- This source is high-authority (Cursor's own engineering team writing about their own runtime) and aligns 100% with the Command Brief. Zero contradictions.
