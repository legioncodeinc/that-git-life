# Example: Happy Path PR Review

A worked end-to-end example of `code-review-pr-guardian` handling a well-scoped PR: description audit, checklist generation, and comment coaching.

---

## Scenario

**PR title:** `feat: add email validation to registration form`
**Author:** Alex Chen
**Reviewer request:** "Audit this PR description and generate a review checklist. Also coach one of the reviewer's comments."

**Existing PR description:**
```
Added email validation. Fixed a bug.
```

**Diff overview:**
- `components/RegistrationForm.tsx` — 45 lines changed (adds `validateEmail` function, applies it to the form submit handler)
- `utils/validation.ts` — 20 lines changed (adds email regex utility)
- `components/__tests__/RegistrationForm.test.tsx` — 60 lines changed (adds test cases for valid/invalid emails)

**Reviewer comment to coach:**
> "This regex is way too simple. You'll need something better."

---

## Step 1: Description audit

| Element | Status | Notes |
|---|---|---|
| Motivation | ❌ Missing | "Added email validation" — no problem statement |
| Context | ❌ Missing | No issue link, no prior PR reference |
| What changed | ❌ Partial | "Added email validation" — not per-file |
| What did NOT change | ❌ Missing | No scope boundary |
| Testing proof | ❌ Missing | No CI link, no test run evidence |
| Reviewer hints | ❌ Missing | None |

**Audit result:** 0/6 elements present. Description needs full rewrite.

---

## Step 2: Rewritten PR description

```markdown
## Motivation

Registration form currently accepts any string in the email field. Malformed
email addresses are reaching the database and failing on the unique constraint
rather than returning a user-friendly validation message. Fixes #214.

## Context

- Closes: #214 (Users seeing cryptic error on registration with malformed email)
- No prior PR dependency

## What changed

- `components/RegistrationForm.tsx`: Added `validateEmail` call on form submit.
  Returns early with an inline error message if the email is invalid.
- `utils/validation.ts`: Added `validateEmail(email: string): boolean` utility
  using RFC-5321-compatible regex (see code comment for source).
- `components/__tests__/RegistrationForm.test.tsx`: Added 8 test cases covering
  valid emails, missing @, missing TLD, and empty string.

## What did NOT change

- Password validation logic is unchanged (separate ticket: #218)
- Existing user records with malformed emails in the database are not affected
  (no migration; this is front-end only)

## Testing proof

- [x] All 8 new test cases pass locally (`pnpm test RegistrationForm`)
- [x] CI passes: [link to CI run]
- [x] Manual test: submitted form with `notanemail`, `@nodomain`, and valid
  `user@example.com` — correct behavior in all three cases

## Reviewer hints

- Key logic is in `components/RegistrationForm.tsx` lines 42-58
- `utils/validation.ts` is a simple utility — can skim
- Open question: should we add server-side validation too, or is client-only
  acceptable given we also validate at the DB constraint level?
```

---

## Step 3: Review checklist (scoped to this PR)

**Phase 1: Author checklist** — ✅ all items met after description rewrite.

**Phase 2: Reviewer checklist (context-scoped)**

### Correctness
- [ ] Does `validateEmail` correctly reject the edge cases named in the tests?
- [ ] What happens if the user submits with JavaScript disabled? (Client-only validation)
- [ ] Is the error message shown inline or as a toast? Does it clear on correction?

### TypeScript / React additions
- [ ] Is `validateEmail` pure (no side effects)?
- [ ] The form submit handler: does it prevent default before or after validation? (Order matters)

### Style
- [ ] Is the regex source cited in a code comment? (non-obvious logic — `nit:`)

### Phase 3: Process
- [ ] CI passes
- [ ] At least one reviewer other than Alex

---

## Step 4: Coached reviewer comment

**Original comment:**
> "This regex is way too simple. You'll need something better."

**Coached version:**
> `suggestion:` The current regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) rejects the most common malformed emails but passes some technically-invalid ones (e.g., double dots in the local part). For registration, this is likely acceptable — the goal is UX feedback, not RFC-5321 compliance, and the DB constraint is the hard gate.
>
> If we want stricter validation, consider the `validator.js` library's `isEmail()` which handles the RFC edge cases. Trade-off: adds a dependency; benefit: maintained regex we don't have to own.
>
> Not a merge gate — flagging so Alex can make a conscious choice. If staying with the current approach, suggest adding a code comment explaining the intentional simplicity.

---

## Outcome summary

| Action | Before | After |
|---|---|---|
| Description quality | 0/6 elements | 6/6 elements |
| Review checklist | None | 8-item scoped checklist |
| Reviewer comment | Vague + no tier | `suggestion:` with rationale, fix options, and tier clarity |
