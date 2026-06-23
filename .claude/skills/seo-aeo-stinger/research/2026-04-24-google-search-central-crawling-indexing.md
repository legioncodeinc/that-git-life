# Google Search Central — Crawling, Indexing, Rendering

**Sources:**
- https://developers.google.com/search — Search Central hub
- https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers — Crawler identification
- https://developers.google.com/search/docs/crawling-indexing/robots/intro — robots.txt spec
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview — Sitemaps
- https://developers.google.com/search/docs/crawling-indexing/canonicalization — Canonical URLs
- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics — JS rendering
- https://developers.google.com/search/docs/appearance/page-experience — Page experience & CWV

**Retrieved:** 2026-04-24
**Query used:** "Google Search Central crawling indexing JavaScript rendering Next.js"

## Summary

Google's pipeline is a three-stage process: **Crawl → Index → Serve**. Technical SEO lives entirely in the first two stages. Next.js hybrid rendering (SSR / SSG / ISR / RSC) is first-class supported by Googlebot — all rendering modes produce a crawlable initial HTML response that Googlebot indexes without waiting for hydration. Client-side-only rendering (CSR) is discouraged because it moves content into the JavaScript pass, which runs later and less reliably.

## Key mechanics to preserve

### Crawling

- **Googlebot** identifies as `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html)`.
- **Mobile-first indexing** (default since July 2019 for all new sites): the **Smartphone Googlebot** is the primary crawler. Desktop content that's absent on mobile is effectively invisible.
- robots.txt is **case-sensitive** for paths. `Disallow: /Admin/` does not block `/admin/`.
- `Disallow: /path` blocks crawl; it does **not** block indexing. A `disallow`ed URL discovered via inbound links may still appear in the index with "No information is available for this page" text. To prevent indexing, serve 404/410, use `<meta name="robots" content="noindex">`, or use the `X-Robots-Tag: noindex` HTTP header — and do **not** disallow the URL (because Googlebot must be able to crawl it to see the noindex directive).

### Indexing

- **Canonicalization:** Google picks one canonical URL per cluster of duplicate content. Signals: `rel=canonical` link, `<link rel="canonical">`, HTTP `Link: rel="canonical"` header, redirects, sitemap inclusion, internal linking consistency. Conflicting signals degrade quality.
- **Canonical tags must be absolute URLs.** Relative canonicals are a common Next.js bug — the Stinger's `lib/metadata.ts` helper enforces absolute via `metadataBase` resolution.
- **`noindex`** removes a URL from the index on next crawl. Pages with `noindex` should not be listed in the sitemap — it's a conflicting signal.

### Rendering

- Googlebot runs a modern Chromium renderer (kept near-current; as of 2024+ it's evergreen with stable Chrome).
- The second "render" pass can happen minutes to days after the initial crawl. Content that only appears after hydration may be temporarily missing from the index.
- **Pre-rendering (SSR/SSG/ISR) is preferred** over CSR for SEO-critical content. Next.js App Router defaults to SSR/RSC — align with this default.
- `noscript` fallbacks are ignored by Googlebot's renderer (it executes JS). They help other crawlers (some AI bots).

## Status codes Google treats distinctly

- **200 OK** — indexed (if not noindex).
- **301 Moved Permanently** — canonical signal transfers to target; preferred for permanent moves.
- **302 Found / 307 Temporary** — no canonical signal transfer; use only for actually-temporary redirects.
- **404 Not Found** / **410 Gone** — de-indexes. 410 is slightly faster.
- **503 Service Unavailable** — preserves index ranking temporarily. Use during planned maintenance with `Retry-After` header.
- **5xx sustained** — eventual de-indexing. Next.js deployment failures that return 500s will lose rankings if prolonged.

## Relevance to this stinger

- `guides/00-principles.md` and `guides/01-technical-foundation.md` cite this note for crawl/index fundamentals.
- `guides/11-troubleshooting.md` captures the "Pages Not Indexing" diagnosis flow rooted here.
- The Bee's `robots: { index: false }` sacred-page rule (brief SUBAGENT CRITICAL DIRECTIVES) traces to the canonicalization rules above — a wrong "fix" can accidentally re-expose a deliberately-noindexed staging page.
- Mobile-first indexing feeds `guides/07-mobile-optimization.md`.
