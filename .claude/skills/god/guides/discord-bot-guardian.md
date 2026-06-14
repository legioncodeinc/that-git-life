# Discord Bot Guardian — God's Guide

The God routing skill's record of when to invoke `discord-bot-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/discord-bot-guardian.md`](../../agents/discord-bot-guardian.md)
**Weapon:** [`ai-tools/skills/discord-bot-weapon/`](../../skills/discord-bot-weapon/)
**Command Brief:** [`ai-tools/command-briefs/discord-bot-guardian-command-brief.md`](../../../command-briefs/discord-bot-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`discord-bot-guardian` owns the Discord developer surface end to end: SDK selection (discord.js v14/v15, discord.py 2.x, Serenity/Poise for Rust), application command authoring (slash, user-context, message-context), interactive component flows (buttons, select menus, modals), voice channel integration via Lavalink 4 with DAVE-compliant clients (Shoukaku/Lavalink-Client for Node.js; Mafic/lavalink.py for Python), rate-limit handling, shard management, gateway-vs-HTTP-endpoint architectural decisions, and the platform verification path past 100 server installs. It encodes the May 2026 state of the Discord API (v10, DAVE mandatory, Wavelink abandoned) and proactively flags outdated SDK usage, over-privileged intents, and impending verification gates.

## Trigger phrases

Route to `discord-bot-guardian` when the user says any of:

- "add a slash command"
- "build a Discord bot"
- "set up voice in my bot"
- "my bot hits 100 servers"
- "Discord bot verification checklist"
- "migrate to discord.js v14"
- "discord.py slash commands"
- "wire up a modal"
- "review this Discord bot"
- "set up Lavalink"
- "gateway intents"
- "DeferReply pattern"
- "bot sharding"
- "button interaction handler"

Or when the request implicitly involves any Discord API, Discord SDK, or Discord bot behavior.

## Do NOT route when

- The user asks about general Python packaging, `uv`, `pyproject.toml`, or Ruff configuration unrelated to a Discord project — route to `python-guardian`.
- The user asks about Dockerfile, CI/CD, GitHub Actions, or container deployment for a bot — route to `devops-guardian` (discord-bot-guardian surfaces the env-var contract but defers pipeline decisions).
- The user asks about credential vault integration, secret rotation, or token security beyond "use an env var" — route to `security-guardian`.
- The user asks about database schema, ORM choice, or query optimization for bot state storage — route to `db-guardian`.

If a request straddles discord-bot-guardian and python-guardian (e.g. "set up a discord.py bot with uv"), prefer discord-bot-guardian for the Discord surface and let python-guardian handle packaging concerns as a follow-up.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- The bot codebase or a description of the feature to build (file tree, main entry point, command files).
- The SDK in use or intended (discord.js, discord.py, Serenity, or undecided).
- Current SDK version (if reviewing existing code).
- The task: build new feature, review existing code, debug interaction, prepare verification.
- Optionally: current guild count (needed for verification checklist routing).

If the SDK is undecided, route to `guides/01-sdk-selection.md` first.

## Outputs the Angel produces

- **Code additions / refactors** — slash command files, component handlers, voice queue setup, intent configuration, using the project's existing SDK and style.
- **Markdown audit report** at `docs/discord-audit-<date>.md` (using `templates/audit-report.md` skeleton) for full bot audits.
- **Filled bot-verification checklist** (`templates/bot-verification-checklist.md`) when the guild count is approaching 75.
- **Inline PR feedback** for code review tasks.

## Multi-Angel sequences this Angel participates in

- **Bot security review** — `discord-bot-guardian` audits the Discord surface, then `security-guardian` audits the credential and data-handling layer.
- **Discord bot build** — `discord-bot-guardian` builds the bot; `devops-guardian` wires the Docker + CI deployment; `db-guardian` designs the state schema if persistence is needed.
- **New Python bot** — `discord-bot-guardian` owns the discord.py API surface; `python-guardian` handles packaging (`uv`, `pyproject.toml`, `Ruff`, type adoption).

## Critical directives the orchestrator should respect

- Never recommend Wavelink — it is abandoned. Use Mafic/lavalink.py (Python) or Shoukaku/Lavalink-Client (Node.js).
- All voice code must target DAVE-compliant clients (mandatory since March 1, 2026).
- Always use `process.env.DISCORD_TOKEN` / `os.environ["DISCORD_TOKEN"]` — never hardcode tokens.
- Surface the bot-verification deadline at 75 guild installs, not 100.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
