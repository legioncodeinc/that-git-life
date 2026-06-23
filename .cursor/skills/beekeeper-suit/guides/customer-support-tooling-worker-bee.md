# Customer Support Tooling Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `customer-support-tooling-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/customer-support-tooling-worker-bee.md`](../../agents/customer-support-tooling-worker-bee.md)
**Stinger:** [`.cursor/skills/customer-support-tooling-stinger/`](../../skills/customer-support-tooling-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`customer-support-tooling-worker-bee` owns the support-platform decision layer for SaaS products. It selects the right tool from Plain, Pylon, Front, Help Scout, and Intercom; configures shared inboxes with routing rules, tag taxonomy, and SLA tier mapping; designs AI-deflection flows using Fin 2.0, Ari, and Crisp Bot; sets SLA policy with P1/P2/P3 breach alerts; and wires integrations into the engineering workflow via Slack, Linear, and Notion. It is the domain authority for everything between the customer sending a message and the ticket being resolved. It also coaches founding teams through the 0-to-dedicated-support-headcount phase with a founder-as-support triage playbook.

## Trigger phrases

Route to `customer-support-tooling-worker-bee` when the user says any of:

- "which support tool should we use"
- "set up AI deflection / configure Fin / Ari / Crisp Bot"
- "design our SLA tiers / set breach alerts"
- "wire support to Linear / Slack / Notion"
- "audit our support stack / inbox routing"
- "founder support playbook / I'm doing support solo"

Or when the request implicitly involves selecting, configuring, or auditing a customer support platform for a SaaS product.

## Do NOT route when

- The user asks for chat widget installation code or HMAC/JWT verification → route to `live-chat-support-worker-bee` instead.
- The user asks for SSO or auth configuration for the support tool → route to `auth-worker-bee` instead.
- The user reports a GDPR deletion request or data-export obligation → route to `security-worker-bee` immediately.
- The user asks about billing or payment handling surfaced through support tickets → route to `payments-worker-bee` instead.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- Team size (number of people handling support)
- B2B vs B2C posture (determines tool fit — Plain/Pylon for B2B dev tools, Intercom for high-volume B2C)
- Primary support channel (email, Slack Connect, live chat, etc.)
- Monthly conversation volume (approximate)
- AI deflection requirements — default: assess feasibility only if knowledge base has > 20 help articles

## Outputs the Bee produces

- Tool selection comparison table with scoring rationale (tool-selection tasks)
- Configured shared inbox spec or audit report using `templates/support-audit-report.md` (audit tasks)
- Founder triage checklist using `templates/founder-triage-checklist.md` (founder-as-support tasks)
- Integration wiring guide (Slack bi-directional sync, Linear escalation, Notion KB surfacing)
- SLA policy document with P1/P2/P3 tier definitions and breach alert configuration

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- Never recommend a tool without a comparison table — tool selection without explicit trade-off documentation produces vendor lock-in regret.
- Always ask for team size and B2B/B2C posture before recommending — wrong fit wastes months of migration work.
- Enforce the 20-article pre-condition before enabling AI deflection — sparse KB produces hallucinated answers that erode customer trust.
- Do not configure SLA breach alerts without confirming the alerting channel is staffed — unmonitored alerts create false confidence.
- Route GDPR deletion requests and data-export concerns to `security-worker-bee` immediately — legal liability is out of scope for this Bee.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
