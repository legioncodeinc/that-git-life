# Legal Docs Guardian — God's Guide

The God routing skill's record of when to invoke `legal-docs-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/legal-docs-guardian.md`](../../agents/legal-docs-guardian.md)
**Weapon:** [`ai-tools/skills/legal-docs-weapon/`](../../skills/legal-docs-weapon/)
**Command Brief:** [`ai-tools/command-briefs/legal-docs-guardian-command-brief.md`](../../../command-briefs/legal-docs-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`legal-docs-guardian` owns the authoring, generation, and maintenance of the five canonical SaaS legal documents: Terms of Service, Privacy Policy, Data Processing Agreement (DPA), Master Service Agreement (MSA), and Cookie Notice. It uses the "template + lawyer review" path anchored in Termly, Iubenda, and Osano generators. It covers GDPR, CCPA/CPRA, Quebec Law 25, and LGPD compliance postures, and owns the customer-DPA negotiation workflow including the Red Flag / Fallback Matrix triage process.

## Trigger phrases

Route to `legal-docs-guardian` when the user says any of:

- "generate a privacy policy"
- "draft a DPA" / "we need a Data Processing Agreement"
- "set up our Terms of Service" / "review our ToS"
- "review a customer DPA redline" / "customer DPA negotiation"
- "which legal doc generator should I use" / "Termly vs Iubenda"
- "GDPR compliance for SaaS" / "CCPA privacy policy"
- "cookie consent setup" / "cookie banner"
- "what legal documents do we need for launch?"
- "MSA template for enterprise customers"
- "sub-processor list"
- "Quebec Law 25" / "LGPD compliance"

Or when the request involves setting up, auditing, or updating any of the five core SaaS legal documents.

## Do NOT route when

- The user is asking about **technical data-protection controls** (encryption, access controls, breach detection pipelines) — route to `security-guardian`.
- The user is asking about **database schema decisions** for personal-data fields (e.g., "should I store PII in a separate table?") — route to `db-guardian`.
- The user wants **contract negotiation strategy** beyond the DPA (pricing, commercial terms, SLA) — this is a business/legal team concern; surface the limitation.
- The user wants general legal advice on non-data-protection topics (employment law, equity, IP litigation) — out of scope; direct to a qualified attorney.

If a request straddles `legal-docs-guardian` and `security-guardian` (e.g., "what do I need to disclose about our encryption in the privacy policy?"), invoke `legal-docs-guardian` first to capture the documentation requirement, then `security-guardian` to verify the technical controls match what was documented.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- **Document type** requested (ToS, Privacy Policy, DPA, MSA, Cookie Notice, or all)
- **Customer geography** (EU/EEA, California, Quebec, Brazil, US-other) to determine applicable regimes
- **Product data model summary** (what personal data categories are collected) for Privacy Policy and DPA
- **For customer-DPA triage:** the customer's DPA redline (as a file, paste, or description of the requested changes)

If the document type or geography is missing, ask one targeted question rather than proceeding with assumptions.

## Outputs the Angel produces

- **Privacy Policy draft** (markdown for attorney review, or generator workflow walkthrough)
- **Terms of Service draft** with 10-clause checklist completion
- **DPA draft** with all 8 GDPR Article 28(3) sub-clauses and four schedules
- **MSA draft** with 9-section structure
- **Cookie Notice draft** with IAB TCF-categorized cookie list
- **Customer-DPA response memo** (`templates/customer-dpa-response-memo.md`) with Red Flag / Fallback Matrix analysis
- **Compliance posture analysis** for the applicable regime(s)
- All outputs close with the attorney-review invariant

## Multi-Angel sequences this Angel participates in

- **SaaS launch preparation** — `legal-docs-guardian` (documents) → `security-guardian` (verify technical controls match disclosures) → `db-guardian` (verify schema matches data inventory)
- **Enterprise deal close** — `legal-docs-guardian` (DPA triage + MSA review) → business/legal team → counter-redline

## Critical directives the orchestrator should respect

- Always include the attorney-review invariant in every output — do not remove or soften it.
- Do not invoke this Angel for technical compliance controls; that is `security-guardian`'s domain.
- Flag Quebec Law 25 TIA gaps explicitly; neither Termly nor Iubenda covers this as of 2026.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
