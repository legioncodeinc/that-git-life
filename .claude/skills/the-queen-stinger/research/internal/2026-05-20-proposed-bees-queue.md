---
source_url: file:///c:/Users/mario/GitHub/legion-code/ai-tools/proposed-bees-queue.md
retrieved_on: 2026-05-20
source_type: internal-repo
authority: official
relevance: critical
topic: contract
stinger: the-queen-stinger
---

# proposed-bees-queue.md

## Summary
The canonical FIFO queue file. the proposal step appends to the bottom; `the-queen` consumes from the top. The YAML frontmatter encodes the `pickup_protocol` (5-step procedure) and the `row_format` invariant (`NNN|worker-bee-name`, 3-digit zero-padded, kebab-case). The body is a flat list of 231 rows as of retrieval, lowest position number = top of queue = next to be processed. Position numbers are permanent identifiers and must never be renumbered or reused.

## Key quotations / statistics

- Frontmatter `description`: "Strict FIFO pipeline queue. Each row is `NNN|worker-bee-name`. The next pipeline agent claims the FIRST (top) row, looks up the matching `### [ ] NNN. worker-bee-name` block in `proposed-bees-backlog.md`, reads the four metadata lines (Research Depth, Research Model, Analyst Model, Builder Model) plus the search queries, and runs the command-brief -> stinger -> worker-bee -> hive-registrar factory under those declared models and that declared depth budget."
- `pickup_protocol` step 1: "The next pipeline agent reads the FIRST `NNN|worker-bee-name` row in this file (lowest position number still present is always the top)."
- `pickup_protocol` step 2: "The agent deletes that row from this file BEFORE doing any work, so no sibling agent can race onto the same entry, and appends the row to `proposed-bees-completed.md` with a status marker and ISO date."
- `pickup_protocol` step 3 (excerpt): "`**Research Depth:**` controls how many sources the research-apostle downloads. `**Research Model:**` is the model the research-apostle uses for live search + page download + triage. `**Analyst Model:**` is the model that synthesises the downloaded research into architectural decisions for the command brief. `**Builder Model:**` is the model that authors the stinger (skill markdown plus any helper scripts) and the worker-bee agent file."
- `pickup_protocol` step 4: "The agent then runs the full Legion AI Tools Factory pipeline: command-brief -> stinger-forge -> create-bee -> hive-register."
- `pickup_protocol` step 5: "New entries are appended to the BOTTOM of the queue by the proposal step. They are never inserted in the middle. Position numbers must remain monotonic and never reused."
- `row_format`: "NNN|worker-bee-name (3-digit zero-padded id, pipe, kebab-case worker-bee name)"
- `totals.rows`: 231 (must stay synchronized with the body row count).
- `date_updated`: 2026-05-20 (must be bumped on every mutation).
- `last_updated_by`: every mutator (currently `cursor-multitask-coordinator-opus-4.7`, will become `the-queen` after each cycle).
- First five queue rows: `001|nextjs-worker-bee`, `002|cursor-ide-worker-bee`, `003|typescript-worker-bee`, `004|tailwind-worker-bee`, `005|vite-worker-bee` -- these are what `the-queen` will see at the top of the queue and process in that order.

## Annotations for stinger-forge
- IMPORTANT contradiction with the Command Brief: the queue's `pickup_protocol` step 2 says "deletes that row from this file BEFORE doing any work, ... and appends the row to `proposed-bees-completed.md`." The Command Brief says the row goes to `proposed-bees-in-process.md` FIRST and only moves to `completed.md` after hive-registrar finishes. `stinger-forge` MUST resolve this: the Command Brief's two-stage lifecycle (queue -> in-process -> completed) is the newer and more robust design because it provides crash-recovery context. `guides/01-pick-and-lock.md` and `guides/09-close-out.md` should document the corrected protocol. The queue file's frontmatter `pickup_protocol` is stale and needs updating to match the Command Brief's two-stage lifecycle. Flag this for user resolution.
- `guides/02-backlog-lookup.md` should cite the four metadata-line format word-for-word: `**Research Depth:**`, `**Research Model:**`, `**Analyst Model:**`, `**Builder Model:**`. Markdown bold + colon is the parse anchor.
- `guides/01-pick-and-lock.md` must document the YAML frontmatter mutations: decrement `totals.rows`, bump `date_updated`, set `last_updated_by` to `the-queen`. The Command Brief lists this in ACTION step 2.
- The 231 rows at retrieval form the FIFO order. `001|nextjs-worker-bee` is the next pickup for the first `the-queen` invocation post-registration.
