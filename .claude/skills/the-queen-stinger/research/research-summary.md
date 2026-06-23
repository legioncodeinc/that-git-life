# Research Summary: the-queen-stinger

- **Depth tier consumed:** shallow
- **Time window covered:** 2025-11-20 to 2026-05-20 (6 months, within default)
- **Caller:** invoked by `the-queen` (pipeline-controller Bee) via the `scripture-historian` subagent
- **Tools used:** Exa `web_search_exa` (MCP, pre-authenticated) for the five external queries. Firecrawl CLI is NOT on PATH in this session, but the Exa results were rich enough that Firecrawl was not needed for shallow tier. Internal sources were read directly from the local repo via the file system.
- **Total files written:** 19 (research-plan + index + this summary + 6 internal source notes + 10 external source notes).

## Files written, grouped by subfolder

### `research/` root (3 files)
- `research-plan.md` -- depth tier, time window, page budget, query list, expansion plan.
- `index.md` -- manifest table + coverage map showing which guide each source informs.
- `research-summary.md` -- this file.

### `research/internal/` (6 files)
- `2026-05-20-command-brief.md` -- the Command Brief, source of truth for the Bee's identity and contract.
- `2026-05-20-proposed-bees-queue.md` -- canonical FIFO queue file with `pickup_protocol` and `row_format`.
- `2026-05-20-proposed-bees-backlog-header.md` -- backlog header explaining tier structure and metadata block format.
- `2026-05-20-scripture-historian-agent.md` -- the Phase 1.5 worker subagent (this Bee) that `the-queen` dispatches via Task tool.
- `2026-05-20-command-brief-template.md` -- the template `command-center` writes from.

### `research/external/` (10 files)
Cursor primitives (3):
- `2026-05-20-cursor-subagents-docs.md` -- official Cursor docs, orchestrator pattern, Task tool, nested subagents (Cursor 2.5+).
- `2026-05-20-cursor-skills-docs.md` -- official Cursor docs, skill frontmatter schema, lazy loading, `disable-model-invocation`.
- `2026-05-20-cursor-rules-skills-hooks-guide.md` -- practitioner blog, decision tree across Cursor primitives.

Multi-agent orchestration prior art (3):
- `2026-05-20-cursor-self-driving-codebases.md` -- Cursor engineering blog, recursive planner-worker hierarchy, anti-pattern: peer coordination with locks.
- `2026-05-20-cursor-3-2-multitask-futurum.md` -- analyst piece on Cursor 3.2 `/multitask`, the deliberate-counter-pattern for the-queen.
- `2026-05-20-atelier-pipeline-multi-agent.md` -- open-source multi-agent plugin for Claude Code + Cursor (Eva-as-orchestrator).

File-based FIFO queue mechanics (3):
- `2026-05-20-platformatic-filestorage-queue.md` -- canonical production file queue, atomic rename, subfolder lifecycle.
- `2026-05-20-rstudio-filequeue-go.md` -- minimal Go implementation of the atomic-rename FIFO pattern.
- `2026-05-20-maildir-atomic-locking.md` -- Maildir three-stage lifecycle (tmp/new/cur), structural analog to the-queen's queue/in-process/completed.

Markdown-as-state-machine (1):
- `2026-05-20-markdown-files-as-state-machines.md` -- theoretical justification for the entire stinger design.

## Five most influential sources (for `stinger-forge`)

In rank order of weight on the final stinger design.

### 1. `internal/2026-05-20-command-brief.md` (the Command Brief)
**Why it matters:** This IS the source of truth. The 11-step ACTION list maps directly to the 12 proposed guide files. The nine SUBAGENT CRITICAL DIRECTIVES become the bullet list in `guides/00-principles.md`. The three Open Questions are the only items that survive into the summary's "Open questions" section because they need user resolution, not research.

**Annotation for stinger-forge:** Treat this as the spine. Every guide should be traceable to either an ACTION step or a CRITICAL DIRECTIVE in this brief. If a guide cannot be traced back, stinger-forge has scope-crept; trim it.

### 2. `external/2026-05-20-markdown-files-as-state-machines.md` (Phoenix / Just Understanding Data)
**Why it matters:** This is the single strongest prose argument for the entire `the-queen-stinger` design philosophy. The "make invalid states impossible" framing justifies the move-before-work invariant. The dual-persistence (state JSON + checkpoint markdown) pattern is what `the-queen` implements at the four-tracking-files level. Context compaction is the threat model the design is built against.

**Annotation for stinger-forge:** Cite this prominently in `guides/00-principles.md`. The closing line ("Encode workflows as numbered steps with explicit branching, persist state to disk at checkpoints, and design for context compaction as a guaranteed event, not an edge case") IS the design thesis of the entire stinger.

### 3. `external/2026-05-20-platformatic-filestorage-queue.md` (Platformatic FileStorage)
**Why it matters:** The strongest external evidence that the move-before-work invariant is a production-proven pattern, not an ad-hoc invention. The atomic `rename()` semantics in their JS code map exactly to the-queen's atomic markdown-row move at the agent layer. Cross-validates the design with a separate language, separate domain (job queues vs Bee forging), and separate scale (multi-process workers vs single-agent cycles).

**Annotation for stinger-forge:** Use this in `guides/01-pick-and-lock.md` as the authoritative external reference. The "Multiple workers can safely dequeue from the same filesystem ... only one worker succeeds (OS guarantees atomicity)" quote is the load-bearing citation.

### 4. `external/2026-05-20-cursor-self-driving-codebases.md` (Cursor Engineering Blog)
**Why it matters:** Cursor's own engineering team confirms that the-queen's hierarchical foreman-vs-craftsman design is the correct architecture for multi-agent systems at any scale. The anti-pattern criticism (peer coordination with locks fails because agents hold locks too long) is the explicit justification for the-queen's "no peers, one foreman, structured handoff reports" design.

**Annotation for stinger-forge:** Cite in `guides/00-principles.md` under "Why hierarchical orchestration." The single-role rule directly justifies the FIVE-Bee split (command-center / scripture-historian / stinger-forge / bee-creator / hive-registrar) plus the-queen as orchestrator.

### 5. `external/2026-05-20-cursor-subagents-docs.md` (Cursor Subagents documentation)
**Why it matters:** Canonical Cursor documentation. The orchestrator pattern section is direct prior art for `the-queen`. The skill-vs-subagent decision table justifies the asymmetry in how `the-queen` dispatches (Task-tool for scripture-historian, skill-load for the other four phases).

**Annotation for stinger-forge:** Use the orchestrator pattern quote verbatim in `guides/00-principles.md`. Use the skill-vs-subagent decision table to write `guides/05-phase-15-scripture-historian.md`'s opening paragraph explaining why this single phase uses a different dispatch mechanism.

## Open questions

These survived the research and require user resolution before `stinger-forge` finalizes the guide content. The Command Brief's IDEAS section proposed answers for #1 and #2 but did not commit; #3 is newly surfaced by the research.

1. **Should the in-process file enforce a hard one-row limit?**
   - Proposed in Command Brief: yes, the-queen refuses to start a new cycle if the file has >0 non-blank lines.
   - Research finding: Platformatic FileStorage's "Multiple workers can safely dequeue" semantics works because the OS-level rename is atomic. the-queen's equivalent is the agent-level row move, which is NOT atomic in the OS sense; the single-row-limit invariant is the substitute. RECOMMEND: keep the one-row hard limit AND document the substitution explicitly in `guides/00-principles.md`.

2. **Should the completed-row carry the four model identifiers used for that cycle?**
   - Proposed in Command Brief: yes, for downstream cost/quality analytics. Format: `NNN|worker-bee-name|completed|YYYY-MM-DD|research:<model>|analyst:<model>|builder:<model>`.
   - Research finding: no external evidence either way; this is a pure design choice. Maildir-style stale-lock recovery (from `maildir-atomic-locking.md`) suggests that file/row names should embed enough audit metadata to support post-hoc analysis without requiring a separate journal. RECOMMEND: keep the proposed format. It is small, audit-friendly, and matches industry patterns.

3. **When a downstream phase fails mid-cycle, should `the-queen` automatically roll the row back to the queue, or leave it in `in-process` with a `failed:<phase>` marker?**
   - Proposed in Command Brief: leave it in `in-process` with a marker.
   - Research finding: this aligns with Maildir's "leave the file in `new/` for stale-lock recovery" semantics. Automatic rollback to queue.md silently loses the failure context, which the Command Brief flags as undesirable. RECOMMEND: keep "leave in in-process with marker" but ALSO document the recovery procedure explicitly in `guides/10-failure-modes.md`: human reviewer inspects the partial artifacts on disk, decides whether to retry from the failed phase or roll back to queue.md manually, and clears the in-process row before the next cycle.

4. **(New from research)** **Does the queue file's `pickup_protocol` step 2 need to be updated?**
   - The queue file says: "deletes that row from this file BEFORE doing any work, ... and appends the row to `proposed-bees-completed.md`." This is a one-stage lifecycle.
   - The Command Brief specifies a two-stage lifecycle: queue -> in-process -> completed.
   - These contradict each other. `stinger-forge` MUST flag this for user resolution. RECOMMEND: update the queue file's `pickup_protocol` to match the Command Brief's two-stage lifecycle (this is a separate manual edit, NOT part of stinger-forge's output, but `guides/01-pick-and-lock.md` should call out the stale documentation in the queue file's frontmatter).

5. **(New from research)** **Should the the-queen Bee file declare `proactive: true` or `proactive: false`?**
   - the proposal step has `proactive: true` because the user might say "propose a new Bee" without naming the proposal step explicitly.
   - The Command Brief's NOTES section says: "Trigger policy: on-demand. `the-queen` is invoked explicitly by an orchestrator or by direct user command; it should NOT volunteer because it mutates four tracking files and dispatches four sub-skills per run."
   - These are in tension. RECOMMEND: declare `proactive: true` (matching the other Bees' pattern) BUT write the description so that the trigger phrases require explicit naming ("run the pipeline", "process the next queued Bee", "advance the factory", "drain one entry from the queue") rather than topic-driven phrases that might fire accidentally. This honors both the format consistency and the human-explicit-trigger intent.

## Sources stinger-forge should re-fetch with deeper context

Only at `normal` or `deep` tier would re-fetching be justified. For this `shallow` run, the highlights returned by Exa were rich enough that full-page fetches were not needed. If `stinger-forge` discovers a missing piece during build, the most likely candidates for `web_fetch_exa` follow-up are:

1. `https://cursor.com/docs/subagents` -- full body for the Frontmatter Fields section. Exa highlights truncated some rows of the frontmatter table (`name`, `description` cells were incomplete). If `bee-creator` (Phase 3) needs to author a complete frontmatter for `the-queen.md`, re-fetch this page.
2. `https://www.engineering.fyi/article/towards-self-driving-codebases` -- full body for the "Lessons learned" section. The highlights covered the recommended pattern and the anti-patterns but not the implementation tactics. If `guides/00-principles.md` wants to document specific implementation patterns (e.g., handoff report format), re-fetch.
3. The `command-brief-template.md` repo-root file referenced in the Command Brief: the template lives at the repo root, NOT under `ai-tools/`. `stinger-forge` should verify the path one more time when writing `guides/04-phase-1-command-center.md` and add a "note on template location" if Phase 1 fails to find it.

## Notes on this research run

- The shallow tier suited the domain well. The internal repo sources ARE the authoritative contract; external research was calibrating context, not authoritative override.
- The Firecrawl CLI was not available on PATH in this session, so Exa carried the full external workload. The Exa highlights were sufficient quality that no full-page fetches were required. If a future re-run wants to deepen the research without escalating to `normal`, install Firecrawl CLI (`npm install -g firecrawl-cli`) and use it for bulk-scrape of canonical docs (cursor.com/docs/*, github.com/<repo>/blob/main/README.md).
- The five authored queries from the Command Brief / backlog returned non-overlapping, high-relevance results. The query authoring was good; no expansion was needed for shallow tier.
- One source (`maildir-atomic-locking.md`) is from 2021, older than the 6-month default window. Included because Maildir is a generational spec that hasn't drifted and is the canonical reference for the three-stage lifecycle pattern. The recency cap is not violated in spirit because the spec's stability is the reason it's worth citing.

---

> "Research for `the-queen` is complete at `ai-tools/skills/the-queen-stinger/research/` (19 files, depth: shallow, window: 6 months). Ready to hand off to **stinger-forge**."
