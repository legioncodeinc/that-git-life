# Rules

> What rules are, how they work, and how they map across Cursor, Claude Code, and Claude Cowork.

## What a rule is

A rule is standing guidance that applies to the agent at all times, not just when a specific task comes up. Where a skill is loaded on demand and an agent is invoked for a domain, a rule is always in the room. Rules encode the non-negotiables: house style, safety constraints, workflow gates, and the conventions every agent must respect no matter what it is working on.

Think of rules as the constitution. Agents and skills do the work, but rules set the boundaries they all operate inside.

## How rules map across harnesses

| Harness | Where rules live | Shape |
|---|---|---|
| **Cursor** | `.cursor/rules/*.mdc` | Markdown with frontmatter: `description`, `alwaysApply`, and optional `globs` to scope a rule to certain files. |
| **Claude Code** | `CLAUDE.md` (project) and `~/.claude/CLAUDE.md` (global) | Always-loaded project memory. Nested `CLAUDE.md` files can scope guidance to subtrees. |
| **Claude Cowork** | `CLAUDE.md` plus project instructions | Cowork runs on the Claude Code engine, so the same `CLAUDE.md` mechanism applies, alongside any project-level instructions configured in the app. |

Cursor's `.mdc` rules and Claude Code's `CLAUDE.md` are different formats, so rules are translated, not copied, between them. This repo keeps the canonical rules as Cursor `.mdc` files and mirrors them into a root [`CLAUDE.md`](./CLAUDE.md) so the Claude Code and Cowork engines pick them up too.

## The rules in this repo

All four are always-on (`alwaysApply: true`).

| Rule | File | What it enforces |
|---|---|---|
| **No em dashes** | [`.cursor/rules/no-em-dashes.mdc`](./.cursor/rules/no-em-dashes.mdc) | No em dashes or en dashes in any prose written for the user. Use commas, colons, parentheses, periods, or semicolons instead. Applies to chat, docs, commits, and comments. |
| **Plan construction protocol** | [`.cursor/rules/plan-construction-protocol.mdc`](./.cursor/rules/plan-construction-protocol.mdc) | Mandatory structure for every multi-step plan: branch off `main` first, route each step to the best-fit model, and pass a ship gate before declaring done. |
| **PR conflict check** | [`.cursor/rules/pr-conflict-check.mdc`](./.cursor/rules/pr-conflict-check.mdc) | Always check for and resolve merge conflicts before declaring a PR shippable. |
| **Respect agent work boundaries** | [`.cursor/rules/respect-agent-work-boundaries.mdc`](./.cursor/rules/respect-agent-work-boundaries.mdc) | Never modify or delete another agent's active work. Agents stay in their lane during parallel sessions. |

## Writing a good rule

- Keep it short and absolute. A rule is a constraint, not a tutorial.
- State the bad pattern and the good pattern side by side so it is unambiguous.
- Scope it. If a rule only applies to certain files, use `globs` in Cursor or a nested `CLAUDE.md` in Claude Code.
- Only make a rule always-on if it truly should apply everywhere. Over-broad rules get ignored.

## Related

- [AGENTS.md](./AGENTS.md) — domain specialists
- [SKILLS.md](./SKILLS.md) — packaged capabilities
- [HOOKS.md](./HOOKS.md) — event-driven automation
