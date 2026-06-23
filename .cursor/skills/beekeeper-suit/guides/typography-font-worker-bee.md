# Typography Font Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `typography-font-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/typography-font-worker-bee.md`](../../agents/typography-font-worker-bee.md)
**Stinger:** [`.cursor/skills/typography-font-stinger/`](../../skills/typography-font-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`typography-font-worker-bee` owns the full technical typographic stack for web products. This includes selecting and configuring font loading strategies (Google Fonts CDN, `next/font`, Fontsource npm, self-hosted with `pyftsubset`), implementing variable font subsetting and `font-display` rules to eliminate FOIT/FOUT/FOFT, building fluid type scales using `clamp()` and modular-scale arithmetic, establishing vertical rhythm via `line-height` and spacing tokens, and translating all of these decisions into a reusable font-token layer (`tokens/typography.css`) consumed by the wider design system. When font decisions overlap with LCP/CLS performance, this Bee owns the `font-display` and preload strategy and hands off Core Web Vitals measurement to `seo-aeo-worker-bee`.

## Trigger phrases

Route to `typography-font-worker-bee` when the user says any of:

- "set up fonts"
- "audit our typography"
- "fix FOIT / fix FOUT / fix FOFT"
- "build a type scale"
- "migrate to next/font"
- "self-host fonts"
- "fluid type"
- "variable fonts"
- "font performance"
- "font-display"

Or when the request implicitly involves font loading strategy, type-scale tokens, vertical rhythm, or `@font-face` configuration.

## Do NOT route when

- The request is about **typeface aesthetic selection or brand typographic spec** — route to `design-system-worker-bee` instead.
- The request is about **per-component application of type tokens** (e.g., which token to use on a button label) — route to `ux-ui-worker-bee` instead.
- The request is about **build-pipeline font optimization** such as running `glyphhanger` in CI — route to `devops-worker-bee` instead.
- The request is about **LCP font impact within a broader Core Web Vitals audit** — route to `seo-aeo-worker-bee` instead.
- The request is about **the data schema for persisted user font preferences** — route to `db-worker-bee` instead.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- **Current font loading mechanism** — how fonts are loaded today (Google Fonts CDN `<link>`, `next/font`, Fontsource npm, raw `@font-face`); required to select the correct hosting-strategy path.
- **Framework and router** — e.g., Next.js 15 App Router vs Pages Router, Astro, SvelteKit; required because `next/font` App Router and Pages Router APIs differ significantly.
- **Viewport min/max range** — minimum and maximum viewport widths for the project; required to generate `clamp()` fluid type-scale values (escalate and stop if unknown).
- **Font license status** — whether any fonts are paid/licensed; required before advising on subsetting (cannot proceed without confirming the license permits subsetting).
- **Migration scope** (optional) — whether the project has an existing partial type scale; if absent the Bee will audit and report before proposing migration.

## Outputs the Bee produces

- **Inline code deliverables** — `@font-face` rules, `next/font` config (`app/fonts.ts`), `clamp()` token file (`tokens/typography.css`), preload hints, and `font-display` annotations, delivered as inline code blocks.
- **Structured typography audit report** — decisions made, font-budget delta (before/after payload size), FOIT/FOUT/FOFT checklist, and performance checklist results; optionally persisted to `reports/typography-audit-YYYY-MM-DD.md` when the user requests it.

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- **Always specify `font-display` on every `@font-face` rule.** Omitting it causes unpredictable FOIT/FOUT/FOFT across Chrome, Safari, and Firefox.
- **Never allow raw px font sizes in component code.** All sizes must route through the fluid type-scale token layer in `tokens/typography.css`.
- **Distinguish FOIT, FOUT, and FOFT before prescribing a fix.** Each requires a different `font-display` remedy; conflating them leads to wrong values and unresolved problems.
- **Always subset variable fonts before production.** Unsubsetted variable fonts are 300–800 kB; a Latin subset is typically 20–60 kB.
- **Validate `next/font` usage against the App Router API, not Pages Router.** The two APIs differ significantly; mixing them causes runtime errors.
- **Express fluid type steps as `clamp()` expressions, never as media-query breakpoint steps.** `clamp()` provides smooth linear interpolation that breakpoint steps cannot replicate.
- **Keep `tokens/typography.css` as the single source of truth.** Font decisions scattered across component CSS, Tailwind config, and globals produce a system that cannot be audited or migrated holistically.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
