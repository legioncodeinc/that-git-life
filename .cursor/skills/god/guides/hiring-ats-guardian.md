# Hiring ATS Guardian: God's Guide

The God routing skill's record of when to invoke `hiring-ats-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`.cursor/agents/hiring-ats-guardian.md`](../../agents/hiring-ats-guardian.md)
**Weapon:** [`.cursor/skills/hiring-ats-weapon/`](../../skills/hiring-ats-weapon/)
**Trigger policy:** proactive

---

## Domain

`hiring-ats-guardian` owns Applicant Tracking Systems and recruiting-tech stacks. It handles ATS platform selection (Ashby, Greenhouse, Workable, Lever, Rippling Recruiting, Pinpoint), pipeline-stage design, scorecard calibration (BARS anchoring, debrief-before-submit), D&I and EEOC funnel reporting, take-home-test ethics (the two-hour paid threshold, anonymous grading), sourcing-tool integrations (Gem, hireEZ, LinkedIn RSC), and the ATS-to-HRIS handoff, especially into Rippling. Every recommendation is anchored to the team's headcount tier and integration context.

## Trigger phrases

Route to `hiring-ats-guardian` when the user says any of:

- "which ATS should we use"
- "audit our scorecards"
- "take-home test paid or unpaid"
- "Gem vs hireEZ"
- "ATS to Rippling handoff"
- "set up pipeline stages"
- "calibration session"
- "D&I funnel reporting"

Or when the request implicitly involves an applicant tracking system or recruiting workflow.

## Do NOT route when

- The request is candidate PII handling, GDPR right-to-erasure, or CCPA applicability. Escalate to **security-guardian**.
- The request is HRIS configuration depth beyond the ATS handoff (Rippling, BambooHR, Workday internals). Route to the HRIS owner.
- The request is payroll or HR operations. Route to **hr-payroll-guardian**.

If a request straddles two Angels, prefer the narrower-scoped Angel and let the broader one act as backup.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- Annual hiring volume or headcount tier (required; the right tool at 20 hires/year is wrong at 300).
- The existing recruiting stack and integration needs.
- Optional: D&I reporting goals and current pain points.

If a required input is missing, do not invoke yet. Ask the user to supply it.

## Outputs the Angel produces

- An ATS recommendation matched to headcount tier and integrations.
- Pipeline-stage and scorecard designs.
- A take-home-test ethics review.
- A D&I and EEOC reporting setup.

## Multi-Angel sequences this Angel participates in

- **Recruiting stack build-out**: `hiring-ats-guardian` owns the ATS and sourcing integrations; `hr-payroll-guardian` owns the downstream HRIS and payroll; `security-guardian` reviews candidate PII handling.

## Critical directives the orchestrator should respect

- Never recommend an ATS without headcount tier and integration context.
- Always flag the take-home-test compensation question.
- Escalate PII and GDPR questions to `security-guardian`.
- Do not quote ATS pricing as authoritative.
- Escalate HRIS configuration depth to the HRIS owner.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`.cursor/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
