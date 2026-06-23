# Example — Full SEO Audit of a Next.js E-commerce Site

**Scenario:** A hypothetical Next.js 15 App Router e-commerce site, `shop.example.com`, with ~1,200 product pages, 4 physical store locations, and a blog. The user invokes `seo-aeo-worker-bee` with "audit the main branch for SEO".

**Guides exercised:** `00-principles.md` (scoping), `01`–`11` (phase walk), `10-implementation-phases.md` (checklist).

**Output format:** matches `templates/audit-report-template.md`.

---

## Step 1 — Scoping

**Invocation:** "Audit this branch for SEO."

**Classification:** Audit mode. Walk 8-phase checklist top-to-bottom.

**Business context:**
- E-commerce with 4 physical stores → local SEO is in scope (`guides/08-local-seo.md`).
- Blog exists → content quality / E-E-A-T in scope (`guides/04-content-quality-eeat.md`).
- SaaS-like conversion intent on product pages → schema validation is high-priority.

**Next.js version:** `"next": "15.2.1"` in `package.json`. Full coverage. App Router confirmed (has `app/` directory, no `pages/` directory).

---

## Step 2 — Phase-by-phase findings

### Phase 1: Technical Foundation

| Item | Status | Note |
|---|---|---|
| `next.config.js` image optimization | FAIL (Critical) | `images.formats` missing; defaults to WebP only. No `remotePatterns` for the CDN `cdn.shop.example.com` → external images 400. |
| Viewport meta | PASS | Separate `viewport` export in root layout. `userScalable: true`. |
| Security headers | PARTIAL | Present but missing `Content-Security-Policy`. Flagged for `security-worker-bee` — not this Stinger's scope to author CSP. |
| Compression | PASS | `compress: true` set. |
| TypeScript strict | PASS | `ignoreBuildErrors: false`. |
| Sitemap | FAIL (Critical) | `app/sitemap.ts` lists only 8 static pages. Missing 1,200 product URLs and 4 location URLs. |
| Robots | PASS | `app/robots.ts` correctly allows all paths except `/admin`. AI bots explicitly allowed. |
| Manifest | PASS | Present with icons 192 and 512. |
| Fonts | PASS | `next/font` with `display: 'swap'`. |
| GA4 | PASS | Wired via `<Script strategy="afterInteractive">`. |
| Search Console | UNVERIFIED | No `verification.google` in root metadata. |
| Speed Insights | FAIL (High) | Not wired. No CWV field data being captured. |

### Phase 2: Schema Markup

| Item | Status | Note |
|---|---|---|
| Organization (homepage) | PASS | Valid JSON-LD, passes Rich Results Test. |
| LocalBusiness (4 locations) | FAIL (Critical) | **Only 2 of 4 location pages emit LocalBusiness schema.** Boston and Austin locations missing. |
| Product schema | PARTIAL | Present on 1,200 products but missing `aggregateRating` despite having 400+ reviews in database. Star ratings missing from SERP. |
| BreadcrumbList | FAIL (High) | Completely missing. Deep product pages (`/category/subcategory/product`) have no breadcrumb schema. |
| FAQPage | PASS | On homepage and select landing pages. |
| Validation record | FAIL (Critical) | **No schema has been validated in any prior audit on file (`library/qa/seo/`).** Direct violation of the SUBAGENT CRITICAL DIRECTIVE. |

### Phase 3: Content Optimization

| Item | Status | Note |
|---|---|---|
| Title tags 50–60 chars | PARTIAL | 320 product titles truncate (avg 72 chars). |
| Meta descriptions 150–160 | PARTIAL | 840 products have no description; falls back to the Organization default. |
| H1 per page | PASS | One H1 per page, keyword-present. |
| Heading hierarchy | PARTIAL | 15 blog posts skip from H2 to H4. |
| Alt text on images | FAIL (High) | Audit sampled 50 product images: 18 have `alt=""`, 6 have `alt="image"`. |
| Image file names | PARTIAL | `IMG_4281.jpg` style prevalent in blog; product images use SKU. |
| Question-answer content shape | FAIL (Medium) | Blog posts bury the answer below 2 paragraphs of preamble. No "Quick Answer" boxes. |
| Direct-answer boxes (40–60 words) | MISSING | |
| FAQ sections on product pages | MISSING | |
| Comparison tables | MISSING | |
| Author attribution | FAIL (Critical for YMYL / High otherwise) | Blog posts show "by Admin" on all 87 posts. No `/authors` page. No Person schema. |
| Publish / update dates | PARTIAL | `publishedAt` visible; `modifiedAt` missing from half the posts. |
| Cited sources | FAIL (Medium) | Blog posts make factual claims (inventory trends, industry statistics) with no sources. |

### Phase 4: Performance Optimization

Measured via `scripts/web-vitals-snapshot.ts` against 5 representative routes (home, category, product, blog post, location). Lab data:

| Route | Strategy | LCP | INP | CLS | Verdict |
|---|---|---|---|---|---|
| `/` | mobile | 3.8 s | 420 ms | 0.18 | Poor |
| `/` | desktop | 2.1 s | 180 ms | 0.08 | Good |
| `/category/apparel` | mobile | 4.2 s | 510 ms | 0.22 | Poor |
| `/product/sku-12345` | mobile | 3.1 s | 290 ms | 0.09 | Needs improvement |
| `/blog/top-10-trends-2026` | mobile | 4.8 s | 380 ms | 0.15 | Poor |
| `/locations/boston` | mobile | 2.9 s | 220 ms | 0.11 | Needs improvement |

**Root causes identified:**

- **LCP:** Hero images on home and category are `<img>` tags, not `<Image>`. No `priority`. Hero is 1.8 MB JPEG — not AVIF/WebP.
- **INP:** The product card component re-renders on scroll (unmemoized). Category grids of 40+ products trigger cascading re-renders.
- **CLS:** Product cards load with ratings injected async — pushes card content down ~24 px mid-render. Blog author avatar loads without `width`/`height` → 180 px shift.

### Phase 5: AEO

| Item | Status | Note |
|---|---|---|
| Content for featured snippets | FAIL (High) | No paragraph snippets, no list snippets. No question-style H2s. |
| Question-based keyword targeting | MISSING | Blog titles use noun-phrase format ("The Best Apparel Trends"), not question format ("What are the best apparel trends?"). |
| Voice-search friendly | FAIL (Medium) | Long compound sentences throughout blog. |
| FAQ schema | PARTIAL | Homepage only. No product-page FAQs. |
| AI assistant citation readiness | FAIL (Critical) | Missing: author attribution, `dateModified`, source citations. These are the primary LLM-citation signals. |

### Phase 6: Local SEO

| Item | Status | Note |
|---|---|---|
| NAP consistency | FAIL (Critical) | Boston location shows `(617) 555-1234` in footer but `617-555-1234` on `/locations/boston`. |
| LocalBusiness schema coverage | FAIL (Critical) | Only 2 of 4 locations emit schema (see Phase 2). |
| Location pages exist | PASS | All 4 locations have dedicated pages. |
| `openingHoursSpecification` | FAIL (High) | Uses legacy `openingHours` string format. |
| GBP listing (out of scope, flagged only) | FLAG | Confirm with marketing that all 4 GBP listings exist and match. |

### Phase 7: Content Expansion

Informational only — no findings against technical code.

### Phase 8: Link Building

Out of scope. Informational only.

---

## Step 3 — Prioritized findings

### Critical (fix before merge)

1. Schema never validated (`Directive violation`).
2. LocalBusiness schema missing on 2 of 4 locations.
3. Sitemap missing 1,200 products + location pages.
4. `next.config.js` image optimization misconfigured.
5. Author attribution missing on 87 blog posts (YMYL risk on industry-opinion posts).
6. NAP inconsistency between footer and Boston page.

### High

1. BreadcrumbList schema missing site-wide.
2. Alt text missing/garbage on 18+6 sampled images.
3. LCP / CLS poor on mobile category + home + blog post.
4. Missing `aggregateRating` on Product schema (400+ reviews unattached).
5. AI-assistant citation signals missing (author, `dateModified`, sources).
6. Speed Insights not wired.
7. Legacy `openingHours` format on location pages.

### Medium

1. 320 product titles truncate.
2. 840 products missing meta descriptions.
3. Blog posts bury answers below preamble (featured-snippet eligibility).
4. `dateModified` missing on half of blog posts.
5. No direct-answer boxes or FAQ sections on product pages.

### Low

1. Heading hierarchy skip (H2 → H4) on 15 posts.
2. Legacy image filenames in blog (`IMG_*.jpg`).

---

## Step 4 — Three discovery systems cross-check

Per directive: every finding justified for all three systems.

| Finding | Traditional search | AI Overviews | AI assistants |
|---|---|---|---|
| Missing schema validation | Rich result loss | Snippet extraction unreliable | LLM comprehension degraded |
| LocalBusiness gaps | Local pack loss | Local AI answers broken | "near me" cite misses |
| Missing author attribution | E-E-A-T drift (YMYL) | Lower snippet probability | **Primary citation signal missing** |
| Poor CWV on mobile | Ranking demotion | Less likely to surface | No direct impact |
| Alt text missing | Image search loss + accessibility | Image extraction broken | Image context broken |

All findings affect ≥ 2 systems. No finding is a system tradeoff (none "optimize one, harm another").

---

## Step 5 — Report output

Report written to `library/qa/seo/main-seo-audit.md` (in the target repo), using `templates/audit-report-template.md` as the shape.

**Handoff line:**

> "Audit complete. Report at `library/qa/seo/main-seo-audit.md`. Top findings: 6 Critical, 7 High. Recommend: (a) kick off Phase 1 remediation immediately (sitemap + next.config + schema validation gate); (b) schedule Phase 3 content remediation sprint; (c) loop in `security-worker-bee` for the CSP gap."

---

## Bee's next step

The user can now:

- Ask the Bee to implement Critical fixes (switches to Implementation mode).
- Hand off the full 8-week rollout plan to `library-worker-bee` for PRD authoring.
- Schedule a 14-day CrUX follow-up against Search Console.
