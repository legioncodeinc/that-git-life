# font-loading-guardian — God's Guide

The God routing skill's record of when to invoke `font-loading-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/font-loading-guardian.md`](../../agents/font-loading-guardian.md)
**Weapon:** [`ai-tools/skills/font-loading-weapon/`](../../skills/font-loading-weapon/)
**Command Brief:** [`ai-tools/command-briefs/font-loading-guardian-command-brief.md`](../../../command-briefs/font-loading-guardian-command-brief.md)
**Trigger policy:** on-demand

---

## Domain

`font-loading-guardian` owns the web font loading mechanics layer end-to-end: `font-display` descriptor selection (`swap`, `optional`, `fallback`, `block`) with explicit CLS risk analysis; `<link rel="preload">` strategy including the `crossorigin` requirement and over-preloading risks; the variable-font + Unicode-range subsetting pipeline using `pyftsubset`, `glyphhanger`, and `subfont`; the `next/font` App Router integration (`app/fonts.ts`, Google Fonts and local fonts, `display` option, Tailwind wiring); and CLS-from-font-swap elimination via metric-matched fallback overrides (`size-adjust`, `ascent-override`, `descent-override`, `line-gap-override`) calculated with `fontpie` or `capsizefitter`. It is the performance engineer's lens on font loading, distinct from the typographic designer's lens owned by `typography-font-guardian`.

## Trigger phrases

Route to `font-loading-guardian` when the user says any of:

- "Audit font loading" / "audit our fonts"
- "Fix FOIT" / "text is invisible during load"
- "CLS from font swap" / "layout shift when font loads"
- "font-display: swap" / "which font-display value should I use"
- "Preload fonts" / "font preload not working" / "font loading twice"
- "crossorigin on font preload"
- "Subset variable font" / "font file is too large" / "pyftsubset"
- "next/font config" / "app/fonts.ts" / "next/font display option"
- "Size-adjust" / "ascent-override" / "metric-matched fallback"
- "fontpie" / "capsizefitter"
- "Font performance checklist"

Or when a CLS audit has identified a font-swap as the source of CLS, or when a Lighthouse audit flags "Avoid invisible text" or "Preload key requests" for fonts.

## Do NOT route when

- The user is selecting a typeface or making brand typographic decisions — route to `typography-font-guardian`. `font-loading-guardian` implements loading mechanics for a typeface that is already chosen.
- The user asks about fluid type scales, `clamp()`, modular scales, or vertical rhythm — those belong to `typography-font-guardian`.
- The user asks about configuring `glyphhanger` or `subfont` in a CI/CD pipeline (GitHub Actions, Vercel build) — that is `devops-guardian`'s scope. `font-loading-guardian` specifies what to subset; `devops-guardian` wires the pipeline.
- The user asks about LCP improvements, INP, or Core Web Vitals beyond CLS from fonts — route to `seo-aeo-guardian`.
- The user wants a full performance audit (Core Web Vitals, images, JS bundles, fonts combined) — route to `seo-aeo-guardian` or `lighthouse-pagespeed-guardian` first; they may invoke `font-loading-guardian` for the font-specific remediation.

If a request straddles font loading and typography (e.g., "set up Inter for my Next.js project"), `font-loading-guardian` owns the loading configuration (`next/font`, `font-display`, preload) and `typography-font-guardian` owns the token layer. They can work in sequence.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- The project's current font loading setup: `<link>` tags, `@font-face` rules, `next/font` config, Fontsource imports, or "none yet"
- The framework and version: Next.js (App Router or Pages Router?), Remix, Astro, plain HTML
- The fonts in use: names, formats (WOFF2/variable/static), and hosting (Google Fonts CDN, Fontsource npm, self-hosted)
- Core Web Vitals data if available (CLS score, LCP timing, any font-related flags from PageSpeed Insights)
- Performance budget, if any (target payload size, CLS ceiling)

If the Next.js router version is ambiguous, ask before proceeding — the `next/font` API paths diverge significantly between App Router and Pages Router.

## Outputs the Angel produces

- Corrected `@font-face` rules with explicit `font-display` and `unicode-range`
- `<link rel="preload">` markup with all required attributes
- `app/fonts.ts` configuration for `next/font` projects
- `pyftsubset` / `glyphhanger` CLI commands for variable font subsetting
- Metric-matched fallback `@font-face` blocks (with fontpie-calculated values)
- A structured font loading audit report (persisted to `reports/font-loading-audit-YYYY-MM-DD.md` when requested)

## Multi-Angel sequences this Angel participates in

- **Design system bootstrap:** `design-system-guardian` → `typography-font-guardian` (typeface + token layer) → `font-loading-guardian` (loading mechanics) → `ux-ui-guardian` (component application).
- **Core Web Vitals remediation:** `seo-aeo-guardian` or `lighthouse-pagespeed-guardian` identifies CLS from fonts → `font-loading-guardian` implements metric-matched fallbacks and `font-display` fixes.
- **Performance checklist:** `devops-guardian` sets up CI subsetting pipeline → `font-loading-guardian` verifies the resulting `@font-face` configuration and file sizes are correct.

## Critical directives the orchestrator should respect

- Always specify `font-display` on every `@font-face` — omitting it causes non-deterministic browser behavior
- Never recommend `font-display: swap` without metric-matched fallback overrides — `swap` alone causes CLS
- Always include `crossorigin="anonymous"` on `<link rel="preload" as="font">` — missing this causes double-fetch
- Never preload more than 3 font files — priority inversion risks
- Confirm App Router vs Pages Router before generating `next/font` code — the APIs are incompatible

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
