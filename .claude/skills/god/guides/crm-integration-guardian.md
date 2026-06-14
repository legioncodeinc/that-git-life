# CRM Integration Guardian — God's Guide

The God routing skill's record of when to invoke `crm-integration-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/crm-integration-guardian.md`](../../agents/crm-integration-guardian.md)
**Weapon:** [`ai-tools/skills/crm-integration-weapon/`](../../skills/crm-integration-weapon/)
**Command Brief:** [`ai-tools/command-briefs/crm-integration-guardian-command-brief.md`](../../../command-briefs/crm-integration-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`crm-integration-guardian` owns CRM connectivity: choosing the right integration architecture (native SDK, Merge.dev, Unified.to, Zapier/Make), mapping each CRM's data model and API quirks (HubSpot has no Lead object; Salesforce has Lead/Contact split with a one-way conversion lifecycle; Attio has dynamic attributes), designing bi-directional sync with explicit conflict resolution policies, deduplicating contacts and accounts across systems, and planning lead enrichment (Apollo, Clay, Breeze Intelligence). It covers HubSpot, Salesforce, Pipedrive, Attio, Folk, Close, and Copper. It is calibrated for product teams integrating their SaaS with a CRM -- not for sales ops configuring CRM workflows or for cold email sequence setup.

## Trigger phrases

Route to `crm-integration-guardian` when the user says any of:

- "integrate with HubSpot" / "connect our product to Salesforce"
- "bi-directional CRM sync" / "two-way sync with HubSpot"
- "CRM field mapping" / "how do I map our schema to Salesforce?"
- "Merge.dev or native API?" / "should we use a unified API?"
- "dedup contacts in our CRM" / "we have duplicate contacts"
- "lead enrichment to CRM" / "enrich contacts on write"
- "sync conflict resolution" / "two sources of truth"
- "Salesforce Lead vs Contact" / "when do we convert a Lead?"
- "Attio API production ready?" / "is Attio stable enough for sync?"
- "audit our CRM sync code" / "review our HubSpot integration"
- "which CRM should we integrate first?"

Or when the request implicitly involves connecting a product to a CRM, designing a sync architecture, or resolving CRM data model questions.

## Do NOT route when

- **Cold email sequence design, deliverability, warmup, Apollo list building:** route to `cold-outreach-guardian`. That Angel owns the sequence layer after CRM enrichment.
- **Internal product database schema (Person, Company, Account tables in the product's own DB):** route to `db-guardian`. This Angel maps CRM fields; it does not design internal schemas.
- **Backend sync implementation code (Django/Python/Node.js CRM sync service):** This Angel produces the spec; route coding work to `python-guardian` or the appropriate language guardian.
- **Frontend CRM sync widget, CRM data display in the product UI:** route to `react-guardian`.
- **GDPR data residency, Merge.dev PII storage review, lawful basis for CRM sync:** Flag risk and route to `security-guardian`. This Angel identifies the concern; `security-guardian` audits it.
- **Salesforce CPQ, Marketing Cloud, Apex triggers, enterprise platform complexity:** This Angel covers standard Salesforce REST API and CDC. Escalate complex Salesforce Platform work.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- **CRM target(s):** Which CRM(s) are in scope (HubSpot, Salesforce, Attio, etc.)
- **Sync direction:** Read-only, write-only, or bi-directional
- **Task type:** Architecture selection, field mapping design, bi-directional sync design, dedup strategy, enrichment plan, or code audit
- **Existing integration (if any):** What tools/approach are currently in use
- **Product data objects in scope:** Which objects need to sync (Users, Workspaces, Subscriptions, etc.)

If the task is vague ("help us with our CRM integration"), ask one focused clarifying question: "What's the primary pain point -- choosing the integration approach, designing the sync, or auditing existing code?"

## Outputs the Angel produces

- **Integration spec:** Full markdown spec covering architecture, object/field mapping, conflict resolution, dedup, enrichment, rate limit analysis, and security -- saved to `library/requirements/crm/` or delivered inline
- **Field mapping table:** Per `templates/field-mapping-table.md`
- **Sync design spec:** Per `templates/sync-design-spec.md` for bi-directional integrations
- **Dedup strategy worksheet:** Per `templates/dedup-strategy-worksheet.md`
- **Code audit report:** Per `templates/code-audit-checklist.md` with severity-tagged findings

## Multi-Angel sequences this Angel participates in

- **CRM integration + cold outreach:** `crm-integration-guardian` designs the enriched CRM write path; `cold-outreach-guardian` designs sequences using the enriched CRM data. Hand off after the integration spec is complete.
- **CRM integration + product schema design:** `db-guardian` designs the internal Person/Workspace/Subscription schema; `crm-integration-guardian` designs the mapping from that schema to the CRM. Run `db-guardian` first.
- **CRM integration + implementation:** `crm-integration-guardian` produces the spec; `python-guardian` (or `react-guardian`) implements it. The spec is the input to the implementation phase.
- **CRM integration + GDPR review:** `crm-integration-guardian` flags PII residency concerns (Merge.dev data storage, cross-border sync); `security-guardian` audits the compliance posture.

## Critical directives the orchestrator should respect

- Map the CRM data model first -- never let field mapping or sync design proceed without confirming the target CRM's object model.
- Conflict resolution policy must be defined before bi-directional sync is declared designed.
- State the Merge.dev pricing trade-off ($1.17M/year at 500 customers/3 CRMs) before recommending a unified API layer.
- Clearbit standalone API is deprecated for non-HubSpot stacks -- recommend Apollo or Clay instead.
- Consent and Do Not Contact flags apply "most restrictive wins" -- this is non-negotiable and cannot be overridden by the user's sync direction preference.

(Full list lives in `crm-integration-guardian.md`'s `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
