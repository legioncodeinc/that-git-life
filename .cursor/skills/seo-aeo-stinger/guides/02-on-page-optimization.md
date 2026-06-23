# 02 — On-Page Optimization

Mirrors canonical playbook §3. Metadata helper, page structure, image optimization.

**Source research:** `research/2026-04-24-nextjs-metadata-api.md`, `research/2026-04-24-nextjs-image-optimization.md`.

**Templates:** `templates/lib-metadata.ts`.

---

## 2.1 Metadata helper (`lib/metadata.ts`)

The playbook's reusable `generateMetadata` wrapper. Preserved verbatim in `templates/lib-metadata.ts`.

Usage from a page or layout:

```ts
import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: 'Page Title',
  description: '150–160 character description with primary keyword',
  keywords: ['primary keyword', 'secondary'],
  url: '/page-path',
  type: 'website',
});
```

For articles:

```ts
export const metadata: Metadata = generateMetadata({
  title: post.title,
  description: post.excerpt,
  image: post.featuredImage,
  url: `/blog/${post.slug}`,
  type: 'article',
  publishedTime: post.publishedAt,
  modifiedTime: post.updatedAt,
  author: post.author,
  section: post.category,
  tags: post.tags,
});
```

The helper resolves images relative to `metadataBase`, sets OG + Twitter cards in parallel, and includes `alternates.canonical`.

### Title length rule

- **50–60 characters.** Longer titles truncate in SERPs (~600 CSS px visible).
- Include the primary keyword and brand. Brand is appended automatically by the root layout's title template.

### Description length rule

- **150–160 characters.** Longer truncates; shorter may trigger Google to auto-generate from page content.
- Include primary keyword naturally.
- Write for humans — descriptions don't rank directly, but they influence CTR, which is a secondary ranking signal.

---

## 2.2 Page structure best practices

### Homepage pattern

```tsx
// app/page.tsx
export const metadata: Metadata = generateMetadata({
  title: 'Your Brand — Unique Value Proposition',
  description: '...',
  url: '/',
  type: 'website',
});

export default function HomePage() {
  return (
    <>
      {/* Organization JSON-LD — see guides/03-schema-markup.md */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />

      <main>
        <h1>Primary Keyword-Rich Headline</h1>

        <section>
          <h2>Secondary Heading with Related Keywords</h2>
          <p>
            First paragraph includes primary keyword naturally within the
            first 100–150 words. Provide value immediately.
          </p>
        </section>
      </main>
    </>
  );
}
```

### Blog post pattern

See playbook §3.2 (preserved) and `examples/implementation-blog-post.md` for a full worked example.

Key rules:

- **One `<h1>` per page.** Include primary keyword.
- **Heading hierarchy enforced.** `<h1>` → `<h2>` → `<h3>` without skipping (don't jump from h2 to h4).
- **First 100–150 words** carry the primary keyword naturally. Avoid stuffing.
- **`<article>` for article content.** `<main>` wraps the page's primary content once.
- **`<time dateTime={ISO}>`** for any date. Human-readable display; machine-readable `dateTime`.

### Canonical tags

Every page gets a canonical. `generateMetadata` sets `alternates.canonical` automatically. For paginated, faceted, or parameterized URLs, make the canonical point to the non-paginated base:

- `/blog?page=2` → canonical `/blog`
- `/products?color=blue&sort=price` → canonical `/products`

Exception: when pagination represents distinct content (e.g., an archive where page 2 has genuinely different items), the canonical points to the paginated URL itself, and `rel="next"` / `rel="prev"` links signal the sequence.

---

## 2.3 Image optimization

Use `next/image` for every image. Details in `research/2026-04-24-nextjs-image-optimization.md`.

### Above-the-fold hero

```tsx
<Image
  src="/hero.jpg"
  alt="Descriptive alt text with keywords when relevant"
  fill
  priority
  quality={85}
  sizes="100vw"
  className="object-cover"
/>
```

- `priority` injects `<link rel="preload">`. Only one per page.
- `fill` + parent `position: relative` for responsive hero. Requires `sizes`.

### Below-the-fold

```tsx
<Image
  src="/image.jpg"
  alt="Descriptive alt text"
  width={800}
  height={600}
  quality={85}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
/>
```

- `loading="lazy"` is default — do not set `priority`.
- `placeholder="blur"` prevents CLS during decode. Generate `blurDataURL` with `plaiceholder` or `@plaiceholder/next` at build time.
- **Explicit `width` and `height`** reserve space — zero CLS contribution.

### Alt text rules

- Descriptive. Not keyword-stuffed.
- Empty (`alt=""`) for purely decorative images (icons inside a button with accessible `<span>` text).
- Not filenames. Not "image" or "photo". Not Lorem Ipsum.

### File-name hygiene

- `descriptive-keyword-rich-filename.jpg` > `IMG_4281.jpg`.
- Hyphens, not underscores (Google parses hyphens as word separators).
- Lowercase only.

---

## Worked examples

- `examples/implementation-blog-post.md` — full blog-post implementation with metadata, schema, E-E-A-T, and AI-extraction patterns.
- `examples/audit-ecommerce-site.md` — on-page findings for a hypothetical e-commerce site.
