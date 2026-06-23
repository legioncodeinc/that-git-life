# SEO/AEO Audit — {{branch-or-feature}}

**Date:** {{YYYY-MM-DD}}
**Auditor:** seo-aeo-worker-bee (Stinger: seo-aeo-stinger)
**Target:** {{repo-name}} @ {{commit-sha-or-branch}}
**Next.js version:** {{next-version}}
**Business context:** {{e.g., e-commerce, SaaS, local business, content site}}
**Scope:** {{full | specific-phase | specific-issue}}

---

## Executive summary

{{2–3 sentence overview of the audit's top-level findings and the recommended next step.}}

**Finding counts:**

- Critical: {{n}}
- High: {{n}}
- Medium: {{n}}
- Low: {{n}}

---

## Phase-by-phase scorecard

Mirrors `guides/10-implementation-phases.md`. Each row marks Pass / Partial / Fail.

### Phase 1 — Technical Foundation

| Item | Status | Note |
|---|---|---|
| `next.config.js` image optimization | {{Pass/Partial/Fail}} | |
| Viewport meta | | |
| Security headers | | |
| Compression | | |
| TypeScript strict | | |
| Sitemap | | |
| Robots | | |
| Manifest | | |
| Fonts | | |
| Google Analytics 4 | | |
| Search Console | | |
| Speed Insights / Web Vitals wiring | | |

### Phase 2 — Schema Markup

| Schema type | Status | Validator | Rich Results Test | Note |
|---|---|---|---|---|
| Organization (homepage) | | | | |
| LocalBusiness (per location) | | | | |
| Article / BlogPosting | | | | |
| Product | | | | |
| Service | | | | |
| Review / AggregateRating | | | | |
| HowTo | | | | |
| VideoObject | | | | |
| FAQPage | | | | |
| BreadcrumbList | | | | |
| Person (author pages) | | | | |

**Validator evidence:** {{paste or link to validator.schema.org output per schema — required per SUBAGENT CRITICAL DIRECTIVE}}

### Phase 3 — Content Optimization

| Item | Status | Note |
|---|---|---|
| Title tags 50–60 chars | | |
| Meta descriptions 150–160 | | |
| H1 per page | | |
| Heading hierarchy | | |
| Alt text on images | | |
| Image file names | | |
| Question-answer content shape | | |
| Direct-answer boxes (40–60 words) | | |
| FAQ sections | | |
| Comparison tables | | |
| Author attribution | | |
| Publish / update dates | | |
| Cited sources | | |

### Phase 4 — Performance (Core Web Vitals)

**Measured, not asserted.** Capture baseline per route via `scripts/web-vitals-snapshot.ts` or PageSpeed Insights.

| Route | Strategy | LCP | INP | CLS | Verdict |
|---|---|---|---|---|---|
| / | mobile | | | | |
| / | desktop | | | | |
| {{route}} | mobile | | | | |
| {{route}} | desktop | | | | |

**Field data (CrUX, p75, last 28 days):** {{from Search Console}}

### Phase 5 — AEO

| Item | Status | Note |
|---|---|---|
| Featured snippet coverage (paragraph) | | |
| Featured snippet coverage (list) | | |
| Featured snippet coverage (table) | | |
| FAQ schema | | |
| Voice search patterns | | |
| AI assistant citation readiness | | |

### Phase 6 — Local SEO (if applicable)

| Item | Status | Note |
|---|---|---|
| NAP consistency | | |
| LocalBusiness schema coverage | | |
| Location pages | | |
| `openingHoursSpecification` | | |
| GBP listings (flag only) | | |

### Phase 7 — Content Expansion

Informational. No direct findings.

### Phase 8 — Link Building

Out of scope. Informational.

---

## Prioritized findings

### Critical (fix before merge)

1. {{finding — include file path + line}}
2. …

### High

1. …

### Medium

1. …

### Low

1. …

---

## Three discovery systems cross-check

Every finding above must be classified for all three systems. Findings where the three columns diverge are system-tradeoff flags (not wins).

| Finding | Traditional search | AI Overviews | AI assistants |
|---|---|---|---|
| {{finding}} | | | |

---

## Recommended next step

- [ ] {{e.g., "Implement Critical fixes immediately — switch to Implementation mode."}}
- [ ] {{e.g., "Hand off to library-worker-bee for PRD authoring on the 8-week rollout."}}
- [ ] {{e.g., "Schedule 14-day CrUX follow-up against Search Console."}}
- [ ] {{e.g., "Route CSP change through security-worker-bee before merge."}}

---

## Appendix A — Validation artifacts

Paste the full output of:

- Rich Results Test per schema type (URL + screenshot or JSON).
- Schema Markup Validator per schema type.
- PageSpeed Insights per tested route (URL + lab + field data).
- `scripts/check-metadata-completeness.ts` output.

---

## Appendix B — Refresh note

The `seo-aeo-stinger` research folder's 90-day refresh cadence:

- **Last research refresh:** {{date — see `research/refresh-cadence.md`}}
- **Next scheduled refresh:** {{date}}
- **Current Core Web Vitals thresholds:** LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.
- If this audit relied on a refresh older than 90 days, flag it here and recommend a refresh before the next audit.
