# Template: final report

The shape of the final summary message `the-queen` emits at the end of every run. Filled out per `guides/11-reporting.md`.

## Markdown skeleton

```markdown
## the-queen cycle report

<one-line summary in past tense>

## Tracking-file deltas

| File | Before | After |
|---|---|---|
| `proposed-bees-queue.md` | top row was `NNN\|worker-bee-name` | top row is `MMM\|next-worker-bee-name` |
| `proposed-bees-in-process.md` | empty | empty (after close-out) |
| `proposed-bees-completed.md` | <N> rows | <N+1> rows |
| `proposed-bees-backlog.md` | `### [ ] N. worker-bee-name` | `### [x] N. worker-bee-name` |

## Artifacts produced

- Command Brief: `ai-tools/command-briefs/<worker-bee-name>-command-brief.md`
- Stinger folder: `ai-tools/skills/<stinger-name>/` (guides/ N files, examples/ N files, templates/ N files, research/ N files)
- Bee file: `ai-tools/agents/<worker-bee-name>.md`
- beekeeper-suit's roster: row added to `ai-tools/skills/beekeeper-suit/SKILL.md` (line ~NN)
- beekeeper-suit-side guide: `ai-tools/skills/beekeeper-suit/guides/<worker-bee-name>.md`

## Phase timing

| Phase | Worker | Duration | Status |
|---|---|---|---|
| 1 | command-center | <h:mm:ss> | OK |
| 1.5 | scripture-historian | <h:mm:ss> | OK |
| 2 | stinger-forge | <h:mm:ss> | OK |
| 3 | bee-creator | <h:mm:ss> | OK |
| 4 | hive-registrar | <h:mm:ss> | OK |
| 10 (close-out) | the-queen | <h:mm:ss> | OK |

## Flags and warnings

- <flag 1, or "No flags or warnings.">
- <flag 2>

## Next steps for the orchestrator

<one sentence telling the orchestrator what to do next>

---

the-queen stopped. Awaiting next invocation.
```

## Filled-in example (happy path)

```markdown
## the-queen cycle report

Forged Bee `001|nextjs-worker-bee`. Pipeline complete in 22 minutes 44 seconds.

## Tracking-file deltas

| File | Before | After |
|---|---|---|
| `proposed-bees-queue.md` | top row was `001|nextjs-worker-bee` | top row is `002|cursor-ide-worker-bee` |
| `proposed-bees-in-process.md` | empty | empty |
| `proposed-bees-completed.md` | empty | 1 row |
| `proposed-bees-backlog.md` | `### [ ] 1. nextjs-worker-bee` | `### [x] 1. nextjs-worker-bee` |

## Artifacts produced

- Command Brief: `ai-tools/command-briefs/nextjs-worker-bee-command-brief.md`
- Stinger folder: `ai-tools/skills/nextjs-stinger/` (guides/ 8 files, examples/ 3 files, templates/ 5 files, research/ 92 files)
- Bee file: `ai-tools/agents/nextjs-worker-bee.md`
- beekeeper-suit's roster: row added to `ai-tools/skills/beekeeper-suit/SKILL.md` (line 23)
- beekeeper-suit-side guide: `ai-tools/skills/beekeeper-suit/guides/nextjs-worker-bee.md`

## Phase timing

| Phase | Worker | Duration | Status |
|---|---|---|---|
| 1 | command-center | 0:01:23 | OK |
| 1.5 | scripture-historian | 0:12:45 | OK |
| 2 | stinger-forge | 0:06:11 | OK |
| 3 | bee-creator | 0:01:42 | OK |
| 4 | hive-registrar | 0:00:38 | OK |
| 10 (close-out) | the-queen | 0:00:05 | OK |

## Flags and warnings

- No flags or warnings.

## Next steps for the orchestrator

Cycle complete. Invoke `the-queen` again to process row `002|cursor-ide-worker-bee`, or stop here for human review.

---

the-queen stopped. Awaiting next invocation.
```

## Filled-in example (failure at Phase 2)

```markdown
## the-queen cycle report

Cycle stopped at Phase 2 (stinger-forge). Row `005|vite-worker-bee` remains in-process with failure marker.

## Tracking-file deltas

| File | Before | After |
|---|---|---|
| `proposed-bees-queue.md` | top row was `005|vite-worker-bee` | top row is `006|shadcn-component-library-worker-bee` |
| `proposed-bees-in-process.md` | empty | `005|vite-worker-bee|failed:stinger-forge|2026-05-20` |
| `proposed-bees-completed.md` | empty | empty (no close-out happened) |
| `proposed-bees-backlog.md` | `### [ ] 5. vite-worker-bee` | unchanged |

## Artifacts produced

- Command Brief: `ai-tools/command-briefs/vite-worker-bee-command-brief.md` (Phase 1 OK)
- Stinger folder research subfolder: `ai-tools/skills/vite-stinger/research/` (Phase 1.5 OK, 87 files)
- Stinger SKILL.md: NOT produced (Phase 2 failed)
- Bee file: NOT produced
- beekeeper-suit's roster: NOT updated
- beekeeper-suit-side guide: NOT produced

## Phase timing

| Phase | Worker | Duration | Status |
|---|---|---|---|
| 1 | command-center | 0:01:18 | OK |
| 1.5 | scripture-historian | 0:18:22 | OK |
| 2 | stinger-forge | 0:04:47 | FAILED |
| 3 | bee-creator | N/A | skipped |
| 4 | hive-registrar | N/A | skipped |
| 10 (close-out) | the-queen | N/A | skipped |

## Flags and warnings

- Phase 2 stinger-forge returned without writing SKILL.md. Worker logs indicate a model timeout during synthesis.
- Research folder is intact at `ai-tools/skills/vite-stinger/research/`. A retry of Phase 2 can reuse it without re-running scripture-historian.

## Next steps for the orchestrator

Resolve the Phase 2 failure (see worker logs), then either: (a) re-invoke `the-queen` to retry from Phase 2 against the existing in-process row, or (b) manually roll back the row to the queue and try again later.

---

the-queen stopped. Awaiting next invocation.
```
