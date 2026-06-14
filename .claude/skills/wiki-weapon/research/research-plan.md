# Research Plan — wiki-weapon (2026-04-29)

Source brief: [`legion/command-briefs/wiki-guardian-command-brief.md`](../../../../command-briefs/wiki-guardian-command-brief.md)
Recon: [`legion/command-briefs/research/2026-04-29-claude-obsidian-recon.md`](../../../../command-briefs/research/2026-04-29-claude-obsidian-recon.md)

## Search queries (13 total — execute via `web_search_exa`, save to `research/2026-04-29-<topic>.md`)

| # | Query | Output file | Drives which guide |
|---|---|---|---|
| 1 | TypeScript ts-morph entity extraction patterns | `research/2026-04-29-ts-morph-extraction.md` | `guides/04-entity-extraction-by-type.md` (function, class) |
| 2 | react-docgen-typescript component metadata extraction | `research/2026-04-29-react-docgen-typescript.md` | `guides/04-entity-extraction-by-type.md` (react-component) |
| 3 | ADR template lightweight format Michael Nygard | `research/2026-04-29-adr-format.md` | `guides/07-adr-detection.md`, `templates/decision.md` |
| 4 | Conventional Commits decision pattern matching | `research/2026-04-29-conventional-commits-decisions.md` | `guides/07-adr-detection.md` (pattern catalog) |
| 5 | Markdown frontmatter schema validation | `research/2026-04-29-frontmatter-validation.md` | `references/frontmatter-schema.md` |
| 6 | Wikilink resolution algorithms | `research/2026-04-29-wikilink-resolution.md` | `guides/09-lint-mode.md` (dead-link checks) |
| 7 | BullMQ queue definition extraction patterns | `research/2026-04-29-bullmq-queue-extraction.md` | `guides/04-entity-extraction-by-type.md` (queue) |
| 8 | Inngest function definition AST extraction | `research/2026-04-29-inngest-extraction.md` | `guides/04-entity-extraction-by-type.md` (queue) |
| 9 | node-sql-parser CREATE TABLE extraction | `research/2026-04-29-sql-ddl-parsing.md` | `guides/04-entity-extraction-by-type.md` (sql-table) |
| 10 | cron-parser Node.js TypeScript | `research/2026-04-29-cron-parser-ts.md` | `guides/04-entity-extraction-by-type.md` (cron-job) |
| 11 | OpenFeature flag declaration patterns | `research/2026-04-29-openfeature-flags.md` | `guides/04-entity-extraction-by-type.md` (feature-flag) |
| 12 | LaunchDarkly SDK client.variation extraction | `research/2026-04-29-launchdarkly-extraction.md` | `guides/04-entity-extraction-by-type.md` (feature-flag) |
| 13 | git blame author distribution heuristics | `research/2026-04-29-git-blame-heuristics.md` | `guides/04-entity-extraction-by-type.md` (History sections) |

## Authoritative sources to consult explicitly (no search needed)

claude-obsidian source files (read-only port references), located at `gods-hand/refs/claude-obsidian-main/`:

- `skills/wiki-ingest/SKILL.md` — REWRITE source for the 8–15 page rule and contradiction protocol shape.
- `skills/wiki-lint/SKILL.md` — PORT source for `guides/09-lint-mode.md`.
- `agents/wiki-ingest.md` — PORT source for `references/parallel-subagent-contract.md` (the "Do NOT" list).
- `agents/wiki-lint.md` — PORT source for the lint sub-agent contract.
- `skills/wiki/references/frontmatter.md` — PORT + extend with code-specific fields.
- `_templates/{entity,concept,comparison,question}.md` — PORT into `templates/` (already done in this pass).

Sibling weapon for style mirroring: `legion/.cursor/skills/library-weapon/`.

## Open questions to resolve via research or user follow-up

- ADR detection confidence threshold — what commit-message patterns count as "high confidence" vs "low confidence"? Q4 result drives this.
- Should `react-component` entity sub-type render `props` as a body sub-section or per-prop entity pages? Brief recommends sub-section; confirm during research with Q2.
- Should `lint` mode catch ADRs whose `superseded_by` was never updated? Yes per brief; codify pattern after Q3+Q4.
- For `queue` and `cron-job`, also extract handler functions as `function` entities and link via `triggers:` frontmatter? Yes per brief atomic principle; codify after Q7+Q8+Q10.
- For `feature-flag`, track call sites via `read_at: [{file, line}, ...]`? Yes per brief; confirm SDK patterns via Q11+Q12.

## Deferred to v2 (do NOT research now)

- Tree-sitter polyglot extraction.
- ollama embedding-based duplicate-page lint (DragonScale).
- DragonScale `wiki/folds/` log rollup mechanism.

## Research note format (per query)

Each `research/2026-04-29-<topic>.md` file should follow:

```markdown
---
title: <topic>
date: 2026-04-29
sources:
  - <url 1>
  - <url 2>
---

# <Topic>

## Summary
[3–5 sentences distilling what wiki-guardian needs to know to apply this in production.]

## Key facts
- ...

## Recommended approach for wiki-guardian
[Concrete, opinionated. Name the library, name the API surface, name the gotchas.]

## Sources
- [Title](URL) — date retrieved 2026-04-29 — [one-line summary]

## Quotes worth preserving
> "..." — author, source

## Open questions / gaps
- ...
```

After all 13 queries complete, write a synthesis at `research/2026-04-29-synthesis.md` mapping each research note to the guide it informs and surfacing any contradictions or gaps that need user input.
