# Font Loading Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `font-loading-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/font-loading-worker-bee.md`](../../agents/font-loading-worker-bee.md)
**Stinger:** [`.cursor/skills/font-loading-stinger/`](../../skills/font-loading-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`font-loading-worker-bee` is the performance-first font loading mechanics specialist. It owns everything in the browser's actual font loading sequence: `@font-face` descriptor choices, `font-display` strategy selection with CLS risk analysis, `<link rel="preload">` hints with crossorigin correctness, variable-font subsetting via pyftsubset/glyphhanger/subfont, `next/font` App Router integration for Next.js projects, and CLS-from-font-swap elimination via metric-matched fallback overrides (`size-adjust`, `ascent-override`, `descent-override`, `line-gap-override`). It sits between the upstream visual decisions owned by `typography-font-worker-bee` and the CI/CD infrastructure owned by `devops-worker-bee`. It is opinionated: it recommends `font-display: optional` for body copy, `font-display: swap` + metric-matched fallbacks for LCP headings, and `next/font` for any Next.js project.

## Trigger phrases

Route to `font-loading-worker-bee` when the user says any of:

- "audit font loading"
- "fix FOIT"
- "CLS from font swap"
- "next/font config"
- "preload fonts"
- "subset variable font"
- "font-display strategy"
- "font performance checklist"

Or when the request implicitly involves font loading mechanics, invisible or shifting text on page load, web font payload size, or `@font-face` configuration.

## Do NOT route when

- The request is about typeface selection, aesthetic font pairing, or fluid type scale decisions — route to `typography-font-worker-bee` instead.
- The request is about automating font subsetting inside a CI/CD build pipeline — route to `devops-worker-bee` instead.
- The request is about Core Web Vitals measurement beyond CLS, LCP attribution, or SEO impact of CLS scores — route to `seo-aeo-worker-bee` instead.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- The presenting symptom or goal (FOIT, FOUT + CLS, slow font load, proactive audit, next/font setup, subsetting request)
- The project framework — Next.js App Router vs Pages Router vs plain HTML (required before generating any code; the two Next.js APIs are incompatible)
- Font files or font names in use — optional; if absent the Bee will audit whatever `@font-face` rules are present or ask the user to identify them
- Whether any fonts are paid/licensed typefaces that restrict subsetting — optional; the Bee will escalate and stop if this is unclear before recommending subsetting

## Outputs the Bee produces

- Corrected `@font-face` rules, `<link rel="preload">` markup, `next/font` config (`app/fonts.ts`), or subsetting CLI commands as inline code blocks
- For full audits: a structured audit report following the `reports/README.md` naming and format convention, saved to the project's reports directory

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- Always specify `font-display` on every `@font-face` rule — browser defaults vary across Chrome, Safari, and Firefox; omitting it produces non-deterministic FOIT/FOUT/FOFT.
- Never recommend `font-display: swap` without also implementing metric-matched fallback overrides (`size-adjust`, `ascent-override`, `descent-override`, `line-gap-override`) — `swap` without them trades FOIT for FOUT-with-CLS.
- Always add `crossorigin="anonymous"` to `<link rel="preload" as="font">` — omitting it causes a double-fetch and wastes the preload.
- Never preload more than 2-3 font files — over-preloading inverts the fetch-priority queue and can delay LCP images.
- Always confirm App Router vs Pages Router before generating Next.js font code — mixing the two APIs causes runtime errors.
- Always subset variable fonts before recommending self-hosting — unsubsetted variable fonts are 300-800 kB; a Latin subset is typically 20-60 kB.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
