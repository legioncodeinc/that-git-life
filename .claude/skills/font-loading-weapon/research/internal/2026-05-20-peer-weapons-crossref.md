---
source_url: internal
retrieved_on: 2026-05-20
source_type: blog
authority: official
relevance: medium
topic: cross-reference
weapon: font-loading-weapon
---

# Internal Cross-References: font-loading-weapon Peer Weapons

## Summary
Cross-reference notes mapping the boundary between `font-loading-weapon` and its
neighboring weapons in the Legion AI Tools Factory. These boundaries are
documented in the Command Brief and define what the Angel owns vs defers.

## Peer Weapon Boundaries

### typography-font-guardian / typography-font-weapon
- **Location:** `ai-tools/skills/typography-font-weapon/`
- **Owns:** Typeface selection, fluid type scale (`clamp()`), font tokens
  (CSS custom properties for `--font-body`, `--font-heading`), FOUT/FOIT/FOFT
  general overview, `next/font` self-hosting overview, `font-display: swap`
  general recommendation.
- **font-loading-guardian takes over at:** The specific `@font-face` descriptor
  choices, preload strategy, subsetting pipeline, metric-override CLS
  elimination technique, and the measurable performance audit.
- **Handoff point:** `font-loading-guardian` produces the `@font-face` rules
  and fallback stacks; `typography-font-guardian` wraps them into the CSS token
  layer that references the loaded families.

### seo-aeo-guardian / seo-aeo-weapon
- **Location:** `ai-tools/skills/seo-aeo-weapon/`
- **Owns:** CLS Core Web Vitals score impact on SEO ranking, LCP attribution,
  PageSpeed Insights score interpretation.
- **font-loading-guardian feeds:** CLS score improvement from font-swap
  elimination, LCP improvement from font preloading, the audit report numbers
  that feed into an SEO CWV report.

### devops-guardian / devops-weapon
- **Location:** `ai-tools/skills/devops-weapon/`
- **Owns:** CI/CD subsetting pipeline automation (running `pyftsubset` as a
  build step, font optimization in the build system).
- **font-loading-guardian feeds:** The exact CLI commands and unicode-range
  values that the CI pipeline should run. `devops-guardian` wires them; 
  `font-loading-guardian` defines the commands.

### lighthouse-pagespeed-guardian / lighthouse-pagespeed-weapon
- **Location:** `ai-tools/skills/lighthouse-pagespeed-weapon/`
- **Owns:** Running Lighthouse CI, interpreting audit scores, performance
  budgets in CI.
- **font-loading-guardian feeds:** The "Ensure text remains visible during
  webfont load" audit (font-display), the CLS attribution panel, font payload
  size as a performance budget item.

## Annotations for weapon-forge

- The peer weapon boundaries define the `## Out of Scope` section in `SKILL.md`.
- The handoff to `typography-font-guardian` (produces `@font-face` rules; peer
  wraps them into token layer) should be the closing line in several guides.
- The `seo-aeo-guardian` relationship means CLS scores from font fixes should
  be measurable and reportable — include a "measuring the result" section in
  `guides/06-performance-checklist.md`.
