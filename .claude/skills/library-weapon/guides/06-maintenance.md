# Guide 06 — Sync Audit / Maintenance

Covers detecting and fixing drift between the library structure and schema v2.

## Trigger phrases

- "run a sync audit"
- "check for drift"
- "is everything in the right folder?"
- "audit the library"

## Drift types to check

### 1. v1 path remnants

These should not exist in any repo. Flag every one found:

| Stale path | Fix |
|---|---|
| `library/knowledge-base/` | Run `pnpm standardize-library --repository <name>` |
| `library/architecture/` | Same |
| `library/requirements/features/` | Same |
| `library/requirements/issues/` | Same |
| `library/qa/` | Same |

### 2. PRD/IRD naming violations

Check that all folders under `requirements/backlog/`, `requirements/in-work/`, `requirements/completed/`, `issues/backlog/`, `issues/in-work/`, `issues/completed/` follow the naming rules:

- PRD folders: `prd-<###>-<slug>/`
- IRD folders: `ird-<###>-<slug>/`
- Old naming like `feature-007-...` or `issue-042-...` should not exist.

### 3. Missing index files

Every PRD folder must contain `prd-<###>-<slug>-index.md`. Every IRD folder must contain `ird-<###>-<slug>-index.md`. Flag folders missing their index.

### 4. Missing qa/ subfolders

Every PRD and IRD folder should have a `qa/` subfolder (even if empty). Create missing ones.

### 5. Missing README.md files

Every v2 folder should have a seeded `README.md` with the correct YAML headmatter. Running `pnpm standardize-library --repository <name>` will seed any missing ones.

### 6. Stale wiki content

Run `pnpm legion-sync --status` to check for stale entries in the wiki that no longer have a source.

## Audit procedure

1. For each repo: run `pnpm standardize-library --repository <name> --dry-run`. Zero actions = no drift.
2. Run `pnpm legion-sync --status`. All repos should show OK.
3. Grep for old naming patterns:
   ```bash
   rg "knowledge-base|/features/|/issues/" <repo>/library/ --files-with-matches
   rg "feature-[0-9]{3}|issue-[0-9]{3}" <repo>/library/ --files-with-matches
   ```
4. Produce a drift report listing: repo, drift type, affected paths, recommended fix.

## Output

Drift report as markdown. Do not fix without user confirmation on destructive operations (renames). Safe operations (creating missing folders, writing missing READMEs) may proceed immediately.
