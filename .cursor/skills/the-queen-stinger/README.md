# the-queen-stinger

The procedural arsenal for `the-queen`, the pipeline-controller Bee of the Legion AI Tools Factory.

`the-queen` consumes ONE row at a time from `ai-tools/proposed-bees-queue.md`, drives it through the canonical five-phase Bee-forging pipeline (command-center -> scripture-historian -> stinger-forge -> bee-creator -> hive-registrar), and updates the four tracking files (`proposed-bees-queue.md`, `proposed-bees-in-process.md`, `proposed-bees-completed.md`, `proposed-bees-backlog.md`) along the way. This stinger encodes everything `the-queen` needs to do that reliably: the move-before-work invariant, the strict FIFO pickup protocol, the per-phase dispatch contracts, the close-out lifecycle, and the failure-mode catalog.

It does NOT encode any product-domain knowledge. The worker phases own all substantive content.

## Start here

1. `SKILL.md` is the master index.
2. `guides/00-principles.md` is the philosophy: foreman vs craftsman, move-before-work, hierarchy.
3. `guides/01-pick-and-lock.md` is the operational core: how to atomically claim a queue row.
4. `guides/10-failure-modes.md` is the recovery catalog.

## Folder map

- `guides/` -- 12 numbered procedure files (`00-` through `11-`). Read in order on first use.
- `examples/` -- worked end-to-end runs (`happy-path.md`, `recovery-from-crashed-prior-run.md`).
- `templates/` -- canonical row formats and the final-report shape.
- `reports/` -- where past-run summaries accumulate over time.
- `research/` -- raw research notes from `scripture-historian` (do not edit; `stinger-forge` reads at build time).

## Pairing

- Bee: [`ai-tools/agents/the-queen.md`](../../agents/the-queen.md)
- Command Brief: [`ai-tools/command-briefs/the-queen-command-brief.md`](../../command-briefs/the-queen-command-brief.md)
- Producer counterpart: the proposal step
