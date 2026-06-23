# Next.js Prefetching & Performance Features

**Sources:**
- https://nextjs.org/docs/app/api-reference/components/link — Link component & prefetch
- https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating — Navigation docs
- https://nextjs.org/docs/app/api-reference/functions/dynamic — Dynamic imports
- https://nextjs.org/docs/app/api-reference/next-config-js/optimizePackageImports
- https://web.dev/articles/preload-critical-assets

**Retrieved:** 2026-04-24
**Query used:** "Next.js prefetching strategy 2026" and "Next.js dynamic import bundle optimization"

## Summary

Next.js App Router automatically prefetches in-viewport `<Link>` destinations during idle time. The resulting navigations feel instant. Tradeoff: aggressive prefetch can over-fetch on low-bandwidth devices or bloat the initial idle budget. The Stinger codifies when to tune this.

## Prefetching rules to preserve

### Default behavior

- `<Link>` in the App Router prefetches the route component (RSC payload) when the link enters the viewport, and navigations are near-instant.
- Prefetching happens only in production builds; dev mode disables it for iteration speed.
- `<Link prefetch={false}>` opts out per-link. Use for low-priority links (footer legal pages, long list items) to save bandwidth.
- `<Link prefetch={null}>` (the default in App Router) = viewport-triggered static prefetch. `prefetch={true}` forces eager prefetch including dynamic segments.

### Dynamic imports for route-level splitting

`next/dynamic` ships components only when needed:

```tsx
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <Skeleton />,
  ssr: false, // Skip SSR if the component is interactive-only
});
```

- `ssr: false` omits the component from server render — useful for client-only widgets (charts with canvas, maps, editors) that bloat the SSR bundle.
- Named exports: `dynamic(() => import('@/components/X').then(mod => mod.X))`.

### `optimizePackageImports`

In `next.config.js`:

```js
experimental: {
  optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'date-fns'],
}
```

Converts full-package imports to per-module ES imports at build time. Without this, importing `Menu` from `lucide-react` pulls the whole icon set into the bundle. With it, only `Menu` is bundled. High-impact for icon and utility libraries.

### Font optimization (recap)

- `next/font/google` and `next/font/local` self-host the font files at build time (no cross-origin request to Google Fonts).
- `display: 'swap'` prevents FOIT (flash of invisible text).
- `preload: true` (default) injects `<link rel="preload">` for the font files.
- `variable: '--font-inter'` exposes a CSS variable so Tailwind can reference it.
- Subset fonts with `subsets: ['latin']` (or `['latin', 'latin-ext']`).

### Bundle hygiene

- `next build && next build --analyze` (with `@next/bundle-analyzer`) reveals bundle bloat.
- **Rule of thumb:** the main-route JavaScript bundle should be under ~170 KB compressed for mobile CWV on 4G. Above that, INP and TBT suffer.
- Remove unused deps; check for moment/lodash full-imports (swap for `date-fns`, per-function lodash).

## Relevance to this stinger

- `guides/06-core-web-vitals.md` §"Code splitting & dynamic imports" references this file.
- `templates/next.config.js` includes `experimental.optimizePackageImports` as a recommended addition.
- `scripts/web-vitals-snapshot.ts` stub captures the main-route bundle size as an auxiliary metric alongside LCP/INP/CLS.
- The playbook §7.5 & §7.6 snippets are preserved verbatim.
