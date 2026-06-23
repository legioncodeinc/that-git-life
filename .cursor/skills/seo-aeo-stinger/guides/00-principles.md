# 00 — Principles, Scope & Directives

Read before touching anything else. This guide wraps the canonical playbook's §1 (Introduction & Philosophy) with the `seo-aeo-worker-bee` Bee's directives from the Command Brief.

---

## The three parallel discovery systems

Every on-page decision is justified against all three. Optimizing one at the expense of another is a finding, not a win.

1. **Traditional Search Engines** — Google, Bing. ~70% of web traffic in 2025–2026. Crawl, index, rank via the classic signals: content, links, technical health, Core Web Vitals.
2. **AI Overviews & Featured Snippets** — Growing; ~30% of queries now show an AI answer above the blue links. Extractive — Google lifts short, structured answers from well-organized pages.
3. **AI Assistants** — ChatGPT, Perplexity, Claude. ~40% YoY growth. Retrieval-augmented or training-ingested; citation patterns reward explicit authorship, freshness, stable URLs, structured data.

(Source: canonical playbook §1 + `research/2026-04-24-ai-assistant-crawlers.md`.)

### Consequence for every decision

When you add a metadata field, a schema object, a route, a heading, a link — ask three questions:

1. **Does a traditional crawler understand this?** (HTML, cacheable, canonical, indexable?)
2. **Does an AI Overview / featured-snippet engine extract it?** (Structured, dated, authored, question-answer shape?)
3. **Does an AI assistant surface this page as a citation?** (Author, freshness, schema, stable URL?)

If the answer to any is "no", document the tradeoff or fix it.

---

## Core principles (from playbook §1)

- **Principle 1: AI-first, human-centered.** Optimize for machine comprehension while maintaining excellent UX.
- **Principle 2: E-E-A-T above all.** Experience, Expertise, Authoritativeness, Trustworthiness. See `guides/04-content-quality-eeat.md`.
- **Principle 3: Performance is non-negotiable.** Core Web Vitals are direct ranking factors. See `guides/06-core-web-vitals.md`.
- **Principle 4: Structured data is the translation layer.** Schema disambiguates content for machines. See `guides/03-schema-markup.md`.
- **Principle 5: Original value wins.** AI systems detect derivative content. Information gain is essential.

---

## SUBAGENT CRITICAL DIRECTIVES (non-negotiable, from the brief)

1. **Three parallel discovery systems or nothing.** Every on-page decision is justified for (a) traditional search, (b) AI Overviews, and (c) AI assistants.

2. **Schema changes require validation.** Never ship schema without running Google's Rich Results Test (https://search.google.com/test/rich-results) AND the Schema Markup Validator (https://validator.schema.org). Record both outputs in the audit report's validation appendix (saved at `library/qa/seo/<date>-...md` or under a feature folder). Invalid schema is worse than no schema — it triggers indexation warnings.

3. **Core Web Vitals are measured, not asserted.** Before/after LCP/INP/CLS numbers are mandatory. Use the Web Vitals library wiring in `templates/lib-web-vitals.ts`. Lab data (Lighthouse) is a proxy; field data (CrUX via Search Console) is the truth.

4. **E-E-A-T signals are structural, not cosmetic.** Author attribution, expertise disclosure, freshness markers, citations belong in schema and visible structure — not just CSS styling. Every content page gets an `Author` schema with `sameAs` links. See `templates/components-Author.tsx`.

5. **Mobile-first is not optional.** Test at 320px and 375px viewports. Touch targets ≥ 44×44 CSS px. Input font-size ≥ 16px (prevents iOS Safari auto-zoom). No horizontal scroll.

6. **Next.js version awareness.** On first contact with a codebase, check `package.json`:
   - `next < 13.4` → App Router not available. Flag and hand off to `react-worker-bee`.
   - `next 13.4 ≤ v < 14` → App Router works but `viewport` export is merged with `metadata`. Degraded coverage.
   - `next ≥ 14` → Full coverage. `viewport` is a separate export.
   - `next ≥ 15` → `params` and `searchParams` in `generateMetadata` are Promises — must be awaited.
   - Pages Router codebases → degraded coverage. Flag and escalate to `react-worker-bee` for migration.

7. **Respect `noindex` intentions.** Pages with `robots: { index: false }` or `<meta name="robots" content="noindex">` are sacred. Do not remove without explicit user confirmation — they may be staging, preview, or intentional exclusions.

---

## Invocation decision tree

Classify the request during scoping. Each mode has a different exit criterion:

```
User request arrives
├── "Audit this branch" / "Review SEO"
│   └── Run 8-phase checklist (guides/10) top-to-bottom; produce audit report at library/qa/seo/<date>-...md.
├── "Implement SEO foundation" / "Add schema to X"
│   └── Author files in phase order; use templates/; run validate-schema.ts.
├── "Fix <metric>" / "Diagnose <issue>"
│   └── guides/11 troubleshooting; capture before/after measurements.
├── "Plan the 8-week rollout" / "Map to a PRD"
│   └── Deliver phase-by-phase plan; optionally hand off to library-worker-bee.
└── (Unclear)
    └── Ask the user: audit? implementation? remediation? plan?
```

---

## Scope boundaries

### In scope

- Next.js 14+ App Router codebases.
- Technical SEO surface: `next.config.js`, `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`, `public/manifest.json`, `lib/metadata.ts`, `lib/schema.ts`, `components/Schema.tsx`.
- On-page metadata, schema markup, Core Web Vitals, mobile, local SEO, analytics wiring.
- E-E-A-T structural signals (author, freshness, schema).
- AEO patterns: featured snippets, FAQ, voice, AI-assistant citation.
- 8-phase rollout planning.

### Out of scope

- Marketing copy, keyword research, editorial work → content Bee.
- Pages Router, Nuxt, SvelteKit, Astro, plain HTML → degraded fidelity; flag.
- Backlink acquisition, PR, influencer outreach.
- Paid search (Google Ads, Meta Ads).
- Security headers beyond the playbook's defaults → route through `security-worker-bee`.

---

## Cross-Bee handoffs

- **`security-worker-bee`** — CSP headers in `next.config.js > headers()` overlap. Any change adding or relaxing `Content-Security-Policy` routes through `security-worker-bee` before merge.
- **`react-worker-bee`** — Pages Router → App Router migration, advanced RSC patterns, Server Actions internals.
- **`library-worker-bee`** — PRD authoring for phased rollouts when the deploying product wants a feature PRD at `library/requirements/features/feature-<###>-<title>/prd-feature-<###>-<title>.md`.
- **`quality-worker-bee`** — post-implementation verification; runs last before QA.

---

## Refresh cadence

The `research/` folder drives the guides. SEO/AEO best practices drift fast — CWV thresholds changed twice since 2020, rich-result eligibility changes yearly, AI crawlers rotate. **Review `research/` every 90 days.** See `research/refresh-cadence.md` for the protocol.

---

## Worked example

`examples/audit-ecommerce-site.md` shows this guide in action — the Ang