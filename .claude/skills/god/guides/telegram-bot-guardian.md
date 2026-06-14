# telegram-bot-guardian — God's Guide

The God routing skill's record of when to invoke `telegram-bot-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/telegram-bot-guardian.md`](../../agents/telegram-bot-guardian.md)
**Weapon:** [`ai-tools/skills/telegram-bot-weapon/`](../../skills/telegram-bot-weapon/)
**Command Brief:** [`ai-tools/command-briefs/telegram-bot-guardian-command-brief.md`](../../../command-briefs/telegram-bot-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`telegram-bot-guardian` owns the full Telegram Bot development surface. It covers the official Bot API (up to 10.0, May 2026, including guest mode and Managed Bots), the grammY TypeScript framework (v1.43.0, recommended choice over abandoned Telegraf), the aiogram 3.x Python framework (v3.28.2, async-native), webhook vs long-polling architecture (with quantitative traffic thresholds), Telegram Mini Apps WebApp platform (initData HMAC-SHA256 and Ed25519 validation, JS SDK wiring), Telegram Stars payments (mandatory for all digital goods in 2026 under Apple/Google compliance enforcement), inline mode, and MTProto escalation via Telethon/TDLib when Bot API limits are exceeded.

## Trigger phrases

Route to `telegram-bot-guardian` when the user says any of:

- "build a Telegram bot"
- "grammY or aiogram?"
- "webhook not delivering" / "bot not receiving updates"
- "Telegram Mini App" / "initData validation"
- "Telegram Stars payment" / "Telegram Payments"
- "set up a webhook for my Telegram bot"
- "how do I handle inline keyboards in Telegram"
- "MTProto vs Bot API"
- "my Telegram bot stopped working after Bot API update"

Or when the request involves building, debugging, or architecting any Telegram bot feature.

## Do NOT route when

- The user needs React/Vue/frontend work inside a Telegram Mini App — route to `react-guardian` (the Mini App frontend is a standard web app; `telegram-bot-guardian` only owns the bot-side initData wiring).
- The user needs Dockerfile, CI/CD, or hosting for their bot server — route to `devops-guardian`.
- The user needs Stripe or external payment processor integration beyond what Telegram Payments wraps — route to `payments-guardian`.
- The user asks a general messaging architecture question unrelated to Telegram — answer inline.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- Use case type: new bot, webhook debugging, Mini Apps, payments, MTProto escalation
- Language preference: TypeScript (grammY) or Python (aiogram)
- Whether a bot token and webhook URL are already configured (for debugging scenarios)
- For Mini Apps: whether there's an existing frontend and what framework it uses
- For payments: whether the goods are digital (Stars required) or physical (fiat allowed)

If the user hasn't specified the use case, ask one targeted question before routing.

## Outputs the Angel produces

- Inline code snippets (grammY or aiogram) for bot features
- Configuration guides for webhook setup
- Mini Apps initData validation code (server-side)
- Architectural recommendations with rationale
- Pre-launch checklist from `templates/new-bot-checklist.md`

## Multi-Angel sequences this Angel participates in

- **Telegram Mini App build:** `telegram-bot-guardian` (bot-side wiring, initData validation) → `react-guardian` (Mini App frontend React/Vue layer) → `devops-guardian` (deployment)
- **Telegram bot deployment:** `telegram-bot-guardian` (bot code + webhook config) → `devops-guardian` (Dockerfile + CI + hosting)
- **Payments integration:** `telegram-bot-guardian` (Stars/Telegram Payments) → `payments-guardian` (if external payment processor also needed)

## Critical directives the orchestrator should respect

- Never produce code with hardcoded bot tokens; always environment variable + .gitignore check.
- Always apply Stars mandate check before any payment code: digital goods require Stars (XTR) with empty `provider_token`.
- Remind the user to validate Mini App `initData` server-side on every Mini Apps engagement.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
