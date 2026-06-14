# Guide: react-guardian

Senior React architecture engineer for React 18/19 codebases — opinionated, modern, grounded in production-proven patterns.

---

## What this Angel owns

`react-guardian` reviews, refactors, or authors React codebases through the bulletproof-react lens and the curated awesome-react ecosystem, with React 19 awareness baked in. Its territory:

- **Folder architecture** — feature-based layout, barrel discipline, import-boundary rules.
- **Component composition** — compound components, API minimalism, prop surface design.
- **State layering** — UI state → global state → server state → URL state → form state, with colocation as the default.
- **Data-fetching boundaries** — RSC vs. TanStack Query vs. SWR vs. route loaders; no leaf-level fetches.
- **Error + Suspense composition** — every route gets both; no tree without either.
- **Forms** — React Hook Form + Zod in React 18; React 19 Actions + `useActionState` + `useFormStatus` + `useOptimistic` where appropriate.
- **Performance** — measured via Profiler, Lighthouse, bundle budgets. "Feels fast" is not a finding.
- **Testing strategy** — Vitest + RTL + MSW + Playwright, with integration > unit bias.
- **TypeScript discipline** — strict mode, Zod at boundaries, `satisfies` over `as`, branded types where they earn their keep.
- **React 19 idioms** — Actions, the Compiler, ref-as-prop, Server Components.
- **Anti-pattern detection** — useEffect-for-derived-state, barrel files, direct DOM queries, premature global state.

It does not do visual design, SEO, or security audits. Those surface as flagged handoffs to the appropriate Angel.

## When to invoke

Delegate to `react-guardian` when the user:

- Says "review React architecture", "code review this React diff", "propose a React refactor".
- Needs a state-management decision or ADR ("should this be Zustand or URL state?").
- Asks where a Server / Client Component boundary should go, or questions a `'use client'` placement.
- Wants a React 19 upgrade read — Actions, the Compiler, Suspense composition.
- Is setting up a new React project and wants bootstrap artifacts (provider stack, error boundary, test setup, ESLint config).
- Needs an anti-pattern sweep across an existing codebase.

Do **not** invoke for visual design, token usage, spacing, typography — route to `ux-ui-guardian`.

Do **not** invoke for SEO metadata, schema, sitemap, Core Web Vitals — route to `seo-aeo-guardian`.

Do **not** invoke for security audits of Server Actions, auth, or storage — `react-guardian` will surface those as handoffs to `security-guardian` rather than auditing itself.

## Paired Weapon

`.cursor/skills/react-weapon/` — contains the master index (SKILL.md) with routing table and severity rubric, 14 guides covering the bulletproof-react pillars plus React 19 idioms and Server Components, the ecosystem catalog, worked examples (ADR, before/after review, refactor proposal), output templates (ADR, project structure, provider stack, error boundary, test setup, ESLint config), deterministic scripts (`scan-anti-patterns.ts`, `bundle-budget-check.ts`, `react-version-audit.ts`), and the research trail.

## Expected input

- The branch, diff, or directory to review.
- The React version (or permission to read `package.json` and classify the stack).
- The scope: architecture review, pattern ADR, refactor proposal, code review, testing audit, performance audit, or from-scratch setup.
- Any specific files or decisions the user wants emphasized.

## Expected output

- Findings classified per the severity rubric: must-fix / should-refactor / style.
- Every finding cites `file.ts:LN` plus a short snippet and a link to the relevant guide section.
- For ADRs: a filled-in `templates/ADR.md` with decision, context, consequences, alternatives considered.
- For refactors: a PRD-shaped proposal (phases, acceptance criteria) — with a handoff to `library-guardian` if the refactor is large enough to warrant formal PRD authoring.
- For setup: provider stack, error boundary, test setup, ESLint config drawn from `templates/`.
- For reports: written into the host repo's `library/` tree (standalone: `library/qa/react/<date>-<topic>.md`; feature-tied: `library/requirements/features/feature-<###>-<title>/reports/<date>-<type>-report.md`; issue-tied: `library/requirements/issues/issue-<###>-<title>/reports/<date>-<type>-report.md`) following `templates/review-output-template.md`.
- Explicit handoff lines for any finding that belongs to another Angel (security, SEO, UX).

## Critical directives to respect when routing

- **React version awareness is mandatory.** Recommending a React 19 pattern into a React 18 codebase is a silent-drift bug. Always pass `package.json` or let the Angel read it.
- **Bleeding-edge is not reckless.** Novel patterns are labeled "experimental" with their source URL. Do not treat the Angel's experimental flags as weakness — it is calibrating risk.
- **State colocation is the default.** Do not ask `react-guardian` to approve a premature Zustand / Redux store unless the guide-backed case is airtight.
- **Performance findings must cite numbers.** Profiler traces, Lighthouse scores, or bundle budget results — not "feels fast".
- **Security is surfaced, not audited.** `react-guardian` flags Server Action auth, token storage, or RBAC concerns with file:line and hands off to `security-guardian`.

## Typical failure modes

- Invoked for a non-React stack (Svelte, Vue, Solid) — the Angel produces reduced-coverage output and flags "REDUCED COVERAGE"; route to a stack-specific reviewer instead.
- Invoked for visual review — the Angel will surface the request and hand off to `ux-ui-guardian`.
- Invoked for SEO metadata on a Next.js page — route to `seo-aeo-guardian`; `react-guardian` handles the render / data / boundary concerns only.
- Invoked without a clear scope — architecture vs. review vs. refactor vs. setup changes the output shape. Name the scope in the delegation.

## Orchestration notes

Step 3 in the extended implementation loop: **Plan → Implement → React architecture review → Security → QA**. `react-guardian` runs before `security-guardian` because architectural refactors can change the s