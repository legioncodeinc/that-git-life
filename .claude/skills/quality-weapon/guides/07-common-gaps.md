# 07 — Common Gaps Catalog

A catalog of "implied but missing" patterns that recur across audits. Check these proactively on every Gaps-axis evaluation (see `04-five-axis-evaluation.md`).

Each pattern below lists:
- The gap (what's missing).
- The signature (what to grep / look at).
- The usual severity (can escalate to Critical based on context).

---

## UI and state gaps

### Missing empty state
- **Gap:** List view that renders nothing when the data set is empty, leaving a blank screen.
- **Signature:** `data.map(...)` in a component with no `if (data.length === 0)` branch.
- **Severity:** Warning. Critical if plan explicitly described empty state.

### Missing loading state
- **Gap:** Async UI with no skeleton, spinner, or `Suspense` boundary.
- **Signature:** Client component with `useEffect`/SWR fetch but no `isLoading` branch; server component with a slow `await` but no sibling `loading.tsx` in the route.
- **Severity:** Warning.

### Missing error state
- **Gap:** Fetch or mutation with no UI path for the error case.
- **Signature:** `try/catch` that swallows to `console.error`; no sibling `error.tsx` in the route.
- **Severity:** Warning. Critical if an unhandled error crashes the page.

### Missing unauthenticated-user flow
- **Gap:** Page or route that assumes a logged-in user but doesn't redirect or show a signed-out variant.
- **Signature:** `session.user.id` accessed without a null check; route outside `(auth)` segment without middleware guard.
- **Severity:** Critical (if protected route) or Warning (if a view leaks to logged-out state).

### Missing feature-flag guard
- **Gap:** Plan describes a staged rollout but the feature ships unflagged.
- **Signature:** New public route or UI without `useFeatureFlag`, `FeatureGate`, or equivalent wrapper.
- **Severity:** Warning. Critical if the plan said "behind flag until Xth."

---

## Data and validation gaps

### Missing input validation
- **Gap:** User input (form, query param, request body) used without schema validation.
- **Signature:** `request.json()` or `req.body` accessed directly without `zod` / `yup` / `valibot` parse.
- **Severity:** Warning on a form; Critical when input reaches a DB query or file path.

### Missing tenant scoping (multi-tenant app)
- **Gap:** Query touches a tenanted table without filtering by `tenantId` / `orgId` / `workspaceId`.
- **Signature:** `prisma.X.findMany({ where: { ...} })` on a tenanted model where `where` lacks a tenant filter. Grep the schema for `tenantId` to find tenanted models.
- **Severity:** **Always Critical.** Tenant leak is a security-grade data bug.
- **(Multi-tenant repos)**: this rule is especially load-bearing in any codebase that hosts multiple tenants behind a shared schema.

### Missing authz check
- **Gap:** Route performs a write but doesn't verify the user owns the resource.
- **Signature:** `PUT/DELETE/POST` handler that reads `session.user.id` but doesn't compare it to the resource's owner.
- **Severity:** Critical.

### Missing pagination
- **Gap:** List endpoint returns the entire table.
- **Signature:** `findMany` without `take` or cursor; `SELECT * FROM` without `LIMIT`; API response shape has no `nextCursor` / `hasMore` / `page`.
- **Severity:** Warning. Critical if the table grows unbounded with user content.

---

## Performance gaps

### N+1 queries
See `research/2026-04-24-prisma-n-plus-one.md`.
- **Gap:** One query for a list, then one query per item for related data.
- **Signature (Prisma):**
  - `for/map` over a list calling `findUnique` / `findFirst`.
  - `findMany` without `include` followed by `.posts` access in a render loop.
  - GraphQL resolver that fetches parent then walks children without dataloader.
- **Severity:** Critical on a hot path; Warning on cold paths.

### Missing index on FK used in where/include/orderBy
- **Gap:** Prisma schema relation column has no `@@index` / `@index`.
- **Signature:** Grep `schema.prisma` for relation fields; any field used in a query filter or ordering that lacks an index line is a candidate.
- **Severity:** Warning.

### Waterfall fetches
- **Gap:** Server component sequentially awaits N independent fetches.
- **Signature:** Multiple `const x = await fetch(...)` in a row where the fetches don't depend on each other.
- **Severity:** Warning.

### Unnecessary `"use client"`
- **Gap:** Client component directive on a file that doesn't need it (increases bundle size).
- **Signature:** `"use client"` at top of a file with no hooks, no event handlers, no browser-only APIs.
- **Severity:** Suggestion.

---

## Correctness and regression gaps

### Caller not updated after signature change
- **Gap:** Modified function has a new signature; at least one caller elsewhere in the repo wasn't updated.
- **Signature:** Grep repo for `<functionName>(` and compare arg shapes.
- **Severity:** Critical (build break) or Critical (silent type change, e.g., return nullable).

### Deleted file with surviving imports
- **Gap:** File deleted in the diff but still imported somewhere.
- **Signature:** `git diff --name-status` shows a `D`; grep for the old import path.
- **Severity:** Critical (build break).

### Silent catch
- **Gap:** `try/catch` that logs or swallows, losing errors.
- **Signature:** `catch (e) { console.error(e) }` with no re-throw, Sentry capture, or user-facing error.
- **Severity:** Warning. Critical if inside a financial or data-mutation path.

---

## Testing and observability gaps

### Plan required tests, none shipped
- **Gap:** Plan explicitly called for unit / integration tests; none in the diff.
- **Signature:** No `.test.ts` / `.spec.ts` siblings for new source files.
- **Severity:** Warning.
- **Note:** If the plan did NOT call for tests, missing tests is a Suggestion (not Warning).

### Missing log / metric / trace the plan required
- **Gap:** Plan described observability signals; diff lacks them.
- **Signature:** Plan mentions "emit metric X" or "log Y event"; grep the diff for the signal.
- **Severity:** Warning.

### Leftover debugging artifacts
- **Gap:** `console.log`, `debugger`, `alert`, `// TODO: remove` in the diff.
- **Signature:** Grep the diff for these strings.
- **Severity:** Suggestion (single instance) or Warning (systematic).

---

## Scope and documentation gaps

### Out-of-scope change
- **Gap:** Files changed that the plan didn't authorize.
- **Signature:** Cross-reference Files Changed against the plan's scope section.
- **Severity:** Warning; Critical if the out-of-scope file is high-risk (`middleware.ts`, `schema.prisma`, auth modules).

### Missing .env.example update
- **Gap:** New env var required by the code but not documented in `.env.example`.
- **Signature:** Grep diff for `process.env.X_NEW_VAR` and check if `.env.example` was updated.
- **Severity:** Warning.

### Plan required docs update, none shipped
- **Gap:** Plan said "update README / CHANGELOG / architecture doc"; not done.
- **Signature:** Plan's task list mentions a doc change; diff has no touched `.md` in that path.
- **Severity:** Warning.

---

## How to use this catalog

During the Gaps axis pass in `04-five-axis-evaluation.md`:

1. Skim this list.
2. For each pattern, ask: "Is this applicable here?" (If the plan didn't touch auth, skip auth gaps.)
3. For applicable patterns, grep / inspect the diff.
4. Record findings with the severity above, adjusted for context.

Add new patterns to this file as they recur across audits. The file is a living catalog.

---

## See also

- Examples: `examples/02-blocker-heavy-audit.md` demonstrates several patterns from this catalog.
- Research: `research/2026-04-24-react-nextjs-review-checklist.md`, `research/2026-04-24-prisma-n-plus-one.md`, `research/2026-04-24-regression-without-tests.md`.
