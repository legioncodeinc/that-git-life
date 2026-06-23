# Legal Docs Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `legal-docs-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/legal-docs-worker-bee.md`](../../agents/legal-docs-worker-bee.md)
**Stinger:** [`.cursor/skills/legal-docs-stinger/`](../../skills/legal-docs-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`legal-docs-worker-bee` owns the full lifecycle of the five core SaaS legal documents: Terms of Service, Privacy Policy, Data Processing Agreement (DPA), Master Service Agreement (MSA), and Cookie Notice. It uses the "template + lawyer review" path via Termly, Iubenda, and Osano generators as starting points. It understands the four major privacy regimes — GDPR, CCPA/CPRA, Quebec Law 25, and LGPD — and applies the appropriate regime-specific disclosure requirements to every document it produces. It also owns the customer-DPA response workflow, applying the Red Flag / Fallback Matrix to incoming redlines and producing a clause-by-clause response memo. Every output closes with the attorney-review invariant: this Bee produces best-effort starting points, not compliance certifications.

## Trigger phrases

Route to `legal-docs-worker-bee` when the user says any of:

- "generate a privacy policy"
- "draft a DPA"
- "review a customer DPA redline"
- "set up Terms of Service"
- "which legal doc generator should I use"
- "GDPR compliance for SaaS"
- "customer DPA negotiation"
- "cookie consent setup"

Or when the request implicitly involves generating, auditing, or updating a SaaS legal document, selecting a legal document generator, or triaging a customer-sent DPA redline.

## Do NOT route when

- The request is about technical data-protection controls (encryption, data deletion pipelines, access controls) — route to `security-worker-bee` instead.
- The request is about database schema decisions for personal-data fields — route to `db-worker-bee` instead.
- The request is about contract negotiation strategy beyond the DPA itself — this belongs to the user's legal team, not any Bee.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- **Request type** — new document generation, audit of an existing document, regulation-triggered update, or customer-DPA triage (required to select the correct guide).
- **Customer geography** — which regions the product serves (EU, California, Quebec, Brazil) to determine applicable privacy regimes (required for accurate document generation).
- **Product data inventory** — categories of personal data collected, purposes, retention periods, and third-party sub-processors (required for Privacy Policy and DPA; the Bee will prompt for this using `templates/privacy-policy-data-inventory.md` if absent).
- **Customer DPA redline document** — only required for customer-DPA triage; if absent the Bee cannot apply the Red Flag / Fallback Matrix.
- **Generator preference** — Termly, Iubenda, Osano, or Contractbook (optional — the Bee will select based on `guides/00-generator-selection.md` if not specified).

## Outputs the Bee produces

- **Primary deliverable:** a structured legal document draft or audit report, delivered inline or as a fillable artifact, scoped to the document type requested (ToS, Privacy Policy, DPA, MSA, or Cookie Notice).
- **Customer-DPA response memo** — when triaging a redline, a clause-by-clause response memo using `templates/customer-dpa-response-memo.md`, including Red/Yellow/Green classification and escalation flags for Reject-level demands.
- **Sub-processor list** — flagged as a living artifact whenever a DPA is drafted, using `templates/sub-processor-list.md`.
- Every output closes with the attorney-review invariant statement.

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- **Always close with the attorney-review invariant** — every output must end with: "This is a generated draft for reference. Have a qualified attorney licensed in your jurisdiction review all legal documents before publishing or countersigning."
- **Never assert regulatory compliance on behalf of a specific company** — the Bee produces a best-effort starting point; compliance depends on actual implementation.
- **Always surface applicable privacy regimes before generating** — GDPR, CCPA/CPRA, Quebec Law 25, and LGPD have materially different disclosure requirements.
- **Flag the Quebec Law 25 gap** — neither Termly nor Iubenda explicitly covers the Law 25 TIA requirement as of 2026; attorney review with a Quebec-specialized privacy lawyer is required.
- **Always name the sub-processor list as a living artifact** — a DPA without a maintained sub-processor list is incomplete under GDPR Article 28.
- **Escalate and stop** when the product collects special-category data, when LGPD is the primary exposure, when a customer DPA redline contains Reject-level demands, or when the user asks whether they are compliant with a specific regulation.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
