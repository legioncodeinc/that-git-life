# Research Plan: gods-hand-weapon

- **Depth tier:** shallow
- **Time window:** 2025-11-20 back to 2026-05-20 (6 months)
- **Page budget target:** 5 to 10 external pages + 6 internal repo sources = 11 to 16 research notes total
- **Source breadth target:** internal repo source-of-truth files (canonical contract surfaces), official Cursor docs on subagents/skills, practitioner blogs on multi-agent pipelines, GitHub READMEs / examples on FIFO file queues, blog posts on atomic move-before-work patterns, glossary-style references on markdown lifecycle tracking
- **Caller:** invoked by `gods-hand` (pipeline-controller Angel) via the `scripture-historian` subagent, Phase 1.5 of the Legion AI Tools Factory pipeline

## Domain framing

`gods-hand-weapon` is a procedural orchestration arsenal, not a knowledge-domain weapon. The Angel's contract is FIFO file plumbing across four markdown tracking files (`proposed-angels-queue.md`, `proposed-angels-in-process.md`, `proposed-angels-completed.md`, `proposed-angels-backlog.md`) plus sequential dispatch of four worker skills and one worker subagent. The bulk of the substantive material is internal to this repo. External research is calibrating signal: how the wider Cursor / multi-agent community handles sequential dispatch, FIFO queues represented as files, and atomic move semantics.

## Initial queries (from command brief, authored by command-center / big-bang-space)

- "Cursor subagents pipeline orchestration multi-phase 2026"
- "Cursor IDE skills sequential dispatch best practices 2026"
- "task queue FIFO worker contract atomic move lock 2026"
- "Cursor IDE multi-agent factory pipeline orchestrator 2026"
- "Markdown file lifecycle queue in-process completed tracking 2026"

## Expansion queries (authored by scripture-historian)

Shallow tier does not branch the authored queries. Each of the 5 initial queries gets one Exa pass; the most authoritative 1 to 2 results per query are saved as research notes. No follow-on branching, no GitHub deep-dives, no white papers, no StackOverflow / Reddit mining. That work is reserved for `normal`, `deep`, and `extreme` tiers.

## Internal repo sources (already on disk; treated as primary evidence)

These are the source-of-truth contract surfaces `gods-hand` reads on every invocation. They are not "external research" but they ARE primary authoritative evidence and must be filed as research notes with `source_type: internal-repo` and `authority: official`:

1. `ai-tools/command-briefs/gods-hand-command-brief.md` -- the Command Brief itself.
2. `ai-tools/proposed-angels-queue.md` -- producer/consumer contract surface (YAML frontmatter, `pickup_protocol`, `row_format`).
3. `ai-tools/proposed-angels-backlog.md` (header only, lines 1 to 50) -- backlog tier structure and metadata block format.
4. `ai-tools/agents/big-bang-space.md` -- canonical producer Angel; the file-plumbing-style mirror that `gods-hand` consumes the output of.
5. `ai-tools/agents/scripture-historian.md` -- worker subagent pattern that `gods-hand` dispatches in Phase 1.5.
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

Categorization by subfolder (`internal/` vs `external/`) is justified at shallow tier because the internal sources are the actual contract surfaces (authoritative for the weapon) while the external sources are calibrating context (helpful but not authoritative). `weapon-forge` will prioritize `internal/` when authoring `guides/` and treat `external/` as cross-validation.
