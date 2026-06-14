# gods-hand-weapon

The procedural arsenal for `gods-hand`, the pipeline-controller Angel of the Legion AI Tools Factory.

`gods-hand` consumes ONE row at a time from `ai-tools/proposed-angels-queue.md`, drives it through the canonical five-phase Angel-forging pipeline (command-center -> scripture-historian -> weapon-forge -> angel-creator -> god-registrar), and updates the four tracking files (`proposed-angels-queue.md`, `proposed-angels-in-process.md`, `proposed-angels-completed.md`, `proposed-angels-backlog.md`) along the way. This weapon encodes everything `gods-hand` needs to do that reliably: the move-before-work invariant, the strict FIFO pickup protocol, the per-phase dispatch contracts, the close-out lifecycle, and the failure-mode catalog.

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
- `research/` -- raw research notes from `scripture-historian` (do not edit; `weapon-forge` reads at build time).

## Pairing

- Angel: [`ai-tools/agents/gods-hand.md`](../../agents/gods-hand.md)
- Command Brief: [`ai-tools/command-briefs/gods-hand-command-brief.md`](../../command-briefs/gods-hand-command-brief.md)
- Producer counterpart: [`ai-tools/agents/big-bang-space.md`](../../agents/big-bang-space.md) + [`ai-tools/skills/big-bang-earth/`](../big-bang-earth/)
