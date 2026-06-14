# Examples — wiki-weapon

Worked invocations of wiki-guardian and the resulting page writes. Each file shows: the invocation payload, the source code chunk, the git context, and the resulting page writes (entity / concept / decision / contradiction-report as applicable).

Used by wiki-guardian to mirror structure, tone, and frontmatter completeness when authoring real pages.

**Status:** populated in the next weapon-forge pass after research completes. Tracked in `research/research-plan.md`.

## Planned examples

- `01-document-mode-typescript-module.md` — `document` mode against a small TS module; happy path; produces 1 module + 4 function entities + 1 concept page.
- `02-update-mode-with-contradiction.md` — `update` mode where a function's return type changed; produces 1 contradiction with all four artifacts.
- `03-direct-mention-with-confirmation.md` — `@`-mention from a Cursor user; shows the scope-confirmation flow and the `partial_scan: true` response.
- `04-adr-inferred-from-commit.md` — Phase 5 ADR detection from a high-confidence commit message; produces a `decisions/` page.
- `05-non-js-stub-pages.md` — chunk includes a Python file; shows the stub-page reflex.
- `06-react-component-extraction.md` — `react-component` entity sub-type extraction with `props_summary` and `tested_by` linking.
- `07-queue-and-handler.md` — `queue` entity extraction that also creates the handler-function entity and links via `triggers:`.
- `08-feature-flag-with-call-sites.md` — `feature-flag` entity with `read_at:` populated from grep over the codebase.
