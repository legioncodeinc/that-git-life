# Example: Full Supersession Walkthrough

This example walks through a complete ADR supersession: an old database decision is replaced by a new one, and both records are updated correctly.

---

## Scenario

ADR-0012 recorded the decision to use PostgreSQL via Supabase. The team has now hit Supabase's connection limit in production and is migrating to Neon. A new ADR is needed.

---

## Before: ADR-0012 (current state)

```markdown
# 0012. Use PostgreSQL via Supabase

Date: 2025-02-14

## Status

Accepted

## Context
...

## Decision
We decided to use PostgreSQL via Supabase as the primary data store...

## Consequences
...
```

---

## Step 1: Create the new ADR

```bash
adr new -s 12 "Migrate from Supabase to Neon for PostgreSQL"
# Creates: docs/decisions/0025-migrate-from-supabase-to-neon.md
# Automatically appends: "Supersedes: 0012"
```

---

## Step 2: Fill in ADR-0025

```markdown
# 0025. Migrate from Supabase to Neon for PostgreSQL

Date: 2026-04-08

## Status

Accepted

Supersedes ADR-0012

## Context

ADR-0012 adopted PostgreSQL via Supabase in 2025. In Q1 2026 we hit Supabase's 
connection limit (500 simultaneous connections at our Pro tier) during a traffic spike. 
Supabase's connection pooler (PgBouncer) mitigated but did not eliminate the issue 
due to transaction-mode limitations with prepared statements in Drizzle ORM.

Neon offers native serverless connection pooling (no PgBouncer configuration), 
database branching for preview environments, and a compatible PostgreSQL 16 wire 
protocol. It is a drop-in replacement for our Drizzle ORM setup.

## Decision

We decided to migrate our PostgreSQL instance from Supabase to Neon. The data was 
migrated using pg_dump / pg_restore. Connection strings and environment variables 
were updated. Row-level security policies were preserved; Neon supports RLS via 
the same PostgreSQL mechanisms.

## Consequences

**Positive:**
- Native serverless connection pooling eliminates the connection limit issue.
- Database branching enables isolated preview environments per PR (ENG-500).
- Neon's autoscaling reduces idle compute cost by ~40% (estimated).

**Negative:**
- We lose Supabase's realtime subscription feature. Any feature relying on 
  Supabase Realtime must migrate to a separate WebSocket service.
- Neon is a newer provider; long-term support timeline less proven than Supabase.

**Neutral:**
- Auth remains with Clerk; no auth migration required.
- Row-level security policy definitions are identical.

## Alternatives Considered

### Alternative: Supabase connection pooling upgrade

Upgrading to Supabase Enterprise (custom pricing) would raise connection limits. 
Rejected because Neon's branching feature and lower idle compute cost provide 
additional value beyond just connection limits, at a lower price point.

### Alternative: PlanetScale

No foreign key constraint support. Rejected (same reason as ADR-0012).
```

---

## Step 3: Update ADR-0012

Open `docs/decisions/0012-use-postgresql-via-supabase.md` and change only the Status section:

```markdown
## Status

Superseded by ADR-0025
```

Do not modify any other content.

---

## Step 4: Verify the bidirectional link

- ADR-0025 says: `Supersedes ADR-0012` ✓
- ADR-0012 says: `Superseded by ADR-0025` ✓

---

## Step 5: Update the ADR log index (if manual)

```markdown
| 0012 | Use PostgreSQL via Supabase | ~~Accepted~~ Superseded by 0025 | ... |
| 0025 | Migrate from Supabase to Neon | Accepted, Supersedes 0012 | ... |
```

If using Log4brains, regenerate the site:

```bash
npx log4brains build
```

---

## Step 6: Reference in the migration commit

```
feat(infra): migrate PostgreSQL from Supabase to Neon (ADR-0025)

Closes ENG-499. Supersedes ADR-0012.
```

---

## Result

The audit trail is complete. Any engineer who reads ADR-0012 is immediately directed to ADR-0025. Any engineer who reads ADR-0025 can trace the lineage back to ADR-0012. The git history, the ADR log, and the PR descriptions all cross-reference each other.
