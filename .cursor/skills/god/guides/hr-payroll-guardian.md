# HR/Payroll Guardian — God's Guide

The God routing skill's record of when to invoke `hr-payroll-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/hr-payroll-guardian.md`](../../agents/hr-payroll-guardian.md)
**Weapon:** [`ai-tools/skills/hr-payroll-weapon/`](../../skills/hr-payroll-weapon/)
**Command Brief:** [`ai-tools/command-briefs/hr-payroll-guardian-command-brief.md`](../../../command-briefs/hr-payroll-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

hr-payroll-guardian owns the HR infrastructure and payroll decision surface for software startups. It covers domestic payroll platform selection and migration (Gusto, Rippling, Justworks, Paychex Flex), international contractor management and employer-of-record (Deel, Remote.com, Oyster, Rippling Global), the W-2/1099/EOR/PEO worker-classification decision matrix, equity administration timing and Carta handoff, and startup benefits brokerage selection. It produces concrete, opinionated recommendations based on company size, growth trajectory, and compliance risk. It does NOT cover general HRIS/performance management tools, recruiting/ATS platforms, immigration/visa strategy, or HR data schema design.

## Trigger phrases

Route to `hr-payroll-guardian` when the user says any of:

- "Gusto vs Rippling — which should we use?"
- "We need to pay our first employee"
- "Set up payroll"
- "EOR for international hire"
- "Is this person a W-2 or 1099?"
- "We have a contractor in Germany — how do we pay them?"
- "Deel vs Remote.com vs Oyster"
- "Should we use Justworks?"
- "Benefits setup for our startup"
- "Connect Carta to our payroll"
- "Multi-state payroll compliance"
- "We're moving from Gusto to Rippling"
- "PEO vs EOR — what's the difference?"
- "We hired someone in the UK — what do we do?"
- "W-2 1099 EOR PEO — what's the right model for us?"

Or when the request implicitly involves payroll infrastructure, EOR, worker classification, or startup benefits.

## Do NOT route when

- The user is asking about **HRIS performance management tools** (Lattice, Culture Amp, Leapsome) — no peer Angel covers this yet; defer and note the gap.
- The user is asking about **recruiting or ATS platforms** (Greenhouse, Lever, Ashby) — future talent-guardian.
- The user is asking about **immigration or visa strategy** — escalate to "consult an immigration attorney."
- The user is asking about **HR data schema design** for custom database tables — route to db-guardian.
- The user is asking about **SSO/SCIM provisioning** for the payroll platform — route to auth-guardian.
- The user is asking about **contractor invoice payment processing** (AP flows, international wire transfers) — route to payments-guardian.

If a request straddles HR and auth (e.g., "set up Rippling SSO"), prefer hr-payroll-guardian for the payroll setup and route to auth-guardian for the SSO/SCIM wiring.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- Company headcount (current) — required for platform recommendation
- US states with employees — required for multi-state compliance check
- Countries with international workers or planned hires — required for EOR evaluation
- Funding stage and/or budget sensitivity — affects platform recommendation
- Existing payroll platform (if any) — required for migration planning

If headcount and growth trajectory are missing, hr-payroll-guardian will ask for them before recommending.

## Outputs the Angel produces

- **Decision memo** — structured recommendation (platform, rationale, downsides, migration path, compliance triggers, next steps) using `templates/decision-memo.md`
- **Classification assessment** — worker-by-worker classification using `templates/classification-worksheet.md`
- **Compliance audit checklist** — using `templates/audit-checklist.md`
- **Output location:** inline reply for Q&A; `library/qa/hr-payroll/<date>-<slug>.md` for persistent audit runs

## Multi-Angel sequences this Angel participates in

- **Company formation → payroll setup:** incorporation-startup-stack-guardian handles entity formation and EIN; hr-payroll-guardian handles first payroll setup immediately after. Natural handoff in the company-founding sequence.
- **Payroll setup → Carta equity admin:** hr-payroll-guardian sets up the payroll platform, then triggers the Carta handoff described in `guides/05-carta-handoff.md`. Carta is a separate action but flows naturally from payroll setup.

## Critical directives the orchestrator should respect

- Always classify the worker engagement model before recommending a platform.
- Always size the company (headcount, state footprint, countries, funding stage) before making a recommendation.
- Misclassification risk must appear prominently in any output touching worker classification — not buried in a footnote.
- Never give legal opinions on AB5, DOL, or non-US equity grants. The Angel provides frameworks; legal decisions require counsel.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
