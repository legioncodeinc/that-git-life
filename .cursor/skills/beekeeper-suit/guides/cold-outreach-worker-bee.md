# Cold Outreach Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `cold-outreach-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/cold-outreach-worker-bee.md`](../../agents/cold-outreach-worker-bee.md)
**Stinger:** [`.cursor/skills/cold-outreach-stinger/`](../../skills/cold-outreach-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`cold-outreach-worker-bee` is the Legion Army's outbound sales specialist for founder-led B2B cold email. It owns the full cold outreach stack: tool selection and configuration (Apollo, Clay, Smartlead, Instantly, Lemlist), email infrastructure and deliverability (separate sending domains, SPF/DKIM/DMARC, warmup, volume ramp), multi-touch sequence design (3-5 steps, under 80 words, single CTA), AI personalization without slop (Clay Claygent SKIP rule, 1-in-1000 test), reply handling and disqualification, and list hygiene (ICP definition, verification, catch-all handling, GDPR flag discipline). This Bee is calibrated for founders running outreach themselves with 0-2 person sales teams, not enterprise SDR organizations. Reply rate is the only metric it respects — open rates are noise since Apple MPP.

## Trigger phrases

Route to `cold-outreach-worker-bee` when the user says any of:

- "set up cold outreach"
- "my cold email lands in spam"
- "write a cold email sequence"
- "set up Clay personalization"
- "Apollo vs Instantly"
- "my reply rate is below 2%"
- "cold email warmup setup"
- "clean my outreach list"
- "Smartlead or Instantly?"
- "build an outbound sequence for [ICP]"

Or when the request implicitly involves cold email infrastructure, deliverability, AI personalization for outbound, list hygiene, reply classification, or B2B outbound tool selection.

## Do NOT route when

- The request is about inbound SDR workflows — this Bee only covers outbound cold email, not inbound lead qualification or SDR processes.
- The request involves CRM architecture, Salesforce/HubSpot schema design, lead status fields, or sequence tracking field design — route to `db-worker-bee`.
- The request is about GDPR/CCPA compliance audits, lawful basis for cold contact, or EU privacy law — route to `security-worker-bee`.
- The request covers AE discovery call scripts, demo scripting, or account expansion — out of scope for this Bee entirely.
- The request is about LinkedIn content strategy or paid acquisition — out of scope.
- The request involves GTM strategy or target market definition at the strategic level — route to `library-worker-bee` for PRD authorship.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- The outreach goal or problem statement (e.g., "emails landing in spam", "need a sequence for VP Eng at B2B SaaS", "set up Clay waterfall")
- ICP description — industry, company size, title, and buying trigger (if building a sequence or list; Bee will prompt with the ICP worksheet if absent)
- Current tool stack (Apollo, Instantly, Smartlead, Clay, Lemlist — whichever applies; optional, Bee will ask during tool selection tasks)
- Whether EU/EEA contacts are in scope — optional, but Bee will flag GDPR risk if the region is mentioned or implied

## Outputs the Bee produces

- Sequence copy deliverable — full markdown file with all steps, subject lines, body copy, and spacing table (for sequence build tasks)
- Deliverability audit report — numbered findings list with severity ratings (blocking / degraded / advisory) for infrastructure fix tasks
- Clay personalization formula — waterfall enrichment structure and Claygent prompt with SKIP rule applied
- ICP definition and verified list hygiene recommendations using the ICP definition worksheet
- Tool selection recommendation with stack rationale drawn from the 2026 founder stack decision matrix

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` (for EU/GDPR flag review) then `quality-worker-bee`
- CRM schema handoff — when reply tracking fields or lead status schema are needed, hands off cleanly to `db-worker-bee`
- GTM strategy handoff — when ICP definition is strategic rather than operational, routes to `library-worker-bee` for PRD authorship before implementing

## Critical directives the orchestrator should respect

- **Deliverability before copy** — always run the deliverability audit checklist before touching sequence copy. Infrastructure failures make perfect copy irrelevant.
- **Separate sending domains are non-negotiable** — if the user is sending from their primary domain, stop and fix this before anything else. Deliverability damage to the primary domain is irreversible.
- **AI personalization must pass the 1-in-1000 test** — Clay Claygent SKIP rule is the operational implementation: return "SKIP" if no specific insight is found; never generate a generic opener.
- **Never recommend more than 5 steps for cold SMB sequences** — 3-step sequences generate the highest per-sequence reply rate (9.2%); steps 6+ produce near-zero positive replies and burn sender reputation.
- **Reply rate is the canonical metric** — open rates are fabricated by Apple MPP since 2021; always use reply rate (positive replies / emails sent) as the KPI.
- **Flag EU/GDPR cold outreach risks explicitly** — cold email to EU prospects without legitimate interest documentation is non-compliant; flag and route to `security-worker-bee`, never provide legal advice.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
