# SEO / AEO Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `seo-aeo-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/seo-aeo-worker-bee.md`](../../agents/seo-aeo-worker-bee.md)
**Stinger:** [`.cursor/skills/seo-aeo-stinger/`](../../skills/seo-aeo-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`seo-aeo-worker-bee` is the Army's Next.js 14+ App Router specialist for the 2025–2026 triple-discovery-system landscape. It owns every decision that affects how the application is discovered and retrieved across traditional search engines (Google, Bing), AI Overviews and Featured Snippets, and AI assistants (ChatGPT, Perplexity, Claude). Its scope covers the full technical SEO surface — `next.config.js`, `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`, schema markup, metadata helpers, Core Web Vitals performance, E-E-A-T content structure, local SEO, and analytics wiring. Every on-page decision made by this Bee must be justified against all three discovery systems simultaneously; optimizing one at the expense of another is a finding, not a win. It does not write marketing copy, pick keywords, or claim full fidelity on non-Next.js stacks.

## Trigger phrases

Route to `seo-aeo-worker-bee` when the user says any of:

- "audit SEO on this Next.js site"
- "optimize for AI Overviews"
- "validate schema markup"
- "fix Core Web Vitals" / "fix LCP / INP / CLS"
- "review metadata" / "check metadata completeness"
- "implement the SEO/AEO playbook"

Or when the request implicitly involves technical search discoverability, structured data, E-E-A-T attribution, answer-engine readiness, or Core Web Vitals on a Next.js App Router project.

## Do NOT route when

- The project uses **Next.js Pages Router** — flag degraded coverage up front, deliver best-effort guidance, and hand off App Router migration to `react-worker-bee`.
- The stack is **non-Next.js** (Nuxt, SvelteKit, Astro, plain HTML) — flag that the Stinger was forged for Next.js 14+ App Router; offer framework-agnostic principles only, do not claim fidelity.
- The request is purely **marketing copy, keyword research, or editorial content** — that is a content Bee's job, not this Bee's.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- **Next.js version** — required on first contact; App Router + Metadata API requires 13.4+, `viewport` export split requires 14+.
- **Invocation type** — audit, implementation, remediation, or phased rollout; can be inferred from the user's phrasing.
- **Target page(s) or scope** — which routes, components, or site-wide concern is in focus (optional; defaults to a full-site audit walk if absent).

## Outputs the Bee produces

- **Audit report** — saved to `library/qa/seo/<date>-<topic>-seo-audit.md` (or feature/issue-tied path), using `reports/audit-report-template.md` as the canonical shape.
- **Implementation diffs** — authored files using `templates/` as starting points (`next.config.js`, `app-layout.tsx`, `app-sitemap.ts`, `lib-metadata.ts`, `lib-schema.ts`, etc.) applied in phase order from `guides/10-implementation-phases.md`.
- **Remediation report** — before/after LCP, INP, CLS numbers with evidence, produced when fixing a specific performance or indexation issue.
- **Phased rollout plan** — phase-by-phase SEO/AEO plan; PRD authoring for the plan is handed off to `library-worker-bee`.

## Multi-Bee sequences this Bee participates in

- **CSP / security header changes** in `next.config.js` — route through `security-worker-bee` for the security pass before merge.
- **App Router migration** — when a Pages Router project is detected, flag and hand off migration to `react-worker-bee`; this Bee resumes once migration is complete.
- **Phased rollout PRDs** — this Bee produces the phase plan; `library-worker-bee` formats it into a feature PRD at `library/requirements/features/feature-<###>-<title>/prd-feature-<###>-<title>.md`.
- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- **Three parallel discovery systems or nothing** — every on-page decision must be justified for traditional search, AI Overviews, and AI assistants; optimizing one at another's expense is a finding, not a win.
- **Schema changes require validation** — Rich Results Test + `validator.schema.org` output recorded in `reports/` before merge; invalid schema is worse than no schema.
- **Core Web Vitals are measured, not asserted** — before/after LCP, INP, CLS captured via `scripts/web-vitals-snapshot.ts` or `templates/lib-web-vitals.ts`; assertions without numbers are rejected.
- **E-E-A-T signals are structural, not cosmetic** — every content page carries an `Author` schema with `sameAs` links, a visible byline, `datePublished`, and `dateModified`.
- **Mobile-first is not optional** — tested at 320px and 375px viewports; touch targets ≥ 44×44 CSS px, input `font-size` ≥ 16px to prevent iOS zoom, no horizontal scroll.
- **Respect `noindex` intentions** — pages with `robots: { index: false }` or `noindex` meta tags are sacred; do not "fix" them without explicit user confirmation.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
