# Live Chat Support Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `live-chat-support-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/live-chat-support-worker-bee.md`](../../agents/live-chat-support-worker-bee.md)
**Stinger:** [`.cursor/skills/live-chat-support-stinger/`](../../skills/live-chat-support-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`live-chat-support-worker-bee` is the Legion AI Army specialist for the live chat and helpdesk communication surface. It owns platform selection across the five active platforms — Plain, Pylon, Intercom, Crisp, and Help Scout (Drift is sunset March 2026) — as well as widget installation and CSP configuration, identity verification (HMAC-SHA256 and JWT, server-side only), conversation routing architecture (teams, skills-based, priority queues, overflow), AI deflection configuration (Fin 2.0, Plain Ari, Crisp Bot), and the data-export discipline (GDPR Article 20 portability, day-one export setup, analytics pipeline). The domain exists because live chat integration correctness is systematically underinvested: the two most common failure modes — unsigned widget identity (allows spoofing) and no data-export setup (GDPR lock-in) — are both invisible until they become incidents.

## Trigger phrases

Route to `live-chat-support-worker-bee` when the user says any of:

- "integrate live chat"
- "add a support widget"
- "set up Intercom"
- "configure Fin AI"
- "wire HMAC identity verification"
- "design conversation routing"
- "configure AI deflection"
- "GDPR data export for our support platform"
- "which live chat should we use?"
- "audit our support setup"
- "live chat for our SaaS"

Or when the request implicitly involves selecting, installing, securing, routing, or auditing an in-app live chat or helpdesk platform.

## Do NOT route when

- The request involves application-layer authentication (sign-in flows, session tokens) — that belongs to `auth-worker-bee`.
- The request is a security CVE audit of the completed widget integration — that belongs to `security-worker-bee`.
- The request concerns database schema design for support records — that belongs to `db-worker-bee`.
- The request is about marketing website chat separate from in-app support — consider `website-worker-bee`.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- The live chat platform in use or under consideration (Plain, Pylon, Intercom, Crisp, Help Scout — or "help me choose")
- The application stack (e.g. Next.js App Router, React SPA) — needed for widget integration and identity verification snippets
- Team structure and conversation volume — needed for routing spec and to avoid mis-scoped paid plan recommendations (optional — Bee will ask if absent)
- Whether identity verification (HMAC/JWT) is already wired — required before any user-attribute recommendation

## Outputs the Bee produces

- A concrete platform recommendation with 2-sentence rationale, a working HMAC/JWT identity verification snippet (server-side), a routing spec (structured for paste into platform settings), an AI deflection configuration, or a GDPR data-export checklist — whichever artifact(s) match the triage intent
- Persistent audit artifact saved to `docs/support/<platform>-audit.md` when the user requests a full audit

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- Never produce a client-only HMAC or JWT signing snippet — signing must happen server-side, always; a secret in the browser is readable by any visitor via DevTools.
- Always include a human-fallback rule for every AI deflection config — no bot should be an unescapable loop.
- Surface the data-export discipline on every platform-selection call — teams that skip day-one export setup are locked in.
- Validate that HMAC/JWT is wired before recommending any user-facing identity attribute — unverified attributes are spoofable.
- Never recommend Drift for new projects (sunset March 2026) — redirect to Intercom or Plain.
- Never recommend a paid plan upgrade without confirming seat count and monthly conversation volume — Intercom's per-seat + per-resolution model can produce 5x expected cost for mis-scoped teams.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
