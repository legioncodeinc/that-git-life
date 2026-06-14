# Wiki Guardian — God's Guide

The God routing skill's record of when to invoke `wiki-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/wiki-guardian.md`](../../../agents/wiki-guardian.md)
**Weapon:** [`ai-tools/skills/wiki-weapon/`](../../wiki-weapon/)
**Command Brief:** [`ai-tools/command-briefs/wiki-guardian-command-brief.md`](../../../command-briefs/wiki-guardian-command-brief.md)
**Trigger policy:** on-demand (invoked by the Legion VS Code extension's TS driver, or by Cursor user `@`-mention)

---

## Domain

`wiki-guardian` is the Legion's per-repo entity cartographer. It receives code chunks plus pre-computed git context from the Legion VS Code extension's TypeScript driver (or self-discovers chunks when `@`-mentioned), extracts entities across a comprehensive 13-type catalog (function, class, module, service, endpoint, env-var, config-key, data-model, react-component, sql-table, queue, cron-job, feature-flag) using `ts-morph` for TypeScript/JavaScript and filename-only stub pages for other languages, files them as atomic markdown pages with `[[backlinks]]` into `library/knowledge-base/wiki/{entities,concepts,decisions,questions,comparisons,meta}/`, infers Architecture Decision Records from commit messages that clearly encode decisions, and runs an active four-artifact contradiction protocol whenever a contract changes — never silently overwriting history. It is sibling to `library-guardian` (which writes per-module narrative documentation) and is opinionated about three things: atomicity (every entity gets its own page, no compound documents), evidence (every claim cites a source `file:line`), and contradictions (every contract change leaves a `[!stale]` breadcrumb, a `[!contradiction]` callout, a daily journal entry, and a Cursor notification).

## Trigger phrases

Route to `wiki-guardian` when the TS driver fires any of (canonical path):

- `mode: document` — initial scan, no prior wiki state for the chunk
- `mode: update` — incremental scan, prior state exists, contradiction protocol may fire
- `mode: scan-directory` — user-targeted subtree scan
- `mode: lint` — audit-only, no writes, per-chunk health checks

Route on `@`-mention (escape-hatch path) when the user says any of:

- "@wiki-guardian extract entities from {file/dir}"
- "@wiki-guardian document this module's exports"
- "@wiki-guardian what's in `<path>`?"
- "@wiki-guardian add this to the wiki"
- "Lint the wiki" / "Check the wiki for orphans / stale claims / dead links"

Or when the user is in the editor and says something equivalent to "capture this file's entities into the knowledge base."

## Do NOT route when

- The user wants per-module narrative documentation in `library/knowledge-base/<module>/` — that is `library-guardian`. (wiki-guardian writes atomic entities and the cross-reference web; library-guardian writes the narrative around them.)
- The user wants a QA report at `library/qa/` — that is `quality-guardian`.
- The user wants the wiki's global state files (`index.md`, `<type>/_index.md`, `log.md`, `hot.md`, `.legion/file-hashes.json`) modified directly — the TS driver owns those. wiki-guardian writes per-page content only; the driver reconciles global state in a post-pass. Asking wiki-guardian to "regenerate the index" is a routing error.
- The user wants source code modified — wiki-guardian is read-only against the codebase.
- The user wants a PRD or feature spec — that is `library-guardian`.
- The chunk is non-JS/TS without a TS driver invocation — wiki-guardian will write a stub page only; for deep extraction in those languages, wait for v2 (Tree-sitter) or route to the language Angel for now.

If a request straddles "extract entities" and "write a module narrative," invoke `wiki-guardian` first for the atomic entities and then `library-guardian` for the narrative that connects them.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or the TS driver has supplied):

**Canonical path (TS driver):**
- `mode` — document / update / scan-directory / lint.
- `chunk` — list of file paths with full source content, scoped to a logical boundary (one module, one PR diff, one user-selected directory).
- `git_context` — per file: creation commit, last-touched commit (sha + author + timestamp + message), recent commit history with messages, `git blame` author distribution.
- `prior_state` — for `update` mode: the existing entity pages relevant to the chunk (paths + frontmatter).
- `wiki_root` — absolute path to `library/knowledge-base/wiki/` in the target repo.
- `page_caps` — max 300 lines per page, target 8–15 new-or-updated pages per chunk.
- `callout_vocabulary` — permitted semantic callouts (`[!contradiction]`, `[!stale]`, `[!gap]`, `[!key-insight]`).

**Escape-hatch path (`@`-mention):**
- The file or directory in scope (inferred from the user prompt + Cursor's current editor state).
- Explicit user confirmation of the inferred chunk before any write (Angel echoes back and waits).
- Git context — either from the TS driver via `.legion/queue/`, or self-fetched via the user's `git` binary.

If the canonical path's `mode` or `chunk` is missing, do not invoke yet — ask the TS driver to supply them. If the `@`-mention path's scope is vague, ask one clarifying question before any disk write.

## Outputs the Angel produces

**To disk** — atomic markdown pages under `library/knowledge-base/wiki/`:

- `entities/<entity-name>.md` — one per callable code unit across the 13-type catalog. ≤300 lines, full frontmatter (`type`, `entity_type`, `status`, `created`, `updated`, `path`, `language`, `depends_on`, `used_by`, `last_commit_hash`, `tags`), source citations, wikilinks. Non-JS files get stub-status pages.
- `concepts/<concept-name>.md` — one per architectural pattern or data flow that spans multiple entities.
- `decisions/<short-title>.md` — one per ADR inferred from a high-confidence commit-message match (Tier-1 patterns). ADR-shaped (Context / Decision / Consequences / Sources).
- `comparisons/<comparison-name>.md` — when a chunk introduces an alternative to an existing pattern.
- `questions/<question-name>.md` — when a gap requires human judgment or a low-confidence ADR signal needs confirmation.
- `meta/<YYYY-MM-DD>-contradiction-report.md` — written or appended whenever Phase 6 detects contradictions (one journal-style file per day).

**To the TS driver** — a structured response payload with `pages_created`, `pages_updated`, `decisions_filed`, `contradictions_flagged`, `meta_reports_written`, `notification_flags`, `entities_detected` (with file:line), `gaps`, `lint_findings`, `partial_scan` (true for `@`-mention invocations so the driver knows to reconcile global state).

## Multi-Angel sequences this Angel participates in

- **TS driver Document / Update flow** — wiki-guardian extracts entities and authors atomic pages; the TS driver runs the global-state reconciliation pass (updates `index.md`, `<type>/_index.md`, `log.md`, `hot.md`, the hash manifest). Multiple wiki-guardian invocations may run concurrently against different chunks; the driver reconciles in a single post-pass after all parallel agents finish.
- **Compounding documentation** — wiki-guardian writes the atomic entity graph; `library-guardian` writes the per-module narrative at `library/knowledge-base/<module>/` and reads the wiki at query time to enrich its narratives. Together they produce both the cross-reference web and the human-readable story.
- **Audit trail for design history** — when a contract change is detected, wiki-guardian's four-artifact contradiction protocol leaves a permanent record (stale callout + contradiction callout + daily journal + Cursor notification). Downstream consumers (`library-guardian` enriching a narrative, the user querying "when did this change?") read this trail rather than rebuilding it.

## Critical directives the orchestrator should respect

- **Never ask wiki-guardian to touch global state files.** `index.md`, `<type>/_index.md`, `log.md`, `hot.md`, `.legion/file-hashes.json` are owned by the TS driver. Race conditions and lost writes happen otherwise — claude-obsidian learned this the hard way.
- **Active contradiction protocol is mandatory.** All four artifacts every time on a contract change: stale callout + contradiction callout + meta report entry + notification flag. The Angel will refuse to silently overwrite, and so should the orchestrator.
- **Never fabricate ADRs or relationships.** Only file `decisions/` pages on high-confidence Tier-1 commit-message matches; low-confidence signals go to `questions/`. Every `depends_on` / `used_by` / `related` wikilink must be supported by evidence (import statement, function call, type reference, clear commit-message statement).
- **Always cite source `file:line`.** Reports without coordinates are not evidence.
- **Atomic page rule.** ≤300 lines per page, target 8–15 new-or-updated pages per chunk. Compound documents defeat the wiki's design.
- **Non-JS files get stub pages, not silence.** Filename-only basename pages with `language:` and `status: stub` so the wiki acknowledges existence; v2 (Tree-sitter) will upgrade in place.
- **`@`-mention invocation: confirm scope before any write.** Direct invocation skips the driver's chunk planning. The Angel echoes the inferred chunk and waits for explicit user confirmation; the orchestrator should not push it past that pause.
- **Pairing is louder than atomicity.** Every entity declares sibling pairs in frontmatter (queue↔handler, cron↔target, sql-table↔data-model, ADR `supersedes`↔`superseded_by`). Lint mode catches missing pairs as a first-class finding.
- **Never author module narratives, PRDs, or QA reports.** Owned by `library-guardian` and `quality-guardian`. wiki-guardian's scope is atomic entities + the cross-reference web only.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
