# 11 — Troubleshooting Guide

Mirrors canonical playbook §12. Six canonical issue categories with symptoms, diagnosis, and remediation.

**Source research:** `research/2026-04-24-google-search-central-crawling-indexing.md`, `research/2026-04-24-core-web-vitals-thresholds.md`, `research/2026-04-24-schema-org-structured-data.md`.

---

## Issue 1 — Images not optimizing

**Symptoms:** Large image file sizes, slow LCP, Network tab shows JPEG/PNG originals instead of AVIF/WebP.

**Diagnosis:**

1. Inspect the hero image's Network-tab response. Content-Type should be `image/avif` (on AVIF-capable browsers) or `image/webp`. If `image/jpeg`, optimization isn't running.
2. Check `next.config.js` — is `images.formats` set? Is `unoptimized: true` present anywhere?
3. Check that `<Image>` from `next/image` is used — not `<img>`.
4. For external images, check `images.remotePatterns` — the host must be allowlisted.

**Remediation:**

- Remove `unoptimized: true`.
- Use `<Image>` component, not `<img>`.
- Configure `images.formats: ['image/avif', 'image/webp']`.
- Allowlist external hosts in `remotePatterns`.
- Set `quality={85}` for standard, `quality={90}` for hero-photography.

**Governing guide:** `02-on-page-optimization.md` §2.3.

---

## Issue 2 — Poor Core Web Vitals

**Symptoms:** LCP > 2.5 s, INP > 200 ms, CLS > 0.1. Search Console "Page experience" report flags pages as "Poor" or "Needs improvement".

**Diagnosis:**

1. Run PageSpeed Insights on a representative page. Check both Lab and Field data. Field data at p75 is the ranking truth.
2. Identify the LCP element in the PageSpeed report.
3. Check for long tasks blocking INP (DevTools Performance tab, "Long Tasks" lane).
4. Identify layout shifts in the PageSpeed CLS breakdown.

**Remediation:**

- **LCP:** `priority` on the LCP image, `display: swap` on fonts, preconnect to CDN, server-render the hero.
- **INP:** break up long tasks with `scheduler.yield()` or `requestIdleCallback`, defer non-critical scripts to `strategy="lazyOnload"`, lazy-hydrate below-the-fold components.
- **CLS:** set explicit `width`/`height` on images/videos, reserve space for ads and embeds, avoid inserting content above existing content.

**Governing guide:** `06-core-web-vitals.md`. **Record before/after numbers at `library/qa/seo/<date>-cwv-remediation-<route>.md`.**

---

## Issue 3 — Pages not indexing

**Symptoms:** Pages not appearing in Google. Search Console "Coverage" report shows pages as "Crawled — currently not indexed" or "Discovered — currently not indexed".

**Diagnosis:**

1. Check `robots.txt` — is the path blocked? `Disallow` prevents crawl, not indexing, but also prevents Google from seeing any `noindex` directive.
2. Check page HTML for `<meta name="robots" content="noindex">`. In Next.js App Router, this comes from `robots: { index: false }` in metadata.
3. Check HTTP status code — must be 200. 404/410 de-indexes; 5xx delays indexing.
4. Check canonical tag — does it point at a different URL? If so, Google will index the canonical, not this page.
5. Check if the page is in `sitemap.xml`.
6. Check Search Console's URL Inspection tool — shows Google's crawl result.
7. Is the content thin or duplicated? Google may deprioritize indexing.

**Remediation:**

- Fix the blocking directive (remove `noindex`, unblock in robots.txt, correct canonical).
- Submit the URL via Search Console URL Inspection → "Request indexing".
- Ensure the page is in the sitemap.
- For thin/duplicate content: expand the content, or consolidate with the canonical page.

**Critical:** before removing a `noindex`, verify it wasn't intentional. Staging, preview, and admin pages often carry deliberate `noindex`. The brief's directive: "Respect `noindex` intentions. Pages with `noindex` are sacred — do not 'fix' without explicit user confirmation."

**Governing guide:** `01-technical-foundation.md`, `research/2026-04-24-google-search-central-crawling-indexing.md`.

---

## Issue 4 — Schema markup errors

**Symptoms:** Rich Results Test shows errors. Search Console "Rich results" report flags "Parse error" or type-specific warnings.

**Diagnosis:**

1. Test the page URL at https://search.google.com/test/rich-results. Capture the error output.
2. Test the raw JSON-LD at https://validator.schema.org. This catches misspelled property names that RRT ignores.
3. Check for missing required fields per `guides/03-schema-markup.md` §3.3.
4. Check URL absoluteness — all URLs in schema must be absolute (https://...), not relative (/path).
5. Check date formats — must be ISO 8601 (`2026-04-24T10:30:00Z`).

**Remediation:**

- Add missing required fields.
- Convert relative URLs to absolute.
- Fix date formats to ISO 8601.
- Nest `@context` at the outer level only, not inside nested types.
- Re-run both validators. **Record both outputs in the audit report** (`library/qa/seo/<date>-schema-validation.md` or under a feature folder) before ship.

**Governing guide:** `03-schema-markup.md`, `research/2026-04-24-schema-org-structured-data.md`.

---

## Issue 5 — Duplicate content

**Symptoms:** Multiple pages with substantially identical content. Google consolidates them and may pick an unexpected canonical. Search Console "Duplicate without user-selected canonical" warning.

**Diagnosis:**

1. Run a Screaming Frog crawl or `siteaudit` crawler. Look for duplicate title tags, duplicate H1s, or fingerprint-similar content.
2. Check URL parameters — are faceted URLs (sort, filter, tracking) creating duplicates?
3. Check for `/index.html` vs `/` duplicates.
4. Check for `http://` vs `https://`, `www.` vs non-`www.` — these should be redirected, not coexist.

**Remediation:**

- Implement `rel="canonical"` pointing at the canonical URL (via `alternates.canonical` in metadata).
- Set up 301 redirects for protocol/subdomain variants.
- Use `noindex` on intentional duplicate pages (archive pages, print views).
- Consolidate similar content into a single authoritative page.
- For faceted URLs, canonical the faceted variant to the base.

**Governing guide:** `01-technical-foundation.md`, `02-on-page-optimization.md`.

---

## Issue 6 — Slow build times

**Symptoms:** `next build` taking > 5 minutes. Deploys feel painful.

**Diagnosis:**

1. Check the number of static pages. `generateStaticParams` over 10,000 entries is slow.
2. Check for slow API calls inside `generateMetadata` or `generateStaticParams` — each call is a serial build step.
3. Check image processing volume. Thousands of static images at build time slow things.
4. Run `next build --profile` to identify the slowest steps.

**Remediation:**

- For large `generateStaticParams`, consider ISR (`revalidate`) or `dynamicParams: true`.
- For dynamic params, set `fallback: 'blocking'` so uncached pages render on first request.
- Cache API calls used in build-time functions.
- Move heavy image processing to a CDN / build-time-only pipeline (e.g., Cloudinary transforms instead of Next.js Image processing for static assets).
- Consider partial prerendering (PPR) in Next.js 15+ — hybrid static + streaming.

**Governing guide:** `06-core-web-vitals.md` §6.8 (code splitting).

---

## Escalation triggers

Hand off to another Bee when:

- **CSP header changes** → `security-worker-bee`.
- **Server Actions, advanced RSC patterns** → `react-worker-bee`.
- **Pages Router → App Router migration** → `react-worker-bee`.
- **PRD authoring for the remediation plan** → `library-worker-bee`.
- **Accessibility deep-dive** (WCAG audit) → `ux-ui-worker-bee`.

---

## Worked examples

- `examples/core-web-vitals-remediation.md` — Issue 2 walked through with before/after numbers.
- `examples/audit-ecommerce-site.md` — surfaces Issues 1, 2, 4, and 5 in a single audit.
