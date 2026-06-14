# product-tour-onboarding-ui-guardian — God's Guide

The God routing skill's record of when to invoke `product-tour-onboarding-ui-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/product-tour-onboarding-ui-guardian.md`](../../agents/product-tour-onboarding-ui-guardian.md)
**Weapon:** [`ai-tools/skills/product-tour-onboarding-ui-weapon/`](../../skills/product-tour-onboarding-ui-weapon/)
**Command Brief:** [`ai-tools/command-briefs/product-tour-onboarding-ui-guardian-command-brief.md`](../../../command-briefs/product-tour-onboarding-ui-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`product-tour-onboarding-ui-guardian` owns the in-app guided-experience layer: product tours, tooltips, hotspots, modals, onboarding checklists, and the trigger/segmentation logic that decides who sees what when. It covers the full lifecycle from tool selection (Userpilot, Appcues, Userflow, Pendo Guides, Driver.js, Shepherd.js, Intro.js) through implementation, segment-based triggers, and the tour maintenance protocol that prevents tours from breaking when UI changes. It treats onboarding UX as a product engineering problem, not a marketing configuration task.

## Trigger phrases

Route to `product-tour-onboarding-ui-guardian` when the user says any of:

- "set up a product tour"
- "build an onboarding checklist"
- "our tours keep breaking after deploys"
- "compare Driver.js vs Shepherd.js"
- "which product tour tool should we use"
- "add segment-based tour triggers"
- "our tour is showing to the wrong users"
- "checklist activation gamification"
- "Userpilot vs Appcues vs Userflow"
- "data-tour attribute selector strategy"
- "tour maintenance protocol"
- "Intro.js alternative"
- "product-led growth onboarding UI"

Or when the request implicitly involves in-app guided tours, onboarding checklists, or tour selector drift.

## Do NOT route when

- The user wants onboarding email sequences or lifecycle emails — no Angel owns this yet; flag and defer.
- The request is about tour tooltip/modal visual tokens or spacing — route to `ux-ui-guardian`.
- The request is about custom React tour component architecture — route to `react-guardian`.
- The request is about the user-progress database schema — route to `db-guardian`.
- The request is about analytics event instrumentation for tour funnels — route to PostHog/Mixpanel Angels.
- The request is about user authentication or account setup flows — route to `auth-guardian`.

If a request straddles tour component styling (ux-ui-guardian) and tour mechanics (this Angel), prefer this Angel and surface the token/styling handoff explicitly.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- Product stack (Next.js, React, Vue, plain HTML) and whether a third-party tour tool is already in use.
- Tour goals: activation milestone, target user segment, expected step flow.
- Any known maintenance pain: "tours break after every deploy", "wrong segment sees the tour", "checklist doesn't track progress".
- Budget information (for SaaS tool selection — see `guides/01-platform-selection.md`).

If none of this is provided, the Angel will ask the qualification questions before proceeding.

## Outputs the Angel produces

- Tour configuration spec (platform recommendation + integration steps).
- Code snippets (Driver.js/Shepherd.js hooks, segment-trigger logic, localStorage persistence).
- Populated `templates/data-tour-registry.json`.
- Playwright CI smoke test for selector existence.
- Tour health report at `library/qa/onboarding/<date>-tour-audit.md` or `library/requirements/features/<feature>/reports/<date>-tour-review.md`.

## Multi-Angel sequences this Angel participates in

- **Onboarding flow build-out** — this Angel handles the in-app tour/checklist layer; `ux-ui-guardian` handles visual token application to tour components; `react-guardian` handles custom component architecture; `db-guardian` handles user-progress schema.

## Critical directives the orchestrator should respect

- Always run the qualification checklist (`guides/01-platform-selection.md`) before naming a platform.
- Require `data-tour` attributes on all targeted elements — never allow class-based selectors in a CSS-in-JS codebase.
- Ensure every tour output includes a selector registry and CI smoke test, not just tour content.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
