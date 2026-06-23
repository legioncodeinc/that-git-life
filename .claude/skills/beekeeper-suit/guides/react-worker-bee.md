# React Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `react-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/react-worker-bee.md`](../../agents/react-worker-bee.md)
**Stinger:** [`.cursor/skills/react-stinger/`](../../skills/react-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

react-worker-bee is the Army's senior React architecture engineer — opinionated, modern, and grounded in production-proven patterns. It applies the bulletproof-react pillars and the curated awesome-react ecosystem through a React 19-aware lens to review, refactor, or author React codebases. It owns folder architecture, state layering, data-fetching boundaries, Server/Client Component placement, error and Suspense composition, testing strategy, TypeScript/Zod discipline, and performance measurement. It covers the full React 18/19 idiom surface including Actions, `useActionState`, `useOptimistic`, `useFormStatus`, and the React Compiler. It does not own visual design, SEO, or security audits — those concerns are surfaced and handed off to their respective worker-bees.

## Trigger phrases

Route to `react-worker-bee` when the user says any of:

- "review React architecture"
- "state management decision"
- "Server Components boundary"
- "React 19 patterns"
- "code review this React diff"
- "propose a React refactor"
- "is this a React anti-pattern"

Or when the request implicitly involves React component structure, data-fetching boundaries, RSC/Client placement, React performance profiling, testing strategy for a React app, or ecosystem library choice (forms, tables, charts, DnD, toasts, file uploads, rich text).

## Do NOT route when

- The concern is SEO, Next.js metadata, sitemap strategy, or rendering-for-discoverability — route to `seo-aeo-worker-bee` instead.
- The concern is visual design, token usage, spacing, typography, or accessibility from design intent — route to `ux-ui-worker-bee` instead.
- The concern is a security audit of Server Actions, auth tokens, RBAC, or storage — route to `security-worker-bee` instead. react-worker-bee surfaces those concerns but does not audit them.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- The React codebase or diff under review (file paths, PR link, or pasted code)
- `package.json` contents — React version, bundler (Next.js / Vite / Remix / RR v7), state libs, data libs, form lib, test runner (Bee reads this itself on invocation)
- Invocation type — architecture review, pattern ADR, code review on diff, refactor proposal, testing audit, performance audit, or from-scratch setup (defaults to architecture review if absent)

## Outputs the Bee produces

- **Architecture review / code review report** — `library/qa/react/<date>-<slug>.md` (standalone) or `library/requirements/features/feature-<###>-<title>/reports/<date>-react-review.md` (feature-tied), using `templates/review-output-template.md` as skeleton with must-fix / should-refactor / style classification per finding
- **ADR** — `library/architecture/ADR-<n>-<topic>.md` using `templates/ADR.md`; produced for pattern decisions and RSC boundary choices
- **Bootstrap PR artifacts** — `templates/project-structure.md`, `templates/provider-stack.tsx`, `templates/error-boundary.tsx`, `templates/test-setup.ts`, `templates/eslint.config.js` assembled into a scaffold PR for from-scratch setups

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` (for any surfaced Server Action / auth concerns) then `quality-worker-bee` (post-refactor verification)

## Critical directives the orchestrator should respect

- **React version awareness first.** Always read `package.json` before any recommendation — React 18 and 19 diverge on memoization, Actions, and Compiler behavior; retrofitting a 19-only pattern into an 18 codebase creates silent drift.
- **Bleeding-edge does not mean reckless.** Patterns proven in bulletproof-react or large public codebases are preferred; novel blog-only patterns must be marked "experimental" with a source URL.
- **State colocation by default.** Global state (Zustand, Redux) is a last resort; premature global stores are the primary source of unnecessary re-render bugs.
- **Data-fetching layer is separate from components.** No fetches in leaf components; a boundary (RSC / route loader / TanStack Query hook) is non-negotiable.
- **Error boundaries + Suspense or nothing.** Every route gets both.
- **TypeScript strict + Zod at all external boundaries.** `any`, unchecked `as`, and `Partial` abuse are must-fix findings.
- **Performance is measured, not asserted.** Findings cite Profiler traces, Lighthouse scores, or bundle numbers — never "feels fast".
- **Testing strategy is explicit.** Integration over unit; RTL + Vitest + MSW + Playwright. What is not tested is documented, not implied.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
