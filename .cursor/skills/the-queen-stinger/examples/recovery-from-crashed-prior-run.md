# Example: recovery from a crashed prior run

What `the-queen` does when invoked while `proposed-bees-in-process.md` has an orphaned row from a previously-crashed cycle. This is failure mode F0.2 in `guides/10-failure-modes.md`.

## Starting state

The user invokes `the-queen` expecting a normal cycle:

> "Run the pipeline."

The four tracking files are:

- `proposed-bees-queue.md`: top row `006|shadcn-component-library-worker-bee` (231 - 1 = 230 in body; one was already processed in a prior cycle).
- `proposed-bees-in-process.md`: one row: `005|vite-worker-bee|failed:stinger-forge|2026-05-19`.
- `proposed-bees-completed.md`: 1 row from a happy-path prior cycle: `001|nextjs-worker-bee|completed|2026-05-18|...`.
- `proposed-bees-backlog.md`: `### [ ] 5. vite-worker-bee` (still unchecked because the cycle did not close out).

On disk:
- `ai-tools/command-briefs/vite-worker-bee-command-brief.md` exists (Phase 1 succeeded).
- `ai-tools/skills/vite-stinger/research/` exists with files (Phase 1.5 succeeded).
- `ai-tools/skills/vite-stinger/SKILL.md` does NOT exist (Phase 2 failed before writing it).
- `ai-tools/agents/vite-worker-bee.md` does NOT exist.
- No roster row for `vite-worker-bee` in `ai-tools/skills/beekeeper-suit/SKILL.md`.

## Step 1 (would-be Pick)

`the-queen` reads `proposed-bees-queue.md`. Top row of body would be `006|shadcn-component-library-worker-bee`.

But BEFORE proceeding, `the-queen` always checks `proposed-bees-in-process.md` per the F0.2 pre-flight check.

## F0.2 trigger fires

`the-queen` reads `proposed-bees-in-process.md` and finds:

```
005|vite-worker-bee|failed:stinger-forge|2026-05-19
```

This is a non-blank row. The orphan detection trigger fires.

`the-queen` STOPS. It does NOT pick row `006`. It does NOT delete the orphan. It does NOT touch any tracking file.

## Diagnosis emitted to the caller

`the-queen` emits a structured message explaining the orphan:

```markdown
## the-queen pre-flight check failed

The factory is not in a clean state. The in-process tracking file has an orphaned row from a prior run:

- File: `ai-tools/proposed-bees-in-process.md`
- Row: `005|vite-worker-bee|failed:stinger-forge|2026-05-19`
- Diagnosis: A prior cycle started but failed at Phase 2 (stinger-forge). The Command Brief and research folder exist on disk; the Stinger SKILL.md, Bee file, and beekeeper-suit's roster row do NOT.

I cannot start a new cycle until this row is resolved. Per `guides/10-failure-modes.md` F0.2, the recovery options are:

## Option A: Retry from the failed phase (resume)

Re-invoke me with explicit instructions to resume row 005 from Phase 2. I will:
1. Verify the existing Command Brief and research folder are intact.
2. Re-run Phase 2 (stinger-forge). If it succeeds, continue with Phases 3, 4, and close-out.
3. Update the in-process row by removing the failure marker before re-running Phase 2.

This option preserves all the work already done (Phase 1 brief, Phase 1.5 research).

## Option B: Roll back to the queue (retry from scratch)

Manually edit:
- `ai-tools/proposed-bees-in-process.md`: delete the row.
- `ai-tools/proposed-bees-queue.md`: prepend `005|vite-worker-bee` to the top of the body, increment `totals.rows`.

Then optionally delete the partial artifacts:
- `ai-tools/command-briefs/vite-worker-bee-command-brief.md`
- `ai-tools/skills/vite-stinger/` (the entire folder)

After cleanup, invoke me normally. I will pick row 005 from the queue again and start from Phase 1.

This option discards the Phase 1 brief and Phase 1.5 research. Use when the failure was caused by something in the early phases that needs to be re-thought.

## Option C: Mark as abandoned

If row 005 should not be forged at all (e.g., the Bee proposal is being retired):

- Delete the row from `ai-tools/proposed-bees-in-process.md`.
- Optionally delete the partial artifacts.
- Leave the backlog entry as `### [ ] 5. vite-worker-bee` so a human can later decide whether to delete it from the backlog entirely.

After cleanup, invoke me. I will see the in-process file is empty and proceed with row 006.

---

the-queen stopped. Awaiting human decision.
```

## What this example demonstrates

- The F0.2 pre-flight check ALWAYS runs before any other work.
- `the-queen` does NOT auto-recover. Each recovery option requires human judgment because the right answer depends on context (was the failure transient? is the brief still relevant? has the domain shifted?).
- The orphan row carries enough information (`|failed:<phase>|<date>`) to make the diagnosis without `the-queen` having to inspect the artifacts on disk.
- The stop line is honored: no automatic retry, no advancing to the next queue row, no silent rollback.

## What `the-queen` does NOT do

- It does NOT pick row 006 just because 005 is "stuck". The queue is strict FIFO from the top; skipping a row violates the protocol.
- It does NOT automatically retry Phase 2 even if the failure looks transient. The Command Brief's directive #1 ("Process exactly ONE queue entry per invocation. Never auto-advance.") includes "never auto-retry."
- It does NOT delete the in-process row to "clean up" without instructions. The orphan is the audit record.

## What the human reviewer typically does

In practice, Option A (retry from the failed phase) is the most common choice for transient failures (model timeout, network error). Option B is chosen when the brief needs to be re-written. Option C is rare; it usually accompanies a separate decision to retire the Bee from the backlog.

After the human chooses an option and applies the manual edits (Option A skips manual editing; the next `the-queen` invocation is instructed to retry), the next `the-queen` invocation sees an empty in-process file and proceeds normally.

## Cross-reference

See `guides/10-failure-modes.md` for the full failure-mode catalog. F0.2 is one entry in a larger list that includes filesystem permission errors, naming conflicts, partial close-outs, and more.
