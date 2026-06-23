---
source_url: file:///c:/Users/mario/GitHub/legion-code/ai-tools/proposed-bees-backlog.md
retrieved_on: 2026-05-20
source_type: internal-repo
authority: official
relevance: critical
topic: backlog-format
stinger: the-queen-stinger
---

# proposed-bees-backlog.md (header lines 1 to 50)

## Summary
The backlog file's header explains how to read it: each tier-grouped entry has a checkbox, four metadata lines, a Purpose, and 5 to 7 search queries. `the-queen` reads ONLY the metadata block under `### [ ] NNN. worker-bee-name` for its dispatch; it never edits the rest of the backlog except to flip the checkbox to `[x]` at the end of a successful cycle. The "Already registered" list (17 Bees as of 2026-05-20) is the uniqueness check surface and the source of canonical Bee-already-shipped knowledge.

## Key quotations / statistics

- File purpose statement (line 3): "A prioritized backlog of Bee + Stinger pairs to add to Legion's `ai-tools/` roster. Ordered by value/impact to a vibe coder building a real product end-to-end. Each entry has a checkbox to mark when forged, a one-line purpose, and 3-5 research queries to run through EXA (`web_search_exa`) and FireCrawl during Phase 2 (`stinger-forge`)."
- How-to-read instructions (lines 5-9): "Checkbox -- mark `[x]` when the Bee + Stinger pair has been forged and registered with beekeeper-suit. Purpose -- single-line domain summary. Full domain detail lives in the Command Brief when the Bee is forged. Research queries -- 2026-current. Refresh annually or when a major release lands."
- Already registered (line 15): "`asset-worker-bee`, `auth-worker-bee`, `code-forensics-worker-bee`, `db-worker-bee`, `design-system-worker-bee`, `devops-worker-bee`, `library-worker-bee`, `mind-worker-bee`, `payments-worker-bee`, **`python-worker-bee`** (covers Django + Django Ninja + FastAPI + Celery + Channels + pytest + uv + Pydantic v2 + Ruff + pyright -- 'Python ultimate' is already shipped), `quality-worker-bee`, `react-worker-bee`, `security-worker-bee`, `seo-aeo-worker-bee`, `ux-ui-worker-bee`, `website-worker-bee`, `wiki-worker-bee`."
- Tier list (lines 23-39): 17 tiers from Foundation through Extended Coverage. Vibe coders ship roughly in tier order. Forge top-down when bandwidth is scarce.
- Backlog entry shape (illustrative, from line 47-51 example): "### [ ] 1. nextjs-worker-bee / **Research Depth:** deep / **Research Model:** grok-4.3 / **Analyst Model:** claude-opus-4-7-thinking-max / ..."

## Annotations for stinger-forge
- `guides/02-backlog-lookup.md` should cite the four metadata-line format directly and explain that the metadata block immediately follows the `### [ ] NNN. worker-bee-name` heading. The Purpose line follows the metadata; the 5-7 search queries follow the Purpose.
- The "Already registered" list is the uniqueness surface `hive-registrar` will mutate, and `the-queen` should verify the new Bee landed there at end of cycle. Reading this list is part of the close-out confirmation step.
- The backlog's tier groupings are not load-bearing for `the-queen` (it does not pick by tier). They matter only for the proposal step insertion ordering. `guides/02-backlog-lookup.md` can mention tiers as orientation but does not depend on them.
- Note the discrepancy with the proposal step's instruction "5 to 7 queries" vs the backlog header's "3-5 research queries." `stinger-forge` should NOT try to fix this in the backlog text; flag it as a known doc-vs-code drift. The Command Brief is the authoritative actor specification.
