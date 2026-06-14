# Nygard ADR Format

The Nygard format is the canonical ADR template, introduced by Michael Nygard in 2011. It answers four questions every engineer will eventually ask about a past architectural choice: What was the situation? What was decided? What were the trade-offs accepted? What alternatives were rejected?

---

## Template anatomy

```markdown
# NNNN. <Title>

Date: YYYY-MM-DD

## Status

<Proposed | Accepted | Superseded by ADR-NNNN | Deprecated | Rejected>

## Context

<The forces at play: technical constraints, team size, time pressure, adjacent systems, 
regulatory requirements. Write this as "here is the situation we were in" — not as 
justification for the decision. A reader who disagrees with the decision should still 
recognize this as an accurate description of the context.>

## Decision

<The concrete choice made. Active voice, past tense. "We decided to use PostgreSQL as 
the primary data store." Not "PostgreSQL should be used." Not "we plan to use." 
The decision is closed.>

## Consequences

<The trade-offs accepted — positive, negative, and neutral. Be honest about the negatives; 
they are the most valuable part of this section. A future engineer considering a change 
needs to know what was given up, not just what was gained.>

## Alternatives Considered

<Each alternative that was seriously evaluated, with a brief explanation of why it was 
rejected. This section prevents "why didn't we just use X?" conversations six months later.>

### Alternative: <Name>

<Two to four sentences on what it offers and why it was not chosen.>
```

---

## Worked example: choosing a database

```markdown
# 0012. Use PostgreSQL for the primary data store

Date: 2025-11-03

## Status

Accepted

## Context

We are building a multi-tenant SaaS application with a relational data model (users, 
organizations, subscriptions, audit events). The team has strong SQL experience. We 
evaluated the data access patterns and found that ~90% are simple CRUD with JOIN, and 
~10% require full-text search. We need ACID transactions for subscription billing operations. 
The expected dataset size is <100 GB for the first two years.

## Decision

We decided to use PostgreSQL (via Supabase) as the primary data store for all relational 
data. Full-text search will use PostgreSQL's built-in `tsvector` / `tsquery` for the 
initial release, with Typesense as a future option if search requirements grow.

## Consequences

**Positive:**
- Strong ACID guarantees for billing and audit operations.
- The team's existing SQL expertise reduces onboarding time.
- `pg_vector` extension available if we add vector search later.
- Row-level security via Supabase RLS simplifies multi-tenancy.

**Negative:**
- Horizontal write scaling requires Citus or a migration to a distributed database if 
  write throughput exceeds ~10k writes/s (unlikely for Y1).
- Full-text search is functional but less featureful than Typesense or Algolia for 
  faceted search.

**Neutral:**
- Supabase manages the Postgres instance; we accept managed service trade-offs 
  (limited Postgres extension selection, managed backup schedule).

## Alternatives Considered

### Alternative: MongoDB

Offers a flexible document model that would simplify schema evolution. Rejected because 
our data is fundamentally relational (users → orgs → subscriptions), and the team has 
limited MongoDB experience. The schema flexibility benefit does not outweigh the JOIN 
ergonomics loss.

### Alternative: PlanetScale (MySQL)

Branching-based schema changes are operationally appealing. Rejected because PlanetScale 
does not support foreign key constraints, which we rely on for referential integrity in 
billing data.
```

---

## Filing conventions

- **Filename:** `NNNN-<kebab-case-title>.md` — always zero-padded to 4 digits.
  - Example: `0012-use-postgresql-primary-data-store.md`
- **Directory:** `docs/decisions/` or `docs/adr/` (respect existing project convention).
- **Numbering:** scan the directory, take `max(existing numbers) + 1`. Never gap-fill.

---

## Common mistakes

| Mistake | Correction |
|---|---|
| Decision written in future tense ("we will use...") | Write past tense; the decision is closed |
| Missing Alternatives Considered | Always include; future engineers will rediscover the same options |
| Consequences section lists only positives | Include the negatives honestly; this is where ADRs earn their keep |
| Generic title ("Database decision") | Specific title ("Use PostgreSQL for the primary data store") |
| Status left blank | Always set one of the five statuses |
