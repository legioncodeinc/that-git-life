# 10 — Implementation Phases (8-week rollout)

Mirrors canonical playbook §11. Preserved verbatim — item counts and ordering unchanged. Every audit walks this checklist top-to-bottom; every implementation authors files in this order.

**Source research:** all `research/*.md`.

---

## Phase 1 — Technical Foundation (Week 1–2)

### Configuration

- [ ] Enable image optimization in `next.config.js`
- [ ] Add viewport meta tag to root layout
- [ ] Configure security headers
- [ ] Set up proper compression
- [ ] Remove `ignoreBuildErrors` and fix TypeScript errors
- [ ] Configure proper redirects (301s)

### Core files

- [ ] Create comprehensive `sitemap.ts`
- [ ] Configure `robots.ts` with proper rules
- [ ] Set up `manifest.json` for PWA
- [ ] Configure proper font loading with `display: swap`

### Monitoring

- [ ] Install Google Analytics 4
- [ ] Set up Google Search Console
- [ ] Install Vercel Speed Insights (or alternative)
- [ ] Configure Web Vitals reporting
- [ ] Set up error monitoring (Sentry, etc.)

**Governing guides:** `01-technical-foundation.md`, `09-analytics-tracking.md`.

---

## Phase 2 — Schema Markup (Week 2–3)

- [ ] Add Organization schema to homepage
- [ ] Implement LocalBusiness schema on location pages
- [ ] Add Article schema to blog posts
- [ ] Create FAQ schema for FAQ sections
- [ ] Implement BreadcrumbList schema
- [ ] Add Product schema (if applicable)
- [ ] Add Service schema for services
- [ ] Implement Review/AggregateRating schema
- [ ] Add Person schema for team members/authors
- [ ] Create HowTo schema for guides
- [ ] Add VideoObject schema for videos
- [ ] Validate all schema with Rich Results Test

**Governing guide:** `03-schema-markup.md`. **Mandatory validation workflow.**

---

## Phase 3 — Content Optimization (Week 3–6)

### On-page elements

- [ ] Optimize all title tags (50–60 chars)
- [ ] Write compelling meta descriptions (150–160 chars)
- [ ] Ensure H1 tags on all pages with target keywords
- [ ] Implement proper heading hierarchy (H1–H6)
- [ ] Add descriptive alt text to all images
- [ ] Optimize image file names

### Content structure

- [ ] Restructure content in question-answer format
- [ ] Add direct answer boxes (40–60 words)
- [ ] Create comprehensive FAQ sections
- [ ] Add comparison tables where relevant
- [ ] Implement numbered lists for processes
- [ ] Add key takeaways sections

### E-E-A-T

- [ ] Add author attribution to all content
- [ ] Create detailed author bio pages
- [ ] List credentials and expertise
- [ ] Add publish/update dates to content
- [ ] Include cited sources and references
- [ ] Add review/fact-check attribution

**Governing guides:** `02-on-page-optimization.md`, `04-content-quality-eeat.md`, `05-answer-engine-optimization.md`.

---

## Phase 4 — Performance Optimization (Week 4–7)

### Images

- [ ] Enable Next.js Image optimization
- [ ] Add `priority` to above-the-fold images
- [ ] Implement `loading="lazy"` for below-fold images
- [ ] Generate blur placeholders
- [ ] Configure proper `sizes` attribute
- [ ] Convert images to AVIF/WebP

### Code

- [ ] Implement dynamic imports for heavy components
- [ ] Code-split route bundles
- [ ] Minimize JavaScript bundle size
- [ ] Remove unused dependencies
- [ ] Optimize third-party scripts

### Fonts

- [ ] Use `display: swap` for all fonts
- [ ] Preload critical fonts
- [ ] Subset fonts if possible
- [ ] Consider variable fonts

### Testing

- [ ] Run Lighthouse audit (aim for 90+ on all metrics)
- [ ] Test Core Web Vitals in Search Console
- [ ] Test on real mobile devices
- [ ] Verify LCP < 2.5 s
- [ ] Verify INP < 200 ms
- [ ] Verify CLS < 0.1

**Governing guide:** `06-core-web-vitals.md`. **Measured, not asserted.**

---

## Phase 5 — AEO Optimization (Week 5–8)

- [ ] Optimize content for featured snippets
- [ ] Target question-based keywords
- [ ] Create voice-search-friendly content
- [ ] Implement comprehensive FAQ sections
- [ ] Add comparison content
- [ ] Create glossary/definition pages
- [ ] Structure content for AI extraction
- [ ] Add direct answers at beginning of sections

**Governing guide:** `05-answer-engine-optimization.md`.

---

## Phase 6 — Local SEO (Week 6–9)

- [ ] Optimize Google Business Profile listings
- [ ] Ensure NAP consistency across all platforms
- [ ] Create location-specific pages
- [ ] Add location-specific content
- [ ] Implement local schema markup
- [ ] Get listed in local directories
- [ ] Encourage customer reviews
- [ ] Respond to all reviews

**Governing guide:** `08-local-seo.md`. **Conditional — skip if not a local-business target.**

Note: GBP, directories, and review management are marketing-ops territory — the Bee flags the need; execution is elsewhere.

---

## Phase 7 — Content Expansion (Ongoing)

- [ ] Launch blog/resources section
- [ ] Create topic clusters
- [ ] Develop pillar content
- [ ] Publish original research
- [ ] Create case studies
- [ ] Add video content
- [ ] Implement content refresh calendar
- [ ] Monitor content decay

**Governing guide:** `04-content-quality-eeat.md`. **Content strategy is out of scope — this phase lists the technical scaffolding for content.**

---

## Phase 8 — Link Building & PR (Ongoing)

- [ ] Develop backlink acquisition strategy
- [ ] Pursue guest posting opportunities
- [ ] Build relationships with industry publications
- [ ] Monitor brand mentions
- [ ] Reclaim unlinked mentions
- [ ] Participate in relevant online communities

**Out of scope for this Stinger.** Informational checklist only — the Bee does not execute outreach. Flag to marketing.

---

## Priority order for maximum impact

### Immediate (Week 1)

1. Fix image optimization
2. Add viewport meta tag
3. Set up Analytics & Search Console
4. Fix any blocking technical errors

### High priority (Week 2–4)

1. Implement comprehensive schema markup
2. Optimize Core Web Vitals
3. Add author attribution
4. Expand thin content

### Medium priority (Month 2–3)

1. Launch blog/content hub
2. Implement topic clusters
3. Optimize for AEO
4. Develop local SEO strategy

### Ongoing

1. Content creation and updates
2. Backlink acquisition
3. Performance monitoring
4. Competitor analysis

---

## Success metrics (track monthly)

- **Technical** — Core Web Vitals scores, page load time.
- **SEO** — organic traffic, keyword rankings, indexed pages.
- **AEO** — featured snippet captures, AI Overview appearances, AI-assistant citation frequency (via server-log analysis of `ChatGPT-User` and `Perplexity-User` visits).
- **Business** — conversion rate, lead quality, revenue from organic.

---

## Tools & resources

**Essential (free):**

- Google Search Console
- Google Analytics 4
- Google PageSpeed Insights
- Schema Markup Validator — https://validator.schema.org
- Rich Results Test — https://search.google.com/test/rich-results

**Recommended (paid):**

- Semrush or Ahrefs (competitive analysis, keyword research)
- Screaming Frog (technical audit crawler)
- Surfer SEO (content optimization)
- Hotjar (user behavior)

**Learning resources:**

- Google Search Central — https://developers.google.com/search
- Next.js Documentation — https://nextjs.org/docs
- Schema.org — https://schema.org
- web.dev — https://web.dev
- Search Engine Journal, Search Engine Land (industry news)

---

## Worked example

`examples/audit-ecommerce-site.md` — a full audit scorecard walked phase-by-phase against this checklist, producing the report shape in `templates/audit-report-template.md`.
