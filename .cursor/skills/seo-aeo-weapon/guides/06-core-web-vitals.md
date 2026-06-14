# 06 — Core Web Vitals & Performance

Mirrors canonical playbook §7. Monitoring setup, Web Vitals reporting, image and font optimization, code splitting, prefetching.

**Source research:** `research/2026-04-24-core-web-vitals-thresholds.md`, `research/2026-04-24-nextjs-image-optimization.md`, `research/2026-04-24-nextjs-prefetching-strategy.md`.

**Templates:** `templates/lib-web-vitals.ts`.

---

## 6.1 The three Core Web Vitals

As of March 12, 2024, INP replaced FID. Current stable trio: **LCP, INP, CLS**.

| Metric | Good | Needs improvement | Poor |
|---|---|---|---|
| **LCP** — Largest Contentful Paint | ≤ 2.5 s | 2.5–4.0 s | > 4.0 s |
| **INP** — Interaction to Next Paint | ≤ 200 ms | 200–500 ms | > 500 ms |
| **CLS** — Cumulative Layout Shift | ≤ 0.1 | 0.1–0.25 | > 0.25 |

(Source: https://web.dev/vitals, full details in `research/2026-04-24-core-web-vitals-thresholds.md`.)

**Measured at 75th percentile of page loads, segmented by desktop and mobile.** Field data (CrUX), not lab data. Lighthouse approximates but is not what Google ranks on.

**FID is deprecated.** `onFID` in the `web-vitals` library still works but is a legacy metric — don't build new dashboards around it.

---

## 6.2 Monitoring setup

### Root layout wiring

```tsx
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
```

- `@vercel/speed-insights` → CWV field data, free on Vercel.
- `@vercel/analytics` → traffic + event data.
- Alternatives: `web-vitals` → your own analytics endpoint (see `templates/lib-web-vitals.ts`). Also `next/web-vitals` hook in pre-App-Router codebases.

### Custom reporter

`templates/lib-web-vitals.ts` subscribes to `onLCP`, `onINP`, `onCLS`, `onFCP`, `onTTFB` (plus `onFID` for legacy). Each metric fires once per page and is sent to your analytics endpoint via `navigator.sendBeacon()`.

---

## 6.3 LCP optimization

The largest element in the initial viewport must render within 2.5 s.

### Tactical fixes

1. **`priority` on the LCP image.** Injects `<link rel="preload">`. One per page only.
2. **`next/font` with `display: 'swap'`.** Prevents custom-font LCP text from waiting on font download.
3. **Preconnect to external domains.** For CDNs, third-party fonts, etc.:
   ```tsx
   <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
   ```
4. **Inline critical CSS** where possible. Next.js handles this via the App Router's automatic CSS extraction.
5. **Server-render the above-the-fold content.** CSR-only hero content is LCP death.
6. **Compress responses.** `compress: true` in `next.config.js`. Brotli on modern hosts.

### If LCP is a `<video>`

- Provide a `poster` image — the poster becomes the LCP candidate and renders faster.
- Use `preload="metadata"` not `preload="auto"`.

### If LCP is text

- Custom font must be preloaded (`next/font` handles this).
- Text content must be in the HTML response, not fetched client-side.

---

## 6.4 INP optimization

INP measures the longest interaction latency observed in a visit. Click → next frame. Tap → next frame. Keypress → next frame.

### Tactical fixes

1. **Chunk long tasks.** Any single JavaScript task > 50 ms blocks user interaction. Use `requestIdleCallback`, `scheduler.yield()`, or `setTimeout(0)` to break up work.
2. **Defer non-critical scripts.** Use `<Script strategy="lazyOnload">` or `afterInteractive`. Avoid `beforeInteractive` unless truly required.
3. **Reduce `useEffect` cascades.** Each hook that runs on interaction delays the next paint.
4. **Memoize expensive components.** `React.memo`, `useMemo`, `useCallback`. But don't blanket-memoize — pay the cost only where it matters.
5. **Lazy-hydrate below-the-fold components.** `next/dynamic` with `{ ssr: true }` for SEO, deferred client hydration.
6. **Remove synchronous third-party scripts.** GA4 is async by default (good). Intercom, Hotjar, Pendo often default to sync — add `strategy="lazyOnload"` via Next.js `<Script>`.

### Bundle size

Main-route JS bundle target: **< 170 KB compressed** for mobile 4G (source: `research/2026-04-24-nextjs-prefetching-strategy.md`). Above that, INP suffers.

Measure with `@next/bundle-analyzer`. Use `optimizePackageImports` in `next.config.js` to tree-shake icon and utility libraries.

---

## 6.5 CLS optimization

Cumulative Layout Shift measures unexpected movement of visible content during page load.

### Tactical fixes

1. **Explicit dimensions on all images and videos.** `width` and `height` or `fill` with parent `position: relative`.
2. **Reserve space for ads.** Any ad slot needs fixed dimensions.
3. **Reserve space for embeds.** Twitter/Instagram/YouTube embeds load async — wrap in a fixed-aspect-ratio container.
4. **`next/font` for custom fonts.** Prevents FOIT → FOUT shift. Set `fallback` metrics so the swap is geometrically identical.
5. **Don't insert content above existing content.** Injected banners/notifications must be fixed-positioned or pushed below the fold.
6. **Avoid `display: none` → `display: block` transitions** of hero-area content.

CLS excludes layout shifts within 500 ms of user interaction (user-initiated changes are fine).

---

## 6.6 Image optimization recap

See `guides/02-on-page-optimization.md` §2.3 for the full image patterns. CWV-specific rules:

- `priority` on the LCP image only.
- `placeholder="blur"` for below-fold images — zero CLS.
- `sizes` attribute correct; oversizing the selected srcset variant wastes LCP budget.
- `quality={85}` default; higher only for hero.
- AVIF → WebP → original format cascade, configured in `next.config.js`.

---

## 6.7 Font optimization

```tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});
```

- `next/font` self-hosts at build time — eliminates cross-origin round-trip.
- `display: 'swap'` prevents invisible-text wait.
- `preload: true` (default) injects font `<link rel="preload">`.
- Subset via `subsets` — `['latin']` only if no non-Latin text. Adding `['latin', 'latin-ext']` doubles the file.

---

## 6.8 Code splitting & dynamic imports

```tsx
const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false, // Only for interactive-only widgets
});
```

Split on:

- Route level — automatic via App Router.
- Below-the-fold interactive components.
- Platform-specific features (mobile-only carousels, desktop-only sidebars).
- Heavy third-party libraries (charts, maps, editors).

Do **not** `ssr: false` on SEO-critical content. The content will be absent from the initial HTML and Googlebot's second render may or may not see it.

---

## 6.9 Prefetching strategy

App Router auto-prefetches in-viewport `<Link>` destinations. For low-priority links (footer, long lists), opt out:

```tsx
<Link href="/privacy" prefetch={false}>Privacy Policy</Link>
```

For high-priority CTAs whose route is dynamic, force eager prefetch:

```tsx
<Link href={`/products/${id}`} prefetch>View Product</Link>
```

---

## 6.10 Measurement protocol (the "measured, not asserted" directive)

For any performance-impacting change:

1. **Capture baseline.** Run Lighthouse CI or `scripts/web-vitals-snapshot.ts` on the target pages. Record LCP/INP/CLS.
2. **Apply change.**
3. **Capture post-change.** Same pages, same tool.
4. **Record in `library/qa/seo/`.** Use the template in `templates/audit-report-template.md`. Save at `library/qa/seo/<date>-cwv-remediation-<route>.md`. Before/after table. Include the URL, the metric, the before value, the after value, and the delta.
5. **Field data follow-up.** Lab data (Lighthouse) is a proxy — acceptable for in-session validation. Schedule a 14-day follow-up against Search Console CrUX field data to confirm the improvement sticks at p75.

---

## Worked example

`examples/core-web-vitals-remediation.md` — before/after measured LCP/INP/CLS fix on a hypothetical page, with the tactical changes annotated.
