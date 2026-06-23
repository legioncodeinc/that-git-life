# 07 — Mobile Optimization

Mirrors canonical playbook §8. Mobile-first design, touch targets, mobile performance.

**Source research:** `research/2026-04-24-mobile-first-optimization.md`.

---

## 7.1 Mobile-first is not optional

Google has been mobile-first indexing by default since July 2019 and completed the migration for all sites in October 2023. **The Smartphone Googlebot is the primary crawler.** Desktop-only content is functionally invisible.

### The audit bar

- **Test at 320 px (iPhone SE 1st gen) and 375 px (modern baseline) viewports.**
- **No horizontal scroll.** Period. `overflow-x: hidden` is a workaround, not a fix.
- **Touch targets ≥ 44 × 44 CSS px.** Exceeds WCAG 2.2 AA (24 × 24 min); matches Apple HIG, Material Design.
- **Input `font-size` ≥ 16 px** on mobile. Below 16 px, iOS Safari auto-zooms on focus — creates a CLS event AND a user-confusion shift.
- **Viewport meta correctly set.** Next.js `viewport` export (see `guides/01-technical-foundation.md`). Never `userScalable: false` — blocks screen magnifiers.

---

## 7.2 Mobile-first CSS (Tailwind example)

Default styles target mobile. Scale up via breakpoint utilities.

```tsx
// tailwind.config.ts
export default {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
};
```

```tsx
// Mobile-first usage — default is mobile, scale up
<div className="text-base sm:text-lg md:text-xl lg:text-2xl">
  Responsive text
</div>
```

---

## 7.3 Touch target sizing

The canonical CSS from playbook §8.2:

```css
/* globals.css */
button,
a,
input,
select,
textarea {
  min-height: 44px;
  min-width: 44px;
}

@media (pointer: coarse) {
  /* Extra padding on touch devices */
  button,
  a {
    padding: 12px 16px;
  }
}
```

### Anti-patterns to catch

- Icon buttons with 16 × 16 SVG and no surrounding padding. Fix: `min-width/height: 44px` on the `<button>`, centered icon.
- Inline text links adjacent with no margin. Fix: inline-block with margin, or stack vertically.
- Menu items at 32 px height. Fix: 44 px minimum.
- Modal close buttons (`×`) at 24 px. Fix: expand hit area via padding; keep icon visually small.

---

## 7.4 Mobile performance specifics

- **4G is the baseline network.** PageSpeed Insights tests at 4G by default.
- **CPU throttling** is more aggressive on mid-range Android — INP budget is tighter than desktop.
- **Mobile LCP target is 2.5 s same as desktop**, but CrUX field data shows mobile consistently 30–50% slower. Passing on desktop doesn't guarantee passing on mobile.
- **Bundle size matters more.** Mobile CPUs parse JavaScript slower. The 170 KB main-bundle target is a mobile-first number, not a desktop-first number.

### Conditional component rendering

```tsx
'use client';
import { useEffect, useState } from 'react';

export function ResponsiveFeature() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => { setIsMobile(window.innerWidth < 768); }, []);
  return isMobile ? <LightweightMobileComponent /> : <FullFeaturedComponent />;
}
```

**Caveat:** client-side conditional rendering produces two different hydration trees — SEO content must be the **same on both** or mobile-first indexing will miss the desktop-only content. Use conditional rendering for behaviors, not for indexable content.

---

## 7.5 Mobile UX patterns that help SEO

- **Sticky headers sized appropriately** — minimum 56 px height, fixed-positioned without causing CLS.
- **Readable font sizes** — body text ≥ 16 px, line height ≥ 1.5.
- **Single-column layout** — multi-column on narrow viewports almost always causes horizontal scroll.
- **Tap-expandable FAQs** — accordion pattern, not "click for full answer" link navigation.

---

## 7.6 Tools for verification

- **Chrome DevTools Device Mode** — emulates mobile viewports. Free.
- **PageSpeed Insights** — https://pagespeed.web.dev/. Tests mobile + desktop, reports both lab and field data.
- **Google Mobile-Friendly Test** — https://search.google.com/test/mobile-friendly.
- **Real devices** — beats emulation for INP measurement. Test on a mid-range Android (Pixel 5 or equivalent).

---

## Worked example

`examples/audit-ecommerce-site.md` — the audit includes a mobile-specific section flagging horizontal scroll on a pricing table and undersized touch targets in a product card.
