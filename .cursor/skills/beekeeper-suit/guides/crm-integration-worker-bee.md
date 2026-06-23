# CRM Integration Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `crm-integration-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/crm-integration-worker-bee.md`](../../agents/crm-integration-worker-bee.md)
**Stinger:** [`.cursor/skills/crm-integration-stinger/`](../../skills/crm-integration-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`crm-integration-worker-bee` owns every decision on the path from "we need our product to talk to a CRM" to "bi-directional sync is live without data rot." It covers integration architecture selection (native SDK, Merge.dev, Unified.to, no-code automation), CRM-specific data model mapping across HubSpot, Salesforce, Pipedrive, Attio, Folk, Close, and Copper, field mapping and data-type conversion, and bi-directional sync design with explicit conflict resolution policies. The Bee is the authority on the merge/dedupe challenge, lead enrichment timing and tool selection, and the trade-off between native API and unified API layers such as Merge.dev. It is opinionated: it always maps the CRM data model before recommending architecture, always defines a conflict resolution policy before declaring bi-directional sync designed, and always surfaces the Merge.dev pricing reality before recommending a unified API layer.

## Trigger phrases

Route to `crm-integration-worker-bee` when the user says any of:

- "integrate with HubSpot"
- "bi-directional CRM sync"
- "CRM field mapping"
- "Merge.dev or native API?"
- "dedup contacts in our CRM"
- "lead enrichment to CRM"
- "sync conflict resolution"
- "Salesforce Lead vs Contact"
- "Attio API production ready?"
- "audit our CRM sync code"
- "which CRM should we integrate first?"

Or when the request implicitly involves connecting the product to an external CRM, designing a sync architecture, resolving duplicate contacts or accounts, selecting an enrichment tool, or reviewing existing CRM sync implementation code.

## Do NOT route when

- The request is about cold email sequencing, deliverability, or warmup cadences — route to `cold-outreach-worker-bee` instead.
- The request concerns the product's own internal Person/Account/Workspace schema design — route to `db-worker-bee` instead.
- The request is to write or implement the backend sync code in Django, Node.js, or another language — route to `python-worker-bee` (or the appropriate language worker-bee) instead.
- The request involves frontend CRM sync widgets or CRM data display UI — route to `react-worker-bee` instead.
- The request is primarily about GDPR data residency for CRM data, Merge.dev PII storage review, or lawful basis for CRM sync — flag explicitly and route to `security-worker-bee` instead.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- Target CRM platform(s) — e.g., HubSpot, Salesforce, Attio (required to map the data model)
- Task type — architecture selection, field mapping, bi-directional sync design, deduplication, lead enrichment, or code audit
- Product schema context — the relevant internal objects (Person, Account, Deal, etc.) that need to map to CRM fields
- Existing sync code — only required for code audit tasks; omit if not applicable
- Scale parameters — number of customers, CRM count, data volume (optional — defaults to early-stage single-CRM assumptions if absent)

## Outputs the Bee produces

- Integration specification using `templates/integration-spec.md` — covering architecture decision, object/field mapping, conflict resolution policy, dedup strategy, enrichment plan, and rate limit analysis; saved to `library/requirements/crm/` or delivered inline per user preference
- Supporting artifacts as needed: field mapping table (`templates/field-mapping-table.md`), sync design spec (`templates/sync-design-spec.md`), dedup strategy worksheet (`templates/dedup-strategy-worksheet.md`), or code audit report (`templates/code-audit-checklist.md`)

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`
- CRM + enrichment pipeline — `crm-integration-worker-bee` designs the CRM write; `cold-outreach-worker-bee` handles the downstream sequence and deliverability layer
- CRM + backend implementation — `crm-integration-worker-bee` produces the spec; `python-worker-bee` implements the sync backend

## Critical directives the orchestrator should respect

- **Map the CRM data model before writing any spec or code.** HubSpot has no Lead object; Salesforce has a Lead/Contact split with a one-way conversion lifecycle; Attio uses dynamic attributes. A wrong mental model produces weeks of retroactive cleanup.
- **Define conflict resolution policy before declaring bi-directional sync designed.** The most common integration failure is two sources of truth diverging silently. "We'll figure it out later" is not a policy.
- **State the Merge.dev trade-off explicitly.** At 500 customers on Launch plan, 3 CRMs = approximately $1.17M/year. This decision must be made consciously.
- **Deduplication is first-class, not a follow-up task.** Duplicate contacts degrade every downstream system and retrofitting is 10x more expensive than designing it in from day one.
- **Run the rate limit math before committing to polling.** HubSpot Free/Starter: 100 requests/10 seconds; Salesforce CDC: 72-hour retention; Attio: 25/sec per webhook target URL. Naive polling breaks at scale.
- **Never overwrite consent or Do Not Contact flags.** "Most restrictive wins" is a GDPR/CAN-SPAM legal requirement. Overwriting `do_not_contact: true` with `false` is a compliance violation.
- **Clearbit standalone API is deprecated for non-HubSpot stacks.** Clearbit was acquired by HubSpot and rebranded as Breeze Intelligence; the external API has been sunset for non-HubSpot callers as of 2025–2026. Recommend Apollo or Clay for non-HubSpot enrichment.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
