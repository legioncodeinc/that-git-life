# Guide 02: Rule File Authoring

How to write, migrate, and maintain `.cursor/rules/*.mdc` files correctly.

## Anatomy of a rule file

```mdc
---
description: <One sentence: what this rule is about. Used by AI to decide relevance when globs unset.>
globs: **/*.tsx, **/*.ts
alwaysApply: false
---

# Rule Title

Your rule content here. Use markdown. Be specific. Use examples.
```

All three frontmatter fields are optional, but their presence or absence determines the activation mode (see `guides/01-principles.md`). Omit a field entirely rather than setting it to an empty string — empty strings behave differently from unset across Cursor versions.

## Frontmatter field reference

| Field | Type | Required | Notes |
|---|---|---|---|
| `description` | string | Recommended | Used by AI for intelligent activation. 1-2 sentences max. |
| `globs` | string or list | Optional | Comma-separated patterns or YAML list. Standard glob syntax. |
| `alwaysApply` | boolean | Optional | Defaults to `false` if omitted. |

### Glob pattern syntax

| Pattern | Matches |
|---|---|
| `**/*.ts` | All TypeScript files anywhere |
| `src/**/*.tsx` | TSX files under `src/` |
| `**/*.{ts,tsx}` | TS and TSX files anywhere |
| `*.md` | Markdown files in project root only |
| `**/tests/**` | Any file inside a `tests/` folder |

Comma-separate multiple patterns on the same line: `**/*.ts, **/*.tsx`. Or use a YAML list:

```yaml
globs:
  - "**/*.ts"
  - "**/*.tsx"
```

## How to create a rule file

Three methods, all equivalent:

1. **Slash command (fastest):** type `/create-rule` in the agent panel. Cursor prompts for name and creates the file at `.cursor/rules/<name>.mdc`.
2. **Settings UI:** Cursor Settings > Rules, Commands > "+ Add Rule".
3. **Direct file creation:** create `.cursor/rules/<descriptive-name>.mdc` manually with the Write tool. Cursor picks it up on the next agent invocation.

## Anti-patterns

| Anti-pattern | Why it's bad | Fix |
|---|---|---|
| `alwaysApply: true` on every rule | Exhausts the 2,000-token context budget | Scope with globs or switch to intelligent activation |
| Rule file > 500 lines | Hard to maintain; slow to load | Split into multiple focused files |
| Vague descriptions like "coding standards" | AI cannot decide when to apply intelligently | Write: "Apply when writing or reviewing TypeScript API routes with Zod validation" |
| Copying file content inline | Rules go stale when files change | Use `@filename` references |
| Both `.cursorrules` and `.cursor/rules/` present | Silent precedence conflicts | Migrate fully; archive `.cursorrules` |

## Migrating from `.cursorrules`

Follow this checklist:

1. **Inventory** — read the existing `.cursorrules` file and list every distinct instruction.
2. **Categorise** — for each instruction, decide which activation mode fits:
   - Global always: `alwaysApply: true`
   - File-specific: `globs` scope
   - Context-dependent: intelligent activation with `description`
   - On-demand: no globs, no description (manual)
3. **Create `.mdc` files** — one file per logical group. Name them descriptively.
4. **Set frontmatter** — according to the chosen activation mode.
5. **Test** — open a file matching each glob and verify the rule appears in the agent's context (check via "What rules are active?" prompt).
6. **Archive** — rename `.cursorrules` to `.cursorrules.bak` and confirm no regressions.
7. **Delete** — once stable, remove `.cursorrules.bak`.

## Team Rules (Enterprise / Business)

Team Rules are managed in the Cursor dashboard and pushed to all team members' installations. They:

- Override project rules on conflict.
- Support glob patterns for file scoping.
- Are enforced by team admins; individual developers cannot disable them.

If a user reports "my project rules aren't applying", check whether a Team Rule is overriding them.

## Keeping rules current

Rule bodies should reference files via `@filename` rather than duplicating content. When the referenced file changes, the rule stays accurate automatically. Reserve inline content for short, stable directives that will not drift.

Audit rule files when the codebase undergoes major refactors: glob patterns that matched the old file structure silently stop matching after a rename.
