# preact-guardian — God's Guide

The God routing skill's record of when to invoke `preact-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/preact-guardian.md`](../../agents/preact-guardian.md)
**Weapon:** [`ai-tools/skills/preact-weapon/`](../../skills/preact-weapon/)
**Command Brief:** [`ai-tools/command-briefs/preact-guardian-command-brief.md`](../../../command-briefs/preact-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`preact-guardian` owns all Preact 11 decisions: the signals API (`@preact/signals` v2 with `createModel`/`useModel`/`action`), the `preact/compat` compatibility layer for React-to-Preact migrations, the third-party widget embedding pattern (shadow DOM isolation, IIFE bundles, size budgeting), Astro island integration (`client:*` directives, require `@astrojs/preact` >= 5.0.1 for the `useId` fix), and the Fresh 2.x framework (Deno-native, islands architecture, serializable props constraint, cross-island signals state). It also owns the honest "when NOT to use Preact" decision — surfacing tradeoffs rather than evangelizing. React architecture in general, Next.js App Router configuration, and Deno DevOps beyond Fresh belong to other Angels.

## Trigger phrases

Route to `preact-guardian` when the user says any of:

- "build this in Preact"
- "migrate from React to Preact"
- "preact/compat alias setup"
- "signals createModel / useModel"
- "embed widget bundle size"
- "third-party widget, no React"
- "astro preact island"
- "Fresh framework"
- "Preact vs React — should I switch?"

Or when the request implicitly involves the Preact 11 surface (signals, compat, embed, Astro islands with Preact, Fresh).

## Do NOT route when

- The request is about React architecture, React hooks, or React state management without a Preact context — route to `react-guardian`.
- The request involves Next.js App Router configuration — route to `react-guardian` AND warn the user that `preact/compat` + App Router is a documented footgun.
- The request is about Deno infrastructure, deployment, or devops beyond Fresh — route to `devops-guardian`.
- The request is about design system tokens or visual design — route to `ux-ui-guardian`.
- The user wants to use React Server Components — route to `react-guardian`; Preact has no RSC implementation.

If a request straddles Preact and React, prefer `preact-guardian` only when the Preact-specific surface (signals, compat, embed, Astro/Fresh) is the primary concern.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- **Stack context**: new project, existing React migration, embed widget, or framework (Astro/Fresh)?
- **Bundle size target or constraint** (for embed scenarios)
- **Existing React component tree** (if compat migration is in scope)
- **Framework context**: Astro config, Fresh `deno.json`, or plain Vite setup

If the scenario is ambiguous, `preact-guardian` will ask one targeted clarifying question.

## Outputs the Angel produces

- Recommendation or code artifact (refactored component, migration plan, embed snippet, Fresh route, Astro island)
- "When React is better" verdict with explicit rationale when Preact is not the right call
- Migration checklist (from `templates/migration-checklist.md`) for React-to-Preact migrations
- Bundle size analysis and size budget checklist for embed scenarios

## Multi-Angel sequences this Angel participates in

- **Preact + Astro review**: `preact-guardian` owns the Preact island code; `seo-aeo-guardian` can audit the Astro routes for Core Web Vitals.
- **Bundle optimization**: `preact-guardian` classifies whether Preact is the right tool; `devops-guardian` may be needed for build pipeline changes (tree-shaking, IIFE config).

## Critical directives the orchestrator should respect

- Never recommend Preact without naming a concrete benefit (specific size delta, embed constraint, signals preference).
- Check `preact/compat` compatibility gaps before any migration — `@types/react` conflict and Next.js App Router footgun are the two most common blockers.
- Defer to `react-guardian` for React architecture; `preact-guardian` activates only when Preact's distinct surface is in play.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
