# Icon System Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `icon-system-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/icon-system-worker-bee.md`](../../agents/icon-system-worker-bee.md)
**Stinger:** [`.cursor/skills/icon-system-stinger/`](../../skills/icon-system-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`icon-system-worker-bee` owns the icon delivery layer in React/Next.js applications. It covers library selection and configuration across Lucide, Heroicons, Tabler, Phosphor, and Iconify; the tree-shaking-vs-SVG-sprite delivery trade-off; the dynamic-import-by-name pattern for loading icons from a string key at runtime without bundling the full library; and custom SVG component authoring with correct `viewBox`, `currentColor`, and SVGO conventions. It also owns the full accessibility contract that distinguishes decorative icons (`aria-hidden="true"`) from semantic icons (`aria-label` or adjacent visible text) and interactive icons (accessible name on the `<button>` wrapper), enforcing WCAG 2.1 Level A compliance. The bee does not own design tokens for icon size or color, SVG sprite build-pipeline tooling at the bundler level, or general React bundle-optimization strategies beyond icon imports.

## Trigger phrases

Route to `icon-system-worker-bee` when the user says any of:

- "Which icon library should we use?"
- "My icon imports are bloating the bundle"
- "How do I load an icon by name at runtime?"
- "Build me a reusable icon component"
- "Audit our icons for accessibility"
- "Should I use an SVG sprite?"
- "Icon button has no accessible name"

Or when the request implicitly involves icon library selection, icon bundle size, dynamic icon loading, custom SVG components, or icon accessibility attributes.

## Do NOT route when

- The request is about icon size or color design tokens — route to `ux-ui-worker-bee`, which owns those decisions.
- The request is about SVG sprite build-pipeline tooling at the bundler level (SVGO, svg-sprite CLI, vite-plugin-svgr pipeline configuration) — route to `devops-worker-bee`.
- The request is about general React bundle optimization strategies beyond icon imports — route to `devops-worker-bee`.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- The icon library in use or under consideration (Lucide, Heroicons, Tabler, Phosphor, Iconify, or custom).
- The rendering context: Next.js App Router (RSC), Next.js Pages Router, or plain React SPA.
- Whether icons need to load dynamically by name string at runtime (optional — defaults to static named imports if absent).

## Outputs the Bee produces

- Inline implementation code: named-import icon component, dynamic icon loader, or custom SVG wrapper, placed in the file or directory specified by the user.
- A filled-in `templates/icon-audit-report.md` for audit requests, covering library config, delivery strategy, accessibility findings, custom SVG checklist, findings summary, and next steps.

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- Never import from a library's barrel root unless the library guarantees tree-shaking at that level; barrel imports from unguarded ESM packages bundle every icon into the chunk.
- Always apply the decorative-vs-semantic distinction: every icon must either be hidden from assistive technology (`aria-hidden="true"`) or carry an accessible name; unlabeled interactive icons are a WCAG 2.1 Level A failure.
- Never use the dynamic-import-by-name pattern for SSR-critical above-the-fold icons; dynamic imports introduce a loading waterfall and hydration mismatches.
- Prefer Iconify only when the project genuinely needs multi-library icon mixing; single-library projects pay Iconify's ~8 KB runtime overhead without the benefit.
- Custom SVG components must set `focusable="false"` on the `<svg>` element to prevent keyboard focus in legacy Edge and misidentification by some screen readers.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
