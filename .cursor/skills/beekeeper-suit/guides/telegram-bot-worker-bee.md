# Telegram Bot Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `telegram-bot-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/telegram-bot-worker-bee.md`](../../agents/telegram-bot-worker-bee.md)
**Stinger:** [`.cursor/skills/telegram-bot-stinger/`](../../skills/telegram-bot-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`telegram-bot-worker-bee` owns the full Telegram Bot development surface for 2026. It covers the Bot API up to version 10.0 (including guest mode and Managed Bots), grammY v1.x (TypeScript — the recommended framework), aiogram 3.x (Python, async-native), and the architectural decision between webhook and long-polling delivery with quantitative production thresholds. The Bee also owns Telegram Mini Apps WebApp platform concerns including server-side initData validation via both HMAC-SHA256 and Ed25519 paths, Telegram Stars payments (mandatory for all digital goods in 2026), inline mode, and MTProto escalation via Telethon/TDLib when Bot API capabilities are exhausted. It does not own the Mini App's frontend React/Vue UI layer, the DevOps surface for deploying the bot server, or external payment processor integrations beyond Telegram Payments.

## Trigger phrases

Route to `telegram-bot-worker-bee` when the user says any of:

- "build a Telegram bot"
- "set up a webhook for my bot"
- "validate initData from a Telegram Mini App"
- "implement Telegram Stars payments"
- "grammY vs aiogram — which should I use"
- "my bot is getting 409 Conflict errors"

Or when the request implicitly involves Telegram Bot API integration, Telegram Mini Apps server-side wiring, or Telegram-specific payment flows.

## Do NOT route when

- The request is about the Mini App's frontend UI or React/Vue components inside the WebView — route to `react-worker-bee` instead.
- The request is about Dockerizing the bot server, CI/CD pipelines, or infrastructure beyond bot-specific webhook concerns — route to `devops-worker-bee` instead.
- The request is about external payment processors (Stripe, PayPal, etc.) that are not Telegram Payments/Stars — route to `payments-worker-bee` instead.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- The target language/runtime (TypeScript with grammY, or Python with aiogram — Bee will recommend if unspecified)
- The bot token or confirmation it will be sourced from an environment variable (never hardcode)
- The deployment target or hosting environment (affects webhook vs long-polling recommendation; Bee applies quantitative thresholds if absent)
- The specific scenario: new bot setup, webhook debugging, Mini Apps initData, payments, inline mode, or MTProto escalation (Bee will classify from context if not stated)

## Outputs the Bee produces

- Code snippets, configuration blocks, or architectural recommendations grounded in the relevant stinger guide, with the guide section cited
- Pre-launch checklist (`templates/new-bot-checklist.md`) applied automatically whenever a bot is going into production

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- Never hardcode bot tokens in any generated code; always use environment variables and verify `.gitignore` coverage before outputting token-adjacent code.
- Always validate Mini Apps `initData` server-side (HMAC-SHA256 or Ed25519); skipping this is a critical auth bypass.
- Telegram Stars are mandatory for digital goods in 2026 — no exceptions; do not suggest fiat paths for digital goods.
- Always call `answerCallbackQuery` within 30 seconds and `answerPreCheckoutQuery` within 10 seconds to prevent duplicate processing.
- Escalate to MTProto only after confirming Bot API 10.0 (including guest mode) cannot cover the use case.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
