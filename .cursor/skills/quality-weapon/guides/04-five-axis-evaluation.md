# 04 — Five-Axis Evaluation

After the traceability table is filled, evaluate the implementation along these five axes. Each axis yields a row in the Scorecard and may yield findings at any severity.

The five axes are: **Completeness**, **Correctness**, **Alignment**, **Gaps**, **Detrimental Patterns**. They map roughly onto Google's eight reviewer dimensions (see `research/2026-04-24-google-code-review-standard.md`), compressed for this Angel's plan-relative scope.

---

## Axis 1 — Completeness

**Question:** Is every requirement from the plan addressed in code?

Source: the traceability table from step 3.

Checks:

- Every row has a Status of ✅, ⚠️, ❌, or 🟦.
- Count of ❌ rows → drives the axis status.
  - Zero ❌ → ✅ Pass.
  - 1–2 ❌ on non-critical items → ⚠️ Partial.
  - 3+ ❌ or 1+ ❌ on a core user flow → ❌ Fail.
- Any requirement left un-traceable (couldn't find where it lives) is a Completeness gap — record what you searched for.

Findings produced: Critical for every ❌ row on a core flow. Warning for ❌ on secondary flows. Suggestion if the plan is ambiguous enough that "done" is subjective.

---

## Axis 2 — Correctness

**Question:** Does the implementation do what the plan specifies, not just look like it?

Checks:

- For each ✅ row in the traceability table, re-read the code and confirm behavior. Attention to:
  - Data model / type definitions match the plan's schema (field names, nullability, enum values).
  - API contracts (route path, HTTP method, request/response shape) match.
  - Edge cases the plan called out (e.g., "handle empty list", "retry on 429") are handled.
  - Business-logic constants match (e.g., plan says "free tier = 100/mo", code should not say `if (count > 50)`).
- Flag any case where the surface looks right but the behavior is wrong.

Findings: usually Warning or Critical. A "looks right, acts wrong" bug is worse than a missing feature because it evades later sanity checks.

---

## Axis 3 — Alignment

**Question:** Does the code structure match the plan's architecture and conventions?

Checks:

- File locations match the plan's architecture diagram (if any) or the repo's existing conventions.
- Naming follows the plan's vocabulary. If the plan says "subscription", the code should not say "membership" unless that's an established synonym in the codebase.
- Module boundaries respected — e.g., UI components don't directly import DB clients.
- UI/UX elements match any wireframes, user stories, or descriptions in the plan (labels, states, empty states).
- Non-goals honored — no out-of-scope files in the diff (see `03-cross-reference-audit.md` on non-goals).

Findings: usually Warning for naming/placement. Critical for module-boundary violations (e.g., `"use client"` page importing `@prisma/client` — leaks server code into the bundle).

Next.js App Router specifics (source: `research/2026-04-24-react-nextjs-review-checklist.md`):

- `"use client"` directives only where needed.
- Server components do not import from client-only modules.
- Metadata exports (`generateMetadata` or `metadata`) on public routes.
- `loading.tsx` / `error.tsx` siblings present where plan specified loading/error UX.

---

## Axis 4 — Gaps

**Question:** What's implied but missing — error handling, validation, tests, edge cases?

This axis catches implicit requirements. See `07-common-gaps.md` for the full pattern catalog. Quick checklist:

- **Error handling.** Every `fetch`, `await`, DB call in the diff — is there a catch path? (Warning if absent; Critical if silent failure corrupts data.)
- **Input validation.** New API routes or form handlers — is input validated before use? (Critical if user input reaches DB unvalidated.)
- **Loading / empty states.** UI components that fetch data — is there a loading state? An empty state?
- **Auth/authz.** New routes or pages — are they protected if the plan implies authenticated users?
- **Feature flags.** If the plan describes a rollout strategy, is the code behind a flag?
- **Tests.** If the plan explicitly called for tests, are they present? (If the plan is silent, missing tests is a Suggestion, not a Warning.)
- **Observability.** If the plan described metrics, traces, or logs, are they emitted?

Findings produced: mostly Warning. Critical only when a gap is directly ship-blocking (e.g., unprotected admin route).

---

## Axis 5 — Detrimental Patterns

**Question:** Does the implementation regress existing behavior or introduce anti-patterns?

Checks:

### Regressions
- For every modified function signature, grep the repo for callers. Any caller unvisited by the diff that relied on the old contract is a regression candidate. (Source: `research/2026-04-24-regression-without-tests.md`.)
- For every deleted file, grep for remaining imports.

### Security smells
- Hardcoded secrets, API keys, tokens in the diff.
- `eval`, `Function()`, `dangerouslySetInnerHTML` without sanitization.
- User input flowing into DB queries, file paths, or shell commands without escaping.
- Missing auth checks on new routes.
- (Deep security audit is `security-guardian`'s job; here, flag obvious smells only.)

### Performance anti-patterns
- **N+1 queries** (source: `research/2026-04-24-prisma-n-plus-one.md`):
  - `for (const x of list) { await prisma.y.findUnique(...) }` — loop-over-findUnique.
  - `prisma.user.findMany()` then `.map(u => u.posts)` where `posts` is a relation — missing `include`.
  - FK columns in `where`/`include`/`orderBy` without indexes in `schema.prisma`.
- Unbounded loops, recursion without depth limits.
- Missing pagination on list endpoints — any `findMany` without `take` or cursor.
- Synchronous blocking work in server components.
- Fetching inside a loop in a server component — parallelize with `Promise.all`.

### Code health
- Dead code (unreachable branches, unused exports).
- Leftover debugging (`console.log`, `debugger`, `// TODO: remove this`).
- Unused imports (ESLint usually catches these; flag if not).
- Stale comments referring to old behavior.

Findings produced: all severities, calibrated by impact. A `console.log` in a hot path is Warning. A hardcoded secret is Critical. An N+1 on the dashboard is Critical; on an admin-only page, Warning.

---

## Scorecard production

From the five axes, produce the scorecard row:

| Category | Status | Rule of thumb |
|---|---|---|
| Completeness | ✅ / ⚠️ / ❌ | ✅ all ✓, ⚠️ if any ❌ rows, ❌ if core flow missing |
| Correctness | ✅ / ⚠️ / ❌ | ✅ behavior matches, ⚠️ minor divergence, ❌ wrong-but-looks-right |
| Alignment | ✅ / ⚠️ / ❌ | ✅ structure matches, ⚠️ naming/placement drift, ❌ module-boundary violation |
| Gaps | ✅ / ⚠️ / ❌ | ✅ no implicit gaps, ⚠️ minor gaps, ❌ auth/validation/error-handling gap |
| Detrimental | ✅ / ⚠️ / ❌ | ✅ clean, ⚠️ code-health drift, ❌ regression or perf anti-pattern on hot path |

Use consistent emoji. Do not mix ✅/✔️ or ❌/✖️.

---

## See also

- Severity classification for each finding: `05-severity-classification.md`.
- Common gap catalog: `07-common-gaps.md`.
- Examples: `examples/01-happy-path-clean-audit.md` (clean scorecard), `examples/02-blocker-heavy-audit.md` (failing scorecard).
- Research: `research/2026-04-24-google-code-review-standard.md`, `research/2026-04-24-react-nextjs-review-checklist.md`, `research/2026-04-24-prisma-n-plus-one.md`, `research/2026-04-24-regression-without-tests.md`.
