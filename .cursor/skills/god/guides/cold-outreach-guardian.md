# Cold Outreach Guardian — God's Guide

The God routing skill's record of when to invoke `cold-outreach-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/cold-outreach-guardian.md`](../../agents/cold-outreach-guardian.md)
**Weapon:** [`ai-tools/skills/cold-outreach-weapon/`](../../skills/cold-outreach-weapon/)
**Command Brief:** [`ai-tools/command-briefs/cold-outreach-guardian-command-brief.md`](../../../command-briefs/cold-outreach-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`cold-outreach-guardian` owns the full cold outreach stack for founder-led B2B sales: tool selection and configuration (Apollo, Clay, Smartlead, Instantly, Lemlist), email infrastructure and deliverability (separate sending domains, SPF/DKIM/DMARC, warmup, volume ramp), multi-touch sequence design (3-5 steps, under 80 words, single CTA per step), AI personalization without slop (Clay Claygent SKIP rule, 1-in-1000 test), reply handling and disqualification, and list hygiene (ICP definition, email verification, catch-all handling, GDPR flag discipline). It is calibrated for founders running outreach themselves with 0-2 person sales teams, and it is opinionated: if the setup will land in spam, it says so; if the sequence has too many steps or the AI personalization is generic, it cuts it.

## Trigger phrases

Route to `cold-outreach-guardian` when the user says any of:

- "set up cold outreach" / "start cold email"
- "my cold email lands in spam" / "deliverability problem"
- "write a cold email sequence" / "build an outbound sequence"
- "set up Clay personalization" / "Clay waterfall"
- "Apollo vs Instantly" / "Smartlead or Instantly?" / "which cold email tool"
- "my reply rate is below 2%" / "no one is replying to my cold email"
- "cold email warmup" / "domain warmup setup"
- "clean my outreach list" / "verify my email list"
- "Claygent personalization" / "AI personalization for cold email"
- "ICP definition for outreach" / "who should I cold email"

Or when the request implicitly involves cold outreach infrastructure, sequence design, or B2B email list building.

## Do NOT route when

- **Inbound SDR workflows or AE discovery call scripts:** different discipline and tooling, no peer Angel today; handle inline or flag as out of scope.
- **CRM architecture (HubSpot/Salesforce schema, pipeline stages, automation):** route to `db-guardian` for schema; no CRM-specific Angel today.
- **GDPR/CCPA compliance audit for cold email:** `cold-outreach-guardian` flags the risk; route the compliance audit to `security-guardian`.
- **LinkedIn content strategy or paid acquisition:** out of scope; no peer Angel today.
- **Enterprise SDR team operations at scale (Salesforce sequences, 50+ rep outreach programs):** this Angel is calibrated for founder-led outreach; flag the mismatch and adjust recommendations accordingly or handle inline.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- **Task classification:** is this an infrastructure fix, sequence build, Clay setup, list hygiene, tool selection, or diagnostics investigation?
- **Current stack (optional):** which tools are already in use, what sending domains exist, whether warmup is running
- **ICP description (for sequence builds):** target industry, company size, job title, and buying trigger
- **Current sequence (for audits):** the existing email copy, cadence, and step structure
- **Specific problem (optional):** deliverability tanking, reply rate below 2%, sequence performance, etc.

If the task is vague ("help with cold email"), ask one focused clarifying question before proceeding.

## Outputs the Angel produces

- **Sequence build:** markdown file with subject lines, body copy for all steps, cadence table (step, channel, delay, goal)
- **Deliverability audit:** numbered findings list with severity (blocking / degraded / advisory), each actionable
- **Clay personalization template:** waterfall formula structure, Claygent prompt with SKIP rule, QA criteria
- **Tool setup guide:** step-by-step configuration for Smartlead/Instantly or Apollo
- **Diagnostics report:** root cause identification for performance drop + ordered fix steps
- **Inline reply** for quick audits; file at `library/requirements/outreach/` for full sequence builds

## Multi-Angel sequences this Angel participates in

- **Cold outreach + CRM schema design:** `cold-outreach-guardian` specifies the fields (lead status, reply category, sequence name, follow-up date); `db-guardian` designs the table schema.
- **Cold outreach + GDPR compliance:** `cold-outreach-guardian` flags EU contacts and the specific risk; `security-guardian` audits the compliance posture.
- **GTM strategy + outreach implementation:** `library-guardian` authors the ICP/GTM PRD; `cold-outreach-guardian` implements the outreach program against it.

## Critical directives the orchestrator should respect

- Assess deliverability infrastructure before touching copy or sequences — infrastructure failures make all optimization irrelevant.
- Separate sending domains are non-negotiable; if the user is sending from their primary domain, address this before anything else.
- Flag EU/GDPR cold outreach risks explicitly and route to `security-guardian` — never provide legal advice.
- Reply rate (positive replies / emails sent) is the only valid success metric; correct any report that uses open rates as primary KPI.

(Full list lives in `cold-outreach-guardian.md`'s `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
