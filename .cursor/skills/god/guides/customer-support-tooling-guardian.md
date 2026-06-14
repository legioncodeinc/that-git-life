# Customer Support Tooling Guardian — God's Guide

The God routing skill's record of when to invoke `customer-support-tooling-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/customer-support-tooling-guardian.md`](../../agents/customer-support-tooling-guardian.md)
**Weapon:** [`ai-tools/skills/customer-support-tooling-weapon/`](../../skills/customer-support-tooling-weapon/)
**Command Brief:** [`ai-tools/command-briefs/customer-support-tooling-guardian-command-brief.md`](../../../command-briefs/customer-support-tooling-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`customer-support-tooling-guardian` owns the support-platform decision layer for SaaS products. It selects the right tool from Plain, Pylon, Front, Help Scout, and Intercom; configures shared inboxes (routing, tags, SLA tiers); designs AI-deflection flows (Fin 2.0, Ari, Crisp Bot); sets SLA policy with breach alerts; wires integrations into Slack, Linear, and Notion; and provides a founder-as-support playbook for teams of 1-3 people without dedicated support headcount. It explicitly does NOT own chat widget installation code or HMAC verification (live-chat-support-guardian), auth/SSO for support tools (auth-guardian), GDPR data-retention audits (security-guardian), or billing/subscription management surfaced through support (payments-guardian).

## Trigger phrases

Route to `customer-support-tooling-guardian` when the user says any of:

- "which support tool should we use"
- "Plain vs Pylon vs Intercom vs Help Scout vs Front"
- "configure AI deflection"
- "set up Fin AI"
- "design our SLA policy"
- "wire support to Linear"
- "Slack to support integration"
- "founder-as-support playbook"
- "audit our support stack"
- "set up a shared inbox"
- "SLA breach alerts"
- "support triage checklist"
- "how many help articles before enabling Fin"

Or when the request implicitly involves selecting or configuring a customer support platform for a SaaS product.

## Do NOT route when

- The user asks for chat widget installation code, HMAC/JWT verification code, or widget embed configuration → route to `live-chat-support-guardian`.
- The user asks for SSO/auth integration for the support tool → route to `auth-guardian`.
- The user reports a GDPR data deletion request or data-export obligation → route to `security-guardian` immediately.
- The user asks about billing/subscription management within support tickets → route to `payments-guardian`.
- The request is specifically about Zendesk, Freshdesk, or Salesforce Service Cloud (not in the Angel's primary five-tool scope; handle inline or forge a new Angel).

If a request straddles `customer-support-tooling-guardian` and `live-chat-support-guardian`, prefer `live-chat-support-guardian` for code-level widget tasks and `customer-support-tooling-guardian` for tool-selection and configuration decisions above the widget layer.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- Team size (number of people handling support today).
- B2B or B2C posture (named enterprise accounts vs. broad consumer base).
- Primary support channel (email, Slack Connect, in-app chat, or multi-channel).
- Monthly conversation volume (current and projected 12-month).
- AI deflection priority (autonomous LLM-agent, copilot-only, or none).
- Integration requirements (Slack, Linear/Jira, Notion).

Optional: existing support tool's configuration or conversation export for audit mode.

If team size and posture are missing, the Angel will ask before recommending — do not invoke with these inputs missing or the comparison table will be uninformed.

## Outputs the Angel produces

- **Tool-selection report:** comparison table (Plain/Pylon/Help Scout/Front/Intercom), decision-tree path, scoring rationale, pricing model analysis. Delivered inline.
- **Configuration spec:** shared inbox routing rules, tag taxonomy, SLA tier definitions, integration wiring guide. Delivered inline or as `library/qa/support/<date>-support-audit.md`.
- **Audit report:** uses `templates/support-audit-report.md` skeleton. Identifies SLA misses, deflection gaps, routing bottlenecks, peer-Angel handoffs. Saved to `library/qa/support/`.
- **Founder triage checklist:** operational checklist using `templates/founder-triage-checklist.md`. Delivered as a living document for the founding team.

## Multi-Angel sequences this Angel participates in

- **Support stack build:** `customer-support-tooling-guardian` (tool selection + config) → `live-chat-support-guardian` (widget installation code) → `auth-guardian` (SSO) → `security-guardian` (GDPR retention audit).
- **Engineering escalation path:** `customer-support-tooling-guardian` wires Linear integration → `db-guardian` if a custom support data store is needed.

## Critical directives the orchestrator should respect

- Never recommend a tool without a comparison table.
- Always ask for team size and B2B/B2C posture before recommending.
- Do not enable AI deflection until the knowledge base has >= 20 published articles.
- Do not configure SLA breach alerts without confirming the alerting channel is staffed.
- Route GDPR deletion requests to security-guardian immediately.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
