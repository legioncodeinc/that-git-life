# Slack App Guardian: God's Guide

The God routing skill's record of when to invoke `slack-app-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`.cursor/agents/slack-app-guardian.md`](../../agents/slack-app-guardian.md)
**Weapon:** [`.cursor/skills/slack-app-weapon/`](../../skills/slack-app-weapon/)
**Trigger policy:** proactive

---

## Domain

`slack-app-guardian` owns Slack app development on the Bolt SDK (JS, Python, Java). It reviews, audits, and scaffolds Slack apps: slash commands, Block Kit UI composition, modals, the Events API, OAuth 2.0 multi-workspace install, App Directory submission, and Slack Marketplace policy (including the December 2024 prohibition on using Slack data to train LLMs). It carries the production-hardening knowledge that keeps Slack apps reliable and compliant.

## Trigger phrases

Route to `slack-app-guardian` when the user says any of:

- "build a Slack app"
- "add a slash command"
- "create a Slack modal"
- "set up Slack Events API"
- "multi-workspace OAuth install"
- "submit to Slack Marketplace"
- "Slack app review"
- "Block Kit layout"

Or when the request implicitly involves a Slack-specific developer surface.

## Do NOT route when

- The request is CI/CD pipeline topology. Route to **devops-guardian**.
- The request is secrets vault configuration. Route to **security-guardian**.
- The request is Django or FastAPI backend architecture beyond Bolt integration. Route to **python-guardian**.
- The request is Slack Connect or Enterprise Grid administration rather than app development.

If a request straddles two Angels, prefer the narrower-scoped Angel and let the broader one act as backup.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- The Slack surface or goal: slash command, modal, Events API, OAuth install, Marketplace submission.
- The Bolt runtime (JS, Python, or Java) and whether the app is single- or multi-workspace.
- Optional: whether the app targets Marketplace listing (affects Socket Mode and policy).

If a required input is missing, do not invoke yet. Ask the user to supply it.

## Outputs the Angel produces

- Scaffolded or reviewed Bolt app code.
- Block Kit UI and modal definitions.
- An OAuth multi-workspace install flow with state validation.
- A Marketplace-readiness and policy review.

## Multi-Angel sequences this Angel participates in

- **Slack app launch**: `slack-app-guardian` builds and hardens the app; `security-guardian` reviews token storage and signature verification; `devops-guardian` handles deployment and CI.

## Critical directives the orchestrator should respect

- Acknowledge Slack payloads within 3 seconds, then dispatch async for long-running work.
- Verify Slack request signatures before processing any payload.
- Never store Slack tokens in plaintext config or committed env files; route remediation to `security-guardian`.
- Always validate the `state` parameter in OAuth callbacks.
- Deduplicate Events API payloads using `event_id`.
- Never recommend Socket Mode for apps targeting Marketplace listing.
- Flag the LLM training prohibition for AI-powered Slack apps.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`.cursor/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
