# Guide 00 — Principles

The non-negotiables for wiki-guardian. Read this before any other guide. Treat each rule as a hard constraint — every one exists because breaking it caused observed harm in claude-obsidian, the system this Angel ports from.

## The 15 directives

### 1. Never touch global state files

`library/knowledge-base/wiki/index.md`, `<type>/_index.md`, `log.md`, `hot.md`, and `.legion/file-hashes.json` are owned exclusively by the Legion VS Code extension's TypeScript driver. wiki-guardian writes per-page content only. The driver reconciles global state in a post-pass after all parallel agents finish.

**Why:** Race conditions and lost writes when N agents run concurrently. See [`references/parallel-subagent-contract.md`](../references/parallel-subagent-contract.md) for the full "Do NOT" list ported verbatim from claude-obsidian.

### 2. Active contradiction protocol is mandatory

When Phase 2 detects a contract change, ALL FOUR artifacts every time: `[!stale]` callout on prior page + `[!contradiction]` callout on new page + entry in `meta/<YYYY-MM-DD>-contradiction-report.md` + `notification_flag` in the response payload. Incomplete handling is a bug.

**Why:** The audit trail is the single most valuable property the wiki provides. See [`guides/06-contradiction-protocol.md`](06-contradiction-protocol.md) and [`references/contradiction-protocol.md`](../references/contradiction-protocol.md).

### 3. Never fabricate an ADR

Only file `decisions/<short-title>.md` pages when commit message language clearly encodes a decision (high-confidence pattern matches). When confidence is below threshold, file a `questions/` page asking a human to confirm — never guess.

**Why:** Fabricated ADRs corrupt the design history. The wiki must be trustworthy.

### 4. Never exceed 300 lines per page

If a page would exceed 300 lines, split into atomic sub-pages and link from a parent.

**Why:** Bloated pages defeat the compounding-graph design — the agent loses the ability to load just the relevant entity.

### 5. Never fabricate relationships

Every `depends_on` / `used_by` / `related` wikilink must be supported by evidence in the chunk: an import statement, a function call, a type reference, a clear commit-message statement.

**Why:** Hallucinated cross-references are worse than missing ones — they actively mislead.

### 6. Always cite source `file:line` for factual claims

Every assertion in an entity body must be traceable to a specific line in the source.

**Why:** Reports without coordinates are not evidence.

### 7. Always use repo-relative paths

Wikilinks and `path` frontmatter are relative to the repo root, never absolute.

**Why:** Absolute paths break the moment the repo is cloned elsewhere.

### 8. Always include `last_commit_hash` in frontmatter on entity pages

Delta-tracking key — the TS driver uses it to know whether to re-scan an entity on the next pass.

**Why:** Without it, every Update scan would re-read every page from scratch.

### 9. Never author PRDs, QA reports, or module narratives

Owned by `library-guardian` and `quality-guardian`. wiki-guardian's scope is atomic entities + the cross-reference web only.

### 10. Never write to source code

Read-only against the codebase. The wiki is a derivative artifact; the code is the source of truth.

### 11. Never invent git facts

All git context comes from the TS driver's pre-computed payload (canonical path) or self-fetched via the user's `git` binary (escape-hatch path). Never hallucinate commit hashes, authors, or dates.

### 12. Always emit the structured response payload

The TS driver's reconciliation pass depends on it. A scan that completes without a payload is a bug.

### 13. When invoked via `@`-mention, always confirm scope before writing

Direct invocation skips the TS driver's chunk planning. Echo back the inferred chunk and ask the user to confirm before any disk writes.

### 14. When invoked via `@`-mention, always flag `partial_scan: true` in the response

Direct invocation produces partial state; the TS driver must run a reconciliation pass to bring `index.md`, `log.md`, `hot.md`, and the hash manifest current.

### 15. Non-JS files get stub pages, not silence

When the chunk includes a file in a language outside the v1 `ts-morph` scope, write a filename-only stub at `entities/<filename>.md` with `language: <detected>` and `status: stub` so v2 multi-language extraction can find and upgrade it later.

---

## The principles map to the brief

These 15 directives are the SUBAGENT CRITICAL DIRECTIVES section of the [Command Brief](../../../command-briefs/wiki-guardian-command-brief.md), reorganized for guide use. If the brief and this guide ever diverge, the brief wins — file an issue (or write a `questions/` page asking which to update).
