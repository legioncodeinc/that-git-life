# Template: in-process row format

The exact row format `gods-hand` appends to `ai-tools/proposed-angels-in-process.md` in Sub-step 2c of `guides/01-pick-and-lock.md`.

## Happy-path row format

For a clean lock with no failures, the row is identical to the queue row format:

```
NNN|guardian-name
```

Where:

- `NNN` is the zero-padded 3-digit position number (e.g. `001`, `042`, `231`).
- `guardian-name` is the kebab-case Angel name (e.g. `nextjs-guardian`, `auth-guardian`).

The pipe character `|` separates the two fields. No surrounding whitespace.

Example:

```
007|forms-zod-guardian
```

## Failed-cycle row format

If a phase failed and `gods-hand` is leaving the row in `in-process` with a marker per the "leave-with-marker" strategy in `guides/10-failure-modes.md`, the row is extended:

```
NNN|guardian-name|failed:<phase-name>|YYYY-MM-DD
```

Where:

- `<phase-name>` is the name of the failed phase: one of `command-center`, `scripture-historian`, `scripture-historian-auth`, `weapon-forge`, `angel-creator`, or `god-registrar`.
- `YYYY-MM-DD` is the ISO date when the failure was recorded.

Example:

```
007|forms-zod-guardian|failed:weapon-forge|2026-05-20
```

## File-level invariants

- The file holds AT MOST one non-blank row at any time. A second row indicates a race condition or a prior crash; see F0.2 in `guides/10-failure-modes.md`.
- Blank lines and comment lines (starting with `#`) are permitted at the top of the file as documentation, but the body of the file contains at most one data row.
- The file MAY have YAML frontmatter, but `gods-hand` does not require it. If present, frontmatter fields like `date_updated` and `last_updated_by` are optional metadata.

## When this format applies

`gods-hand` writes this format in:

- Sub-step 2c of `guides/01-pick-and-lock.md` (happy-path row).
- Failure recovery in `guides/10-failure-modes.md` (failed-cycle row with marker).
- Step 10b of `guides/09-close-out.md` (deletes the row entirely; does not re-write it).

External tools that read `proposed-angels-in-process.md` (e.g., a future "factory dashboard") can parse the row with a simple split-on-pipe.
