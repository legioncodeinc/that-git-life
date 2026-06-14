# Example: Authoring a Nygard ADR from a PR Description

This example walks through the full workflow of deriving an ADR from a PR that introduces a significant architectural change.

---

## Input: PR description

> **PR #247: Migrate auth from NextAuth to Better Auth**
>
> We've hit the wall with NextAuth's session management flexibility. Migrating to Better Auth gives us:
> - First-class Drizzle ORM adapter (no custom adapter code)
> - Built-in passkey support (required for our Q3 security goals)
> - Database-side sessions (eliminates the JWT-rotation complexity we've been fighting)
>
> Reviewed NextAuth v5 beta and Clerk as alternatives. NextAuth v5 is still unstable; Clerk is a hosted service we'd rather avoid for compliance reasons.
>
> Related ticket: ENG-482

---

## Step 1: Determine ADR eligibility

This is a consequential, closed, non-obvious decision. The auth provider affects security posture, developer ergonomics, onboarding complexity, and vendor lock-in. It warrants an ADR. Format: Nygard (two alternatives, manageable complexity).

## Step 2: Assign the next number

```bash
adr list
# → 0030-adopt-drizzle-orm.md (latest)
# Next: 0031
```

## Step 3: Draft the ADR

```markdown
# 0031. Migrate from NextAuth to Better Auth

Date: 2026-03-12

## Status

Accepted

## Context

We adopted NextAuth.js v4 in 2024 (ADR-0008) for its ecosystem breadth and Next.js 
integration. By Q1 2026 we had encountered three friction points: (1) the Drizzle ORM 
adapter required custom code not maintained in the official repo, (2) passkey support 
was not available without a community plugin with poor maintenance, (3) JWT-based 
sessions required complex rotation logic to satisfy our 30-minute idle timeout 
requirement (ENG-391).

Better Auth is a new entrant (stable since Q3 2025) with a first-class Drizzle adapter, 
built-in passkey support, and database-side session storage.

## Decision

We decided to migrate from NextAuth.js v4 to Better Auth for all authentication in the 
main web application. The migration was executed in PR #247 and validated against 
all existing auth test cases.

## Consequences

**Positive:**
- First-class Drizzle ORM adapter eliminates ~200 lines of custom adapter code.
- Passkey support enables Q3 2026 security goal without a third-party plugin.
- Database sessions simplify the idle-timeout implementation (ENG-391 closed).

**Negative:**
- Better Auth has a smaller community and ecosystem than NextAuth. Fewer Stack Overflow
  answers; more reliance on official docs and Discord.
- Migration required updating 14 files and re-testing all auth flows — 3 days of 
  engineering time.

**Neutral:**
- Both libraries use similar session cookie semantics; no user-visible auth behavior changed.

## Alternatives Considered

### Alternative: NextAuth v5 (App Router beta)

NextAuth v5 addresses some of the adapter and passkey limitations via the new Auth.js 
framework. Rejected because v5 was still in beta as of March 2026 with known breaking 
changes expected before stable release. Revisit if v5 stabilizes.

### Alternative: Clerk

Clerk offers a hosted auth solution with first-class passkey support. Rejected because 
it is a vendor-hosted service — all user session data would reside on Clerk's 
infrastructure, creating GDPR data-residency concerns for our EU customers. Also 
rejected due to per-MAU pricing at our scale.
```

## Step 4: File the ADR

```bash
# Create the file at the next number
# (adr-tools doesn't auto-draft from PR descriptions; write manually or use the template)
cp docs/decisions/_template-nygard.md docs/decisions/0031-migrate-nextauth-to-better-auth.md
# Fill in the content above, then:

adr generate toc
# → Updates docs/decisions/README.md with the new entry
```

## Step 5: Update the PR description

Add to PR #247:

> **ADR recorded:** [ADR-0031 - Migrate from NextAuth to Better Auth](docs/decisions/0031-migrate-nextauth-to-better-auth.md)

## Step 6: Link from the merge commit

```
feat(auth): migrate from NextAuth to Better Auth (ADR-0031, closes ENG-482)
```

---

## Result

The merge commit, the PR description, and the ADR record all cross-reference each other. Six months from now, when an engineer asks "why did we switch auth providers?", `git log`, GitHub PR search, or the ADR log each lead to the full answer.
