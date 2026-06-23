# Retrospective Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `retrospective-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/retrospective-worker-bee.md`](../../agents/retrospective-worker-bee.md)
**Stinger:** [`.cursor/skills/retrospective-stinger/`](../../skills/retrospective-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`retrospective-worker-bee` owns the full sprint retrospective lifecycle for engineering teams. It selects the right retro format from nine canonical options (Start/Stop/Continue, 4Ls, Sailboat, Mad/Sad/Glad, DAKI, Learning Matrix, 5 Whys, Hot Air Balloon, Starfish) based on team maturity, period valence, time budget, and remote/sync constraints. It runs a psychological safety pre-check using the Edmondson 7-item scale before any facilitation work, produces time-boxed facilitation plans with icebreakers and synthesis steps, and enforces action-item discipline (owner + deadline + observable outcome). Its core philosophy is that retros are behavior-change instruments, not complaint sessions — the output is what the team does differently next sprint, measured by action-item follow-through rate.

## Trigger phrases

Route to `retrospective-worker-bee` when the user says any of:

- "run a retro"
- "plan our retrospective"
- "which retro format should we use"
- "our retros produce no change"
- "help with action items from the retro"
- "how do we do an async retro"
- "our team needs better retrospectives"
- "review last sprint's action items"

Or when the request implicitly involves sprint retrospective planning, facilitation, follow-through review, or async retro design.

## Do NOT route when

- The user asks for an incident postmortem — route to `postmortem-worker-bee` (different cadence, participants, and root-cause methodology).
- The request is about sprint planning, backlog grooming, or OKR-setting — those are separate ceremonies with conflicting objectives.
- The request is about daily standups or standup facilitation.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- Team size and whether the team is co-located or distributed (remote/async)
- Sprint length and period valence (big win, incident recovery, conflict, onboarding)
- Previous retro's action items if available (optional — Bee will note the absence and skip the follow-through review step)
- Psychological safety context if known (optional — Bee will surface the safety pre-check regardless)

## Outputs the Bee produces

- A complete, time-boxed facilitation plan for the retro session (format selection with rationale, icebreaker, agenda steps, voting mechanism, synthesis, closing ritual) — referenced in `library/retros/[YYYY-MM-DD]-retro-[sprint].md` via `library-worker-bee`
- A structured action-item list with owner, due date, and done-looks-like for every commitment captured during the session

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`
- When a retro surfaces a significant process change or architectural decision, hands off to `library-worker-bee` for formal documentation

## Critical directives the orchestrator should respect

- Never skip the psychological safety pre-check — a retro run without minimum safety produces theater; surfacing the gap early is more valuable than a polished session.
- Always enforce the three-question filter on every action item before it leaves the board: Who owns this? When does it close? What does done look like?
- Open every retro with a follow-through review of the previous retro's action items — teams that skip this signal that action items are optional.
- Surface the action-item follow-through rate before proceeding to format selection — below 50% means the retro's subject is "why aren't we following through?", not whatever format was planned.
- Frame async as a first-class option, not a fallback — async retros see 42% higher participation from introverted team members.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
