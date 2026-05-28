# ADR-008 — Affiliate signups open in browser tabs and surface as a blocking checklist

- **Status:** Accepted
- **Date:** 2026-05-23
- **Decision owner:** Mario Aldayuz
- **Supersedes:** —

## Context

The brief requires the user to sign up for several third-party services (Cloudflare, GoDaddy, Claude.ai paid, GitHub, Obsidian, plus IDE plan) using Notorious Llama affiliate links. We need a flow that maximizes both conversion and user understanding without being annoying.

## Decision

Two-phase signup orchestration:

1. **During install (CLI phase):** the install script opens a sequence of browser tabs to each affiliate URL, pausing for "Press Enter when ready for the next one" between tabs. The user is told upfront how many tabs are coming.
2. **At first boot (web UI):** the onboarding flow renders a **blocking checklist**. Each row is one required account, with the same affiliate link and a "I signed up" toggle. **No subsequent onboarding step unlocks until every checklist item is checked.** Checklist state is persisted in SQLite (`onboarding_steps` table).

## Why

- **Tabs during install** = friction-free path for users who're ready to sign up immediately. They get the signups out of the way and arrive at the web UI with accounts in hand.
- **Blocking checklist in the UI** = safety net for users who skipped tabs, closed them, or want to take signups in their own time. They literally can't proceed without the accounts the rest of the product depends on.
- **Persistent state** = if the user closes the browser mid-onboarding, they come back to the same checklist.

## Affiliate URL list

URLs are referenced by ID, not hardcoded into the flow. Mario maintains the canonical list at `src/installers/affiliate-urls.ts`:

```ts
export const AFFILIATE_URLS = {
  github:       'TODO_AFFILIATE_URL_GITHUB',
  cloudflare:   'TODO_AFFILIATE_URL_CLOUDFLARE',
  godaddy:      'TODO_AFFILIATE_URL_GODADDY',
  claudeAi:     'TODO_AFFILIATE_URL_CLAUDE_AI',
  obsidian:     'TODO_AFFILIATE_URL_OBSIDIAN',
  cursorPro:    'TODO_AFFILIATE_URL_CURSOR_PRO',
  claudeMax:    'TODO_AFFILIATE_URL_CLAUDE_MAX',
} as const;
```

Placeholders ship in the v0 build. Mario fills them in before public launch.

## Consequences

- The web UI cannot proceed past the checklist until the user toggles every item. There is **no skip** button — by design.
- We trust user self-reporting on "I signed up." Validating accounts via OAuth would be a much bigger build with limited upside.
- If a new required account is added later (e.g., a new tool), it's a one-line addition to the checklist data + URL constants. The flow scales.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Tabs only, no checklist | Users who closed tabs or skipped get stuck with missing accounts later. |
| Checklist only, no tabs during install | Slower path for the eager user. |
| Detect accounts via OAuth | Massive scope add; doesn't work for all services. |
| Skip button on checklist | Defeats the purpose — users hit broken flows later when missing accounts surface. |
