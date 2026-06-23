# Preact Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `preact-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/preact-worker-bee.md`](../../agents/preact-worker-bee.md)
**Stinger:** [`.cursor/skills/preact-stinger/`](../../skills/preact-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`preact-worker-bee` owns the full Preact 11 surface for the Legion Army. It covers the signals API (`@preact/signals` v2) including the `createModel`/`useModel`/`action` model pattern, the `preact/compat` compatibility layer for migrating React codebases to Preact, and the third-party embed widget pattern (shadow DOM isolation, IIFE bundle sizing). It also owns Astro island integration via `@astrojs/preact` (including the `client:*` directive matrix and the `>= 5.0.1` `useId` fix) and the Fresh 2.x framework (Deno-native islands, serializable props constraint, cross-island signals state). Critically, it owns the honest "when NOT to choose Preact" decision — surfacing concrete tradeoffs rather than advocating for bundle savings without evidence.

## Trigger phrases

Route to `preact-worker-bee` when the user says any of:

- "use Preact" / "migrate to Preact" / "should I use Preact or React"
- "preact/compat" / "alias React to Preact"
- "signals" / "signal()" / "computed()" / "createModel" / "useModel"
- "embed widget" / "third-party script" / "shadow DOM isolation" / "IIFE bundle"
- "Astro Preact island" / "Fresh framework" / "Fresh 2.x"

Or when the request implicitly involves building a Preact component, evaluating Preact bundle size for a constrained embed, or debugging Preact-specific reactivity behavior.

## Do NOT route when

- The request is about React architecture in general — route to `react-worker-bee` instead.
- The user is configuring Next.js App Router — route to `react-worker-bee`; also flag that `preact/compat` + App Router is a hard footgun.
- The request is about Deno infrastructure, Docker, or deployment concerns that go beyond the Fresh framework — route to `devops-worker-bee` instead.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- The target scenario (new project evaluation, signals authoring, React-to-Preact migration, embed widget, Astro integration, or Fresh framework)
- The existing framework or bundler in use (Vite, Rollup, Webpack, Astro, Fresh/Deno) — needed to give accurate alias or config steps
- React version and any React 19 APIs in use (optional — defaults to checking the compat gap table before proceeding; if React 19 `use()`, `useTransition`, or RSC are present the Bee will surface blockers before migrating)

## Outputs the Bee produces

- Recommendation, code artifact, or migration plan scoped to the classified scenario (component code, alias config, bundle config, or island setup)
- An honest "React is better here" verdict with rationale when no concrete Preact benefit can be named — sourced from `guides/00-when-to-choose-preact.md`

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- Never route to `preact-worker-bee` for a Next.js App Router project without first flagging the `preact/compat` footgun — the Bee will stop and redirect, but the orchestrator should surface the warning early.
- Do not allow `@types/react` to be installed alongside `preact/compat` — type conflicts are pervasive; the Bee enforces Preact's built-in TypeScript types only.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
