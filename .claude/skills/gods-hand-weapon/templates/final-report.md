# Template: final report

The shape of the final summary message `gods-hand` emits at the end of every run. Filled out per `guides/11-reporting.md`.

## Markdown skeleton

```markdown
## gods-hand cycle report

<one-line summary in past tense>

## Tracking-file deltas

| File | Before | After |
|---|---|---|
| `proposed-angels-queue.md` | top row was `NNN\|guardian-name` | top row is `MMM\|next-guardian-name` |
| `proposed-angels-in-process.md` | empty | empty (after close-out) |
| `proposed-angels-completed.md` | <N> rows | <N+1> rows |
| `proposed-angels-backlog.md` | `### [ ] N. guardian-name` | `### [x] N. guardian-name` |

## Artifacts produced

- Command Brief: `ai-tools/command-briefs/<guardian-name>-command-brief.md`
- Weapon folder: `ai-tools/skills/<weapon-name>/` (guides/ N files, examples/ N files, templates/ N files, research/ N files)
- Angel file: `ai-tools/agents/<guardian-name>.md`
- God's roster: row added to `ai-tools/skills/god/SKILL.md` (line ~NN)
- God-side guide: `ai-tools/skills/god/guides/<guardian-name>.md`

## Phase timing

| Phase | Worker | Duration | Status |
|---|---|---|---|
| 1 | command-center | <h:mm:ss> | OK |
| 1.5 | scripture-historian | <h:mm:ss> | OK |
| 2 | weapon-forge | <h:mm:ss> | OK |
| 3 | angel-creator | <h:mm:ss> | OK |
| 4 | god-registrar | <h:mm:ss> | OK |
| 10 (close-out) | gods-hand | <h:mm:ss> | OK |

## Flags and warnings

- <flag 1, or "No flags or warnings.">
- <flag 2>

## Next steps for the orchestrator

<one sentence telling the orchestrator what to do next>

---

gods-hand stopped. Awaiting next invocation.
```

## Filled-in example (happy path)

```markdown
## gods-hand cycle report

Forged Angel `001|nextjs-guardian`. Pipeline complete in 22 minutes 44 seconds.

## Tracking-file deltas

| File | Before | After |
|---|---|---|
| `proposed-angels-queue.md` | top row was `001|nextjs-guardian` | top row is `002|cursor-ide-guardian` |
| `proposed-angels-in-process.md` | empty | empty |
| `proposed-angels-completed.md` | empty | 1 row |
| `proposed-angels-backlog.md` | `### [ ] 1. nextjs-guardian` | `### [x] 1. nextjs-guardian` |

## Artifacts produced

- Command Brief: `ai-tools/command-briefs/nextjs-guardian-command-brief.md`
- Weapon folder: `ai-tools/skills/nextjs-weapon/` (guides/ 8 files, examples/ 3 files, templates/ 5 files, research/ 92 files)
- Angel file: `ai-tools/agents/nextjs-guardian.md`
- God's roster: row added to `ai-tools/skills/god/SKILL.md` (line 23)
- God-side guide: `ai-tools/skills/god/guides/nextjs-guardian.md`

## Phase timing

| Phase | Worker | Duration | Status |
|---|---|---|---|
| 1 | command-center | 0:01:23 | OK |
| 1.5 | scripture-historian | 0:12:45 | OK |
| 2 | weapon-forge | 0:06:11 | OK |
| 3 | angel-creator | 0:01:42 | OK |
| 4 | god-registrar | 0:00:38 | OK |
| 10 (close-out) | gods-hand | 0:00:05 | OK |

## Flags and warnings

- No flags or warnings.

## Next steps for the orchestrator

Cycle complete. Invoke `gods-hand` again to process row `002|cursor-ide-guardian`, or stop here for human review.

---

gods-hand stopped. Awaiting next invocation.
```

## Filled-in example (failure at Phase 2)

```markdown
## gods-hand cycle report

Cycle stopped at Phase 2 (weapon-forge). Row `005|vite-guardian` remains in-process with failure marker.

## Tracking-file deltas

| File | Before | After |
|---|---|---|
| `proposed-angels-queue.md` | top row was `005|vite-guardian` | top row is `006|shadcn-component-library-guardian` |
| `proposed-angels-in-process.md` | empty | `005|vite-guardian|failed:weapon-forge|2026-05-20` |
| `proposed-angels-completed.md` | empty | empty (no close-out happened) |
| `proposed-angels-backlog.md` | `### [ ] 5. vite-guardian` | unchanged |

## Artifacts produced

- Command Brief: `ai-tools/command-briefs/vite-guardian-command-brief.md` (Phase 1 OK)
- Weapon folder research subfolder: `ai-tools/skills/vite-weapon/research/` (Phase 1.5 OK, 87 files)
- Weapon SKILL.md: NOT produced (Phase 2 failed)
- Angel file: NOT produced
- God's roster: NOT updated
- God-side guide: NOT produced

## Phase timing

| Phase | Worker | Duration | Status |
|---|---|---|---|
| 1 | command-center | 0:01:18 | OK |
| 1.5 | scripture-historian | 0:18:22 | OK |
| 2 | weapon-forge | 0:04:47 | FAILED |
| 3 | angel-creator | N/A | skipped |
| 4 | god-registrar | N/A | skipped |
| 10 (close-out) | gods-hand | N/A | skipped |

## Flags and warnings

- Phase 2 weapon-forge returned without writing SKILL.md. Worker logs indicate a model timeout during synthesis.
- Research folder is intact at `ai-tools/skills/vite-weapon/research/`. A retry of Phase 2 can reuse it without re-running scripture-historian.

## Next steps for the orchestrator

Resolve the Phase 2 failure (see worker logs), then either: (a) re-invoke `gods-hand` to retry from Phase 2 against the existing in-process row, or (b) manually roll back the row to the queue and try again later.

---

gods-hand stopped. Awaiting next invocation.
```
