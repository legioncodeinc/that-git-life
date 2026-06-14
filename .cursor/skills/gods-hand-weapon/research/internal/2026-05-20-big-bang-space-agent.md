---
source_url: file:///c:/Users/mario/GitHub/legion-code/ai-tools/agents/big-bang-space.md
retrieved_on: 2026-05-20
source_type: internal-repo
authority: official
relevance: critical
topic: producer-mirror
weapon: gods-hand-weapon
---

# big-bang-space (producer Angel)

## Summary
`big-bang-space` is the producer Angel for the queue that `gods-hand` consumes. It encodes the inverse of `gods-hand`'s contract: where `gods-hand` deletes from the TOP and never inserts, `big-bang-space` appends to the BOTTOM and never edits. The two Angels share the position-numbering invariants, the `NNN|guardian-name` row format, and the uniqueness check surface (`ai-tools/skills/god/SKILL.md`). Reading this Angel's file is how `weapon-forge` learns the canonical file-plumbing Angel style (terse opening, paired-skill load on entry, numbered workflow, refuse-list at the bottom, pairing table at the end).

## Key quotations / statistics

- Frontmatter `proactive: true`: like `gods-hand`, `big-bang-space` is invoked on-demand by the user or an orchestrator, never volunteered. The proactive flag means it CAN be auto-triggered when the user names a topic that needs proposing.
- Opening identity statement: "You are **big-bang-space**, the proposal Angel that births brand new guardians into the Legion AI Tools Factory. You sit at the very front of the factory pipeline. Your job is to take a topic from the caller and produce two atomic appends: 1. A full backlog entry in `ai-tools/proposed-angels-backlog.md` with title, four metadata lines, Purpose, and search queries. 2. A minimal queue row in `ai-tools/proposed-angels-queue.md` of the form `NNN|guardian-name`."
- Boundary statement: "You never build weapons. You never write command briefs. You never register Angels with `god`. Those are downstream steps that read the row you queued."
- Workflow step 7 (sequential appends): "In this order, sequentially, never in parallel: Append A: backlog entry. ... Append B: queue row. ... Increment `totals.rows` in the queue's YAML frontmatter. Update `date_updated:` to today's ISO date (YYYY-MM-DD). Update `last_updated_by:` to `big-bang-space`."
- Self-check item: "New entry was APPENDED, not inserted in the middle." -- Mirror invariant of `gods-hand`'s "deleted from the TOP, not the middle."
- Failure-mode refusal: "The caller wants you to renumber, reorder, or compact the queue. Refuse. Numbering is permanent." -- Same invariant `gods-hand` must enforce.
- Pairing table (line 173+): canonical format `gods-hand`'s file should mirror.

## Annotations for weapon-forge
- This file is the canonical TEMPLATE for `gods-hand`'s agent file at `ai-tools/agents/gods-hand.md`. `angel-creator` (Phase 3) will write that file, but `weapon-forge` (Phase 2) should ensure `guides/` is structured so `angel-creator` can produce a `gods-hand.md` that mirrors this shape:
  1. YAML frontmatter with `name`, `description` (proactive trigger phrases), `proactive: true`.
  2. Opening identity paragraph (one or two short paragraphs).
  3. "First action when invoked" section that loads the paired skill (`gods-hand-weapon`).
  4. Numbered Workflow section (one section per ACTION step from the Command Brief).
  5. "Failure modes to refuse" bulleted list (one bullet per SUBAGENT CRITICAL DIRECTIVE, restated as a refusal).
  6. Pairing table.
- The "sequentially, never in parallel" invariant from `big-bang-space` step 7 is the mirror of `gods-hand`'s "run the four phases in order; never skip or reorder." Both Angels are file-plumbing-style; both refuse parallelism within their mutation sequence.
- `guides/00-principles.md` should cite this Angel as the producer-side mirror to clarify the "we are the consumer; big-bang-space is the producer; together we maintain the FIFO invariant" framing.
- The pairing table at the end of `big-bang-space.md` is the format `gods-hand`'s pairing table should follow. Include rows for: This Angel, Paired skill, Queue file, Backlog file, In-process file, Completed file, God roster file, Model matrix.
