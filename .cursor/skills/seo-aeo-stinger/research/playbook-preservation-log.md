# Playbook Preservation Log

Faithfulness ledger. Canonical source: `NEXTJS_SEO_AEO_COMPLETE_GUIDE_2026.md` (2,175 lines, dated January 2026, v2.0).

For each section of the source, one row: what was preserved verbatim, what was adapted, and why.

| Playbook § | Title | Status | Notes |
|---|---|---|---|
| §1 | Introduction & Philosophy | Adapted | Folded into `guides/00-principles.md` alongside the brief's SUBAGENT CRITICAL DIRECTIVES. The 5 Core Principles preserved verbatim. |
| §2.1 | next.config.js | Verbatim → `templates/next.config.js` | All code preserved. Added inline comment cross-referencing `security-worker-bee` for the security-headers block. |
| §2.2 | app/layout.tsx | Verbatim → `templates/app-layout.tsx` | Full code preserved, including metadata object, viewport export, and JSX. |
| §2.3 | app/sitemap.ts | Verbatim → `templates/app-sitemap.ts` | Preserved, with a TODO marker for `fetchDynamicPages()` implementation. |
| §2.4 | app/robots.ts | Verbatim → `templates/app-robots.ts` | Preserved. Annotated with the allow-all AI-bots default and references to `research/2026-04-24-ai-assistant-crawlers.md` for alternative policies. |
| §2.5 | manifest.json | Verbatim | Lives inline in `guides/01-technical-foundation.md` because it's JSON, not TS. |
| §3.1 | lib/metadata.ts | Verbatim → `templates/lib-metadata.ts` | Preserved. |
| §3.2 | Page structure (Homepage + Blog) | Verbatim | Lives in `guides/02-on-page-optimization.md`. Code blocks preserved. |
| §3.3 | Image optimization | Verbatim | Lives in `guides/02-on-page-optimization.md` and cross-referenced from `guides/06-core-web-vitals.md`. |
| §4.1 | lib/schema.ts | Verbatim → `templates/lib-schema.ts` | Preserved. |
| §4.2 | components/Schema.tsx | Verbatim → `templates/components-Schema.tsx` | Preserved. |
| §4.3 | Schema catalog (Product/Service/Review/HowTo/VideoObject) | Verbatim | Extended in `guides/03-schema-markup.md` with the 2024 FAQPage/HowTo rich-result deprecation context from `research/2026-04-24-schema-org-structured-data.md`. |
| §5.1 | E-E-A-T framework | Verbatim | Lives in `guides/04-content-quality-eeat.md`. |
| §5.2 | Content structure for AI extraction | Verbatim | Preserved. |
| §5.3 | Author attribution component | Verbatim → `templates/components-Author.tsx` | Preserved. |
| §5.4 | Content freshness | Verbatim | Preserved inline in `guides/04-content-quality-eeat.md`. |
| §6.1 | Featured snippets (paragraph/list/table) | Verbatim | Lives in `guides/05-answer-engine-optimization.md`. |
| §6.2 | FAQ component with schema | Verbatim → `templates/components-FAQ.tsx` | Preserved. |
| §6.3 | Voice search optimization | Verbatim | Preserved. |
| §7.1 | Performance monitoring setup | Verbatim | `guides/06-core-web-vitals.md`. |
| §7.2 | Web vitals reporting | Verbatim → `templates/lib-web-vitals.ts` | Preserved. Annotated with note that `onFID` is deprecated; `onINP` is the current responsiveness metric. |
| §7.3 | Image optimization strategies | Verbatim | Cross-references §3.3 and `guides/02-on-page-optimization.md`. |
| §7.4 | Font optimization | Verbatim | Preserved. |
| §7.5 | Code splitting & dynamic imports | Verbatim | Preserved. |
| §7.6 | Prefetching strategy | Verbatim | Preserved. Extended with `research/2026-04-24-nextjs-prefetching-strategy.md` for `<Link prefetch>` semantics and bundle-size target. |
| §8 | Mobile optimization | Verbatim | `guides/07-mobile-optimization.md`. Extended with WCAG 2.2 target-size reference and iOS 16px input rule. |
| §9 | Local SEO | Verbatim | `guides/08-local-seo.md`. Extended with multi-location `@id` pattern and strict NAP rule. |
| §10 | Analytics & Tracking | Verbatim | `guides/09-analytics-tracking.md`. |
| §11 | Implementation Checklist (8 phases) | Verbatim | `guides/10-implementation-phases.md`. Each phase's checklist items preserved; no items added or removed. |
| §12 | Troubleshooting Guide | Verbatim | `guides/11-troubleshooting.md`. All 6 common-issue entries preserved. |
| Final Recommendations + Conclusion | Adapted | Folded into `guides/10-implementation-phases.md` as the "Priority order" appendix. |

## Adaptations (additions that do NOT change playbook content)

- **`guides/00-principles.md`** — new guide wrapping the brief's SUBAGENT CRITICAL DIRECTIVES around the playbook's Introduction. Not a playbook section; necessary for the Cursor skill pattern (principles file is an Army convention — see `quality-stinger`, `security-stinger`).
- **`scripts/validate-schema.ts`, `scripts/web-vitals-snapshot.ts`, `scripts/check-metadata-completeness.ts`** — stubs requested by the brief's IDEAS section. Not in the playbook; additive automation layer.
- **`examples/audit-ecommerce-site.md`, `implementation-blog-post.md`, `core-web-vitals-remediation.md`** — worked examples required by stinger-forge's done-checklist. Not in the playbook; Cursor-skill convention.
- **`templates/audit-report-template.md`** — report template matching the brief's EXPECTED OUTPUT format. Not in the playbook; derived from brief.
- **Cross-Bee references** — `security-worker-bee` (CSP overlap), `react-worker-bee` (App Router), `library-worker-bee` (PRD authoring) — annotated where relevant. Not in the playbook; required by the brief.
