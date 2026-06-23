# 01 — Technical SEO Foundation

Mirrors canonical playbook §2. Covers `next.config.js`, root layout, sitemap, robots, manifest.

**Source research:** `research/2026-04-24-nextjs-metadata-api.md`, `research/2026-04-24-google-search-central-crawling-indexing.md`, `research/2026-04-24-ai-assistant-crawlers.md`.

**Templates used:** `templates/next.config.js`, `templates/app-layout.tsx`, `templates/app-sitemap.ts`, `templates/app-robots.ts`.

---

## 1.1 `next.config.js` — essential SEO config

See `templates/next.config.js` for the full file. Key blocks:

### Image optimization

```js
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60,
  remotePatterns: [
    { protocol: 'https', hostname: '**.yourdomain.com' },
  ],
}
```

- `formats` order matters: browsers that support AVIF get AVIF; others fall back to WebP; ancient clients get the original.
- `remotePatterns` replaces the deprecated `domains` array (Next.js 14+). Any external image host must be allowlisted here or Next.js will 400.
- **Never** set `unoptimized: true` in production — disables all the on-demand AVIF/WebP, lazy loading, and `srcset` logic.

### Security headers

Canonical block preserved in the template. Includes HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.

**Cross-reference:** Any addition or change to `Content-Security-Policy` here routes through `security-worker-bee` before merge. The brief's directive.

### TypeScript strictness

```js
typescript: { ignoreBuildErrors: false }
```

Fix errors, don't suppress. Suppressed errors often hide metadata-shape mistakes that break schema or canonical tags.

### Redirects

Use `permanent: true` (301) for actual permanent moves — preserves link equity per `research/2026-04-24-google-search-central-crawling-indexing.md`. Use 302 (permanent: false) only for genuinely temporary redirects.

---

## 1.2 Root layout (`app/layout.tsx`)

See `templates/app-layout.tsx` for the full file. Key requirements:

### `metadataBase`

```ts
metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com')
```

Required at the root. Relative paths in child pages' metadata (e.g., `alternates.canonical: '/blog'`) resolve against this base. Without it, canonical tags may emit as relative URLs — a Google canonicalization bug.

### Title template

```ts
title: {
  default: 'Your Site Name - Primary Value Proposition',
  template: '%s | Your Brand Name',
}
```

Child pages that export `title: 'Article Title'` become `"Article Title | Your Brand Name"`. Child pages that export `title: { absolute: 'Raw Title' }` bypass the template.

### Viewport (separate export in Next.js 14+)

```ts
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};
```

- `userScalable: true` and `maximumScale: 5` are accessibility requirements. Never set `userScalable: false` or `maximumScale: 1` — blocks screen-magnifier users and fails WCAG.
- `themeColor` with light/dark media queries powers the browser chrome tint on mobile.

### Robots metadata

```ts
robots: {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-video-preview': -1,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
}
```

- `max-image-preview: 'large'` is required to be eligible for featured-snippet thumbnails.
- `max-snippet: -1` allows Google to pull as much snippet text as it needs.
- `max-video-preview: -1` same rule for video.

### Verification codes

```ts
verification: {
  google: 'your-google-verification-code',
  bing: 'your-bing-verification-code',
}
```

Emits `<meta name="google-site-verification">` etc. Required for Search Console and Bing Webmaster Tools ownership.

---

## 1.3 Sitemap (`app/sitemap.ts`)

See `templates/app-sitemap.ts`. Each entry is `{ url, lastModified, changeFrequency, priority }`:

- **`url`** — absolute URL (use `baseUrl` constant).
- **`lastModified`** — `Date` object. Critical for crawl scheduling and AI-assistant freshness signals.
- **`changeFrequency`** — `'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'`. A hint, not a guarantee.
- **`priority`** — 0.0–1.0, relative within *this* site. Google largely ignores across-site comparison. Use 1.0 for homepage, 0.8 for main sections, 0.5–0.7 for individual content.

### Rules

- Maximum 50,000 URLs OR 50 MB per sitemap file. Beyond that, split into a sitemap index.
- **Do not list `noindex` URLs.** Conflicting signals degrade index quality (see `research/2026-04-24-google-search-central-crawling-indexing.md`).
- **Do not list disallowed URLs** (those matching `robots.txt > Disallow`).
- The sitemap URL must be referenced from `robots.txt` (see 1.4).

### Dynamic content

The template's `fetchDynamicPages()` stub is where blog posts, products, or CMS entries get listed. Implementation is project-specific — typically a database query or CMS API call. Cache aggressively; this function runs on every sitemap fetch.

---

## 1.4 Robots (`app/robots.ts`)

See `templates/app-robots.ts`. The playbook's default allows all crawlers including AI bots. This is a business decision, not a technical one — see `research/2026-04-24-ai-assistant-crawlers.md` for the full tradeoff.

### Default (from playbook §2.4)

```ts
rules: [
  {
    userAgent: '*',
    allow: '/',
    disallow: ['/admin/', '/api/', '/private/', '/_next/', '/static/'],
  },
  { userAgent: 'GPTBot', allow: '/' },
  { userAgent: 'CCBot', allow: '/' },
],
sitemap: `${baseUrl}/sitemap.xml`,
host: baseUrl,
```

### Alternative policies

1. **Block training bots, allow indexing/user bots** — useful when content is commercially valuable but discovery-via-AI is still desired:
   ```ts
   { userAgent: 'GPTBot', disallow: '/' },         // OpenAI training
   { userAgent: 'CCBot', disallow: '/' },          // Common Crawl
   { userAgent: 'anthropic-ai', disallow: '/' },   // Anthropic training
   // Leave PerplexityBot, OAI-SearchBot, ChatGPT-User, Perplexity-User allowed
   ```
2. **Block everything** — paid/exclusive content:
   ```ts
   { userAgent: '*', disallow: '/' }
   ```
3. **Google-Extended opt-out** (Google AI training):
   ```txt
   User-agent: Google-Extended
   Disallow: /
   ```
   Note: `Google-Extended` is a directive token, not a crawler. Respected only for Gemini/Bard training; does not affect Google Search indexing.

### Critical rules

- **`Disallow` is case-sensitive for paths.** `Disallow: /Admin/` does not block `/admin/`.
- **`Disallow` prevents crawl, not indexing.** A disallowed URL discovered via inbound links may still appear in the index with "No information available". To truly de-index, serve 404/410 or use `noindex` meta (and leave the URL crawlable so bots can see the directive).
- **The sitemap URL belongs here.** Googlebot and Bingbot discover sitemaps via robots.txt.

---

## 1.5 Web manifest (`public/manifest.json`)

Installable PWA metadata. Not a direct ranking factor but contributes to mobile UX signals.

```json
{
  "name": "Your Site Full Name",
  "short_name": "Your Site",
  "description": "Your site description",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ],
  "categories": ["business", "education"],
  "dir": "ltr",
  "lang": "en-US",
  "scope": "/"
}
```

Referenced from the root layout:

```tsx
<link rel="manifest" href="/manifest.json" />
```

Requirements for Add-to-Home-Screen eligibility: `name`, `short_name`, `start_url`, `display` ∈ `{standalone, fullscreen, minimal-ui}`, at least one icon ≥ 192×192.

---

## Worked example

`examples/audit-ecommerce-site.md` — "Phase 1" of the audit walks this guide's checklist for a hypothetical Next.js e-commerce site.
