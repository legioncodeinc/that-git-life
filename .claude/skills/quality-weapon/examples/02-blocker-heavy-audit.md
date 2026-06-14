# Example 02 — Blocker-Heavy Audit

Demonstrates an implementation with multiple Critical findings (plan gaps, an N+1, tenant-leak) and several Warnings. Illustrates the report at its most impactful: dense, specific, and prioritized.

**Illustrates guides:** `03-cross-reference-audit.md` (thorough traceability), `04-five-axis-evaluation.md` (multiple axes failing), `05-severity-classification.md` (Critical vs. Warning judgment), `07-common-gaps.md` (tenant scoping, N+1, missing auth).

---

## Input — Plan document excerpt

Plan file: `library/requirements/features/feature-013-team-invoices/prd-feature-013-team-invoices.md`

```markdown
# PRD: Team Invoices (Phase 3)

## Goal
Let team owners view and download invoices for their team. Part of the billing rollout.

## User Stories
- US-1: As a team owner, I view a list of invoices for my team with status, date, and amount.
- US-2: As a team owner, I click an invoice to view line items.
- US-3: As a team owner, I download an invoice as a PDF.
- US-4: As a team owner, failed invoices automatically retry with exponential backoff (1h / 6h / 24h) and surface as "Past Due" after three failures.

## Acceptance Criteria
- AC-1: Invoice list is scoped to the signed-in owner's team (tenant isolation).
- AC-2: Only team owners can access; regular members are redirected.
- AC-3: Empty state shown if team has no invoices.
- AC-4: Pagination (20 per page, cursor-based).

## Non-Goals
- NG-1: No invoice editing.
- NG-2: No subscription cancellation flow.
```

## Input — Diff (summary)

```
A  src/app/billing/invoices/page.tsx
A  src/app/billing/invoices/[id]/page.tsx
A  src/app/billing/invoices/[id]/pdf/route.ts
A  src/billing/invoice-service.ts
A  src/billing/cancel-subscription.ts         ← out-of-scope
M  src/db/schema.prisma
```

Key excerpts (abridged):

**`src/billing/invoice-service.ts`**
```ts
export async function listInvoices() {
  const invoices = await prisma.invoice.findMany();   // no tenant filter, no pagination
  return Promise.all(
    invoices.map(async (inv) => ({
      ...inv,
      lineItems: await prisma.invoiceLineItem.findMany({ where: { invoiceId: inv.id } }),
    }))
  );
}

export async function onPaymentFailed(event: StripeEvent) {
  logger.warn("invoice payment failed", { id: event.data.object.id });
  // TODO: retry logic
}
```

**`src/app/billing/invoices/page.tsx`**
```tsx
export default async function InvoicesPage() {
  const invoices = await listInvoices();
  return (
    <div>
      {invoices.map(inv => <InvoiceRow key={inv.id} invoice={inv} />)}
    </div>
  );
}
```

**`src/app/billing/invoices/[id]/page.tsx`** — no owner-role check.

**`src/billing/cancel-subscription.ts`** — 52 lines implementing a cancellation flow, violating NG-2.

---

## Output — QA Report

Written to `library/requirements/features/feature-013-team-invoices/reports/2026-04-24-qa-report.md`.

```markdown
# QA Report: feature-013 Team Invoices

**Plan document:** `library/requirements/features/feature-013-team-invoices/prd-feature-013-team-invoices.md`
**Audit date:** 2026-04-24
**Base branch:** `main`
**Head:** `feat/team-invoices`
**Auditor:** quality-guardian

## Summary

The team-invoices implementation has three Critical blockers that must be addressed before merge: a tenant-scoping gap that leaks invoices across teams (AC-1), missing owner-role authorization (AC-2), and the retry logic from US-4 is entirely absent. Four Warnings surfaced in addition, including an N+1 on the list endpoint and an out-of-scope cancellation flow that violates NG-2. The happy-path rendering works but the implementation is not ship-ready.

## Scorecard

| Category      | Status | Notes |
|---------------|--------|-------|
| Completeness  | ❌ | US-4 retry logic absent; AC-4 cursor pagination not implemented |
| Correctness   | ❌ | Tenant scoping missing → data correctness compromised |
| Alignment     | ⚠️ | Out-of-scope cancellation file added (NG-2 violation) |
| Gaps          | ❌ | No owner-role check, no empty state, no error boundary |
| Detrimental   | ⚠️ | N+1 on list endpoint; no pagination; dead TODO in retry handler |

## Critical Issues (must fix)

- [ ] **Tenant leak — invoices are not scoped to the signed-in team (AC-1)** — `src/billing/invoice-service.ts:2`

  `prisma.invoice.findMany()` returns every invoice in the database, not just the signed-in user's team. This leaks other tenants' billing data on the `InvoicesPage` render. AC-1 explicitly requires tenant isolation.

  Suggested: thread the current `teamId` from the session into the service and filter: `where: { teamId }`. Add a compile-time guard so `listInvoices` requires a `teamId` arg.

  ```ts
  export async function listInvoices() {
    const invoices = await prisma.invoice.findMany();   // ← missing where: { teamId }
  ```

- [ ] **Missing owner-role authorization (AC-2)** — `src/app/billing/invoices/[id]/page.tsx:1-24`

  The detail page reads the invoice by ID but does not check whether the signed-in user is a team owner (or that the invoice belongs to their team). Regular members and cross-team users can read any invoice by guessing IDs.

  Suggested: fetch the user's `teamId` and role from the session; 404 if the invoice's `teamId` doesn't match, and redirect non-owners to `/billing`.

- [ ] **US-4 retry logic not implemented** — `src/billing/invoice-service.ts:16-19`

  The `onPaymentFailed` handler logs and returns. No retry is scheduled, and there is no "Past Due" transition after three failures. This is a core plan requirement, not an edge case.

  Suggested: enqueue a retry job with `queue.enqueue("invoice.retry", { id, attempt: 1 })`, backoff schedule 1h / 6h / 24h, mark `status: "past_due"` on the third failure.

  ```ts
  export async function onPaymentFailed(event: StripeEvent) {
    logger.warn("invoice payment failed", { id: event.data.object.id });
    // TODO: retry logic   ← entire requirement lives in this TODO
  }
  ```

## Warnings (should fix)

- [ ] **N+1 query on invoice list** — `src/billing/invoice-service.ts:2-8`

  The list endpoint runs one query for invoices and then one query per invoice for its line items. For a team with 200 invoices, this is 201 queries.

  Suggested: replace the `Promise.all(...map)` pattern with Prisma's `include`: `prisma.invoice.findMany({ where: { teamId }, include: { lineItems: true } })`.

- [ ] **Missing cursor-based pagination (AC-4)** — `src/billing/invoice-service.ts:2`

  `findMany` returns the full set. AC-4 specifies 20 per page with cursor pagination.

  Suggested: accept `{ cursor, take: 20 }` args, return `{ items, nextCursor }`.

- [ ] **Out-of-scope cancellation flow (NG-2 violation)** — `src/billing/cancel-subscription.ts:1-52`

  NG-2 explicitly excludes cancellation flows from this phase. A full 52-line cancellation implementation landed in this PR.

  Suggested: remove the file, or open a scope-amendment PRD with `library-guardian` if cancellation is now desired for this phase.

- [ ] **Missing empty state (AC-3)** — `src/app/billing/invoices/page.tsx:1-9`

  AC-3 calls for an empty state when a team has no invoices. The current page renders an empty `<div>`.

  Suggested: branch on `invoices.length === 0` and render a "No invoices yet" message with a link to the billing settings.

## Suggestions (consider improving)

- [ ] **Extract the Stripe event handler to a thin adapter** — `src/billing/invoice-service.ts:16-19`

  Once the retry logic lands, the handler will carry non-trivial branching. Consider moving the Stripe-shape knowledge to a separate `stripe-webhook-handler.ts` adapter and keep `invoice-service.ts` storage-agnostic.

## Plan Item Traceability

| #    | Plan Requirement                                    | Status | Implementation Location                              | Notes |
|------|-----------------------------------------------------|--------|-------------------------------------------------------|-------|
| US-1 | Team owner views invoice list                       | ⚠️ | `src/app/billing/invoices/page.tsx:1-9`              | Renders, but with tenant leak and N+1 |
| US-2 | Team owner clicks to view line items                | ⚠️ | `src/app/billing/invoices/[id]/page.tsx:1-24`        | Works, but no authz check |
| US-3 | Team owner downloads PDF                            | ✅ | `src/app/billing/invoices/[id]/pdf/route.ts:1-40`    | — |
| US-4 | Failed invoices auto-retry + Past Due after 3       | ❌ | `src/billing/invoice-service.ts:16-19`               | TODO only — not implemented |
| AC-1 | Invoice list scoped to owner's team                 | ❌ | `src/billing/invoice-service.ts:2`                   | No tenant filter |
| AC-2 | Only team owners can access                         | ❌ | `src/app/billing/invoices/[id]/page.tsx`             | No role check |
| AC-3 | Empty state when no invoices                        | ❌ | `src/app/billing/invoices/page.tsx`                  | Empty `<div>` |
| AC-4 | Pagination (20/page, cursor-based)                  | ❌ | `src/billing/invoice-service.ts:2`                   | No pagination |
| NG-1 | No invoice editing                                  | ✅ | —                                                    | Honored |
| NG-2 | No subscription cancellation flow                   | ❌ | `src/billing/cancel-subscription.ts:1-52`            | Violated — 52-line cancellation added |

## Files Changed

- `src/app/billing/invoices/[id]/page.tsx` (A) — invoice detail page; missing authz check (AC-2 gap)
- `src/app/billing/invoices/[id]/pdf/route.ts` (A) — PDF download endpoint; US-3 ✅
- `src/app/billing/invoices/page.tsx` (A) — invoice list page; empty state absent, tenant leak inherited from service
- `src/billing/cancel-subscription.ts` (A) — out-of-scope cancellation flow (NG-2 violation)
- `src/billing/invoice-service.ts` (A) — central service; three Critical issues and one Warning live here
- `src/db/schema.prisma` (M) — adds `Invoice` and `InvoiceLineItem` models
```

---

## Why the audit looks this way

- **Three Criticals, four Warnings.** Each Critical matches a bullet in the `05-severity-classification.md` decision tree (plan requirement missing, data integrity risk, plan requirement absent). Each Warning is "should fix" — non-hot-path N+1, scope creep, implied gap.
- **Tenant leak is Critical, not Warning**, per `07-common-gaps.md` — tenant scoping violations are always Critical.
- **Cancellation is Warning, not Critical.** The code itself works; it just violates a non-goal. If the cancellation code were broken, severity would escalate.
- **The report names each axis even though three have failed** — no silent passes (`00-principles.md`).
- **Traceability table includes both NG rows.** One is Pass, one is Fail — so scope auditing is visible.
