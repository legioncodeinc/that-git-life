# Standardizer behavior spec

- **Category:** Reference
- **Status:** Canonical
- **Last updated:** 2026-05-23

This document defines how TGL's standardizer engine enforces [Schema v2](schema-v2.md). It is the behavioral contract that PRD-004 implements and that PRD-005 (scanner) reads to detect drift.

---

## 1. Two operating modes

The standardizer runs in two modes, selected per invocation:

| Mode | Trigger | What happens |
|---|---|---|
| **Scaffold** | Target repo has no `library/` folder. | Create the full Schema v2 tree with starter READMEs (using templates from `src/standardizer/templates/`). |
| **Migrate** | Target repo has a `library/` folder. | Inspect, diff against Schema v2, apply the minimum set of moves/renames/creates to reach compliance. |

Both modes share the same idempotency rule: a second run on the same repo produces a zero-diff output.

---

## 2. Idempotency contract

After any successful run, the following must be true:

- Re-running with the same flags produces no file changes.
- Re-running with `--dry-run` outputs `OK: no changes required`.
- Re-running after a manual user edit detects any drift the edit introduced.

A test in `src/standardizer/__tests__/idempotency.test.ts` enforces this by running the migrator twice over a fixture repo and asserting the second run is a no-op.

---

## 3. Scaffold flow

When the standardizer detects no `library/`:

1. Create the canonical tree (Schema v2 §1) as empty directories.
2. Write each `README.md` from the matching template in `src/standardizer/templates/<path>/README.md`. Templates already include the headmatter YAML and section bodies.
3. Write `library/_meta.yaml`:
   ```yaml
   schema_version: 2
   last_standardized_at: <ISO date>
   tgl_version: <semver>
   ```
4. Print a summary: `Scaffolded library/ at <path> — N folders, M READMEs.`

---

## 4. Migrate flow

When the standardizer detects an existing `library/`:

1. **Parse `library/_meta.yaml`** if present. If `schema_version: 2`, jump to validation. If `schema_version: 1` (or missing), this is a v1-to-v2 migration.
2. **Plan moves** for any v1-shaped paths from Schema v2 §2:
   - `knowledge-base/` → `knowledge/private/`
   - `knowledge-base/overview/` → `knowledge/public/overview/`
   - `requirements/features/feature-<###>-*/` → `requirements/backlog/prd-<###>-*/`
   - `requirements/issues/issue-<###>-*/` → `issues/backlog/ird-<###>-*/`
   - `qa/` → relocated under per-PRD `qa/` folders or `requirements/reports/`
   - `architecture/` → `knowledge/private/architecture/`
3. **Plan creates** for any missing canonical folders.
4. **Plan README updates** — every required README that lacks valid headmatter gets re-written from template, preserving the body if the existing body is longer than the template's.
5. **Plan renames** for any PRD/IRD/ADR file that doesn't match the §4 patterns (e.g., `feature-007.md` → `prd-007-…-index.md`).
6. **Apply plan** unless `--dry-run`.
7. **Update `_meta.yaml`** with the new `last_standardized_at`.
8. Print a per-step summary.

If any step would lose data (file content collisions, ambiguous renames), the standardizer **stops and reports** rather than proceeding. The user resolves manually and re-runs.

---

## 5. Validation flow

Used by both modes after changes are applied and by the scanner (PRD-005) for drift detection:

| Check | Severity | Description |
|---|---|---|
| Tree-shape | error | Every required folder from §1 exists. |
| README-presence | error | Every required README from §1 exists. |
| Headmatter-shape | error | Every README opens with a valid YAML block containing `ai_description` and `human_description`. |
| Headmatter-content | warn | `ai_description` and `human_description` are non-empty. |
| Naming-PRD | error | Every file under `requirements/{backlog,in-work,completed}/` matches the PRD/sub-PRD patterns. |
| Naming-IRD | error | Same for `issues/`. |
| Naming-ADR | error | Every file in `knowledge/private/architecture/` matches `ADR-<n>-<slug>.md`. |
| No-sub-IRD | error | `issues/*/ird-*/` contains no sub-IRD files. |
| Sacred-notes | warn | `library/notes/` contains only human-authored files (heuristic: file count change since last scan). |
| Sacred-reports | warn | Files in `requirements/reports/` follow the date-prefixed naming. |
| Meta-present | warn | `library/_meta.yaml` exists and parses. |

Each check produces zero or more findings with `{checkId, severity, path, message}`. Findings are written to the scanner's normalized table (PRD-005).

---

## 6. Templates

Templates live in `src/standardizer/templates/` and are bundled with the package. They mirror the Schema v2 tree exactly:

```
src/standardizer/templates/
  library/
    README.md
    knowledge/
      README.md
      public/{README.md, overview/README.md, guides/README.md, faqs/README.md}
      private/{README.md, architecture/README.md, standards/README.md}
    requirements/{README.md, backlog/README.md, in-work/README.md, completed/README.md, reports/README.md}
    issues/{README.md, backlog/README.md, in-work/README.md, completed/README.md}
    notes/README.md
```

Each template has the YAML headmatter and a starter body. Cursor authors these templates as part of PRD-004 by copying the READMEs already shipped in this repo (`library/**/README.md`).

---

## 7. CLI surface

```bash
tgl standardize <path>                    # scaffold or migrate the repo at <path>
tgl standardize <path> --dry-run          # show plan, change nothing
tgl standardize --root                    # standardize every repo under the TGL GitHub root
tgl standardize --root --dry-run          # same, but plan-only
tgl standardize <path> --strict           # treat warnings as errors (used in CI)
```

`tgl standardize` is also reachable from the web UI as a per-repo action ("Standardize this repo") and a global action ("Standardize all").

---

## 8. What the standardizer never does

- Never deletes files except as part of an explicit rename.
- Never edits the *body* of a README that already has valid headmatter and non-empty body content.
- Never touches files under `library/notes/`.
- Never invents PRD or IRD numbers.
- Never commits or pushes anything. The user's git workflow stays in their hands.
