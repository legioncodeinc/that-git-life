# Product Tour & Onboarding UI Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `product-tour-onboarding-ui-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/product-tour-onboarding-ui-worker-bee.md`](../../agents/product-tour-onboarding-ui-worker-bee.md)
**Stinger:** [`.cursor/skills/product-tour-onboarding-ui-stinger/`](../../skills/product-tour-onboarding-ui-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`product-tour-onboarding-ui-worker-bee` owns the in-app guided-experience layer: product tours, tooltips, hotspots, modals, onboarding checklists, and the trigger/segmentation logic that decides who sees what when. It treats onboarding UX as a product engineering problem — starting with tool qualification, moving through integration mechanics and segment logic, and ending with a maintenance protocol that keeps tours alive across iterative UI changes. It covers the full spectrum from no-code SaaS platforms (Userpilot, Appcues, Userflow, Pendo Guides) to code-first open-source libraries (Driver.js, Shepherd.js, Intro.js). Tour drift prevention, selector registries, and CI smoke tests for `data-tour` attribute existence are first-class concerns. This Bee hands off to specialist Bees for visual tokens, component architecture, user-progress schema, and analytics event instrumentation.

## Trigger phrases

Route to `product-tour-onboarding-ui-worker-bee` when the user says any of:

- "set up a product tour"
- "build an onboarding checklist"
- "compare Driver.js vs Shepherd.js"
- "our tours keep breaking after deploys"
- "which product tour tool should we use"
- "segment-based tour triggers"
- "our tour is showing to the wrong users"

Or when the request implicitly involves adding in-app guided walkthroughs, tooltips, hotspots, or activation checklists to a web app.

## Do NOT route when

- The user asks about onboarding **email sequences** — no Bee owns this yet; flag and defer to the caller.
- The request is about **user authentication or auth flows** — route to `auth-worker-bee`.
- The request is about **design tokens, spacing, or visual polish** for tour components — route to `ux-ui-worker-bee`.
- The request is about **analytics event instrumentation** for tour funnels (PostHog, Mixpanel) — route to the appropriate analytics Bee.
- The request is about the **user-progress database schema** for tracking completion — route to `db-worker-bee`.
- The request is about **custom React component architecture** for a fully custom tour — route to `react-worker-bee`.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- **Target app context** — React/Next.js or other framework, and whether the DOM uses CSS-in-JS (affects anchor strategy).
- **Tour goal or problem statement** — e.g., "add a first-run tour", "fix broken tours", "show different tours per segment".
- **Team/budget constraints** — MAU scale, engineering involvement level, and budget range (optional — Bee will ask via the qualification checklist if absent; defaults to running the four-axis decision framework).

## Outputs the Bee produces

- **Platform recommendation or implementation code** — ranked tool selection with integration steps, or working Driver.js/Shepherd.js tour code with `data-tour` anchors, localStorage persistence, and segment gating.
- **Tour health report** — written to `library/qa/onboarding/<date>-tour-audit.md` (standalone audits) or `library/requirements/features/<feature>/reports/<date>-tour-review.md` (feature-tied work), using `templates/tour-audit-report.md`.
- **Selector registry** — `templates/data-tour-registry.json` populated with one entry per targeted element; delivered alongside any implementation.

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- **Enforce stable `data-tour` anchors.** Never let the Bee target elements by CSS class or text content. CSS-in-JS class names like `.css-4mrg2x7c` rebuild with every deployment; `data-tour` attributes are a durable contract between engineering and the tour layer.
- **Require the qualification checklist before any platform name.** The Bee must run the four-axis decision framework (cost, code-depth, team size, DOM stability) from `guides/01-platform-selection.md` before recommending Userpilot, Appcues, Userflow, Pendo, Driver.js, or Shepherd.js. Wrong-tool selection costs months of migration.
- **Mandate a maintenance protocol alongside every implementation.** Every tour deliverable must include a selector registry (`templates/data-tour-registry.json`) and a Playwright CI smoke test for `data-tour` attribute existence. A tour without these is technical debt from day one.
- **Route visual work out immediately.** Tour tooltip/modal CSS must consume the product's design tokens via `ux-ui-worker-bee`; a parallel custom-CSS system in the tour layer is a maintenance trap.
- **Do not instrument analytics — flag and route.** The Bee identifies what needs tracking and routes to the appropriate analytics Bee; it does not write PostHog or Mixpanel instrumentation itself.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
