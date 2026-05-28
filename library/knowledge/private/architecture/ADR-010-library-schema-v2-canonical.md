# ADR-010 — Library Schema v2 is the canonical repo template

- **Status:** Accepted
- **Date:** 2026-05-23
- **Decision owner:** Mario Aldayuz
- **Supersedes:** —

## Context

TGL's headline feature is repository standardization. We need a canonical template that:

1. Scaffolds new repos consistently.
2. Migrates existing repos to the same standard.
3. Is precise enough to be machine-enforceable.
4. Is loved enough by humans to actually be followed.

Mario provided the spec ("Library Schema v2") on 2026-05-23. The schema defines `library/{knowledge,requirements,issues,notes}/` with strict naming, lifecycle, and YAML headmatter rules.

## Decision

**Library Schema v2** is the canonical template for every repo TGL standardizes — including this one.

- The verbatim schema lives at [`library/knowledge/private/standardizer/schema-v2.md`](../standardizer/schema-v2.md).
- The standardizer engine (PRD-004) is the single source of enforcement.
- Idempotency is a hard requirement: running `tgl standardize <repo>` twice produces no diff on the second run.
- Schema versions are tracked in a `library/_meta.yaml` file at the root of each standardized library. The file contains `{ schema_version: 2, last_standardized_at: <ISO> }`.

## What Schema v2 means in practice

Every standardized repo gets:

```
library/
  README.md
  knowledge/
    README.md
    public/{README, overview/, guides/, faqs/}
    private/{README, architecture/, standards/, <domain>/}
  requirements/{README, in-work/, backlog/, completed/, reports/}
  issues/{README, in-work/, backlog/, completed/}
  notes/{README}
```

Every README opens with the YAML headmatter contract (Schema v2 §3). Every PRD/IRD/ADR follows the §4 naming patterns. Lifecycle is folder location, not frontmatter (§5).

## Why

- **Mario maintains it.** Schema v2 is already battle-tested in the `legion-suite` ecosystem. Adopting it verbatim avoids parallel divergence.
- **Machine-enforceable.** The schema is explicit enough that the standardizer can validate any repo with deterministic pass/fail.
- **One schema for everything Notorious Llama.** Every repo TGL touches gets the same shape. New contributors only learn it once.

## Consequences

- TGL is opinionated: users who want a different folder structure can't use TGL's standardizer. That's the right trade-off.
- When Mario revises the schema (v3, etc.), TGL ships a migration runner (`tgl standardize --migrate-from v2`). For now there is exactly one version.
- The schema-v2 file in `private/standardizer/schema-v2.md` is **derived** from Mario's master copy. The relationship is documented at the top of that file so any divergence is visible.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Invent a TGL-specific schema | Parallel divergence from `legion-suite`'s established standard. |
| Support multiple schemas | Triples the test matrix; the value of standardization is everyone using the same one. |
| Make the schema user-configurable | Defeats the "standardize" pitch — TGL would just be a folder generator. |
