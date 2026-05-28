# Library Schema v2

> Category: Standards | Version: 2.0 | Date: May 2026 | Status: Canonical
>
> **Source:** Verbatim copy of Mario's master schema from `legion-suite`, pasted on 2026-05-23.
> If the master copy in `legion-suite` is updated, copy the new version here and bump the date above.
>
> Defines the canonical `library/` folder layout, headmatter contract, naming rules, and lifecycle invariants for every repository TGL standardizes.

**Related:**
- [`behavior-spec.md`](behavior-spec.md) — how the TGL standardizer enforces this schema.
- [`../architecture/ADR-010-library-schema-v2-canonical.md`](../architecture/ADR-010-library-schema-v2-canonical.md) — why we adopted Schema v2.

---

## 1. Canonical Tree

```
library/
  README.md
  knowledge/
    README.md
    public/                           docs intended for end-users / customers
      README.md
      overview/                       what-is-X, elevator pitch, glossary
      guides/                         step-by-step how-to guides for users
      faqs/                           frequently asked questions
    private/                          internal engineering + business knowledge
      README.md
      architecture/                   ADRs: ADR-<n>-<kebab-slug>.md
      standards/                      documentation-framework.md + repo rules
      <domain>/                       any repo-specific domain folder
  requirements/                       work planned or in flight (product/feature scope)
    README.md
    in-work/                          PRDs actively being implemented
    backlog/                          PRDs queued, not yet started
      prd-<###>-<slug>/
        prd-<###>-<slug>-index.md     module description + feature list
        prd-<###><a>-<slug>-<feat>.md sub-PRDs (a, b, c ... per sub-feature)
        qa/
          prd-<###>-<slug>-qa.md      QA audit for this PRD
    completed/                        shipped PRD folders (entire folder moves here)
    reports/                          routine code-scan reports not tied to any PRD
      <YYYY-MM-DD>-<type>-report.md
  issues/                             reactive bug/incident work (peer of requirements/)
    README.md
    in-work/
    backlog/
      ird-<###>-<slug>/
        ird-<###>-<slug>-index.md     single-scope fix plan
        qa/
          ird-<###>-<slug>-qa.md
    completed/
  notes/
    README.md                         human-only junk drawer — agents never write here
```

---

## 2. Removed and Forbidden Paths (vs v1)

| Removed v1 path | Reason | v2 canonical home |
|---|---|---|
| `library/knowledge-base/` | Renamed root | `library/knowledge/` |
| `library/knowledge-base/<domain>/` | Moved under public/private split | `library/knowledge/private/<domain>/` |
| `library/knowledge-base/overview/` | Special case: end-user content | `library/knowledge/public/overview/` |
| `library/architecture/ADR-*.md` | ADRs live inside knowledge | `library/knowledge/private/architecture/ADR-*.md` |
| `library/requirements/features/feature-<###>-*/` | Folder renamed | `library/requirements/backlog/prd-<###>-*/` |
| `library/requirements/issues/issue-<###>-*/` | Issues get their own peer folder | `library/issues/backlog/ird-<###>-*/` |
| `library/requirements/issues/` | Issues promoted to peer of requirements | `library/issues/` |
| `library/qa/` | Scoped to individual plans or reports folder | `library/requirements/reports/` or `prd-*/qa/` |
| `library/knowledge-base/wiki/` | Never existed in v2 | `legion-wiki/<repo>/wiki/` |
| `library/knowledge-base/brand/` | Never existed in v2 | `legion-shared/brands/` |

---

## 3. README Headmatter Contract

Every `README.md` in the library tree **must** open with this YAML frontmatter block. There are no exceptions.

```yaml
---
ai_description: |
  What an AI agent must know to operate correctly in this folder:
  invariants, naming conventions, which operations are allowed,
  escalation paths, and what must never be done here.
human_description: |
  What a human contributor must know: what goes here, what does not,
  the workflow for adding and graduating documents, and who owns this folder.
---
```

The Markdown body follows immediately after. The body must cover:
1. Purpose of the folder in one sentence.
2. What belongs here (positive list).
3. What does NOT belong here (negative list).
4. Naming conventions specific to this folder.

---

## 4. Naming Invariants

| Item | Pattern | Example |
|---|---|---|
| `<###>` number | 3-digit zero-padded; 4+ digit natural | `006`, `046`, `100`, `1234` |
| PRD folder | `prd-<###>-<kebab-slug>/` | `prd-007-user-export/` |
| PRD index | `prd-<###>-<kebab-slug>-index.md` | `prd-007-user-export-index.md` |
| PRD sub-feature | `prd-<###><letter>-<kebab-slug>-<feature>.md` | `prd-007a-user-export-backend.md` |
| PRD QA report | `qa/prd-<###>-<kebab-slug>-qa.md` | `qa/prd-007-user-export-qa.md` |
| IRD folder | `ird-<###>-<kebab-slug>/` | `ird-042-stale-cache/` |
| IRD index | `ird-<###>-<kebab-slug>-index.md` | `ird-042-stale-cache-index.md` |
| IRD QA report | `qa/ird-<###>-<kebab-slug>-qa.md` | `qa/ird-042-stale-cache-qa.md` |
| ADR | `ADR-<n>-<kebab-slug>.md` | `ADR-013-theia-as-library.md` |
| Routine scan report | `<YYYY-MM-DD>-<type>-report.md` | `2026-05-23-security-scan.md` |

Additional rules:
- Kebab slugs are lowercase, hyphens only, ≤ 60 characters.
- PRD numbers are **repo-local sequential** (not GitHub issue numbers). Take `max+1` from all prd-* folders (open + `completed/`).
- IRD numbers follow the **GitHub issue number** for the repo. Never invent issue numbers.
- Sub-PRD letter suffixes are alphabetical per sub-feature within one parent PRD. `prd-007a`, `prd-007b`, `prd-007c` — no gaps.
- IRDs are **single-scope**. No sub-IRDs.

---

## 5. Lifecycle Invariants

```
backlog/prd-007-foo/  --[start]-->  in-work/prd-007-foo/  --[ship]-->  completed/prd-007-foo/
backlog/prd-007-foo/  -----------[scope abandoned]----------------->  completed/prd-007-foo/
```

- Move the **entire folder** (index + sub-PRDs + qa/) between `backlog/`, `in-work/`, and `completed/`.
- Never update lifecycle state solely in frontmatter. Location **is** the state.
- Issues follow the same three-state pattern under `library/issues/`.

---

## 6. Public vs Private Knowledge

The `public/` vs `private/` split inside `knowledge/` reflects **audience**, not security classification.

| Folder | Audience | Typical content |
|---|---|---|
| `knowledge/public/` | End-users, customers, external | Product overviews, user-facing guides, FAQs |
| `knowledge/private/` | Internal team, AI agents | Architecture, ADRs, standards, engineering domain docs, pricing strategy, marketing strategy |

When in doubt, default to `private/`. Promote to `public/` only when the document is intentionally user-facing.

---

## 7. Domain Folders Inside `knowledge/private/`

Any domain folder is valid under `knowledge/private/`. Common approved domains:

| Domain | Contents |
|---|---|
| `architecture/` | ADRs (required; always lives here in v2) |
| `standards/` | `documentation-framework.md` + repo-specific writing rules |
| `ai/` | AI gateway, prompt cascade, coach architecture |
| `auth/` | Auth provider config, RBAC, session model |
| `data/` | Schema narrative, ORM notes, storage topology |
| `frontend/` | UI architecture, component specs |
| `infrastructure/` | Cloud, hosting, observability |
| `integrations/` | Third-party service wiring, webhooks |
| `operations/` | On-call, SLOs, runbooks |
| `reporting/` | Report shape, findings schema |
| `scanners/` | Scanner contracts, catalogs |
| `security/` | Threat model, signing, compliance |
| `strategy/` | Marketing and business strategy |
| `personas/` | Customer profiles, PMF analysis |
| `reference/` | Generated or external reference material |

---

## 8. Sacred Paths

| Path | Rule |
|---|---|
| `library/notes/` | Agents NEVER write here. Human scratch only. |
| `library/requirements/reports/` | Routine scan reports only. Not tied to any PRD. |
| Individual `prd-*/qa/` and `ird-*/qa/` | QA content authored only by quality gate. Structure maintained by the standardizer. |
| `library/knowledge/private/architecture/` | ADRs only. No other prose. |

---

## 9. Wiki Relationship

This section is upstream context — applies in the `legion-suite` ecosystem where per-repo libraries are mirrored into a derived `legion-wiki`. TGL itself doesn't ship a wiki mirror.

---

## 10. Standardize Script

TGL's standardizer (PRD-004) replaces the upstream `standardize-library.ts`. Behavior parity is documented in [`behavior-spec.md`](behavior-spec.md). The script is idempotent — running it twice produces identical output with all steps reporting "no change."

---

## Changelog

- v2.0 — May 2026. Complete rewrite. Introduces `knowledge/{public,private}`, promotes `issues/` to a peer of `requirements/`, adds `in-work/backlog/completed` lifecycle to both, introduces per-plan `qa/` subfolders, standardizes PRD/IRD naming with `prd-`/`ird-` prefixes and `-index.md` suffix for the main file. Supersedes v1.
- v1.0 — May 2026. Initial canonical schema (legacy).
