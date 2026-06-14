# 03 - Naming Contracts

How to derive the weapon name from the guardian name, how to verify uniqueness across all roster surfaces, and how to handle the two known meta-Angel exceptions.

## The default rule

For a guardian named `<base>-guardian`, the paired weapon is named:

```
<base>-weapon
```

Examples (all current roster):

| Guardian | Weapon |
|---|---|
| `react-guardian` | `react-weapon` |
| `db-guardian` | `db-weapon` |
| `auth-guardian` | `auth-weapon` |
| `security-guardian` | `security-weapon` |
| `seo-aeo-guardian` | `seo-aeo-weapon` |
| `nextjs-guardian` | `nextjs-weapon` |
| `forms-zod-guardian` | `forms-zod-weapon` |

The rule: strip the trailing `-guardian` from the guardian name and append `-weapon`. No other transformations. Preserve all internal hyphens, all lowercase characters, and the kebab-case shape.

## Meta-Angel exceptions

Two Angels are factory infrastructure, not roster Angels, and their pairs do not follow the default rule:

| Angel | Skill (paired weapon) | Why the exception |
|---|---|---|
| `big-bang-space` | `big-bang-earth` | Cosmological metaphor; the cosmic event (space) is paired with the matter that condenses (earth). Author chose semantic pairing over rote convention. |
| `gods-hand` | `gods-hand-weapon` | Mythological metaphor; the hand wields the factory. The weapon name follows the default `<name>-weapon` rule because no metaphorical pair name was chosen. |

For routine `gods-hand` operations, the queue rows being processed will all be `-guardian` names following the default rule. The meta-Angels never appear in the queue.

If, against expectation, a queue row's guardian name does not end in `-guardian`, treat it as a probable typo. STOP and route to the failure mode in `guides/10-failure-modes.md` under "naming convention violation."

## Uniqueness verification

Before Phase 1 (command-center) runs, verify that the new Angel and Weapon names do not collide with existing artifacts. Check all four surfaces:

1. `ai-tools/proposed-angels-backlog.md` -- search for the guardian name. There should be exactly one match: the `### [ ] N. <guardian-name>` heading you just looked up. More than one match means a duplicate; STOP and surface.
2. `ai-tools/proposed-angels-queue.md` -- search for the guardian name. There should be ZERO matches because the row has already been moved to in-process. If there is still a match, the Sub-step 2a delete in `guides/01-pick-and-lock.md` failed; STOP and recover.
3. `ai-tools/proposed-angels-completed.md` -- search for the guardian name. There should be ZERO matches. A match here means the row was already processed and the backlog checkbox should already be `[x]`; this is a desync. STOP and surface.
4. `ai-tools/skills/god/SKILL.md` -- search for the guardian name. There should be ZERO matches. A match here means the Angel is already registered with God's roster, which contradicts the `[ ]` state in the backlog. STOP and surface.

If all four checks pass, the names are unique and Phase 1 can proceed.

You should also verify the WEAPON name does not collide:

5. `ai-tools/skills/<weapon-name>/` -- check the folder does not already exist. If it does, STOP. Either the prior run crashed before reaching Phase 4, or there is a genuine name collision. Either way, surface for the caller.

6. `ai-tools/agents/<guardian-name>.md` -- check the file does not already exist. Same logic.

## File and folder paths derived from names

Once the names are confirmed unique, the following paths are determined and used by downstream phases:

| Artifact | Path |
|---|---|
| Command Brief | `ai-tools/command-briefs/<guardian-name>-command-brief.md` |
| Weapon folder (root) | `ai-tools/skills/<weapon-name>/` |
| Weapon `SKILL.md` | `ai-tools/skills/<weapon-name>/SKILL.md` |
| Weapon research folder | `ai-tools/skills/<weapon-name>/research/` |
| Weapon guides folder | `ai-tools/skills/<weapon-name>/guides/` |
| Angel file | `ai-tools/agents/<guardian-name>.md` |
| God's guide for this Angel | `ai-tools/skills/god/guides/<guardian-name>.md` |

`gods-hand` does not write these files directly; the worker phases do. But `gods-hand` needs to know the paths to (a) hand them to phases as inputs, (b) verify each phase produced its output at the expected path, and (c) include them in the final report.

## Why this matters

A naming collision detected at Phase 4 (god-registrar) instead of before Phase 1 means three to five hours of wasted phase work plus a partial-state recovery that requires manual cleanup. The five-second uniqueness check before Phase 1 is the cheapest insurance in the entire pipeline.

`big-bang-earth`'s naming rules (`ai-tools/skills/big-bang-earth/`) document the upstream side of this contract. `gods-hand` is the downstream side; the rules must be enforced again here because nothing in the queue itself prevents a duplicate name from being authored if `big-bang-space` was used with stale uniqueness state.
