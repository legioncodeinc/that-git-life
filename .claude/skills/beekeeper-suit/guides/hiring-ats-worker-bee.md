# Hiring ATS Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `hiring-ats-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/hiring-ats-worker-bee.md`](../../agents/hiring-ats-worker-bee.md)
**Stinger:** [`.cursor/skills/hiring-ats-stinger/`](../../skills/hiring-ats-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`hiring-ats-worker-bee` owns the full Applicant Tracking System surface for engineering teams, TA ops leads, and founders. It covers platform selection and migration across the six primary 2026 ATS platforms (Ashby, Greenhouse, Workable, Lever, Rippling Recruiting, Pinpoint), pipeline-stage architecture, scorecard design and calibration using BARS anchoring and the debrief-before-submit protocol, D&I and EEOC funnel reporting, take-home assessment ethics (the 2-hour paid threshold, anonymous grading), and sourcing-tool integration wiring (LinkedIn Recruiter, Gem, hireEZ). It also owns the ATS-to-HRIS handoff, especially the Rippling offer-to-hire flow, including the Greenhouse Harvest API v3 migration deadline of August 31, 2026. It never recommends an ATS without knowing headcount tier and integration context first.

## Trigger phrases

Route to `hiring-ats-worker-bee` when the user says any of:

- "Which ATS should we use?" / "ATS comparison" / "Ashby vs Greenhouse"
- "Audit our scorecards" / "Our scorecards aren't being used consistently"
- "Our take-home test is too long" / "Should we pay for take-home tests?"
- "Gem vs hireEZ" / "How do we integrate Gem with our ATS?"
- "ATS to Rippling handoff" / "ATS to HRIS offer letter flow"
- "D&I funnel reporting" / "EEOC reporting" / "Diversity funnel metrics"
- "Set up our pipeline stages" / "How many interview stages should we have?"
- "Calibration session" / "Structured interviews"

Or when the request implicitly involves ATS platform decisions, hiring pipeline configuration, scorecard quality, take-home assessment design, or the offer-to-hire data handoff between recruiting and HR systems.

## Do NOT route when

- The request is about **job description writing** — this is out of scope for this Bee; suggest appropriate JD-writing resources.
- The request is about **compensation benchmarking** — no Bee owns this yet; flag as out of scope.
- The request is about **deep HRIS configuration** beyond the ATS handoff interface (e.g., setting up Rippling payroll groups, departments, compensation bands, or benefits plans) — escalate to `hris-worker-bee` when available.
- The request is about **candidate PII, GDPR right-to-erasure, or data residency** — escalate to `security-worker-bee`.
- The request is a **specific EEOC adverse impact liability or AEDT bias audit jurisdiction legal question** — surface the issue but direct the user to verify with legal counsel.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- **Current ATS state** — "no ATS yet", "evaluating platforms", "have an ATS and want to improve it", or a named specific pain point (required; the Bee will ask if missing)
- **Headcount and hiring velocity** — approximately how many hires per year (~10, 50-200, 200+) (required; wrong answer here produces wrong platform recommendation)
- **HRIS in use** — Rippling, BambooHR, Workday, none, or other (required; determines handoff complexity and whether Rippling Recruiting shortcut applies)
- **Specific ATS platform names** — if the user is asking about a named platform (optional; narrows which guide to open first)

## Outputs the Bee produces

- **Structured advice or decision tree** — for conversational requests (pipeline design, scorecard calibration, sourcing integrations), delivered inline with tables, numbered lists, or decision trees
- **ATS audit report** — for platform selection and full audits, produced using `templates/ats-audit-report.md` covering all seven domains
- **BARS-anchored scorecard** — for scorecard design requests, produced using `templates/scorecard-template.md`
- **Escalation flag** — surfaces `security-worker-bee` or `hris-worker-bee` handoff whenever PII/GDPR or deep HRIS scope is encountered

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`
- ATS integration work involving candidate PII → hand off to `security-worker-bee` for GDPR/data-residency review
- ATS-to-HRIS handoff configuration beyond the offer interface → hand off to `hris-worker-bee`

## Critical directives the orchestrator should respect

- **Never recommend an ATS without first confirming headcount tier and integration context.** The right platform at 20 hires/year is wrong at 300 hires/year; recommending without context produces advice that will need to be undone.
- **Always surface the take-home-test compensation question**, even if the user did not ask. Unpaid assessments over ~2 hours carry significant candidate-experience and equity risk (59% of candidates skip postings with lengthy unpaid take-homes).
- **Do not quote specific ATS pricing as authoritative.** All pricing is custom-quoted or frequently revised; give ranges with "verify with vendor" notes.
- **Proactively flag the Greenhouse Harvest API v1/v2 deprecation** (unavailable after August 31, 2026) any time the user mentions Greenhouse integrations.
- **Escalate PII/GDPR questions to `security-worker-bee`** — candidate data is PII; GDPR right-to-erasure for applicants is outside this Bee's scope.
- **Escalate HRIS configuration depth to `hris-worker-bee`** — Rippling, BambooHR, and Workday configuration beyond the ATS handoff interface is a distinct domain.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
