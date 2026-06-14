# Example: happy-path cycle

A worked end-to-end run from "queue has `001|nextjs-guardian` at top" to "Angel registered with God's roster." Every file write is narrated.

This example is a guided tour, not a script. It is more verbose than a real run because it explains every decision; a real cycle is much terser in chat output (see `templates/final-report.md`).

## Starting state

The four tracking files look like this when `gods-hand` is invoked:

- `proposed-angels-queue.md`: 231 rows in body. Top row: `001|nextjs-guardian`.
- `proposed-angels-in-process.md`: empty.
- `proposed-angels-completed.md`: empty.
- `proposed-angels-backlog.md`: tier 1 has `### [ ] 1. nextjs-guardian` with full metadata block.

The user says: "Run the pipeline."

## Step 1: Pick

`gods-hand` reads `proposed-angels-queue.md`. Top row of body: `001|nextjs-guardian`.

Captures:
- Position: `001`
- Guardian name: `nextjs-guardian`
- Row text: `001|nextjs-guardian`

## Step 2a: Delete row from queue

`gods-hand` uses StrReplace on `proposed-angels-queue.md` to remove the line `001|nextjs-guardian\n`. After the edit, the new top row is `002|cursor-ide-guardian`. Queue body row count drops from 231 to 230.

## Step 2b: Update queue frontmatter

`gods-hand` updates the queue's YAML frontmatter:
- `totals.rows: 231` -> `totals.rows: 230`
- `date_updated: 2026-05-20`
- `last_updated_by: gods-hand`

## Step 2c: Append row to in-process

`gods-hand` writes `001|nextjs-guardian\n` to `proposed-angels-in-process.md`. File now contains exactly one non-blank line.

The state machine is now in the `In-flight` state. Move-before-work invariant holds.

## Step 3: Backlog lookup

`gods-hand` opens `proposed-angels-backlog.md` and searches for `### [ ] 1. nextjs-guardian`. Found at line 47.

Captures:
- Research Depth: `deep`
- Research Model: `grok-4.3`
- Analyst Model: `claude-opus-4-7-thinking-max`
- Builder Model: `claude-opus-4-7-thinking-max`
- Purpose: "Next.js 15+ App Router authority -- Server Components, route handlers, Server Actions, middleware, caching directives, streaming, Partial Prerendering, deploy targets (Vercel vs self-host vs Docker standalone), monorepo patterns."
- Search queries: 5 quoted strings.

Validation checks all pass.

Uniqueness checks (`guides/03-naming-contracts.md`):
- `nextjs-guardian` not present in `ai-tools/skills/god/SKILL.md` -- OK.
- `nextjs-guardian` not present in `proposed-angels-completed.md` -- OK.
- `nextjs-guardian` not present in queue (was just removed) -- OK.
- `ai-tools/skills/nextjs-weapon/` does not exist -- OK.
- `ai-tools/agents/nextjs-guardian.md` does not exist -- OK.

## Step 4: Phase 1 (command-center)

`gods-hand` loads `ai-tools/skills/command-center/SKILL.md` and follows its instructions. The skill:

1. Reads the template at `command-brief-template.md` (repo root).
2. Writes a populated brief to `ai-tools/command-briefs/nextjs-guardian-command-brief.md` with:
   - YAML frontmatter (8 fields) populated from the backlog metadata.
   - H1 heading: `# nextjs-guardian Command Brief`.
   - Angel half populated from the Purpose and `gods-hand`'s pre-filled context.
   - Weapon half with REFERENCE MATERIAL containing the 5 search queries and proposed authoritative sources.

Wall clock: 1m 23s.

`gods-hand` verifies the brief exists and is non-empty. OK. Proceed to Phase 1.5.

## Step 5: Scaffold weapon folder

`gods-hand` creates:

```
ai-tools/skills/nextjs-weapon/
  examples/
  guides/
  reports/
  research/
  templates/
```

All subfolders are empty.

## Step 6: Phase 1.5 (scripture-historian)

`gods-hand` calls the Task tool:

```
Task(
  subagent_type="scripture-historian",
  description="Research nextjs-weapon (deep)",
  prompt="""
You are Phase 1.5 of the Legion AI Tools Factory pipeline, invoked by `gods-hand` for:

- Angel: `nextjs-guardian`
- Weapon: `nextjs-weapon`
- Command Brief: `ai-tools/command-briefs/nextjs-guardian-command-brief.md`
- Research output: `ai-tools/skills/nextjs-weapon/research/`
- Depth tier: `deep`

Read the brief, build a research plan, conduct depth-calibrated research, and end with the canonical handoff line.
"""
)
```

`scripture-historian` runs for 12m 45s and emits its handoff line:

> "Research for `nextjs-guardian` is complete at `ai-tools/skills/nextjs-weapon/research/` (92 files, depth: deep, window: 6 months). Ready to hand off to **weapon-forge**."

`gods-hand` verifies:
- `research/research-plan.md` exists.
- `research/research-summary.md` exists.
- `research/index.md` exists.
- `research/internal/` and `research/external/` each have several files.

OK. Proceed to Phase 2.

## Step 7: Phase 2 (weapon-forge)

`gods-hand` loads `ai-tools/skills/weapon-forge/SKILL.md` and follows its instructions. The skill:

1. Reads the Command Brief.
2. Reads `research/research-summary.md` for the executive summary.
3. Reads `research/index.md` for the source manifest.
4. Authors `SKILL.md` at the weapon root (382 lines).
5. Authors a `README.md` at the weapon root.
6. Authors 8 guides under `guides/`, numbered 00 through 07.
7. Authors 3 examples under `examples/`.
8. Authors 5 templates under `templates/`.
9. Authors `reports/README.md`.

Wall clock: 6m 11s.

`gods-hand` verifies:
- `SKILL.md` exists, has YAML frontmatter, is 382 lines (well under 500).
- At least one file in each of `guides/`, `examples/`, `templates/`. OK.
- `research/` folder is untouched (still 92 files, same names). OK.

OK. Proceed to Phase 3.

## Step 8: Phase 3 (angel-creator)

`gods-hand` loads `ai-tools/skills/angel-creator/SKILL.md` and follows its instructions. The skill:

1. Reads the Command Brief.
2. Walks the Weapon folder recursively to enumerate files for the References section.
3. Writes the Angel file at `ai-tools/agents/nextjs-guardian.md` with:
   - YAML frontmatter (`name: nextjs-guardian`, populated `description`, `proactive: true`).
   - H1: `# Next.js Guardian`.
   - All six standard body sections.
   - References section enumerates 22 files across `guides/`, `examples/`, `templates/`, `research/`.

Wall clock: 1m 42s.

`gods-hand` verifies the Angel file. OK. Proceed to Phase 4.

## Step 9: Phase 4 (god-registrar)

`gods-hand` loads `ai-tools/skills/god-registrar/SKILL.md` and follows its instructions. The skill:

1. Adds a row to the Roster table in `ai-tools/skills/god/SKILL.md`:
   ```
   | `nextjs-guardian` | Next.js 15+ App Router authority ... | "use Next.js", "review App Router code", ... | [guides/nextjs-guardian.md](guides/nextjs-guardian.md) |
   ```
2. Writes `ai-tools/skills/god/guides/nextjs-guardian.md` from `templates/guide-template.md`, substituting placeholders.
3. Increments the "N Angels registered" footnote from 17 to 18.

Wall clock: 38s.

`gods-hand` verifies the roster row, the guide file, and the footnote increment. OK. Proceed to close-out.

## Step 10: Close-out

### Step 10a: Verify artifacts

All five artifacts present:
- Command Brief: OK
- Weapon folder: OK (with populated research/)
- SKILL.md: OK
- Angel file: OK
- God's roster row + guide: OK

### Step 10b: Delete in-process row

`gods-hand` removes `001|nextjs-guardian\n` from `proposed-angels-in-process.md`. File is now empty.

### Step 10c: Append completed row

`gods-hand` appends to `proposed-angels-completed.md`:

```
001|nextjs-guardian|completed|2026-05-20|research:grok-4.3|analyst:claude-opus-4-7-thinking-max|builder:claude-opus-4-7-thinking-max
```

### Step 10d: Flip backlog checkbox

`gods-hand` edits `proposed-angels-backlog.md`: `### [ ] 1. nextjs-guardian` -> `### [x] 1. nextjs-guardian`.

Wall clock for close-out: 5s.

## Step 11: Final report

`gods-hand` emits the canonical report (see `templates/final-report.md` for the worked example with these numbers).

## Ending state

- `proposed-angels-queue.md`: 230 rows. Top row: `002|cursor-ide-guardian`. Frontmatter shows `totals.rows: 230`, `last_updated_by: gods-hand`.
- `proposed-angels-in-process.md`: empty.
- `proposed-angels-completed.md`: 1 row: `001|nextjs-guardian|completed|2026-05-20|...`.
- `proposed-angels-backlog.md`: tier 1 has `### [x] 1. nextjs-guardian`.

On disk:
- `ai-tools/command-briefs/nextjs-guardian-command-brief.md`
- `ai-tools/skills/nextjs-weapon/` (with SKILL.md, README.md, guides/, examples/, templates/, reports/, research/)
- `ai-tools/agents/nextjs-guardian.md`
- `ai-tools/skills/god/SKILL.md` (with new roster row)
- `ai-tools/skills/god/guides/nextjs-guardian.md`

`gods-hand` ends with the stop line. The orchestrator decides whether to invoke `gods-hand` again for `002|cursor-ide-guardian` or pause for human review.

## What this example demonstrates

- The move-before-work invariant in Sub-step 2a-2c.
- The strict FIFO pickup (always lowest `NNN`).
- The exact order of phases and their no-skip rule.
- The verification checks at each phase boundary.
- The close-out as a separate administrative step.
- The final report format and the stop line.

For a failure-mode walkthrough, see `examples/recovery-from-crashed-prior-run.md`.
