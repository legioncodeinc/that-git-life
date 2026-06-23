# Template: completed row format

The exact row format `the-queen` appends to `ai-tools/proposed-bees-completed.md` in Step 10c of `guides/09-close-out.md`.

## Canonical format

```
NNN|worker-bee-name|completed|YYYY-MM-DD|research:<research-model-id>|analyst:<analyst-model-id>|builder:<builder-model-id>
```

Where:

- `NNN` is the zero-padded 3-digit position number.
- `worker-bee-name` is the kebab-case Bee name.
- `completed` is a fixed string marking the row's terminal state.
- `YYYY-MM-DD` is the ISO date the close-out happened.
- `<research-model-id>` is the model used by `scripture-historian`, lifted from the backlog metadata's `**Research Model:**` line.
- `<analyst-model-id>` is the model used during synthesis, lifted from `**Analyst Model:**`.
- `<builder-model-id>` is the model used during skill authoring, lifted from `**Builder Model:**`.

Fields are separated by the pipe character `|`. No surrounding whitespace.

## Example row

```
001|nextjs-worker-bee|completed|2026-05-20|research:grok-4.3|analyst:claude-opus-4-7-thinking-max|builder:claude-opus-4-7-thinking-max
```

## Why include the model identifiers

The model triplet enables downstream analytics without requiring a separate journal file. Concrete use cases:

- "Which model produced the most Bees in the last 90 days?"
- "Did Bees built with `gpt-5.5-extra-high` need more security findings than those built with `claude-opus-4-7-thinking-max`?"
- "Total cost of the factory in Q2 2026, broken down by model."

The triplet is captured at close-out time, when all three values are known with certainty. Storing it in the row avoids the alternative of cross-referencing back to the backlog entry (which could be edited or deleted over time).

## File-level invariants

- Rows are appended to the bottom. Order in the file matches order of completion.
- Position numbers are NOT necessarily monotonic (a high-position Bee might complete before a low-position one if cycles run out-of-order, though `the-queen`'s strict FIFO makes this unlikely).
- Rows are NEVER deleted from `completed.md`. The file is an append-only audit log.
- The file MAY have YAML frontmatter with optional fields like `date_updated`, `last_updated_by`, and `totals.rows`. If `totals.rows` is present, `the-queen` should increment it during close-out.

## Failure variants (future work)

If `the-queen` ever needs to log a permanently-abandoned cycle (e.g., a row that was determined to be a duplicate or otherwise unfit for forging), the suggested row format is:

```
NNN|worker-bee-name|abandoned|YYYY-MM-DD|reason:<short-reason>
```

This is NOT currently emitted by `the-queen` (abandonment requires human decision; see F0.2 recovery in `guides/10-failure-modes.md`). It is reserved for a future maintenance Bee.
