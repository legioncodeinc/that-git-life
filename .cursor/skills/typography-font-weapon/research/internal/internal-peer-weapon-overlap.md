---
source_type: internal
authority: high
relevance: high
topic: peer weapon boundaries and handoff surfaces
url: ai-tools/skills/design-system-weapon/ and ai-tools/skills/ux-ui-weapon/
retrieved: 2026-05-20
---

# Peer Weapon Overlap Notes

## Summary

Three peer Weapons share boundary surfaces with `typography-font-weapon`. Understanding the handoff points is critical to ensuring guides do not over-reach or leave gaps.

## 1. design-system-weapon (upstream)

**Owns:** typeface selection (aesthetic rationale, brand alignment), master design brief, primitive token definitions (color palette, spacing base, etc.).

**Handoff to typography-font-weapon:** The design brief provides the chosen typeface name(s), licensing status, and variable font availability. `typography-font-weapon` then implements the technical loading and token layer. The font-token file `tokens/typography.css` is typography's output that design-system-weapon references as its typographic source-of-truth.

**Overlap risk:** Token naming conventions. Ensure `--font-family-*`, `--font-size-*`, `--line-height-*`, `--letter-spacing-*`, `--font-weight-*` naming in `tokens/typography.css` matches the token naming schema that `design-system-weapon` established for the project. The typography weapon does NOT invent token naming from scratch - it aligns with the existing schema.

## 2. ux-ui-weapon (downstream)

**Owns:** per-component application of type tokens, pixel-perfect component specifications against design brief.

**Receives from typography-font-weapon:** The `tokens/typography.css` file with `--font-size-*`, `--line-height-*`, `--letter-spacing-*`, `--font-weight-*` variables. `ux-ui-weapon` uses these as `var()` references in component styles, never hardcoding raw sizes.

**Overlap risk:** Component-specific type overrides. If a component needs a non-standard type treatment (e.g., a display heading at 90px), `ux-ui-weapon` should define a component-scoped token that references a primitive in `tokens/typography.css`, not bypass the token layer.

## 3. devops-weapon (adjacent)

**Owns:** build pipeline configuration, CI/CD steps, font subsetting tooling in CI.

**Handoff surface:** `typography-font-weapon` specifies _what_ to subset (Unicode ranges, axes, OpenType features, target byte budget). `devops-weapon` implements _how_ the subsetting runs in the pipeline (e.g., `glyphhanger` in GitHub Actions, Vercel font optimization flags). The weapon's `guides/06-performance-checklist.md` should note this boundary explicitly.

## 4. seo-aeo-weapon (cross-reference)

**Cross-reference only:** web font loading affects LCP, which is a Core Web Vitals signal that `seo-aeo-weapon` monitors. `guides/06-performance-checklist.md` should explicitly reference the `font-display: optional` + preload combination as the recommended pattern for LCP-sensitive fonts, and note that `seo-aeo-weapon` owns the broader LCP optimization context.

## Annotations for weapon-forge

- Write `guides/05-font-token-layer.md` with explicit sections on "How to name tokens to align with design-system-weapon output" and "How ux-ui-weapon consumes these tokens."
- Write `guides/06-performance-checklist.md` with a dedicated section on "Build pipeline boundary - what typography-font-weapon specifies vs. what devops-weapon implements."
- In `SKILL.md`, include a "Peer Weapon boundaries" section that lists these four weapons and their handoff points.
