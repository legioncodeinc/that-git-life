# Y-Statement Template

A Y-statement compresses the Nygard four-question framework into a single, grammatically constrained sentence. All five clauses are required.

## Template

```
In the context of <situation>,
facing <concern / challenge>,
we decided <option chosen>,
to achieve <quality / outcome>,
accepting <downside / trade-off>.
```

## Usage

- As the **opening sentence** of a Nygard or MADR "Decision" section (summary before the full record).
- As a **one-line entry** in an ADR log index (`adr-log.md`).
- Do NOT use as the sole format for a consequential decision — Y-statements omit Alternatives Considered.

## Example

```
In the context of a multi-tenant SaaS with relational data and a team with strong SQL experience,
facing the need for ACID transactions and row-level security,
we decided to use PostgreSQL via Supabase,
to achieve data integrity and simplified multi-tenancy,
accepting that horizontal write scaling will require migration if write throughput exceeds 10k/s.
```

## Anti-pattern (missing "accepting")

```
In the context of building a web app, we decided to use React, to achieve a fast UI.
```

The "accepting" clause is missing. This is a marketing pitch, not an engineering record.
