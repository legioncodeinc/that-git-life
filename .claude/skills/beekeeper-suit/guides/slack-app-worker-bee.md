# Slack App Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `slack-app-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/slack-app-worker-bee.md`](../../agents/slack-app-worker-bee.md)
**Stinger:** [`.cursor/skills/slack-app-stinger/`](../../skills/slack-app-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`slack-app-worker-bee` owns the full Slack app developer surface built on the Bolt SDK (JS, Python, and Java). It covers Bolt SDK setup and initialization, slash command registration and response patterns, Block Kit UI composition and interactive element wiring, modal open/push/update lifecycle and view submission handling, Events API subscription and HMAC-SHA256 signature verification, OAuth 2.0 multi-workspace installation flows using `InstallationStore`, and App Directory/Marketplace submission including the December 2024 policy constraints. It explicitly does not cover the Deno Slack SDK or the next-generation Workflow Builder platform. All deployment infrastructure, secrets vault, and backend architectural concerns beyond the Bolt integration layer are routed to peer bees.

## Trigger phrases

Route to `slack-app-worker-bee` when the user says any of:

- "build a Slack app"
- "add a slash command"
- "create a Slack modal"
- "set up Slack Events API"
- "multi-workspace OAuth install"
- "submit to Slack Marketplace"

Or when the request implicitly involves Bolt SDK setup, Block Kit composition, Slack interactive components, webhook signature verification, or Slack App Directory distribution.

## Do NOT route when

- The request is about CI/CD pipeline topology or deployment infrastructure for the Bolt backend — route to `devops-worker-bee` instead.
- The request is about secrets vault configuration, token rotation, or a security audit of Slack tokens — route to `security-worker-bee` instead.
- The request is about Django or FastAPI backend architecture decisions beyond the Bolt integration layer — route to `python-worker-bee` instead.
- The request involves Slack Connect or Enterprise Grid administration — out of scope; direct the user to Slack's enterprise documentation.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- The Slack app surface in scope (slash command, modal, Events API, OAuth install, Marketplace submission, or new scaffold)
- The SDK language preference — JS/TypeScript, Python, or Java (defaults to TypeScript if unspecified)
- Whether the app targets Slack Marketplace distribution (shapes Socket Mode vs HTTP mode decision)
- The existing Bolt app code or manifest, if auditing rather than scaffolding (optional — bee will ask if absent and needed)

## Outputs the Bee produces

- Refactored or scaffolded Bolt SDK handler code (TypeScript or Python) using ACK-first / dispatch-async pattern
- Block Kit JSON payloads, modal view definitions, or slash command response structures
- OAuth multi-workspace install flow scaffold using `InstallationStore`
- App Directory submission checklist with December 2024 policy compliance notes
- Security findings (Critical flags for missing signature verification, plaintext tokens, bypassed `state` validation, or missing `event_id` deduplication)

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- **Acknowledge Slack payloads within 3 seconds, then dispatch async for long-running work.** Slack retries unacknowledged payloads up to 3 times and flags unreliable apps. This applies to slash commands, interactive component actions, and Events API deliveries equally.
- **Verify Slack request signatures before processing any payload.** Bolt does this automatically; flag any custom HTTP handler that omits HMAC-SHA256 verification as a Critical security finding and route remediation to `security-worker-bee`.
- **Never store Slack tokens in plaintext config files or committed environment variables.** Flag any token in a committed `.env` or config file as Critical.
- **Always validate the `state` parameter in OAuth callbacks.** Bypassing Bolt's `stateSecret` validation is a Critical CSRF vulnerability.
- **Deduplicate Events API payloads using `event_id` before processing.** Slack delivers events at-least-once; flag handlers missing this check as a data-integrity risk.
- **Never recommend Socket Mode for apps targeting Slack Marketplace listing.** Socket Mode apps are blocked from Marketplace listing; raise this as a blocking issue when Marketplace distribution is in scope.
- **Flag the LLM training prohibition prominently for AI-powered Slack apps.** The December 2024 Slack App Developer Policy explicitly prohibits using Slack data to train LLMs under any circumstances.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
