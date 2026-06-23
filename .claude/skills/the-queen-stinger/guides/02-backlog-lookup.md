# 02 - Backlog Lookup

Step 3 of the Command Brief's ACTION list. After the row is locked into `in-process`, look up its full metadata in `ai-tools/proposed-bees-backlog.md`. The metadata block is the input contract for the four downstream phases.

## Locate the entry heading

Open `ai-tools/proposed-bees-backlog.md` and search for the EXACT heading:

```
### [ ] NNN. worker-bee-name
```

where `NNN` is the position number (no leading zeros in the backlog heading -- the backlog uses `1`, `2`, `3` while the queue uses `001`, `002`, `003`) and `worker-bee-name` matches the queue row exactly.

Notes on the position-number format mismatch:

- The queue uses `NNN` zero-padded to 3 digits for sortable strings.
- The backlog uses `N` (no zero-padding) in the heading text.
- When searching the backlog, strip leading zeros from `NNN`. The matching heading for queue row `007|forms-zod-worker-bee` is `### [ ] 7. forms-zod-worker-bee`.

If the heading is not found, STOP. The cycle cannot proceed without backlog metadata. Route to `guides/10-failure-modes.md` under "backlog entry not found."

If the heading IS found but the checkbox is already `[x]` (already completed), STOP. The queue row should not have been pickable. This is a desync between queue and backlog; flag in the final report and recommend a manual cleanup.

## Extract the metadata block

The four metadata lines live IMMEDIATELY below the heading, in this exact order:

```
**Research Depth:** shallow | normal | deep | extreme
**Research Model:** <model-id>
**Analyst Model:** <model-id>
**Builder Model:** <model-id>
```

Capture all four values. They are inputs that `command-center` writes into the new Command Brief's YAML frontmatter and that `scripture-historian`, `stinger-forge`, and `bee-creator` consume in turn.

Then capture:

- The **Purpose** sentence (one line, starts with `**Purpose:**`).
- The 5 to 7 search queries (bullet list, each quoted string on its own line, each ending with the current year).

The Purpose sentence is the seed for the Command Brief's elevator pitch. The search queries are the seed reading list for `scripture-historian`'s research plan.

## Validate the metadata

Before proceeding to Phase 1, run these four sanity checks:

1. **Depth tier is one of** `shallow`, `normal`, `deep`, `extreme`. Any other value, STOP and ask the caller to fix the backlog entry.
2. **Model identifiers are recognizable.** Cross-check each against `ai-tools/model-comparison-matrix.md`. If any model ID is unknown, STOP and surface for the caller. Default-guessing wastes budget.
3. **Search query count is 5 to 7.** Below 5: STOP. Above 7: proceed but flag in the final report (the backlog's authoring rule from the proposal step is 5-7; >7 may be a typo).
4. **Each search query ends with the year suffix.** the proposal step requires `2026` (or current year). A query missing the year is a flag, not a stop. Note it and proceed.

If any check fails with STOP, the recovery is documented in `guides/10-failure-modes.md` under "backlog metadata invalid."

## Pass the metadata to Phase 1

Phase 1 (command-center) receives:

- Worker Bee name (from the queue row).
- Stinger name (derived per `guides/03-naming-contracts.md`).
- Position number (from the queue row, used for the brief's `backlog_position` frontmatter field).
- Depth tier.
- Research Model, Analyst Model, Builder Model.
- Purpose sentence.
- The 5-7 search queries.

These flow into the Command Brief that `command-center` writes. The brief is the durable record of these inputs; `the-queen` does not need to remember them between phases (it can re-read the brief).

## On naming convention drift for meta-Bees

the proposal step's naming rule requires worker-bee names to end in `-worker-bee`. Most queue rows follow this rule. The one known exception, a meta-Bee, is:

- the proposal step.
- `the-queen` (paired with `the-queen-stinger`).

These do not appear in the queue or backlog at all; they are factory infrastructure, not roster Bees. `the-queen` is consuming queue rows authored by the proposal step, all of which follow the `-worker-bee` convention. If a queue row ever lacks the `-worker-bee` suffix, treat it as a probable typo and STOP for the caller to confirm.

See `guides/03-naming-contracts.md` for the full naming derivation rules including how to compute the stinger name from the worker-bee name.
