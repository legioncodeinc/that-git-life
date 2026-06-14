# live-chat-support-guardian — God's Guide

The God routing skill's record of when to invoke `live-chat-support-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/live-chat-support-guardian.md`](../../agents/live-chat-support-guardian.md)  
**Weapon:** [`ai-tools/skills/live-chat-support-weapon/`](../../skills/live-chat-support-weapon/)  
**Command Brief:** [`ai-tools/command-briefs/live-chat-support-guardian-command-brief.md`](../../../command-briefs/live-chat-support-guardian-command-brief.md)  
**Trigger policy:** proactive

---

## Domain

`live-chat-support-guardian` owns the full lifecycle of live chat and helpdesk widget integration for SaaS products. This covers: platform selection (Plain, Pylon, Intercom, Crisp, Help Scout — Drift is sunset March 2026), widget installation (JS snippet, React SDK, Next.js App Router), identity verification (HMAC-SHA256 and JWT, server-side signing only), conversation routing (teams, skills-based, priority queues for paying customers, overflow rules), AI deflection (Intercom Fin 2.0, Plain Ari, Crisp Bot, handoff thresholds), and the data-export discipline (GDPR Article 20 portability, day-one export setup, analytics pipelines). It is the only Army Angel that specializes in the customer support communication surface.

## Trigger phrases

Route to `live-chat-support-guardian` when the user says any of:

- "Which live chat should we use?"
- "Integrate Intercom / Crisp / Plain / Pylon / Help Scout"
- "Add a support widget"
- "Wire HMAC identity verification for our chat widget"
- "Configure identity verification for Intercom/Crisp"
- "Our chat widget doesn't know who the user is"
- "Design conversation routing for our support inbox"
- "Configure Fin AI / Crisp Bot / AI deflection"
- "Set up AI support deflection"
- "GDPR data export for our support platform"
- "Audit our live chat setup"
- "Live chat for our SaaS startup"
- "We're using Drift — should we switch?" (Drift is sunset, answer is yes)

Or when the request implicitly involves live chat widget setup, support identity verification, or customer support platform configuration.

## Do NOT route when

- The user wants application-layer authentication (sign-in, JWT tokens, Clerk/Supabase Auth setup) — route to `auth-guardian`.
- The user wants a security audit of the completed widget integration for XSS, CSP, or secret exposure — route to `security-guardian`.
- The user wants the database schema for storing support tickets internally — route to `db-guardian`.
- The user asks about Zendesk, Freshdesk, or Salesforce Service Cloud — no current weapon scope for those; handle inline and note the limitation.
- The user wants a marketing website with a chat widget — the marketing site concerns go to `website-guardian`; the support widget portion of the integration stays with `live-chat-support-guardian`.

If a request straddles `live-chat-support-guardian` and `auth-guardian` (e.g., "how do I feed the user's JWT from Clerk into Intercom"), prefer `live-chat-support-guardian` — it owns the identity-to-widget wiring, consuming the auth layer's output.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- **Platform in scope** (or "help us choose") — Intercom, Crisp, Plain, Pylon, Help Scout.
- **Tech stack** (Next.js App Router vs Pages Router, React SPA, mobile) — needed for widget integration patterns.
- **Auth provider** (Clerk, Supabase Auth, NextAuth, etc.) — needed for identity verification source.
- **Team structure** — number of agents, specialization, Slack-heavy vs ticket-based (needed for routing).
- (Optional) **AI deflection appetite** — autonomous, hybrid with human fallback, or off.
- (Optional) **GDPR / data residency requirements.**

If platform and tech stack are unknown, the Angel will ask before producing integration code.

## Outputs the Angel produces

- **Platform recommendation** — specific recommendation with rationale, not just a comparison table.
- **Identity verification snippet** — server-side API route (Next.js App Router) + client-side widget boot call.
- **Routing spec** — structured routing configuration document (using `templates/routing-spec.md`).
- **AI deflection config** — Escalation Rules, Escalation Guidance, knowledge base seeding plan.
- **Data-export checklist** — completed `templates/data-export-checklist.md` for the chosen platform.
- **Integration audit report** — completed `templates/platform-audit.md` on request.

## Multi-Angel sequences this Angel participates in

- **Support integration sequence:** `auth-guardian` (sets up user identity) → `live-chat-support-guardian` (wires identity into widget, configures routing and AI) → `security-guardian` (audits the widget integration for secret exposure, CSP gaps, HMAC bypass scenarios) → `quality-guardian` (verifies implementation against the integration spec).
- **New product launch sequence:** `website-guardian` (scaffolds the site) → `live-chat-support-guardian` (adds the in-app support widget) → `seo-aeo-guardian` (checks that async widget load does not degrade Core Web Vitals).

## Critical directives the orchestrator should respect

- Never allow a client-only HMAC or JWT snippet — this Angel will always produce a server-side signing function first.
- Always receive a human-fallback rule for AI deflection — the Angel will refuse to produce a bot-only config.
- Surface data-export discipline even when the user did not ask — it is a mandatory output of every platform-selection call.

(Full list in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
