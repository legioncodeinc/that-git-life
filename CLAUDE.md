# Project guidance

This file mirrors the canonical Cursor rules in [`.cursor/rules/`](./.cursor/rules/) so the Claude Code and Cowork engines load the same always-on guidance. See [RULES.md](./RULES.md) for the full explanation of each.

## No em dashes

Do not use em dashes (`—`) or en dashes (`–`) in any prose written for the user, including chat, documentation, commit messages, PR descriptions, and code comments. Use a comma, colon, parentheses, period, or semicolon instead. Regular hyphens are fine. Preserve dashes inside verbatim quotes, code, and literal data.

## Plan construction protocol

Every multi-step plan follows the same structure. Step one is always to branch off `main` into a feature branch; all work happens there. Every later step names the best-fit model for the task with a one-line justification. Nothing is declared done until it passes the ship gate (tests green, acceptance criteria met).

## PR conflict check

Always check for and resolve merge conflicts before declaring a PR shippable. A PR with conflicts is not done.

## Respect agent work boundaries

Never modify or delete another agent's active work. During parallel or multi-agent sessions, each agent stays inside the files and scope it owns.

## Documentation system

Project planning lives in [`library/`](./library/). Knowledge docs, ADRs, PRDs, and IRDs follow Library Schema v2. See the [README](./README.md) for the full workflow.
