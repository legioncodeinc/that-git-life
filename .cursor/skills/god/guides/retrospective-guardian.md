# Retrospective Guardian — God's Guide

The God routing skill's record of when to invoke `retrospective-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/retrospective-guardian.md`](../../agents/retrospective-guardian.md)
**Weapon:** [`ai-tools/skills/retrospective-weapon/`](../../skills/retrospective-weapon/)
**Command Brief:** [`ai-tools/command-briefs/retrospective-guardian-command-brief.md`](../../../command-briefs/retrospective-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`retrospective-guardian` owns the full retrospective lifecycle for engineering teams. It selects the right format for the context, runs the psychological safety pre-check that determines whether the team can be honest, produces a time-boxed facilitation plan, and enforces action-item discipline (owner, deadline, observable outcome, sprint backlog placement). Its core claim: retros are behavior-change instruments, not complaint sessions. The health metric is action-item follow-through rate, not participation rate. It also designs async retros as a first-class option for distributed teams. It does NOT own incident postmortems, sprint planning, backlog grooming, or OKR-setting.

## Trigger phrases

Route to `retrospective-guardian` when the user says any of:

- "Run a retro" / "plan our retrospective" / "help us do a sprint retrospective"
- "Which retro format should we use?"
- "Our retros produce no change" / "action items never get done" / "retro theater"
- "How do we do an async retro?" / "remote retrospective"
- "We need better psychological safety in our retros"
- "Review last sprint's action items"
- "Our team needs better retrospectives"
- "Help with follow-through on retro action items"

Or when the request implicitly involves running or improving a team retrospective.

## Do NOT route when

- The user needs an incident postmortem — those have different cadence, participants (broader stakeholders), and root-cause methodology (5 Whys with blameless culture focus). Route to `postmortem-guardian` if it exists, or handle inline.
- The user is planning the next sprint — route to the team's agile process or relevant tooling. Sprint planning and retros have conflicting objectives and should never be combined.
- The user needs OKR-setting or goal alignment — route to `okr-goal-setting-guardian`.
- The request is about scrum ceremony structure in general (Daily Standup, Sprint Planning, Sprint Review) — handle inline; `retrospective-guardian` is scoped to the Retrospective ceremony only.

If a request straddles retro and sprint planning, separate the ceremonies and handle each independently.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- **Team context** (required): team size, sprint length or period being reviewed, remote/hybrid/co-located, approximate team maturity with retrospectives.
- **Period valence** (optional): shipped a big win, recovered from an incident, had team conflict, onboarded new members. Defaults to neutral if absent.
- **Constraints** (optional): must be async, max time budget, no voting fatigue, specific tool available. Defaults to sync 60-minute retro if absent.
- **Previous action items** (optional): list of last retro's action items for follow-through review. Angel will skip the opening review if absent.
- **Library path** (optional): repo path to `library/` if the team wants retro notes persisted to disk.

If team context is missing entirely, ask before invoking.

## Outputs the Angel produces

- **Primary:** A filled-out facilitation plan (time-boxed agenda, icebreaker, prompts, voting mechanism, synthesis steps, closing ritual) — inline reply by default, or written to `library/retros/[YYYY-MM-DD]-retro-[sprint].md` on request.
- **Secondary:** A prioritized action-item list (owner, due date, done-looks-like) using `templates/action-items.md`.
- **Secondary:** A follow-through rate assessment for the previous retro's action items (if prior items were provided).
- **Audit trail:** If writing to disk, produces a dated retro file in `reports/` per the `reports/README.md` naming convention.

## Multi-Angel sequences this Angel participates in

- **Decision documentation loop** — `retrospective-guardian` surfaces significant process/architecture decisions → `library-guardian` documents them in `library/retros/` or `library/requirements/`.
- **Team health loop** — `retrospective-guardian` produces action items → team implements → `retrospective-guardian` opens next retro with follow-through review, closing the behavior-change loop.

## Critical directives the orchestrator should respect

- Never skip the psychological safety pre-check — surfacing a safety gap is more valuable than a polished facilitation plan on an unsafe team.
- Always verify action items pass the three-question filter (Who? When? What does done look like?) before the session closes.
- Open every retro with a follow-through review of the previous retro's action items — skipping this signal that commitments are optional.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
