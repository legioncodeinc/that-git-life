# 03 - Naming Contracts

How to derive the stinger name from the worker-bee name, how to verify uniqueness across all roster surfaces, and how to handle the two known meta-Bee exceptions.

## The default rule

For a worker-bee named `<base>-worker-bee`, the paired stinger is named:

```
<base>-stinger
```

Examples (all current roster):

| Worker Bee | Stinger |
|---|---|
| `react-worker-bee` | `react-stinger` |
| `db-worker-bee` | `db-stinger` |
| `auth-worker-bee` | `auth-stinger` |
| `security-worker-bee` | `security-stinger` |
| `seo-aeo-worker-bee` | `seo-aeo-stinger` |
| `nextjs-worker-bee` | `nextjs-stinger` |
| `forms-zod-worker-bee` | `forms-zod-stinger` |

The rule: strip the trailing `-worker-bee` from the worker-bee name and append `-stinger`. No other transformations. Preserve all internal hyphens, all lowercase characters, and the kebab-case shape.

## Meta-Bee exceptions

Two Bees are factory infrastructure, not roster Bees, and their pairs do not follow the default rule:

| Bee | Skill (paired stinger) | Why the exception |
|---|---|---|
| `the-queen` | `the-queen-stinger` | Mythological metaphor; the hand wields the factory. The stinger name follows the default `<name>-stinger` rule because no metaphorical pair name was chosen. |

For routine `the-queen` operations, the queue rows being processed will all be `-worker-bee` names following the default rule. The meta-Bees never appear in the queue.

If, against expectation, a queue row's worker-bee name does not end in `-worker-bee`, treat it as a probable typo. STOP and route to the failure mode in `guides/10-failure-modes.md` under "naming convention violation."

## Uniqueness verification

Before Phase 1 (command-center) runs, verify that the new Bee and Stinger names do not collide with existing artifacts. Check all four surfaces:

1. `ai-tools/proposed-bees-backlog.md` -- search for the worker-bee name. There should be exactly one match: the `### [ ] N. <worker-bee-name>` heading you just looked up. More than one match means a duplicate; STOP and surface.
2. `ai-tools/proposed-bees-queue.md` -- search for the worker-bee name. There should be ZERO matches because the row has already been moved to in-process. If there is still a match, the Sub-step 2a delete in `guides/01-pick-and-lock.md` failed; STOP and recover.
3. `ai-tools/proposed-bees-completed.md` -- search for the worker-bee name. There should be ZERO matches. A match here means the row was already processed and the backlog checkbox should already be `[x]`; this is a desync. STOP and surface.
4. `ai-tools/skills/beekeeper-suit/SKILL.md` -- search for the worker-bee name. There should be ZERO matches. A match here means the Bee is already registered with beekeeper-suit's roster, which contradicts the `[ ]` state in the backlog. STOP and surface.

If all four checks pass, the names are unique and Phase 1 can proceed.

You should also verify the STINGER name does not collide:

5. `ai-tools/skills/<stinger-name>/` -- check the folder does not already exist. If it does, STOP. Either the prior run crashed before reaching Phase 4, or there is a genuine name collision. Either way, surface for the caller.

6. `ai-tools/agents/<worker-bee-name>.md` -- check the file does not already exist. Same logic.

## File and folder paths derived from names

Once the names are confirmed unique, the following paths are determined and used by downstream phases:

| Artifact | Path |
|---|---|
| Command Brief | `ai-tools/command-briefs/<worker-bee-name>-command-brief.md` |
| Stinger folder (root) | `ai-tools/skills/<stinger-name>/` |
| Stinger `SKILL.md` | `ai-tools/skills/<stinger-name>/SKILL.md` |
| Stinger research folder | `ai-tools/skills/<stinger-name>/research/` |
| Stinger guides folder | `ai-tools/skills/<stinger-name>/guides/` |
| Bee file | `ai-tools/agents/<worker-bee-name>.md` |
| beekeeper-suit's guide for this Bee | `ai-tools/skills/beekeeper-suit/guides/<worker-bee-name>.md` |

`the-queen` does not write these files directly; the worker phases do. But `the-queen` needs to know the paths to (a) hand them to phases as inputs, (b) verify each phase produced its output at the expected path, and (c) include them in the final report.

## Why this matters

A naming collision detected at Phase 4 (hive-registrar) instead of before Phase 1 means three to five hours of wasted phase work plus a partial-state recovery that requires manual cleanup. The five-second uniqueness check before Phase 1 is the cheapest insurance in the entire pipeline.

the proposal step's naming rules document the upstream side of this contract. `the-queen` is the downstream side; the rules must be enforced again here because nothing in the queue itself prevents a duplicate name from being authored if the proposal step was used with stale uniqueness state.
