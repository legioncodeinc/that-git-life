# Guide: seo-aeo-guardian

Next.js 14+ App Router specialist for the 2025–2026 triple-discovery-system landscape.

---

## What this Angel owns

`seo-aeo-guardian` optimizes simultaneously for three parallel discovery systems: traditional search engines (Google, Bing), AI Overviews / Featured Snippets, and AI assistants (ChatGPT, Perplexity, Claude). Every on-page decision must be justified against all three, or it is a finding, not a win. Its territory:

- **Technical foundation** — `next.config.js`, `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`, `public/manifest.json`.
- **On-page metadata** — `generateMetadata()` helpers, viewport export, Open Graph, Twitter cards.
- **Schema markup** — `lib/schema.ts`, `components/Schema.tsx`, canonical types (Article, Product, Service, Review, HowTo, VideoObject, LocalBusiness, Organization, WebSite, BreadcrumbList, FAQPage).
- **E-E-A-T content structure** — author schema with `sameAs`, visible byline, `datePublished`, `dateModified`, freshness discipline.
- **Answer Engine Optimization** — featured-snippet patterns (paragraph / list / table), FAQ, voice search, AI assistant citation readiness.
- **Core Web Vitals** — LCP, INP (replaced FID in March 2024), CLS; measured with `scripts/web-vitals-snapshot.ts` and `templates/lib-web-vitals.ts`.
- **Mobile-first** — 320px / 375px viewport testing, ≥44×44 CSS px touch targets, ≥16px input font-size.
- **Local SEO** — LocalBusiness schema, NAP consistency, multi-location.
- **Analytics wiring** — GA4, Search Console, event tracking.

It does not write marketing copy, pick keywords, or claim full fidelity on non-Next.js stacks.

## When to invoke

Delegate to `seo-aeo-guardian` when the user:

- Says "audit SEO on this Next.js site", "optimize for AI Overviews", "validate schema markup".
- Needs a metadata / schema / sitemap / robots review on an App Router project.
- Asks to fix or measure Core Web Vitals.
- Wants the full 2025–2026 SEO/AEO playbook applied as a phased rollout.
- Is shipping a public-facing Next.js page and wants a pre-merge review.

Do **not** invoke for Pages Router projects without flagging degraded coverage up front; the Weapon was forged for App Router.

Do **not** invoke for non-Next.js stacks (Nuxt, SvelteKit, Astro, plain HTML) — the Angel can extract framework-agnostic principles but will decline to claim fidelity.

Do **not** invoke for marketing copy or keyword research — that is a content Angel's domain.

## Paired Weapon

`.cursor/skills/seo-aeo-weapon/` — contains the master index (SKILL.md) with four invocation modes (audit / implementation / remediation / phased rollout), 12 guides mirroring the canonical playbook's §1–§12 table of contents, 10 production-ready templates, 3 deterministic validation scripts, 3 worked examples, report templates, and a 10-note research trail with a 90-day refresh cadence.

## Expected input

- The Next.js version (the Angel will verify on first contact — the Metadata API and `viewport` export split vary by version).
- The pages, routes, or components in scope.
- The invocation mode: audit, implementation, remediation, or phased rollout.
- Any existing `noindex` intentions the orchestrator wants preserved.

## Expected output

- **Audit** — a findings report at `library/qa/seo/<branch-or-feature>-seo-audit.md` scoring each phase of `guides/10-implementation-phases.md` with before/after evidence.
- **Implementation** — concrete file diffs drawn from `templates/` (layout, sitemap, robots, metadata helper, schema library, schema component, FAQ, Author, web-vitals reporter).
- **Remediation** — a report with before/after schema validation output and before/after Core Web Vitals numbers.
- **Phased rollout** — a phase-by-phase plan; PRD authoring hands off to `library-guardian`.
- Every schema change is validated against Google's Rich Results Test and `validator.schema.org`; output recorded in the audit report's validation appendix at `library/qa/seo/<date>-schema-validation.md` (or under a feature folder).
- Every performance-impacting change includes measured LCP / INP / CLS.

## Critical directives to respect when routing

- **Three parallel discovery systems or nothing.** Do not accept a win in one system at another's expense.
- **Schema validation is mandatory.** Invalid schema triggers indexation warnings and is worse than no schema.
- **Core Web Vitals are measured, not asserted.** Numbers or it didn't happen.
- **Respect `noindex` intentions.** Pages with `robots: { index: false }` are sacred — they may be staging, preview, or intentionally excluded. Do not "fix" them without explicit user confirmation.
- **Next.js version awareness.** Confirm the `next` version on first contact; the Metadata API and App Router conventions vary by version.

## Typical failure modes

- Invoked on a Pages Router project without the degraded-coverage flag — the Angel will flag and hand App Router migration to `react-guardian`.
- Invoked on a non-Next.js stack — the Angel will decline full fidelity and offer framework-agnostic principles only.
- Invoked to write marketing copy — route to a content Angel; this Angel handles structure, not words.
- Invoked alongside CSP or security-header changes — the Angel surfaces the header changes and routes them through `security-guardian` before merge.

## Orchestration notes

For public-surface Next.js PRs, `seo-aeo-guardian` runs as part of the **Next.js public-surface PR → SEO review → Security → QA** sequence. CSP or security-header edits in `next.config.js` route through `security-guardian`. Large phased rollouts on TrueFreedom.ai hand PRD authoring to `library-guardian` after the phase plan is produced. For Pages Router projects, `seo-aeo-guardian` flags degraded coverage first and hands App Router migration to `react-guardian` before the full audit proceeds.
