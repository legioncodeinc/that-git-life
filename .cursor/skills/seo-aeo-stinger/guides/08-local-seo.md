# 08 — Local SEO

Mirrors canonical playbook §9. Local business pages, NAP consistency, multi-location.

**Source research:** `research/2026-04-24-local-seo-nap-consistency.md`.

**Templates:** `templates/lib-schema.ts` (`createLocalBusinessSchema`).

---

## 8.1 When to apply this guide

Activate when the target site has a physical presence — retail, restaurants, clinics, service businesses, offices — and geo-intent queries ("near me", "in [city]") are a primary traffic source. For pure-SaaS / digital-only businesses, this guide is informational only.

---

## 8.2 NAP consistency — the rule

**N**ame, **A**ddress, **P**hone. Every instance of NAP across the web must match character-for-character. Inconsistency signals that Google and Apple Maps treat as potentially distinct businesses, splitting local authority across duplicates.

### Canonical forms

- **Name:** no punctuation variation. Pick one: `"Acme Co"` or `"Acme, LLC"` — never both.
- **Address:** standardized postal format. In the US, USPS-standard abbreviations (`St`, not `Street`; `Ave`, not `Avenue`) — pick one style and enforce.
- **Phone:** E.164 for schema (`+1-555-555-5555`); locally formatted for human display (`(555) 555-5555`) only when the schema value is separate.

### Audit checklist

- [ ] `<footer>` NAP matches `/contact` NAP matches `/locations/{city}` NAP.
- [ ] `LocalBusiness` schema matches visible NAP exactly.
- [ ] `Organization` schema on homepage matches `LocalBusiness` schema on location pages.
- [ ] External directory listings (Google Business Profile, Apple Maps, Yelp) match the site.

External directory audit is out of scope for this Stinger (marketing ops territory) — the Bee flags the need; execution is elsewhere.

---

## 8.3 LocalBusiness schema required fields

Per Google Structured Data guidelines:

| Field | Notes |
|---|---|
| `@type` | `LocalBusiness` or a specific subtype (`Restaurant`, `MedicalBusiness`, `AutoRepair`, `Dentist`, etc.). Use the most specific that applies. |
| `name` | Exact business name. |
| `address` | `PostalAddress` with `streetAddress`, `addressLocality`, `addressRegion`, `postalCode`, `addressCountry`. |
| `telephone` | E.164. |
| `image` | Storefront or logo URL. |
| `url` | Canonical page URL for this location. |

Recommended: `geo` (GeoCoordinates with `latitude`, `longitude`), `openingHoursSpecification`, `priceRange`, `sameAs` (social profiles), `areaServed`.

See `templates/lib-schema.ts` for the `createLocalBusinessSchema` utility.

---

## 8.4 Opening hours — use `openingHoursSpecification`

```jsonc
"openingHoursSpecification": [
  {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "09:00",
    "closes": "18:00"
  },
  {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": "Saturday",
    "opens": "10:00",
    "closes": "16:00"
  }
]
```

24-hour clock. 24/7: `"opens": "00:00"`, `"closes": "23:59"`. Closed day: omit or use `opens === closes`.

The legacy `openingHours` string form (`"Mo-Fr 09:00-18:00"`) still parses but is discouraged — `openingHoursSpecification` is structured, validated, and internationalizable.

---

## 8.5 Multi-location pattern

For businesses with more than one physical location:

### File structure

```
app/
  locations/
    [city]/
      page.tsx    // generateStaticParams + LocalBusiness schema per city
```

### Per-location page

See playbook §9.1 (preserved) for the full `app/locations/[city]/page.tsx` — fetches the location record, emits `LocalBusiness` schema, renders the visible NAP.

### Root Organization schema branches

At the homepage `Organization`:

```jsonc
{
  "@type": "Organization",
  "@id": "https://yourdomain.com/#organization",
  "name": "Your Business",
  "branch": [
    { "@id": "https://yourdomain.com/locations/new-york#business" },
    { "@id": "https://yourdomain.com/locations/boston#business" }
  ]
}
```

Each location's `LocalBusiness` uses a stable `@id` that the Organization references.

### Sitemap inclusion

Every location page is listed in `app/sitemap.ts`:

```ts
const locationPages = locations.map((location) => ({
  url: `${baseUrl}/locations/${location.id}`,
  lastModified: location.updatedAt,
  changeFrequency: 'monthly',
  priority: 0.8,
}));
```

---

## 8.6 NAP visible markup

In addition to JSON-LD, the page should include semantic microdata or visible structured NAP:

```tsx
<div itemScope itemType="https://schema.org/LocalBusiness">
  <span itemProp="name">Your Business — New York</span>
  <address itemScope itemType="https://schema.org/PostalAddress">
    <span itemProp="streetAddress">123 Main St</span>,{' '}
    <span itemProp="addressLocality">New York</span>,{' '}
    <span itemProp="addressRegion">NY</span>{' '}
    <span itemProp="postalCode">10001</span>
  </address>
  <a href={`tel:+15555555555`} itemProp="telephone">+1 (555) 555-5555</a>
</div>
```

Redundant with JSON-LD? Yes — and intentional. Belt and suspenders. Microdata helps older bots and provides accessibility context; JSON-LD is primary.

---

## 8.7 Google Business Profile (out of scope, flag only)

The GBP listing — free, managed at https://business.google.com — is the single biggest local-SEO lever. The Stinger does **not** manage GBP; it flags:

- [ ] GBP exists and is verified.
- [ ] GBP NAP matches the website NAP.
- [ ] GBP categories are accurate.
- [ ] Reviews are being collected.
- [ ] Photos uploaded.
- [ ] Posts / updates active.

GBP is a marketing-ops concern. The Bee's job is to ensure the website is ready to benefit from GBP; managing GBP itself is out of scope.

---

## Worked example

`examples/audit-ecommerce-site.md` — the audit includes a local-SEO section for a multi-location retailer, flagging inconsistent NAP and missing `openingHoursSpecification`.
