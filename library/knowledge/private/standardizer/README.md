---
ai_description: |
  Library Schema v2 standardizer for that-git-life. This engine scaffolds new
  repos to the canonical layout AND retroactively migrates existing repos.
  Behavior must be idempotent — running twice produces "no change" on the
  second run. Schema source of truth is schema-v2.md (copied verbatim from
  the legion-suite spec). Behavior spec is in behavior-spec.md.
human_description: |
  The folder-structure engine. Read schema-v2.md for what the output should
  look like, then behavior-spec.md for how the standardizer enforces it.
---

# standardizer/

| Document | Purpose |
|---|---|
| [`schema-v2.md`](schema-v2.md) | Canonical Library Schema v2 — verbatim copy of the legion-suite spec. |
| [`behavior-spec.md`](behavior-spec.md) | How the standardizer scaffolds, migrates, validates. Idempotency rules. |
