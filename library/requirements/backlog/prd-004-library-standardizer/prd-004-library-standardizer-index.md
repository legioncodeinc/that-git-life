# PRD-004: Library standardizer

- **Status:** backlog
- **Owner:** Cursor
- **Depends on:** PRD-002 (service core)

## 1. Problem

TGL's headline feature is standardizing repository structure to Library Schema v2. We need an engine that scaffolds new repos with the canonical tree AND retroactively migrates existing repos to match — idempotently, predictably, and without losing data.

## 2. Goals

- A standalone module (`src/standardizer/`) that exposes a public API consumed by the CLI and the service.
- Scaffold mode (no existing `library/`) and migrate mode (existing `library/`).
- `--dry-run` produces a diff without touching files.
- Idempotency: a second run produces zero diff.
- Validation reuse: the same validator that runs after scaffold/migrate is invoked by PRD-005's drift check.
- Bundled README templates that match the READMEs in this repo's own `library/`.

## 3. Non-goals

- Migrating from schemas other than v1 → v2.
- Committing or pushing changes to git.
- Editing the body of pre-existing READMEs that are already compliant.

## 4. User stories

- "As a user, I run `tgl standardize ~/GitHub/foo` and the repo gets a complete Schema v2 library tree."
- "As a user with an old `legion-suite`-shaped repo, I run `tgl standardize` and v1 paths migrate cleanly to v2."
- "As a user, I run `tgl standardize --root --dry-run` to preview changes across every repo."

## 5. Scope

### In scope

- Public API: `standardize(opts: { path: string, dryRun?: boolean, strict?: boolean })`.
- Scaffold path: build the canonical tree + write all templates + `_meta.yaml`.
- Migrate path: detect v1 paths from Schema v2 §2 and rename to v2 homes.
- README headmatter writer/updater.
- Validator (also exported for the scanner).
- Templates for every required README, mirroring `library/**/README.md` in this repo.
- CLI: `tgl standardize <path> [--dry-run] [--strict]`, `tgl standardize --root`.
- Service routes: `POST /api/v1/repos/:id/standardize`, `POST /api/v1/repos/:id/standardize/scaffold-new`.

### Out of scope

- The dashboard UI for standardize results (PRD-006).
- Multi-schema support.

## 6. Acceptance criteria

- [ ] Scaffold mode on an empty directory produces the exact Schema v2 tree with all READMEs.
- [ ] Migrate mode on a v1 fixture renames every v1 path to its v2 home.
- [ ] Re-running migrate on the result produces zero diff.
- [ ] `--dry-run` prints a structured plan and changes nothing on disk.
- [ ] The validator produces a finding for each Schema v2 §3 / §4 violation, with stable `checkId`s.
- [ ] `library/_meta.yaml` is created/updated with `schema_version: 2` and a fresh `last_standardized_at`.
- [ ] The standardizer refuses to proceed and reports cleanly when it would overwrite a non-empty file with a different content hash.
- [ ] CLI exit codes: 0 if clean, 1 if validation failed (with `--strict`), 2 on hard error.
- [ ] Templates produce identical content to this repo's `library/**/README.md` (verified by a snapshot test).

## 7. File-level deliverables

- `src/standardizer/index.ts` — public API.
- `src/standardizer/scaffold/index.ts` — scaffold mode.
- `src/standardizer/migrate/index.ts` — migrate mode (v1 → v2 path table).
- `src/standardizer/migrate/path-table.ts` — Schema v2 §2 mapping.
- `src/standardizer/validate/index.ts` — exported validator.
- `src/standardizer/validate/checks/*.ts` — one file per check from `behavior-spec.md` §5.
- `src/standardizer/headmatter/parse.ts` — YAML headmatter reader/writer.
- `src/standardizer/templates/` — bundled README templates (copies of this repo's library READMEs at build time).
- `src/standardizer/__tests__/*` — unit + idempotency tests.
- `src/standardizer/__fixtures__/` — sample v1 and v2 repos.
- `src/cli/standardize.ts` — CLI command.
- `src/service/routes/standardize.routes.ts` — HTTP routes.

## 8. Sequenced steps

1. Author the path-table constant from Schema v2 §2.
2. Author each validator check + its tests against fixtures.
3. Author the scaffold flow + its template-copying step.
4. Author the migrate flow + its plan-then-apply structure.
5. Build the dry-run reporter (structured JSON + human-readable text).
6. Wire the CLI command + the two service routes.
7. Add the idempotency test (run twice, assert zero diff).
8. Add the snapshot test (templates match this repo's `library/`).
9. Write the QA artifact at `qa/prd-004-library-standardizer-qa.md`.

## 9. Risks

| Risk | Mitigation |
|---|---|
| v1 → v2 rename collides with an existing v2 path. | Detect collision, stop, ask the user to resolve. |
| User edits a README's body and we'd overwrite. | Preserve the body when headmatter is the only diff. |
| Schema v3 lands later and the path table needs to be re-versioned. | The path-table file is per-version; we'll add a v2 → v3 path-table when v3 ships. |
| Templates drift from this repo's actual READMEs. | The build step regenerates templates from `library/**/README.md` at `npm run build`. |

## 10. References

- ADR-010.
- `library/knowledge/private/standardizer/schema-v2.md`
- `library/knowledge/private/standardizer/behavior-spec.md`
