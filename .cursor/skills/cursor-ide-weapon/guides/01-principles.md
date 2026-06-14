# Guide 01: Principles

Core philosophy for `cursor-ide-guardian` — read this before any rule authoring, MCP work, or SDK task.

## The MDC-first imperative

`.cursorrules` was Cursor's original rules format: a single file at the project root, always included in every chat/composer/agent context. It still works in Chat mode, but **it is silently ignored in Agent mode**. Because virtually all modern Cursor workflows involve the agent — inline completions aside — any team using `.cursorrules` exclusively loses all their rules the moment they adopt agentic workflows. There is no error, no warning, no indication.

**Rule 1: any project using agentic workflows must use `.cursor/rules/*.mdc`.**

When both formats coexist, MDC wins on conflicting instructions. The override is silent. This means `.cursorrules` content may seem to work (in Chat) while being completely absent (in Agent), leading to inconsistent behaviour across contexts. The safe state is: migrate fully, then archive `.cursorrules`.

## Context budget awareness

Every `alwaysApply: true` rule is prepended to every chat, composer, and agent context window — before any code, before the user's message, before tool calls. This is powerful but expensive.

**Rule 2: keep total `alwaysApply: true` content under ~2,000 tokens across all rule files.**

At 2,000 tokens you have roughly 1,500 words of rule content always burning context budget. Beyond this threshold:

- Agents see less of the actual code they are working on.
- Token costs increase on metered plans.
- Response quality degrades on long-context models that struggle with early instructions being "forgotten".

Prefer `alwaysApply: false` with narrow globs. A rule scoped to `**/*.tsx` that fires only when a TSX file is in context is just as effective as `alwaysApply: true` for TSX files — and costs nothing when the agent is working on Python.

## The four activation modes

Every `.mdc` file with frontmatter picks exactly one of these modes based on the three frontmatter fields:

| Mode name | `alwaysApply` | `globs` | `description` | When it fires |
|---|---|---|---|---|
| Always Apply | `true` | any | any | Every chat, composer, and agent context |
| Apply to Specific Files | `false` | set | any | When a file matching the glob is in context |
| Apply Intelligently | `false` | unset | set | AI reads `description` and decides if relevant |
| Apply Manually | `false` | unset | unset | Only when `@`-mentioned in chat |

**Rule 3: use the most specific activation mode that satisfies the rule's purpose.**

Guidelines:
- Global coding standards that apply everywhere: "Always Apply" (but watch the token budget).
- Language-specific patterns: "Apply to Specific Files" with a glob like `**/*.ts`.
- Domain context (e.g., "This project uses our auth module"): "Apply Intelligently" with a descriptive `description`.
- Reference material users look up on demand: "Apply Manually".

## Rule file size and composability

Cursor recommends keeping individual rule files under 500 lines. This is not a hard limit but a composability signal: if a rule file is growing beyond 500 lines, it probably conflates multiple concerns and should be split.

**Rule 4: one rule file per logical concern. Name files descriptively.**

Good names: `no-em-dashes.mdc`, `react-component-conventions.mdc`, `api-security-rules.mdc`.
Bad names: `rules.mdc`, `all-rules.mdc`, `misc.mdc`.

Use `@filename` references inside rule bodies to point to example files rather than copying them inline. This keeps rules short and prevents them from going stale when the referenced file changes.

## Rule precedence hierarchy

When multiple rules apply to the same context, Cursor applies them in this order (highest priority first):

1. Team Rules (Enterprise/Business admin-enforced, all repos)
2. Project-level `.cursor/rules/*.mdc` files
3. User-level rules (Cursor Settings > Rules)
4. `.cursorrules` (legacy, Chat mode only)

This means project rules can be overridden by Team Rules. Inform users on Enterprise/Business plans that Team Rules may suppress or override their project rules.

## When to defer to other Angels

`cursor-ide-guardian` owns the configuration layer. When the conversation shifts to what the agent produces, hand off:

- Code quality of agent output → relevant language guardian (`react-guardian`, `python-guardian`, etc.)
- Prompts sent to external LLMs → `mind-guardian`
- CI/CD pipelines that invoke SDK agents → `devops-guardian` (after providing the SDK code)
- Canvas React components → `react-guardian`
- Security of MCP credential handling → `security-guardian`
