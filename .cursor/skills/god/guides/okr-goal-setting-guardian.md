# Guide: okr-goal-setting-guardian

OKR methodology specialist — writes, grades, and iterates Objectives and Key Results, enforces the output-vs-input discipline, calibrates ambition, runs quarterly cadence, and adapts the framework for small teams and startups.

---

**Angel:** [`ai-tools/agents/okr-goal-setting-guardian.md`](../../agents/okr-goal-setting-guardian.md)
**Weapon:** [`ai-tools/skills/okr-goal-setting-weapon/`](../../skills/okr-goal-setting-weapon/)
**Command Brief:** [`ai-tools/command-briefs/okr-goal-setting-guardian-command-brief.md`](../../../command-briefs/okr-goal-setting-guardian-command-brief.md)
**Trigger policy:** proactive

---

## What this Angel owns

`okr-goal-setting-guardian` is the Army's OKR methodology expert. It owns the full OKR lifecycle:

- **OKR authorship:** Writing aspirational Objectives (qualitative, time-bound, memorable) and measurable Key Results that are outputs — not milestones, not activity counts.
- **OKR auditing:** The "are these actually OKRs?" checklist, identifying input-KR anti-patterns, diagnosing KPI-washing and OKR theater.
- **Calibration:** The aspirational vs. committed OKR distinction, the 70% moonshot rule (and when it does NOT apply), sandbagging diagnosis, the 0.0-1.0 scoring scale.
- **Quarterly cadence:** Cycle anatomy (kickoff, baseline lock, mid-quarter check-in, weekly pulse, end-of-quarter scoring + retrospective), the CFR companion practice.
- **Framework disambiguation:** OKRs vs. KPIs vs. MBOs — the key distinctions (compensation linkage, inspiration vs. tracking, leading vs. lagging indicators).
- **Small-team adaptation:** Minimum viable OKR practice for teams of 5-20, when to skip OKRs, the Radical Focus pattern (Wodtke).
- **Tool configuration:** Lattice, 15Five, Weekdone, and Notion OKR field mapping, cycle setup, and check-in workflow guidance.

It does NOT author company strategy, own engineering roadmap planning, or configure goal-tracking tools beyond their OKR-specific surfaces.

## When to invoke

Invoke `okr-goal-setting-guardian` when the user:

- Says "write OKRs", "audit our OKRs", "are these KRs measurable?", "set up a quarterly goal cycle", "grade our OKRs", "OKR for small team".
- Asks "OKR vs. KPI" or "OKR vs. MBO" — wants the framework comparison, not implementation.
- Says "our OKRs are sandbagged" or "we always hit 100% of our goals" — needs calibration coaching.
- Wants to configure OKR fields in Lattice, 15Five, Weekdone, or Notion.
- Describes a team goal-setting problem: too many objectives, input-metric KRs, no mid-quarter check-ins, no retrospectives, or compensation linked to OKR scores.

## Do NOT route when

- The user needs company strategy authored — that is an executive responsibility; this Angel translates strategy into OKRs but does not create it.
- Sprint goal setting, backlog prioritization, or Scrum ceremony coaching is needed — route to `agile-scrum-guardian`.
- Engineering roadmap planning or feature prioritization — route to the relevant domain Angel (`react-guardian`, `python-guardian`, etc.) or `library-guardian` for PRD authorship.
- General project management tooling setup beyond OKR fields (Lattice review cycles, 15Five performance modules, Notion automations) — out of scope; point to the tool's documentation.

## Inputs the Angel needs

- Team/company context: stage (startup / scale-up / enterprise), team size, current goal-setting practice.
- Optional: existing draft OKRs or current goals to audit or improve.
- Optional: the failure mode suspected (sandbagging, input KRs, too many objectives, no cadence, compensation linkage).
- Optional: the OKR tool in use and whether configuration guidance is needed.
- Optional: whether this is a full audit, a write-from-scratch session, or a cadence setup request.

## Outputs the Angel produces

- Annotated OKR set: Objective rewrite + KR rewrites with inline coaching explaining each change.
- Scored OKR audit report (using `templates/okr-audit-report.md`) with per-KR type classification, cadence compliance assessment, and priority recommendations.
- End-of-cycle retrospective session notes (using `templates/okr-retrospective.md`).
- Cadence design: check-in schedule, confidence rating format, scoring convention, and retrospective question set.
- Persistent artefacts land at `library/qa/okr-goal-setting/<date>-<topic>.md` when requested.

## Multi-Angel sequences this Angel participates in

- **Quarterly planning sequence:** `okr-goal-setting-guardian` authors the OKRs → `agile-scrum-guardian` designs the Sprint Goals that support the OKRs → domain Angels (`react-guardian`, `python-guardian`, etc.) own the engineering work the OKRs point at → `library-guardian` stores the OKR artefacts in `library/`.
- **Post-audit follow-up:** After producing an OKR audit report, `quality-guardian` may be invoked to verify that the revised OKRs match the team's stated strategic priorities.

## Critical directives the orchestrator should respect

- Cite Grove or Doerr for every normative claim; the OKR canon is thin and frequently misquoted.
- Never link OKRs to compensation without explicit user instruction; raise it as a risk if the setup implies linkage.
- Always classify each OKR as aspirational or committed before applying the 70% moonshot rule.
- Rewrite input KRs into output KRs on sight; explain why if a defensive exception is warranted.
- Recommend against OKRs when the fit assessment (team size, stage, culture) shows they would add overhead without benefit.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
