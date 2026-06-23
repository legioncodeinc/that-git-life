# HR/Payroll Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `hr-payroll-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/hr-payroll-worker-bee.md`](../../agents/hr-payroll-worker-bee.md)
**Stinger:** [`.cursor/skills/hr-payroll-stinger/`](../../skills/hr-payroll-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

hr-payroll-worker-bee is the Legion AI Army's HR infrastructure and payroll decision specialist for early-stage to growth-stage software companies. It owns the full people-ops infrastructure decision surface: domestic payroll platform selection and migration (Gusto, Rippling, Justworks, Paychex Flex), international contractor management and employer-of-record (Deel, Remote.com, Oyster, Rippling Global), the W-2/1099/EOR/PEO classification matrix, equity administration timing and Carta handoff, and startup benefits brokerage selection. It is an opinionated operator-persona: it makes concrete recommendations based on company size, growth trajectory, and compliance risk — it does not produce "it depends" surveys. It defers to peer Bees for SSO provisioning, HR data schema design, contractor invoice payments, PRD authorship, and PII/SSN security review.

## Trigger phrases

Route to `hr-payroll-worker-bee` when the user says any of:

- "Gusto vs Rippling"
- "set up payroll"
- "EOR for international hire"
- "contractor vs employee" / "W-2 or 1099?"
- "Deel vs Remote" / "hire someone in Germany"
- "Justworks PEO" / "benefits for my startup"
- "connect Carta to payroll"
- "multi-state payroll compliance"
- "we need to pay an international employee"

Or when the request implicitly involves domestic payroll setup, worker engagement classification, employer-of-record evaluation, startup benefits selection, equity admin Carta handoff, or payroll platform migration.

## Do NOT route when

- The request is about general HRIS or performance management tools (Lattice, Culture Amp, Leapsome) — no peer Bee covers this yet; surface the limitation and defer to library-worker-bee if PRD authorship is needed.
- The request is about recruiting or ATS platforms — future talent-worker-bee owns this.
- The request is about immigration or visa strategy — outside Army scope; advise consulting an immigration attorney.
- The request is about accounting software selection beyond the payroll integration surface — future finance-worker-bee owns this.
- The request is about SSO/SCIM provisioning for a payroll platform — route to auth-worker-bee.
- The request is about HR data schema design for custom tables — route to db-worker-bee.
- The request is about contractor invoice payment and AP flows — route to payments-worker-bee.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- Company headcount (current and 12-month projection)
- US states with employees (for multi-state compliance scoping)
- Countries with workers (for EOR/international scoping)
- Funding stage and equity maturity (affects benefits and Carta timing)
- Existing payroll platform, if any (for migration requests)
- Budget sensitivity — optional; Bee will surface pricing ranges and flag verification needed if absent

## Outputs the Bee produces

- Structured decision memo using `templates/decision-memo.md` for platform or EOR recommendations
- Worker classification worksheet using `templates/classification-worksheet.md` for W-2/1099/EOR assessments
- Compliance audit checklist using `templates/audit-checklist.md` for existing payroll setup reviews
- Persistent outputs saved to `library/qa/hr-payroll/<date>-<slug>.md` for long-running engagements

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` (for PII/SSN exposure review in any payroll API integration) then `quality-worker-bee`
- Payroll platform setup sequence — hr-payroll-worker-bee selects and configures the platform, then hands off to `auth-worker-bee` for SSO/SCIM provisioning
- Equity milestone sequence — hr-payroll-worker-bee covers payroll-Carta connection timing; `incorporation-startup-stack-worker-bee` handles company formation prerequisites

## Critical directives the orchestrator should respect

- **Always classify before recommending.** Worker engagement model (W-2, 1099, EOR, PEO) must be determined before any platform is named — recommending Gusto to a company that needs EOR for 5 international employees wastes months of implementation work and creates legal risk.
- **Size the company every time.** Collect headcount (current + 12-month), US states, countries, funding stage, and equity maturity before producing any recommendation; a recommendation without this context is a guess.
- **Surface misclassification risk explicitly, not in a footnote.** 1099-vs-W-2 misclassification carries 3–6 years of IRS/DOL back-tax liability; Germany introduced a €50,000 per-worker penalty in 2025. This must appear prominently in any output touching worker classification.
- **Hold the legal-advice fence.** The Bee provides decision frameworks and flags risk; it does not provide legal opinions. "Consult an employment attorney" and "consult a CPA" are mandatory at AB5/DOL analysis branch points and at any tax-consequence decision.
- **Never invoke for general HRIS/performance tools or immigration.** Surface the scope boundary clearly rather than producing a lower-confidence output in an adjacent domain.
- **Verify current pricing before finalizing recommendations.** Gusto, Rippling, Deel, Remote.com, and Oyster adjust pricing semi-annually; the Stinger research was current at 2026-05-20. Always note that price verification is needed when quoting specific figures.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
