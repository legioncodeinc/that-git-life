# Next.js Image Optimization — AVIF/WebP, LCP, `<Image>` component

**Sources:**
- https://nextjs.org/docs/app/api-reference/components/image
- https://nextjs.org/docs/app/building-your-application/optimizing/images
- https://web.dev/articles/lcp — LCP element rules
- https://caniuse.com/avif — AVIF browser support
- https://caniuse.com/webp — WebP browser support

**Retrieved:** 2026-04-24
**Query used:** "Next.js image optimization AVIF WebP fallback" and "Next.js Image component LCP priority"

## Summary

Next.js `<Image>` component wraps `<img>` with on-the-fly format conversion (AVIF → WebP → original), responsive `srcset` generation, lazy loading by default, and layout-shift prevention (requires `width`/`height` or `fill`). Correctly configured, it's the single biggest LCP and CLS win on most sites.

## Key rules to preserve

- **Format order in `next.config.js`:** `images.formats: ['image/avif', 'image/webp']`. Next.js negotiates the best format via the browser's `Accept` header. AVIF is ~50% smaller than JPEG, WebP ~25% smaller; AVIF has slower encoding so first-request cost is higher — offset by longer `minimumCacheTTL`.
- **`priority` on LCP candidates:** The single above-the-fold hero image should set `priority`. This injects a `<link rel="preload">` and disables lazy loading. Never set `priority` on multiple images per page — it causes preload competition.
- **`sizes` attribute required when using `fill`:** Without `sizes`, the browser downloads the largest srcset variant. Example: `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`.
- **Explicit `width` and `height`:** Prevents CLS. Use intrinsic dimensions when known; use `fill` (with parent `position: relative`) when the image must size to its container.
- **`placeholder="blur"`:** Needs `blurDataURL`. Use `plaiceholder` or `@plaiceholder/next` to generate at build time for local images. Next.js auto-generates for statically imported images.
- **`quality`:** Default 75. For hero images use 85; for photographic full-bleed use 90. Above 90 rarely yields visible improvement but doubles bytes.
- **`remotePatterns` required for external images:** `next.config.js > images.remotePatterns` must allowlist external hosts. `domains` is deprecated in Next.js 14+.
- **`loader` for CDNs:** If a CDN (Cloudinary, Imgix, Cloudflare Images) handles transforms, set `images.loader: 'custom'` and provide a `loaderFile`. Avoid running two optimization layers.

## LCP-specific rules

- The LCP element is the largest `<img>`, `<video>`, background-image, or block-level text in the initial viewport.
- If LCP is an image, that image must be `priority`. Any other lazy-loaded image blocking the network queue delays it.
- If LCP is text, the custom font must use `display: swap` (not `block`), and the text must not wait on a hero image to render.
- If LCP is a background-image, move it to a `<picture>` or `<Image fill>` — background-image doesn't participate in `srcset` and is harder to optimize.

## Relevance to this stinger

- `guides/02-on-page-optimization.md` and `guides/06-core-web-vitals.md` cite this file for image rules.
- `templates/next.config.js` carries the AVIF/WebP + deviceSizes + remotePatterns configuration verbatim from playbook §2.1.
- The audit flow in the brief mandates `priority` on LCP candidates; this is a Critical finding if missing.
- `examples/core-web-vitals-remediation.md` shows a concrete LCP fix using `<Image priority>` with measured before/after.
