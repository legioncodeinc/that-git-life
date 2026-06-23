# 03 — Schema Markup & Structured Data

Mirrors canonical playbook §4. Covers the schema utility, the Schema component, and the canonical type catalog.

**Source research:** `research/2026-04-24-schema-org-structured-data.md`.

**Templates:** `templates/lib-schema.ts`, `templates/components-Schema.tsx`, `templates/components-FAQ.tsx`.

**Validation:** Rich Results Test (https://search.google.com/test/rich-results) AND Schema Markup Validator (https://validator.schema.org). **Mandatory before ship.** See 3.4.

---

## 3.1 Schema utility (`lib/schema.ts`)

Canonical utility library. Preserved verbatim in `templates/lib-schema.ts`. Exports:

- `organizationSchema` — homepage Organization.
- `createLocalBusinessSchema(location)` — per-location LocalBusiness (see `guides/08-local-seo.md`).
- `createArticleSchema(article)` — blog post / news.
- `createFAQSchema(faqs)` — FAQPage.
- `createBreadcrumbSchema(items)` — BreadcrumbList.
- `createProductSchema(product)` — product detail.
- `createServiceSchema(service)` — service page.
- `createReviewSchema(review)` — single review.
- `createHowToSchema(howTo)` — how-to content.
- `createVideoSchema(video)` — VideoObject.

All utilities produce JSON-LD-ready objects. The `@context` is injected by the `<Schema>` component — don't hand-set it.

---

## 3.2 Schema component (`components/Schema.tsx`)

```tsx
import { Thing, WithContext } from 'schema-dts';

interface SchemaProps {
  schema: WithContext<Thing> | Thing;
}

export function Schema({ schema }: SchemaProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', ...schema }),
      }}
    />
  );
}
```

Usage:

```tsx
import { Schema } from '@/components/Schema';
import { createArticleSchema } from '@/lib/schema';

<Schema schema={createArticleSchema(post)} />
```

### Why JSON-LD (not Microdata / RDFa)

- Google's preferred format.
- Cleanly separable from content markup — no intrusive `itemprop` attributes in the HTML.
- Easier to generate programmatically.
- AI assistants parse JSON-LD more reliably than Microdata.

---

## 3.3 Canonical type catalog

Each type below ships with a utility in `lib/schema.ts`. The `Required fields (Google)` column lists what Rich Results Test demands. Schema.org property set is broader — see https://schema.org/<TypeName> for the full menu.

### Organization (homepage, root)

Required: `name`, `url`, `logo`.

Use on the homepage exactly once. Attach `sameAs` with social profile URLs — these feed knowledge-panel resolution. The playbook's `organizationSchema` constant in `lib/schema.ts` carries all the bells and whistles (`contactPoint`, `founder`, `address`).

### LocalBusiness (per location)

Required: `name`, `address` (PostalAddress: streetAddress, addressLocality, addressRegion, postalCode, addressCountry), `telephone`, `image`.

Use the most specific subtype when available — `Restaurant`, `MedicalBusiness`, `AutoRepair`, `Dentist`, etc. The utility defaults to `LocalBusiness`; override via the `@type` field when applicable.

Cross-reference: `guides/08-local-seo.md` for NAP consistency and multi-location patterns.

### Article / BlogPosting / NewsArticle

Required: `headline`, `image`, `datePublished`, `author`.

**When to use which:**

| Type | Use for |
|---|---|
| `NewsArticle` | Time-sensitive news. Enables "Top stories" carousel eligibility. **Do not use for non-news content** — manual-action risk. |
| `BlogPosting` | Standard blog posts, opinion, tutorials. |
| `Article` | Fallback — long-form, whitepapers, analysis. |

When in doubt → `Article`. (Source: `research/2026-04-24-schema-org-structured-data.md`.)

### Product

Required: `name`, `image`, `offers` (with `price`, `priceCurrency`, `availability`).

Eligible for product rich result and Merchant Listings. Add `aggregateRating` and `review` for star ratings in SERP. `availability` values: `InStock`, `OutOfStock`, `PreOrder`, `Discontinued`, `BackOrder`, `LimitedAvailability`, `SoldOut` (full list at https://schema.org/ItemAvailability).

### Service

Required (schema.org, no Google rich result): `serviceType`, `provider`.

Not a Google rich result type, but high-value for AI assistants — they use Service schema to match user queries ("dentist near me in Boston") with service-area intent.

### Review / AggregateRating

Required: `itemReviewed`, `reviewRating` (with `ratingValue`), `author`.

Review snippets render in SERP only when attached to an eligible parent type (Product, Recipe, LocalBusiness, Book, Course, Event, Movie, Software). Arbitrary reviews on company pages no longer render rich results — but still help AI assistants.

### HowTo

Required: `name`, `step[]` (each with `HowToStep`: `name`, `text`).

**Deprecated as a Google rich result** (September 2023) — no SERP how-to carousel anymore. Still emit the schema for AI assistant comprehension. See `research/2026-04-24-schema-org-structured-data.md`.

### VideoObject

Required: `name`, `description`, `thumbnailUrl`, `uploadDate`.

Eligible for video rich result. For videos on YouTube, also emit `contentUrl` pointing at the YouTube URL. Add `duration` (ISO 8601: `PT1M30S` for 1:30) and `transcript` when available.

### FAQPage

Required: `mainEntity[]` of `Question` with `acceptedAnswer` (`Answer`).

**Rich result restricted** (March 2024) — Google surfaces FAQ rich results only for select authoritative government and health sites. **Still emit the schema** for AI Overviews, AI assistants, and accessibility. See `templates/components-FAQ.tsx` for the component pattern.

### BreadcrumbList

Required: `itemListElement[]` of `ListItem` with `position`, `name`, `item` (URL).

Renders breadcrumb trail in SERP. Use on every deep page (>2 levels from root). The `item` URL must be absolute.

---

## 3.4 Validation workflow — MANDATORY

Per the brief's SUBAGENT CRITICAL DIRECTIVE:

1. **Rich Results Test** — https://search.google.com/test/rich-results
   - Tests eligibility for Google rich results.
   - Fails on missing required fields, wrong types, broken image URLs.
   - Shows the rendered SERP preview.

2. **Schema Markup Validator** — https://validator.schema.org
   - Validates against the full schema.org vocabulary.
   - Catches misspelled property names that RRT silently ignores.
   - Stricter than RRT — a schema that passes the Validator but fails RRT means the type isn't Google-rich-result-eligible (often acceptable — see HowTo, FAQPage).

3. **Record output in the audit report** — attach screenshots or paste the JSON/warnings next to each schema object validated. See `templates/audit-report-template.md` Appendix A for the table shape.

4. **CI option** — `scripts/validate-schema.ts` (stub) walks the routes, extracts `<script type="application/ld+json">` blocks, and POSTs to `validator.schema.org`. Use to gate PRs.

**Never ship schema without validation.** Invalid schema triggers Search Console's "Unparsable structured data" or type-specific errors, which degrade trust at the domain level.

---

## 3.5 Multiple schema objects per page

It's correct (encouraged) to emit multiple JSON-LD blocks per page. Common patterns:

- Article page: `BreadcrumbList` + `Article` + `Organization` (publisher, referenced via `publisher` in Article) + optional `FAQPage`.
- Product page: `BreadcrumbList` + `Product` + `Organization` + `Review` × N + `AggregateRating`.
- Location page: `BreadcrumbList` + `LocalBusiness` + `Organization`.

Use `@id` (URL-form unique identifiers) to cross-reference between objects. The playbook's `organizationSchema.@id` is `https://yourdomain.com/#organization` — referenced from Article schema as `publisher: { '@id': 'https://yourdomain.com/#organization' }`.

---

## Worked examples

- `examples/implementation-blog-post.md` — Article + BreadcrumbList + FAQPage on a single post.
- `examples/audit-ecommerce-site.md` — Product + Review + AggregateRating + BreadcrumbList schema findings.
