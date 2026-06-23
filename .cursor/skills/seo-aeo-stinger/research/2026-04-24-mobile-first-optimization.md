# Mobile-First Optimization & Touch Targets

**Sources:**
- https://developers.google.com/search/mobile-sites/mobile-first-indexing — Mobile-first indexing
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html — WCAG 2.2 target size 24×24 CSS px (minimum)
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html — WCAG 2.1 target size 44×44 CSS px (enhanced / AAA)
- https://developer.apple.com/design/human-interface-guidelines/buttons — Apple HIG 44×44 pt minimum
- https://m3.material.io/foundations/accessible-design/accessibility-basics — Material Design 48dp
- https://web.dev/articles/responsive-web-design-basics

**Retrieved:** 2026-04-24
**Query used:** "mobile-first touch target sizing 44px WCAG Apple" and "mobile-first indexing Google 2024 2025"

## Summary

Google has been mobile-first indexing by default since July 2019 and completed the migration for all sites in October 2023. Desktop-only content is functionally invisible. Touch-target sizing is governed by two converging standards: Apple HIG and Material Design converge on 44–48 CSS pixels; WCAG 2.2's new AA-level Success Criterion 2.5.8 sets a 24×24 CSS-px minimum, with the older WCAG 2.1 AAA-level 2.5.5 sitting at 44×44.

## The rule (the Stinger's bar)

- **Target size ≥ 44×44 CSS pixels** for all interactive elements. This exceeds WCAG AA and matches Apple/Material. Non-negotiable per the brief's "Mobile-first is not optional" directive.
- **Input font-size ≥ 16px** on mobile. Below 16px, iOS Safari auto-zooms into the input on focus, creating a CLS event and user-confusion shift. Apply to `<input>`, `<textarea>`, `<select>`.
- **No horizontal scroll.** Tested on 320px (iPhone SE 1st gen) and 375px (modern baseline). Overflow-x: hidden is a workaround, not a solution — fix the underlying layout.
- **Viewport meta required.** `<meta name="viewport" content="width=device-width, initial-scale=1">` via Next.js `viewport` export. `user-scalable=no` and `maximum-scale=1` break accessibility and are forbidden — the canonical playbook's `viewport` export correctly allows `maximumScale: 5` and `userScalable: true`.

## Mobile performance specifics

- Mobile 4G is the baseline network (PageSpeed Insights default). 3G has been phased out of most tests but should still work.
- CPU throttling is more aggressive on mid-range Android — INP budget is tighter than desktop.
- Mobile LCP target is 2.5s like desktop, but field data (CrUX) shows mobile consistently 30–50% slower. Tight LCP on desktop does not guarantee tight LCP on mobile.
- Conditional rendering (`<ResponsiveFeature>`-style components that serve lightweight mobile variants) is valid but must not break crawlable content — the mobile variant must contain the same essential content as desktop, or mobile-first indexing will miss desktop-only content.

## Touch target anti-patterns

- Icon-only buttons with 16×16 SVG and no surrounding `padding`. Fix: `min-width/height: 44px` on the button, centered icon.
- Inline text links next to each other with no margin. Fix: inline-block with margin, or stack vertically.
- Menu items with 32px height. Fix: increase to 44px minimum.
- Close-icon buttons (`×`) in modals at 24px. Fix: expand hit area with padding; icon can stay small.

## Relevance to this stinger

- `guides/07-mobile-optimization.md` carries the bar and CSS patterns.
- `guides/00-principles.md` surfaces the "mobile-first is not optional" directive from the brief.
- The CSS snippet in playbook §8.2 (`button, a, input { min-height: 44px; }`) is preserved verbatim.
- Audit flow: the Bee tests at 320px and 375px viewports; flags horizontal scroll as Critical; flags sub-44px touch targets as High.
- Cross-reference: `ux-ui-worker-bee` owns visual hierarchy and brand; this Stinger owns the technical/accessibility floor for mobile.
