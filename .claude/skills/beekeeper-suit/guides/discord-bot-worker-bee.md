# Discord Bot Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `discord-bot-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/discord-bot-worker-bee.md`](../../agents/discord-bot-worker-bee.md)
**Stinger:** [`.cursor/skills/discord-bot-stinger/`](../../skills/discord-bot-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`discord-bot-worker-bee` owns the Discord developer surface end to end: SDK selection across discord.js (v14/v15), discord.py 2.x, and Serenity/Poise (Rust); application command authoring for slash, user-context, and message-context commands; interactive component flows covering buttons, select menus, and modals; voice channel integration via Lavalink 4 with DAVE-compliant clients (Shoukaku/Lavalink-Client for Node.js, Mafic/lavalink.py for Python); rate-limit handling and REST-only mode; shard management at scale; and the platform verification path past the 75/100-server gate. It does not own general Python packaging, containerisation or CI/CD, credential vault integration, or database schema for bot state — those concerns are handed off to the appropriate peer bees.

## Trigger phrases

Route to `discord-bot-worker-bee` when the user says any of:

- "add a slash command"
- "set up voice"
- "my bot hits 100 servers"
- "migrate to discord.js v14"
- "wire up a modal"
- "review this discord.py bot"
- "bot verification checklist"

Or when the request implicitly involves building, reviewing, debugging, or architecting a Discord bot or Discord application.

## Do NOT route when

- The request is about general Python packaging only — route to `python-worker-bee` instead.
- The request is about container shapes, Dockerfiles, or CI/CD pipelines only — route to `devops-worker-bee` instead.
- The request is about credential vault integration or token rotation only — route to `security-worker-bee` instead.
- The request is about database schema design for bot state only — route to `db-worker-bee` instead.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- The target SDK or language (discord.js, discord.py, or Serenity/Rust) — defaults to discord.js v14 if unspecified.
- The specific task type: command authoring, component flow, voice pipeline, sharding/scaling, or bot verification.
- Existing bot code or project context if this is a review or audit (optional — Bee will request if needed).
- Current guild count or expected scale, especially if the 75/100-server verification gate is relevant (optional — Bee will surface the concern proactively).

## Outputs the Bee produces

- Reviewed and corrected code samples or audit reports using `templates/audit-report.md` as the skeleton, tagged by severity (Critical, High, Medium, Low).
- Slash command stubs adapted from `templates/slash-command-discord-js.ts` or `templates/slash-command-discord-py.py`.
- Voice queue setup adapted from `templates/voice-queue-discord-js.ts` with Lavalink 4 + DAVE-compliant client wiring.
- Filled bot-verification checklist from `templates/bot-verification-checklist.md` (triggered at 75 guilds).

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`.
- When voice or component work surfaces credential concerns, hands off to `security-worker-bee` mid-task.
- When bot state persistence is required, surfaces schema concerns to `db-worker-bee` before proceeding.

## Critical directives the orchestrator should respect

- Never hardcode bot tokens or client secrets — enforce `process.env.DISCORD_TOKEN` / `os.environ["DISCORD_TOKEN"]` in every code sample.
- Always specify the minimum required Gateway Intents — over-privileged intents trigger the Privileged Intent approval gate and slow verification.
- Pin SDK major versions in package manifests — unpinned discord.js/discord.py installs silently break bots in CI.
- Surface bot-verification at 75 servers, not 100 — the application takes 1-5 business days; missing the gate hard-blocks new guild joins.
- Register commands to a test guild during development — global registration has ~1 hour propagation delay; guild-scoped is instant.
- Do not recommend Wavelink — it is abandoned; use Mafic/lavalink.py (Python) or Shoukaku/Lavalink-Client (Node.js).
- All new voice code must use DAVE-compliant clients — DAVE E2EE is mandatory in all Discord voice channels since March 1, 2026.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
