# Template: in-process row format

The exact row format `the-queen` appends to `ai-tools/proposed-bees-in-process.md` in Sub-step 2c of `guides/01-pick-and-lock.md`.

## Happy-path row format

For a clean lock with no failures, the row is identical to the queue row format:

```
NNN|worker-bee-name
```

Where:

- `NNN` is the zero-padded 3-digit position number (e.g. `001`, `042`, `231`).
- `worker-bee-name` is the kebab-case Bee name (e.g. `nextjs-worker-bee`, `auth-worker-bee`).

The pipe character `|` separates the two fields. No surrounding whitespace.

Example:

```
007|forms-zod-worker-bee
```

## Failed-cycle row format

If a phase failed and `the-queen` is leaving the row in `in-process` with a marker per the "leave-with-marker" strategy in `guides/10-failure-modes.md`, the row is extended:

```
NNN|worker-bee-name|failed:<phase-name>|YYYY-MM-DD
```

Where:

- `<phase-name>` is the name of the failed phase: one of `command-center`, `scripture-historian`, `scripture-historian-auth`, `stinger-forge`, `bee-creator`, or `hive-registrar`.
- `YYYY-MM-DD` is the ISO date when the failure was recorded.

Example:

```
007|forms-zod-worker-bee|failed:stinger-forge|2026-05-20
```

## File-level invariants

- The file holds AT MOST one non-blank row at any time. A second row indicates a race condition or a prior crash; see F0.2 in `guides/10-failure-modes.md`.
- Blank lines and comment lines (starting with `#`) are permitted at the top of the file as documentation, but the body of the file contains at most one data row.
- The file MAY have YAML frontmatter, but `the-queen` does not require it. If present, frontmatter fields like `date_updated` and `last_updated_by` are optional metadata.

## When this format applies

`the-queen` writes this format in:

- Sub-step 2c of `guides/01-pick-and-lock.md` (happy-path row).
- Failure recovery in `guides/10-failure-modes.md` (failed-cycle row with marker).
- Step 10b of `guides/09-close-out.md` (deletes the row entirely; does not re-write it).

External tools that read `proposed-bees-in-process.md` (e.g., a future "factory dashboard") can parse the row with a simple split-on-pipe.
