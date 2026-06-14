# typography-font-guardian — God's Guide

The God routing skill's record of when to invoke `typography-font-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/typography-font-guardian.md`](../../agents/typography-font-guardian.md)
**Weapon:** [`ai-tools/skills/typography-font-weapon/`](../../skills/typography-font-weapon/)
**Command Brief:** [`ai-tools/command-briefs/typography-font-guardian-command-brief.md`](../../../command-briefs/typography-font-guardian-command-brief.md)
**Trigger policy:** on-demand

---

## Domain

`typography-font-guardian` owns the technical typographic surface of web products: font loading strategy selection and implementation (Google Fonts, `next/font`, Fontsource, self-hosted variable fonts), `font-display` semantics and FOIT/FOUT/FOFT remediation, variable font configuration (`@font-face` with weight range, `font-optical-sizing`, subsetting via `pyftsubset`), fluid type scale construction using `clamp()` and modular-scale arithmetic (Major Third, Perfect Fourth, Utopia-style generation), vertical rhythm via `line-height` and margin tokens, and the font-token CSS layer (`tokens/typography.css` with three-tier architecture: primitive steps, semantic names, component bindings). It activates after `design-system-guardian` has established the visual language and before `ux-ui-guardian` applies type tokens in components.

## Trigger phrases

Route to `typography-font-guardian` when the user says any of:

- "Set up fonts" / "configure fonts"
- "Audit our typography"
- "Fix FOIT" / "fix FOUT" / "text invisible during load"
- "Build a type scale" / "fluid type scale"
- "Migrate to next/font" / "set up next/font"
- "Self-host fonts" / "host fonts locally"
- "Variable fonts"
- "Font performance" / "fonts slow" / "font blocking render"
- "Set font-display" / "font-display value"
- "clamp() for font sizes" / "fluid typography"
- "Vertical rhythm"
- "Font tokens" / "typography tokens" / "tokens/typography.css"
- "Fontsource" (when asking about setup or comparison)
- "Preload fonts"

Or when the request implicitly involves font loading strategy, type scale, or font token architecture.

## Do NOT route when

- The user is selecting a typeface for aesthetic or brand identity reasons — that is `design-system-guardian`. `typography-font-guardian` consumes the typeface decision and implements the technical loading layer.
- The user asks about applying type tokens inside a specific component (e.g., "make this button use the heading font") — that is `ux-ui-guardian`.
- The user asks about font subsetting in the CI/CD build pipeline (e.g., `glyphhanger` in GitHub Actions, Vercel font optimization flags) — that is `devops-guardian`. `typography-font-guardian` specifies what to subset; the pipeline configuration belongs to `devops-guardian`.
- The user asks about LCP/CWV font impact in a broader Core Web Vitals audit — that is `seo-aeo-guardian`. `typography-font-guardian` can address `font-display` and preload; the full CWV audit belongs to `seo-aeo-guardian`.
- The user asks about persisting a user's font preference to the database — that is `db-guardian`.

If the request straddles typeface selection and font loading (e.g., "set up Inter"), confirm the typeface decision is already made and then invoke `typography-font-guardian` for the loading configuration.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- The project framework (Next.js App Router, Pages Router, Astro, SvelteKit, plain HTML, etc.)
- The font(s) to be used — Google Fonts, self-hosted, Fontsource, or a paid typeface
- Whether the typeface has a variable font variant available
- The target viewport range for the fluid type scale (e.g., 320px to 1440px) — ask if unknown
- Whether the project is multilingual (determines Unicode subset scope)

If the viewport range is unknown, default to 320px–1440px and note the assumption. If the framework is ambiguous between App Router and Pages Router, ask before proceeding — the `next/font` API paths differ.

## Outputs the Angel produces

- `@font-face` rules, `next/font` config (`app/fonts.ts`), or Fontsource import code — whichever matches the chosen hosting strategy
- `tokens/typography.css` — complete font token CSS file with fluid scale, semantic names, line-height, letter-spacing, and rhythm tokens
- Updated `app/layout.tsx` (App Router) applying font CSS variables to `<html>`
- Optional: `docs/typography-audit-YYYY-MM-DD.md` — structured audit report persisted to the repository when the user requests it

## Multi-Angel sequences this Angel participates in

- **Design system bootstrap:** `design-system-guardian` establishes the typeface selection and brand typographic spec → `typography-font-guardian` implements the loading strategy and token layer → `ux-ui-guardian` consumes the type tokens in components.
- **Performance audit:** `seo-aeo-guardian` runs the CWV audit and flags font-related LCP issues → `typography-font-guardian` implements `font-display` strategy, preload hints, and subsetting to resolve them.
- **Security/QA review:** `typography-font-guardian` sets up font loading → `security-guardian` checks for mixed-content issues, CSP `font-src` coverage, and privacy implications of external font CDN requests.

## Critical directives the orchestrator should respect

- Always specify `font-display` on every `@font-face` rule — omitting it causes unpredictable browser behavior.
- Never reference raw `px` font sizes in component code — all sizes must route through `tokens/typography.css`.
- Distinguish FOIT, FOUT, and FOFT before prescribing a fix — each has a different remedy.
- Always subset variable fonts before production — unsubsetted fonts are 300-800 kB.
- Validate `next/font` usage against the App Router API, not Pages Router — they differ significantly.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
