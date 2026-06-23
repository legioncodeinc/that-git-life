# Local SEO — LocalBusiness schema & NAP consistency

**Sources:**
- https://developers.google.com/search/docs/appearance/structured-data/local-business — LocalBusiness schema requirements
- https://support.google.com/business/answer/7091 — Google Business Profile (GBP) guidelines
- https://schema.org/LocalBusiness — Full property set
- https://moz.com/learn/seo/local-citations (NAP consistency industry reference)
- https://support.google.com/business/answer/3038177 — Prohibited / restricted content on GBP

**Retrieved:** 2026-04-24
**Query used:** "Local SEO LocalBusiness schema NAP consistency patterns"

## Summary

Local SEO ranks businesses for "near me" and geo-intent queries. Two primary signals: (1) structured data + on-page consistency (**NAP** — Name, Address, Phone) and (2) external citations (directory listings, reviews, Google Business Profile). The Stinger covers (1) — the technical surface — and flags (2) as out-of-scope (marketing operations concern).

## NAP consistency — the rule

Every NAP instance across the web must match exactly, character-for-character:

- Business name: no punctuation variation (`"Acme, LLC"` vs `"Acme LLC"` vs `"Acme Inc"`).
- Address: standardized USPS or country-postal formatting. One canonical form picked and enforced.
- Phone: canonical format (typically `+1-555-555-5555` E.164 for schema; locally-formatted for human display).

Inconsistency signals that Google and Apple Maps treat as potentially different businesses, splitting local authority across duplicates.

## LocalBusiness schema — required properties (Google)

- `@type`: `LocalBusiness` or a specific subtype (`Restaurant`, `MedicalBusiness`, `AutoRepair`, `Dentist`, etc. — use the most specific applicable subtype).
- `name`: exact business name.
- `address`: `PostalAddress` with `streetAddress`, `addressLocality`, `addressRegion`, `postalCode`, `addressCountry`.
- `telephone`: E.164 format.
- `image`: storefront or logo URL.
- `url`: canonical page URL.
- Recommended: `geo` (GeoCoordinates), `openingHoursSpecification`, `priceRange`, `sameAs` (social profiles), `areaServed`.

## Multiple locations

For businesses with multiple physical locations:

- One page per location at `/locations/{city-or-slug}`.
- Each page emits a `LocalBusiness` schema scoped to that location.
- The root organization emits an `Organization` schema with `branch` array listing each `LocalBusiness` `@id`.
- `@id` is a stable URL-form identifier — do not reuse across locations.

## Opening hours

Use `openingHoursSpecification` (structured) not `openingHours` (the legacy string form):

```jsonc
{
  "@type": "OpeningHoursSpecification",
  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  "opens": "09:00",
  "closes": "18:00"
}
```

24-hour clock. `"00:00"` to `"23:59"` for 24/7 businesses, or `opens: "00:00"` / `closes: "00:00"` for closed days.

## Relevance to this stinger

- `guides/08-local-seo.md` captures the NAP consistency rule and the LocalBusiness schema required-fields table.
- `templates/lib-schema.ts` `createLocalBusinessSchema` utility is preserved verbatim from playbook §4.1.
- The Bee's action flow for a local-business context prioritizes this guide; otherwise it's lower-priority.
- The brief explicitly flags: "Should `local-seo` be a conditionally-activated guide?" — current answer: always authored, conditionally applied based on the target site's business context (Bee decides during scoping).
