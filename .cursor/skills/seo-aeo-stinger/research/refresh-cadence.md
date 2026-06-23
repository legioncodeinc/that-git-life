# Refresh Cadence — 90-Day Review Protocol

**Forge date:** 2026-04-24
**Next review:** 2026-07-24
**Review after that:** 2026-10-22

## Why 90 days

SEO and AEO best practices drift fast:

- **Core Web Vitals thresholds** have changed twice since 2020 (FID→INP was the most recent, March 2024).
- **Google algorithm updates** ship several times per year; ranking weightings shift.
- **Schema.org** publishes versioned releases — new types and properties monthly.
- **AI assistant crawlers** rotate user agents and update policies; new bots appear (OAI-SearchBot appeared mid-2024).
- **Rich result eligibility** changes — FAQPage (March 2024) and HowTo (September 2023) were both deprecated for most sites.
- **Next.js** ships major versions annually (13 → 14 → 15 → ...); each reshuffles Metadata API, params handling, or RSC semantics.

A Stinger last refreshed 18+ months ago is guaranteed to be citing outdated thresholds somewhere.

## What a 90-day review does

The `seo-aeo-worker-bee` Bee (on user trigger "refresh seo-aeo research") walks this checklist:

1. **Re-run `research/research-plan.md` queries.** For each of the 12 queries, run a fresh web search and compare top results to existing notes. New top result → new dated note in `research/YYYY-MM-DD-<topic>.md`. Contradicting claim → update the existing note with a `## 2026-07-24 update` section and adjust the relevant guide.
2. **Check Core Web Vitals thresholds.** Visit https://web.dev/vitals. Confirm LCP/INP/CLS thresholds match `research/2026-04-24-core-web-vitals-thresholds.md`. If changed, update the note, the `00-principles.md` guide, and the `06-core-web-vitals.md` guide.
3. **Check Next.js version.** Visit https://nextjs.org/blog. Note the current stable major. If the Metadata API signature changed (e.g., Next.js 16's params-handling tweak), update `research/2026-04-24-nextjs-metadata-api.md` and `templates/lib-metadata.ts`.
4. **Check Schema.org rich result eligibility.** Visit https://developers.google.com/search/docs/appearance/structured-data. Review the "Search features" list. Any newly deprecated or restricted types → update `research/2026-04-24-schema-org-structured-data.md` and `guides/03-schema-markup.md`.
5. **Check AI crawler user agents.** Visit OpenAI, Anthropic, Perplexity docs. New bots → update `research/2026-04-24-ai-assistant-crawlers.md` and `templates/app-robots.ts`.
6. **Update the review date.** Bump this file's "Next review" date.

Estimated time: 90–120 minutes for the full sweep.

## Trigger phrases

The Bee activates this protocol on:

- "Refresh the SEO research"
- "Update the seo-aeo-stinger research"
- "Run the 90-day SEO/AEO review"
- "Is the Stinger's research still current?"

## Accountability

Owner: unspecified — the user runs it on cadence. If this Stinger accumulates two consecutive missed reviews (180+ days stale), the Bee should proactively surface the staleness at the start of any new audit invocation.
