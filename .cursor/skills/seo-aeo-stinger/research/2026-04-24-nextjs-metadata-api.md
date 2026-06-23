# Next.js Metadata API (App Router)

**Sources:**
- https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
- https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
- https://nextjs.org/docs/app/api-reference/file-conventions/metadata

**Retrieved:** 2026-04-24
**Query used:** "Next.js 15 Metadata API generateMetadata best practices" and "Next.js App Router sitemap dynamic generation"

## Summary

In Next.js App Router, metadata is declared through the Metadata API rather than stuffing tags into `<head>`. Two forms: static (`export const metadata: Metadata = {...}`) and dynamic (`export async function generateMetadata({ params, searchParams }): Promise<Metadata> {...}`). The framework deduplicates and merges metadata across nested layouts and pages; child values override parents by key.

## Key rules to preserve

- **Scope:** Metadata exports are valid from `layout.js/ts` or `page.js/ts` files (App Router only). Not from client components.
- **`metadataBase`:** Required on root layout when using absolute URLs derived from relative strings. Typically `new URL(process.env.NEXT_PUBLIC_SITE_URL)`.
- **Title template:** `{ default, template }` form. `template: '%s | Brand'` — `%s` is replaced by child page titles; `default` is used when no child title is set.
- **`alternates.canonical`:** Sets `<link rel="canonical">`. Use absolute URL or rely on `metadataBase`.
- **`robots`:** Structured form — `robots: { index, follow, googleBot: { ... } }` produces the right meta tags. Setting `index: false` is the App Router way to `noindex` a page.
- **`openGraph` and `twitter`:** First-class keys with nested image arrays. Images resolve against `metadataBase`.
- **`viewport`:** In Next.js 14+, export a separate `viewport` object (not nested in `metadata`). Includes `themeColor`, `colorScheme`, `width`, `initialScale`.
- **`verification`:** `{ google, yandex, bing, yahoo, me, other }` produces ownership-verification meta tags.
- **File conventions:** `app/sitemap.ts` (or `sitemap.xml`), `app/robots.ts` (or `robots.txt`), `app/manifest.ts` (or `manifest.json`), `app/favicon.ico`, `app/icon.{png,svg,jpg}`, `app/apple-icon.png`, `app/opengraph-image.{png,jpg}`, `app/twitter-image.{png,jpg}`. All auto-wired to correct `<link>` / `<meta>` tags.
- **`MetadataRoute.Sitemap`:** Each entry is `{ url, lastModified, changeFrequency, priority, alternates? }`. Max 50,000 URLs or 50 MB per sitemap file — split into sitemap index if larger.
- **`MetadataRoute.Robots`:** `{ rules, sitemap, host }`. `rules` may be an array of `{ userAgent, allow, disallow, crawlDelay }`.

## generateMetadata signature (Next.js 15+)

```ts
export async function generateMetadata(
  { params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string>> },
  parent: ResolvingMetadata
): Promise<Metadata>
```

In Next.js 15, `params` and `searchParams` are Promises — must be awaited. Next.js 14 still accepts sync params; the playbook's examples use the 15 Promise form.

## Relevance to this stinger

- `guides/01-technical-foundation.md` carries the root-layout metadata template verbatim.
- `guides/02-on-page-optimization.md` teaches the `lib/metadata.ts` helper pattern.
- `templates/lib-metadata.ts` is a direct extraction from playbook §3.1.
- `templates/app-sitemap.ts` and `templates/app-robots.ts` from playbook §2.3 and §2.4.
- The Bee must verify Next.js version on first contact: App Router + Metadata API is 13.4+; the `viewport` export split requires 14+.
