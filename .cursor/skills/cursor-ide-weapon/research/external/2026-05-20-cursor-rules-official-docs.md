---
source_type: official-docs
authority: high
relevance: high
topic: rule-file-authoring
url: https://cursor.com/docs/rules
fetched: 2026-05-20
---

# Cursor Rules Official Documentation

## Summary

The official Cursor rules documentation defines the complete `.cursor/rules/` system. Rules are markdown files (`.md` or `.mdc` extension) stored in `.cursor/rules/`, version-controlled, and scoped using path patterns, manual invocation, or relevance-based inclusion. The MDC format with YAML frontmatter provides four activation modes: Always Apply, Apply Intelligently, Apply to Specific Files, and Apply Manually.

The three frontmatter fields are `alwaysApply` (boolean), `description` (string), and `globs` (pattern or comma-separated patterns). Their interaction determines the activation mode:

- `alwaysApply: true` + anything = always included, ignores globs and description
- `alwaysApply: false` + globs provided = auto-attached when a matching file is in context
- `alwaysApply: false` + description + no globs = AI reads description and decides relevance
- `alwaysApply: false` + no description + no globs = only when `@`-mentioned in chat

Glob patterns support standard wildcards: `*` (single segment), `**` (any directories), and comma-separation for multiple patterns.

Rules can be created via `/create-rule` command in the Agent panel, or from `Cursor Settings > Rules, Commands > + Add Rule`. Best practices: keep rules under 500 lines, split large rules into composable smaller ones, provide concrete examples, avoid vague guidance, reference files instead of copying content.

Team Rules (Enterprise/Business plans) apply across all repositories, support glob patterns, and can be enforced by team admins.

## Key quotations

- "Each rule is a markdown file that you can name anything you want. Cursor supports `.md` and `.mdc` extensions."
- "Use `.mdc` files with frontmatter to specify `description` and `globs` for more control over when rules are applied."
- "Keep rules under 500 lines. Split large rules into multiple, composable rules."
- "Reference files instead of copying their contents - this keeps rules short and prevents them from becoming stale."

## Annotations for weapon-forge

- This is the primary source for `guides/02-rule-file-authoring.md`. All frontmatter field specs should cite this doc.
- The four-mode table (Always Apply / Apply Intelligently / Apply to Specific Files / Apply Manually) is the canonical taxonomy - use it verbatim in the guide.
- The glob pattern table should be reproduced in the authoring guide with examples.
- The `/create-rule` slash command should be mentioned in the "how to create a rule" workflow in guide 02.
- Contrast with `.cursorrules` (legacy): docs mention it as still supported but not the preferred path.
