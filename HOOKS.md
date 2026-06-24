# Hooks

> What hooks are, how they work, and how they map across Cursor, Claude Code, Claude Cowork, and Codex.

## What a hook is

A hook is a script that runs automatically when a specific event happens during an agent session. Instead of asking the agent to remember to do something, you wire it to fire on its own. Hooks turn "please always run the linter after editing" into a guarantee rather than a hope. They are the deterministic glue around an otherwise probabilistic agent.

Common uses: format or lint a file right after it is written, block a tool call that violates policy, inject context when a session starts, run tests before a commit, or log every action for an audit trail.

## When a hook fires

Hooks are tied to lifecycle events. The exact names differ by harness, but the common ones are:

- **Before a tool runs** (for example, validate or block a write).
- **After a tool runs** (for example, format the file that was just written).
- **When the user submits a prompt** (for example, add project context).
- **When the session starts or stops** (for example, set up or tear down state).

## How hooks map across harnesses

| Harness | Where hooks are configured | Shape |
|---|---|---|
| **Cursor** | `.cursor/hooks.json` plus scripts in `.cursor/hooks/` | JSON with event keys like `preToolUse` and `postToolUse`, each pointing to a command and an optional `matcher`. |
| **Claude Code** | `.claude/settings.json` under a `hooks` key | Event keys like `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`, `SubagentStop`, and `SessionStart`, each with a matcher and a command. |
| **Claude Cowork** | not user-configurable | Cowork runs in a managed environment, so it does not expose project-level hook files. Automation in Cowork is handled through skills and scheduled tasks instead. |
| **Codex** | `.codex/hooks.json` plus scripts in `.codex/hooks/` | Event keys such as `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, and `Stop`. Non-managed hooks must be reviewed and trusted with `/hooks`. |

The concept is the same across Cursor, Claude Code, and Codex, but the file location and exact event names differ, so a hook has to be translated when moving between them. It is not a copy-paste port like skills are.

## State of hooks in this repo

This repo currently ships **no Cursor or Claude hooks**. It previously carried a `sync-claude-skills.sh` post-write hook that symlinked new `.claude/skills/` folders back into `.cursor/skills/`. That hook was removed because the skill trees are now maintained as full copies (Cursor, Claude Code, and Cowork each get their own), which is cleaner and more portable than symlinks.

The Codex adapter generates a project-local hook set that records `SessionStart`, `UserPromptSubmit`, and `Stop` events in `.codex/that-git-life/events.jsonl`. It also runs That Git Life policy checks on `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, and `Stop`.

The policy hook writes `.codex/that-git-life/policy-warnings.jsonl` and warns when Codex appears to be changing code on `main` or `master`, changing code without a PRD or IRD, or stopping while `EXECUTION_LEDGER.md` still has open criteria. It is warn-only by default. Set `TGL_HOOK_ENFORCEMENT=block` to make policy warnings fail the hook command.

### Adding a hook back

If you want one, create the matching config for your harness:

- **Cursor:** add `.cursor/hooks.json` and a script under `.cursor/hooks/`.
- **Claude Code:** add a `hooks` block to `.claude/settings.json`.
- **Codex:** add `.codex/hooks.json` and scripts under `.codex/hooks/`, or run `node scripts/build-codex-adapter.mjs --out /path/to/project --profile autopilot --merge-agents`.

Keep hook scripts small, fast, and idempotent. A slow or flaky hook taxes every single action it fires on.

## Related

- [AGENTS.md](./AGENTS.md) - domain specialists
- [SKILLS.md](./SKILLS.md) - packaged capabilities
- [RULES.md](./RULES.md) - always-on guidance
