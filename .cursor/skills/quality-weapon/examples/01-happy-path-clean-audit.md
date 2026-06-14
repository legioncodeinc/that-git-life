# Example 01 — Happy-Path Clean Audit

Demonstrates a small, faithful implementation that passes the audit with one Suggestion. Illustrates the minimum viable report — even when nothing is wrong, the full structure is produced.

**Illustrates guides:** `00-principles.md` (no silent passes), `04-five-axis-evaluation.md` (all-green scorecard), `06-report-writing.md` (voice and metadata).

---

## Input — Plan document excerpt

Plan file: `library/requirements/features/feature-007-user-profile-badge/prd-feature-007-user-profile-badge.md`

```markdown
# PRD: User Profile Badge

## Goal
Add a verified-status badge to the user profile header that renders when
`user.verified === true`.

## User Stories
- US-1: As a visitor, I see a checkmark badge next to the username of a verified user so that I can trust the content they post.

## Acceptance Criteria
- AC-1.1: Badge renders only when `user.verified === true`.
- AC-1.2: Badge uses the existing `CheckCircleIcon` from the design system.
- AC-1.3: Badge has an accessible label ("Verified account").

## Non-Goals
- NG-1: No badge UI for other statuses (pro, admin, etc.) in this phase.
- NG-2: No verification application flow.

## Tasks
- [ ] Add `VerifiedBadge` component.
- [ ] Integrate into `ProfileHeader`.
```

## Input — Diff

```
A  src/components/VerifiedBadge.tsx
M  src/components/ProfileHeader.tsx
```

Contents of `src/components/VerifiedBadge.tsx`:

```tsx
import { CheckCircleIcon } from "@/design-system/icons";

interface Props {
  verified: boolean;
}

export function VerifiedBadge({ verified }: Props) {
  if (!verified) return null;
  return (
    <span aria-label="Verified account" role="img" className="inline-flex items-center">
      <CheckCircleIcon className="h-4 w-4 text-blue-500" />
    </span>
  );
}
```

Excerpt of `src/components/ProfileHeader.tsx` showing the integration:

```tsx
import { VerifiedBadge } from "./VerifiedBadge";
// ...
<h1 className="text-xl font-semibold">
  {user.displayName}
  <VerifiedBadge verified={user.verified} />
</h1>
```

---

## Output — QA Report

Written to `library/requirements/features/feature-007-user-profile-badge/reports/2026-04-24-qa-report.md`.

```markdown
# QA Report: feature-007 User Profile Badge

**Plan document:** `library/requirements/features/feature-007-user-profile-badge/prd-feature-007-user-profile-badge.md`
**Audit date:** 2026-04-24
**Base branch:** `main`
**Head:** `feat/verified-badge`
**Auditor:** quality-guardian

## Summary

The verified-badge implementation is complete, faithful to the plan, and ships with a clean scorecard across all five axes. One minor Suggestion on keyboard focus styling is included but does not block merge.

## Scorecard

| Category      | Status | Notes |
|---------------|--------|-------|
| Completeness  | ✅ | Both user stories and all three acceptance criteria implemented |
| Correctness   | ✅ | `verified` guard correctly returns `null`; icon and label match plan |
| Alignment     | ✅ | Uses `CheckCircleIcon` from `@/design-system/icons` as specified |
| Gaps          | ✅ | No implicit gaps — component is purely presentational with no async paths |
| Detrimental   | ✅ | No regressions, performance issues, or security smells |

## Critical Issues (must fix)

None.

## Warnings (should fix)

None.

## Suggestions (consider improving)

- [ ] **Consider an explicit focus style if the badge becomes interactive later** — `src/components/VerifiedBadge.tsx:8-12`

  The current badge is a non-interactive `<span>`, which is correct for this phase. If a future phase adds a tooltip or link (e.g., linking to a "what does verified mean?" page), add `focus-visible` styling. Not in scope for this PR; tracking as a pointer for when NG-2 (verification flow) is revisited.

## Plan Item Traceability

| #     | Plan Requirement                                          | Status | Implementation Location                     | Notes |
|-------|-----------------------------------------------------------|--------|---------------------------------------------|-------|
| US-1  | Visitor sees checkmark badge next to verified user's name | ✅     | `src/components/ProfileHeader.tsx:14-17`    | Integrated via `<VerifiedBadge verified=...>` |
| AC-1.1| Badge renders only when `user.verified === true`         | ✅     | `src/components/VerifiedBadge.tsx:8`        | Early `return null` |
| AC-1.2| Badge uses `CheckCircleIcon` from design system          | ✅     | `src/components/VerifiedBadge.tsx:1,11`     | Imported from canonical path |
| AC-1.3| Badge has accessible label "Verified account"            | ✅     | `src/components/VerifiedBadge.tsx:10`       | `aria-label="Verified account"` + `role="img"` |
| T-1   | Add `VerifiedBadge` component                            | ✅     | `src/components/VerifiedBadge.tsx` (new)    | — |
| T-2   | Integrate into `ProfileHeader`                           | ✅     | `src/components/ProfileHeader.tsx:14-17`    | — |
| NG-1  | Non-goal: No badge UI for other statuses                 | ✅     | —                                           | Honored — only `verified` prop, no status enum |
| NG-2  | Non-goal: No verification application flow               | ✅     | —                                           | Honored — no route or form added |

## Files Changed

- `src/components/ProfileHeader.tsx` (M) — imports `VerifiedBadge` and renders it inside the `<h1>` after the display name
- `src/components/VerifiedBadge.tsx` (A) — new presentational component: accepts `verified: boolean`, returns `null` when false, otherwise renders the `CheckCircleIcon` with an aria label
```

---

## Why the audit looks this way

- **All-green scorecard.** Every plan item maps to implementation. No regressions, no gaps, no anti-patterns.
- **Full report despite no Criticals.** Per `guides/00-principles.md` rule #4 (No silent passes), the scorecard and traceability are written out even when everything passes.
- **One Suggestion, not a Warning.** Per `guides/05-severity-classification.md`, focus styling is an improvement on correct code — Suggestion, not Warning.
- **Non-Goals traced.** Both NG rows appear in the traceability table, confirming scope was audited.
