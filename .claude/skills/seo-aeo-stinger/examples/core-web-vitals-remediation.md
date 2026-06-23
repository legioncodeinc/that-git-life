# Example — Core Web Vitals Remediation with Before/After Numbers

**Scenario:** The `/category/apparel` page in the e-commerce audit (`examples/audit-ecommerce-site.md`) fails Core Web Vitals at p75 on mobile: LCP 4.2 s, INP 510 ms, CLS 0.22. The user invokes `seo-aeo-worker-bee` with "fix the CWV on `/category/apparel`".

**Guides exercised:** `06-core-web-vitals.md`, `11-troubleshooting.md` (Issue 2), `02-on-page-optimization.md`.

**Demonstrates the "measured, not asserted" directive.**

---

## Step 1 — Scoping

**Invocation:** "Fix the Core Web Vitals on `/category/apparel`."

**Classification:** Remediation mode. Diagnose → change → measure → record.

**Next.js version:** 15.2.1. Full coverage.

---

## Step 2 — Baseline capture (BEFORE)

Run `scripts/web-vitals-snapshot.ts` + a full PageSpeed Insights run at https://pagespeed.web.dev/?url=https://shop.example.com/category/apparel&strategy=mobile.

### Lab data (Lighthouse CI, mobile emulated)

| Metric | Value | Threshold | Verdict |
|---|---|---|---|
| LCP | 4,190 ms | ≤ 2,500 ms good | Poor |
| INP | 510 ms | ≤ 200 ms good | Poor |
| CLS | 0.224 | ≤ 0.1 good | Poor |
| FCP | 1,890 ms | — | — |
| TTFB | 820 ms | — | — |
| Main JS bundle | 312 KB compressed | target < 170 KB | Over target |

### Field data (CrUX via Search Console, prior 28 days)

| Metric | p75 value | Verdict |
|---|---|---|
| LCP | 3.9 s | Needs improvement |
| INP | 420 ms | Needs improvement |
| CLS | 0.18 | Needs improvement |

### Diagnosed root causes

1. **LCP:** The hero category image is a `<img src="/hero-apparel.jpg">` — bypassing `next/image`. Original is 1.82 MB JPEG. No `priority`, no `preload`.
2. **INP:** The `ProductCard` component is unmemoized; scrolling triggers parent re-renders, each card re-renders (40 cards × ~12 ms = ~480 ms blocking). Also an inline SVG filter effect on hover forces repaints.
3. **CLS:** The `AggregateRating` badge on each card loads async (200 ms after first paint), pushing the card's button row down by ~22 px. `ProductCard` has no fixed height.
4. **Bundle:** `lucide-react` imported at the barrel level pulling 2,500+ icons into the bundle (~180 KB). `date-fns` also full-imported (~70 KB).

---

## Step 3 — Changes

### Fix 1 — LCP image

```tsx
// Before
<img src="/hero-apparel.jpg" alt="Apparel category" className="w-full h-96 object-cover" />

// After
import Image from 'next/image';

<div className="relative w-full h-96">
  <Image
    src="/hero-apparel.jpg"
    alt="Apparel category"
    fill
    priority
    quality={85}
    sizes="100vw"
    className="object-cover"
  />
</div>
```

Adds `priority` (emits `<link rel="preload">`), enables AVIF/WebP format negotiation via `next.config.js`, responsive `srcset`.

### Fix 2 — INP: memoize `ProductCard`, remove hover SVG filter

```tsx
// Before
export function ProductCard({ product }: { product: Product }) {
  return <article className="hover:drop-shadow-xl filter-saturate">{/* ... */}</article>;
}

// After
import { memo } from 'react';

export const ProductCard = memo(function ProductCard({ product }: { product: Product }) {
  return <article className="hover:shadow-xl transition-shadow">{/* ... */}</article>;
}, (prev, next) => prev.product.id === next.product.id && prev.product.stock === next.product.stock);
```

Swap `hover:drop-shadow-xl filter-saturate` (expensive SVG filter) for `hover:shadow-xl transition-shadow` (composited-layer, no repaint).

### Fix 3 — CLS: reserve rating space

```tsx
// Before
{product.rating && <AggregateRating value={product.rating} />}

// After: always render the space, even as skeleton
<div className="h-6 flex items-center">
  {product.rating ? <AggregateRating value={product.rating} /> : <div className="opacity-0" aria-hidden>—</div>}
</div>
```

Now the card always has identical height regardless of rating load order.

### Fix 4 — Bundle: tree-shake `lucide-react` and `date-fns`

```js
// next.config.js
experimental: {
  optimizePackageImports: ['lucide-react', 'date-fns', '@radix-ui/react-icons'],
}
```

Plus: switch `date-fns` imports from barrel to per-function:

```ts
// Before
import { format, parseISO, differenceInDays } from 'date-fns';

// After (per-function imports, ensure tree-shaking works)
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import differenceInDays from 'date-fns/differenceInDays';
```

---

## Step 4 — Post-change measurement (AFTER)

### Lab data (Lighthouse CI, mobile emulated, same environment)

| Metric | Before | After | Delta | Threshold | Verdict |
|---|---|---|---|---|---|
| LCP | 4,190 ms | 2,180 ms | **-2,010 ms** | ≤ 2,500 ms | Good |
| INP | 510 ms | 185 ms | **-325 ms** | ≤ 200 ms | Good |
| CLS | 0.224 | 0.06 | **-0.164** | ≤ 0.1 | Good |
| FCP | 1,890 ms | 1,240 ms | -650 ms | — | — |
| TTFB | 820 ms | 810 ms | -10 ms | — | — |
| Main JS bundle | 312 KB | 148 KB | **-164 KB** | target < 170 KB | Under target |

All three Core Web Vitals now Good at lab level.

### Field data (CrUX, 14-day follow-up)

*Follow-up scheduled for 2026-05-08. CrUX field data updates lag by ~2 weeks; pass at p75 cannot be confirmed until then.*

| Metric | p75 before | p75 after (projected based on lab) | Expected verdict |
|---|---|---|---|
| LCP | 3.9 s | ~2.4 s | Good |
| INP | 420 ms | ~200 ms | Needs-improvement or Good |
| CLS | 0.18 | ~0.08 | Good |

---

## Step 5 — Record in `library/qa/seo/`

Write `library/qa/seo/2026-04-24-cwv-remediation-category-apparel.md` (in the host repo) with the full before/after table, the diagnosis, the changes made (with file diffs), and the scheduled 14-day field-data follow-up.

Template shape matches `templates/audit-report-template.md` §"Core Web Vitals".

---

## Three discovery systems cross-check

| Fix | Traditional search | AI Overviews | AI assistants |
|---|---|---|---|
| LCP image fix | Ranking boost (CWV pass) | Page more likely surfaced | No direct impact |
| INP card memoization | Ranking boost | No direct impact | No direct impact |
| CLS rating reservation | Ranking boost + UX | No direct impact | No direct impact |
| Bundle size reduction | Indirect (faster load → better CWV) | Indirect | Indirect (faster crawl fetch) |

All fixes positively impact traditional search. Neutral impact on AEO/AI assistants. No tradeoffs.

---

## Handoff line

> "Remediated `/category/apparel`. Before: LCP 4.19 s / INP 510 ms / CLS 0.224 (all Poor). After: LCP 2.18 s / INP 185 ms / CLS 0.06 (all Good). Evidence at `library/qa/seo/2026-04-24-cwv-remediation-category-apparel.md`. Follow-up: re-check CrUX field data at p75 on 2026-05-08."
