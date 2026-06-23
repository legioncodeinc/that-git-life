# Research Plan: the-queen-stinger

- **Depth tier:** shallow
- **Time window:** 2025-11-20 back to 2026-05-20 (6 months)
- **Page budget target:** 5 to 10 external pages + 6 internal repo sources = 11 to 16 research notes total
- **Source breadth target:** internal repo source-of-truth files (canonical contract surfaces), official Cursor docs on subagents/skills, practitioner blogs on multi-agent pipelines, GitHub READMEs / examples on FIFO file queues, blog posts on atomic move-before-work patterns, glossary-style references on markdown lifecycle tracking
- **Caller:** invoked by `the-queen` (pipeline-controller Bee) via the `scripture-historian` subagent, Phase 1.5 of the Legion AI Tools Factory pipeline

## Domain framing

`the-queen-stinger` is a procedural orchestration arsenal, not a knowledge-domain stinger. The Bee's contract is FIFO file plumbing across four markdown tracking files (`proposed-bees-queue.md`, `proposed-bees-in-process.md`, `proposed-bees-completed.md`, `proposed-bees-backlog.md`). Research depth is read from the backlog as one of the `shallow`, `normal`, `deep`, and `extreme` tiers.

## Internal repo sources (already on disk; treated as primary evidence)

These are the source-of-truth contract surfaces `the-queen` reads on every invocation. They are not "external research" but they ARE primary authoritative evidence and must be filed as research notes with `source_type: internal-repo` and `authority: official`:

1. `ai-tools/command-briefs/the-queen-command-brief.md` -- the Command Brief itself.
2. `ai-tools/proposed-bees-queue.md` -- producer/consumer contract surface (YAML frontmatter, `pickup_protocol`, `row_format`).
3. `ai-tools/proposed-bees-backlog.md` (header only, lines 1 to 50) -- backlog tier structure and metadata block format.
4. the proposal step -- canonical producer Bee; the file-plumbing-style mirror that `the-queen` consumes the output of.
5. `ai-tools/agents/scripture-historian.md` -- worker subagent pattern that `the-queen` dispatches in Phase 1.5.
6. `command-brief-template.md` -- the brief template `command-center` writes from.

## Tool plan

- **Primary:** Exa `web_search_exa` (MCP, pre-authenticated). One call per authored query, 5 results per call, total 25 candidate URLs. Triage to keep 1 to 2 per query, ceiling 10 external sources.
- **Secondary:** `web_fetch_exa` for full-content extraction on the surviving URLs when Exa's highlights are insufficient.
- **Optional:** Firecrawl CLI via `npx firecrawl-cli` if Exa returns sparse hits. Not authenticated by default in this session; will note the failover in `research-summary.md` if used.

## Output structure

- `research-plan.md` -- this file (audit trail).
- `internal/` -- subfolder for the 6 internal repo source notes.
- `external/` -- subfolder for the 5 to 10 external source notes.
- `index.md` -- manifest table updated after every file write.
- `research-summary.md` -- final summary, 5 most influential sources, open questions, handoff line.

Categorization by subfolder (`internal/` vs `external/`) is justified at shallow tier because the internal sources are the actual contract surfaces (authoritative for the stinger) while the external sources are calibrating context (helpful but not authoritative). `stinger-forge` will prioritize `internal/` when authoring `guides/` and treat `external/` as cross-validation.
