# Guide 00 — Initialize Command

Scaffolds or migrates a repository's `library/` folder to schema v2. The canonical tool is `scripts/standardize-library.ts` — do not manually create folders.

## Trigger phrases

- "initialize library"
- "set up docs"
- "scaffold documentation"
- "set up library-guardian"

## The right tool

Always use the standardize-library script. It handles both fresh scaffolds (no existing library/) and v1→v2 migrations (existing library/ with old paths).

```bash
# From legion-suite root:
pnpm standardize-library --repository <name>

# Preview first:
pnpm standardize-library --repository <name> --dry-run

# All repos at once:
pnpm standardize-library --all
```

## What the script creates (v2 target tree)

```
library/
  README.md
  knowledge/
    README.md
    public/
      README.md
      overview/
      guides/
      faqs/
    private/
      README.md
      architecture/                 (ADRs go here)
      standards/
        documentation-framework.md
  requirements/
    README.md
    in-work/   README.md
    backlog/   README.md
    completed/ README.md
    reports/   README.md
  issues/
    README.md
    in-work/   README.md
    backlog/   README.md
    completed/ README.md
  notes/
    README.md
```

Every folder gets a seeded `README.md` with YAML frontmatter (`ai_description`, `human_description`) explaining the folder's invariants.

## v1 → v2 migration map

| v1 path | v2 path |
|---|---|
| `library/knowledge-base/<domain>/` | `library/knowledge/private/<domain>/` |
| `library/knowledge-base/overview/` | `library/knowledge/public/overview/` |
| `library/architecture/ADR-*.md` | `library/knowledge/private/architecture/ADR-*.md` |
| `library/requirements/features/feature-NNN-slug/` | `library/requirements/backlog/prd-NNN-slug/` |
| `library/requirements/features/.../prd-feature-NNN-slug.md` | `library/requirements/backlog/prd-NNN-slug/prd-NNN-slug-index.md` |
| `library/requirements/features/.../reports/` | `library/requirements/backlog/prd-NNN-slug/qa/` |
| `library/requirements/issues/issue-NNN-slug/` | `library/issues/backlog/ird-NNN-slug/` |
| `library/qa/` | `library/requirements/reports/` |

## Post-flight

After the script runs:

1. Check `pnpm standardize-library --repository <name> --dry-run` shows "Already up to date."
2. Run `pnpm legion-sync --status` to confirm the wiki is current.
3. Tell the user: what was created/migrated, that notes/ was not touched, next steps for creating content.

## Error handling

- **Script not found**: run `pnpm install` from legion-suite root first.
- **Conflict warning**: the script prints "[WARN] Skipping move — destination exists with different content" for files where the v2 destination already has content. Report these to the user for manual resolution.
- **Not in a recognized repo**: make sure --repository matches one of the ALL_REPOS list in the script (`legion-suite`, `legion-marketing`, `legion-secure`, `legion-code`, `legion-website`, `legion-cloud`, `legion-shim`, `legion-harness`, `legion-shared`).
