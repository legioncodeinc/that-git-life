---
ai_description: |
  Root of the `library/` tree for the `that-git-life` repository. This library is
  the single source of truth for product requirements (PRDs), bug fixes (IRDs),
  architectural decisions (ADRs), engineering standards, and operational knowledge
  for this repo. The layout follows Library Schema v2 exactly — never invent new
  top-level folders here. Before writing or moving anything, read
  `knowledge/private/standardizer/schema-v2.md`. The PRD lifecycle is "location
  is state": move whole folders between `requirements/backlog/`,
  `requirements/in-work/`, and `requirements/completed/`. Issues live as a peer
  of requirements under `library/issues/` and follow the same lifecycle.
human_description: |
  This is the documentation library for that-git-life. If you're planning a
  feature, write a PRD under `requirements/backlog/`. If you're fixing a bug,
  open a GitHub issue and write an IRD under `issues/backlog/` using the issue
  number. Architectural decisions go in `knowledge/private/architecture/` as
  ADRs. Anything ephemeral or scratch lives in `notes/` — agents will never
  touch that folder.
---

# library/

Documentation library for `@thenotoriousllama/that-git-life`. Layout follows
[Library Schema v2](knowledge/private/standardizer/schema-v2.md).

## Top-level folders

| Folder | Purpose |
|---|---|
| `knowledge/` | Reference material. Split into `public/` (end-user) and `private/` (internal + AI agents). |
| `requirements/` | Forward-looking work — PRDs in `backlog/`, `in-work/`, `completed/`, plus routine scan reports. |
| `issues/` | Reactive bug/incident work — IRDs in `backlog/`, `in-work/`, `completed/`. |
| `notes/` | Human scratch only. Agents never write here. |

## Where to start

- **Building this product?** Open [`requirements/backlog/`](requirements/backlog/) and read the PRDs in numeric order.
- **Looking for design intent?** Open [`knowledge/private/architecture/`](knowledge/private/architecture/) for ADRs.
- **Writing a new doc?** Read [`knowledge/private/standards/documentation-framework.md`](knowledge/private/standards/documentation-framework.md) first.

## Schema invariants

This repo enforces:

- Every README in this tree opens with the YAML headmatter shown in Schema v2 §3.
- PRD numbers are repo-local sequential. IRD numbers are GitHub issue numbers.
- Lifecycle = folder location. Never encode lifecycle state in frontmatter.
- `notes/` is sacred to humans.
