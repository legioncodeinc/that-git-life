# Schema.org Structured Data — Canonical Types for This Stinger

**Sources:**
- https://schema.org
- https://schema.org/Article, /BlogPosting, /NewsArticle
- https://schema.org/Product, /Service, /Review, /AggregateRating
- https://schema.org/HowTo, /VideoObject
- https://schema.org/LocalBusiness, /Organization, /WebSite
- https://schema.org/BreadcrumbList, /FAQPage
- https://developers.google.com/search/docs/appearance/structured-data
- https://search.google.com/test/rich-results
- https://validator.schema.org

**Retrieved:** 2026-04-24
**Query used:** "schema.org Article vs BlogPosting vs NewsArticle when to use" and "Rich Results Test validation workflow"

## Summary

Schema.org is the shared vocabulary for structured data, jointly sponsored by Google, Microsoft, Yahoo, and Yandex. For SEO we emit JSON-LD (preferred by Google over Microdata/RDFa) in `<script type="application/ld+json">` tags. Not every schema.org type produces a Google rich result — the set of eligible types is narrower and documented at developers.google.com/search.

## Article vs BlogPosting vs NewsArticle (choice rule)

- **NewsArticle** — time-sensitive news reporting. Eligible for "Top stories" carousel. Requires `datePublished`, `headline`, `image`.
- **BlogPosting** — standard blog posts. Subtype of Article. Use for evergreen-ish opinion, tutorials, analysis.
- **Article** — general fallback when the content isn't news and isn't quite a blog post (e.g., long-form journalism, whitepapers).

Google treats all three largely the same for rich results. **When in doubt, pick `Article`.** Picking `NewsArticle` on non-news content can trigger manual-action risk if Google decides the site is gaming news carousel eligibility.

## Types this stinger catalogs

The canonical playbook ships utilities for these types — each is covered in `guides/03-schema-markup.md`:

| Type | Rich result eligibility | Required fields (Google) |
|---|---|---|
| **Organization** | Knowledge panel eligibility | name, url, logo (ImageObject) |
| **LocalBusiness** | Local pack / map | name, address (PostalAddress), telephone, openingHoursSpecification |
| **Article / BlogPosting / NewsArticle** | Article rich result | headline, image, datePublished, author (Person/Organization) |
| **Product** | Product rich result, merchant listings | name, image, offers (price, priceCurrency, availability) |
| **Service** | Not a Google rich result; helps AI assistants | serviceType, provider, areaServed |
| **Review** | Review snippet (Product/LocalBusiness/etc context only) | itemReviewed, reviewRating, author |
| **AggregateRating** | Same as Review | ratingValue, reviewCount, itemReviewed |
| **HowTo** | (Deprecated rich result Sept 2023; still useful for AI) | name, step[] with HowToStep |
| **VideoObject** | Video rich result | name, description, thumbnailUrl, uploadDate |
| **FAQPage** | (Restricted March 2024 to select authoritative sites) | mainEntity[] of Question with acceptedAnswer |
| **BreadcrumbList** | Breadcrumb trail in SERP | itemListElement[] of ListItem with position, name, item |

## Important 2024–2025 changes to preserve

- **FAQPage rich result restricted** (March 2024): Google now only surfaces FAQ rich results for well-known authoritative government and health sites. **Schema still provides value for AI Overviews, AI assistants, and accessibility** — keep emitting FAQPage schema; do not expect a SERP rich result on ordinary sites.
- **HowTo rich result deprecated** (September 2023): similar story. Keep the schema for AI consumption; do not rely on SERP enhancement.
- **Review snippets tightened:** Review rich results only on self-contained types (Product, Recipe, LocalBusiness, etc.), not on arbitrary Organization or service pages.

## Validation workflow (MANDATORY)

Per the brief's SUBAGENT CRITICAL DIRECTIVE "Schema changes require validation":

1. **Rich Results Test** — https://search.google.com/test/rich-results. Tests eligibility for Google rich results. Fails on missing required fields, bad types, broken images.
2. **Schema Markup Validator** — https://validator.schema.org. Validates against schema.org vocabulary (stricter than Rich Results Test; catches misspelled property names the RRT ignores).
3. **Record output in the audit report** — capture the validator's pass/warning/fail state and paste the screenshot or JSON output into the report's validation appendix (the report itself lives at `library/qa/seo/<date>-schema-validation.md` or under a feature folder).

Never ship schema without passing both tools. **Invalid schema is worse than no schema** — per Google, it can trigger indexation warnings in Search Console and (in extreme cases) manual actions.

## Relevance to this stinger

- `guides/03-schema-markup.md` mirrors playbook §4.1–4.3 verbatim (utility + component + type catalog).
- `templates/lib-schema.ts` and `templates/components-Schema.tsx` preserved from playbook.
- `scripts/validate-schema.ts` stub walks pages, extracts JSON-LD blocks, POSTs to `validator.schema.org` for headless validation.
- `templates/audit-report-template.md` includes a "Schema validation" section with a row per schema object and its validator status.
