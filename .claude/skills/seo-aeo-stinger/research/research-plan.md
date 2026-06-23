# Research Plan — seo-aeo-stinger

**Forge date:** 2026-04-24
**Bee:** seo-aeo-worker-bee
**Stinger:** seo-aeo-stinger
**Canonical playbook:** `NEXTJS_SEO_AEO_COMPLETE_GUIDE_2026.md` (2,175 lines, attached input)

## Objective

Faithfully mirror the canonical 2026 Next.js SEO + AEO playbook into Cursor-skill form: 12 numbered guides tracking the source document's TOC one-to-one, plus a worker-bee principles guide (`00-principles.md`) wrapping the three-discovery-systems mandate. Every code artifact in the playbook is preserved as a template. Every factual/numerical claim traces to a dated source in this folder.

## Three parallel discovery systems (the forge's north star)

1. **Traditional search** (Google, Bing) — crawlability, indexability, canonical tags, sitemaps, robots, performance ranking signals.
2. **AI Overviews & Featured Snippets** — structured data, question-answer content shape, paragraph/list/table snippets, FAQPage schema.
3. **AI assistants** (ChatGPT, Perplexity, Claude) — LLM-crawler access (GPTBot, PerplexityBot, ClaudeBot), author attribution for citation, freshness markers, unambiguous structured data.

No on-page decision is accepted into the guides unless it is justified for all three.

## Search queries (from brief REFERENCE MATERIAL)

1. "Next.js 15 Metadata API generateMetadata best practices"
2. "AEO optimization for ChatGPT Perplexity 2026"
3. "Core Web Vitals INP (Interaction to Next Paint) thresholds 2026"
4. "schema.org Article vs BlogPosting vs NewsArticle when to use"
5. "Next.js App Router sitemap dynamic generation"
6. "E-E-A-T content signals technical implementation"
7. "Next.js image optimization AVIF WebP fallback"
8. "Google Featured Snippets paragraph list table format best practices"
9. "Local SEO LocalBusiness schema NAP consistency patterns"
10. "Next.js prefetching strategy 2026"
11. "GPTBot PerplexityBot ClaudeBot robots.txt 2026"
12. "Rich Results Test Schema Markup Validator workflow"

## Authoritative sources to fetch directly (mandatory per brief)

- https://developers.google.com/search — Search Central: crawling, indexing, rendering, structured data reference.
- https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data — Structured data guidelines.
- https://nextjs.org/docs/app/api-reference/functions/generate-metadata — Metadata API reference.
- https://nextjs.org/docs/app/building-your-application/optimizing/metadata — Metadata guide.
- https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap — Sitemap file convention.
- https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots — Robots file convention.
- https://nextjs.org/docs/app/api-reference/components/script — Script component.
- https://web.dev/vitals — Core Web Vitals thresholds (LCP, INP, CLS).
- https://web.dev/articles/inp — INP definition and thresholds (replaced FID March 2024).
- https://web.dev/articles/lcp — LCP definition and thresholds.
- https://web.dev/articles/cls — CLS definition and thresholds.
- https://schema.org — Canonical structured-data vocabulary.
- https://search.google.com/test/rich-results — Rich Results Test (validation workflow).
- https://validator.schema.org — Schema Markup Validator.
- https://services.google.com/fh/files/misc/hsw-sqrg.pdf — Google Search Quality Rater Guidelines (E-E-A-T).
- https://platform.openai.com/docs/gptbot — GPTBot identification & robots.txt policy.
- https://docs.perplexity.ai/guides/bots — PerplexityBot identification.
- https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler — ClaudeBot/anthropic-ai identification.

## Open questions carried from brief IDEAS section

Tracked in `research/open-questions.md` — user-resolvable, not web-resolvable:

- Migration guide from Pages Router → App Router: in scope, or escalate to `react-worker-bee`?
- AEO-specific patterns (ChatGPT/Perplexity citation optimization): separate guide or folded into `05-answer-engine-optimization.md`? (Current choice: folded in.)
- `local-seo` always-on or conditionally activated per business context?
- Should schema validation be automated in CI (bundle a `scripts/validate-schema.ts`)? (Current choice: yes, stubbed.)

## Refresh cadence

SEO and AEO drift fast. This folder must be reviewed every 90 days. Next review: 2026-07-24. See `research/refresh-cadence.md`.

## Target output

- 8–12 dated research notes in `research/YYYY-MM-DD-<topic>.md`.
- `research/open-questions.md` for user resolution.
- `research/refresh-cadence.md` capturing the 90-day review protocol.
- Every factual claim in `guides/*.md` traceable to one of these files.
- Canonical playbook preservation log in `research/playbook-preservation-log.md` (section-by-section: preserved verbatim vs. adapted).
