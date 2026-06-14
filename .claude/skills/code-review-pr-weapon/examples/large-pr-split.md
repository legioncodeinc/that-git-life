# Example: Large PR Split

A worked example of `code-review-pr-guardian` evaluating a large PR (643 changed lines, 4 mixed concerns) and proposing a concrete split into reviewable increments.

---

## Scenario

**PR title:** `feat: user dashboard v2`
**Lines changed:** 643
**Files changed:** 18
**Author request:** "Is this PR too large? How should I split it?"

**Diff overview:**
- `hooks/useAuthContext.ts` — 45 lines (new hook extracted from `AuthProvider`)
- `components/AuthProvider.tsx` — 38 lines (uses new hook; removes inline logic)
- `api/users.ts` — 120 lines (adds `updateUserProfile` endpoint)
- `api/users.test.ts` — 80 lines (tests for new endpoint)
- `components/Dashboard.tsx` — 180 lines (new dashboard layout)
- `components/ProfileCard.tsx` — 60 lines (new component)
- `components/__tests__/Dashboard.test.tsx` — 90 lines (new tests)
- `styles/dashboard.css` — 30 lines (new styles)

---

## Step 1: Size evaluation

```
🔔 PR size flag
Lines changed: 643 (threshold: 400)
Files changed: 18
Logical concerns identified: 4

  1. Auth hook extraction (useAuthContext) — no behavioral change
  2. API endpoint addition (updateUserProfile) — backend concern
  3. Dashboard UI build — frontend concern
  4. Tests — spread across concerns 1-3
```

**Verdict:** This PR exceeds the 400-line threshold and mixes backend, frontend, and refactoring concerns. Splitting is strongly recommended.

---

## Step 2: Split proposal

### PR A: Extract `useAuthContext` hook
**Lines:** ~83 (hook + AuthProvider changes)
**Concern:** Pure refactor — no behavioral change
**Rationale:** This is the safest PR to review; it changes structure without changing behavior. Ship it first so downstream PRs can depend on it.
**Description starter:** "Extracts auth state management from `AuthProvider` into a `useAuthContext` hook. No behavioral change. Enables cleaner consumption in Dashboard (see #[next-PR])."

### PR B: Add `updateUserProfile` API endpoint
**Lines:** ~200 (endpoint + tests)
**Concern:** Backend addition
**Rationale:** Backend-only change; can be reviewed by backend engineers without frontend context. Ships independently.
**Description starter:** "Adds `PUT /api/users/:id/profile` endpoint with validation and auth middleware. Includes integration tests. Dashboard will consume this in #[next-PR]."
**Depends on:** Can be opened in parallel with PR A.

### PR C: Dashboard UI (`Dashboard.tsx`, `ProfileCard.tsx`, styles)
**Lines:** ~360 (UI components + CSS + tests)
**Concern:** Frontend feature
**Rationale:** Uses the hook from PR A and calls the endpoint from PR B. Must be reviewed after both are merged.
**Description starter:** "Implements the user dashboard v2 layout using `useAuthContext` (from #PR-A) and the profile API (from #PR-B). Includes Storybook stories and 12 test cases."
**Depends on:** PR A merged, PR B merged.

---

## Step 3: Dependency visualization

```
PR A: useAuthContext hook (refactor)  ←── No deps; ship first
PR B: updateUserProfile API            ←── No deps; ship in parallel with A
          ↓
PR C: Dashboard UI                     ←── Depends on A + B
```

---

## Step 4: Revised size validation

| PR | Lines | Status |
|---|---|---|
| PR A | ~83 | ✅ Under 400 |
| PR B | ~200 | ✅ Under 400 |
| PR C | ~360 | ✅ Under 400 |
| Original PR | 643 | ❌ Over threshold |

All three PRs are independently reviewable. The total review effort is similar (same code), but each reviewer has a focused context window — dramatically improving defect detection probability.

---

## PR description for PR A (complete example)

```markdown
## Motivation

`AuthProvider` currently mixes rendering concerns with auth state management.
The auth state logic was tightly coupled to the provider component, making it
difficult to test and impossible to consume without rendering the full provider
tree. This extraction enables cleaner consumption in Dashboard v2 (#[issue]).

## Context

- Closes: N/A (enabler PR for #[Dashboard issue])
- No prior PR dependency

## What changed

- `hooks/useAuthContext.ts`: New hook that manages auth state. Moved from
  `AuthProvider.tsx` lines 22-67 (cut and paste with minor naming cleanup).
- `components/AuthProvider.tsx`: Now imports and uses `useAuthContext`.
  Rendering logic is unchanged.

## What did NOT change

- Auth behavior is identical — this is a refactor only
- No changes to the public API of `AuthProvider`
- No changes to downstream consumers (they still use `<AuthProvider>`)

## Testing proof

- [x] Existing AuthProvider tests pass without modification
- [x] CI passes: [link]

## Reviewer hints

- The key diff is in `AuthProvider.tsx` lines 22-67 (deletion) and
  `hooks/useAuthContext.ts` (addition)
- No logic was changed — the move is line-for-line except for the export name
```
