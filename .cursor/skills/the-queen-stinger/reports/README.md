# reports/

This folder accumulates one-page summaries of past `the-queen` cycles over time. It is the long-term audit log of the factory's outputs.

## What goes here

After each successful cycle, `the-queen` MAY (optionally, not required) append a dated summary file:

```
reports/<YYYY-MM-DD>-<NNN>-<worker-bee-name>.md
```

The file contains the same content as the final report emitted to the caller (see `templates/final-report.md`), preserved on disk for future analysis.

For failed cycles, the summary file is also written, but with the failure state preserved.

## Why optional

The four tracking files (`proposed-bees-queue.md`, `proposed-bees-in-process.md`, `proposed-bees-completed.md`, `proposed-bees-backlog.md`) ARE the authoritative state. They preserve enough information (position, name, completion date, model identifiers) to reconstruct what happened.

The per-cycle summary files in this folder add:

- Phase-by-phase timing.
- Flags and warnings that did not block close-out.
- The exact text of the final report sent to the caller.

These are useful for retrospectives and cost analysis but not strictly required for the factory to function. If `the-queen` is operating under a tight budget, this step can be skipped.

## File format

Each summary file is a copy of the final report markdown (per `templates/final-report.md`), saved verbatim. No additional processing. Just the report as it was emitted.

## Querying the reports folder

Common queries that the reports folder enables:

- "Show me all cycles that took longer than 30 minutes." `grep` for the timing table and parse durations.
- "Which model produced the most warnings in the last 30 days?" Pull the completed-row format from the tracking file plus the warnings list from the reports.
- "Did stinger-forge ever fail in Q2?" `grep` for "FAILED" rows in the timing tables.

The reports are markdown for compatibility with the rest of the factory. Future tooling could parse them with simple regex; nothing here requires structured JSON.

## Naming convention

File names follow the pattern:

```
<YYYY-MM-DD>-<NNN>-<worker-bee-name>.md
```

- `YYYY-MM-DD` is the close-out date.
- `NNN` is the zero-padded position number.
- `<worker-bee-name>` is the kebab-case Bee name.

Examples:

- `2026-05-20-001-nextjs-worker-bee.md`
- `2026-05-21-002-cursor-ide-worker-bee.md`
- `2026-05-21-005-vite-worker-bee-FAILED.md` (suffix for non-happy-path cycles)

## When this folder is initialized

This folder starts empty. The first `the-queen` cycle to complete creates the first file. The folder grows monotonically; no file is ever modified or deleted after it is written.
