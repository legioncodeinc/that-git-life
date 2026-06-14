# product-feedback-roadmap-guardian — God's Guide

The God routing skill's record of when to invoke `product-feedback-roadmap-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/product-feedback-roadmap-guardian.md`](../../agents/product-feedback-roadmap-guardian.md)  
**Weapon:** [`ai-tools/skills/product-feedback-roadmap-weapon/`](../../skills/product-feedback-roadmap-weapon/)  
**Command Brief:** [`ai-tools/command-briefs/product-feedback-roadmap-guardian-command-brief.md`](../../../command-briefs/product-feedback-roadmap-guardian-command-brief.md)  
**Trigger policy:** on-demand

---

## Domain

`product-feedback-roadmap-guardian` owns the full customer-feedback-to-roadmap loop for SaaS products. This covers: platform selection (Userback, Canny, Featurebase, Productboard, Frill, Productlane), collection surface design (in-app widget, customer portal, public voting board), de-duplication discipline (canonical merge workflow, semantic tagging, weekly triage), status-transition policy (five-status model with customer notification templates), RICE/ICE prioritization (scored backlog table with rubric), public roadmap posture (transparency spectrum, 20% capacity cap, no-dates discipline), and integration wiring (Productlane + Linear, Canny + Jira, Featurebase + Linear, Userback + Slack/Jira). It is the only Army Angel that specializes in the feedback collection and roadmap transparency surface.

## Trigger phrases

Route to `product-feedback-roadmap-guardian` when the user says any of:

- "Set up a feedback system for our SaaS"
- "Which feedback tool should we use?" / "Canny vs Featurebase" / "compare feedback platforms"
- "Our feature requests are a mess" / "we have 300 unreviewed requests"
- "We need a public roadmap"
- "Should we publish our roadmap?"
- "Prioritize our feature backlog" / "RICE score these requests" / "ICE scoring"
- "Productlane + Linear setup"
- "Set up a voting board"
- "De-duplicate our feedback backlog"
- "Configure Canny / Featurebase / Userback / Frill"
- "Our feedback is spread across email, Slack, and Intercom — how do we consolidate it?"
- "Customers keep asking about the same features — how do we track that?"
- "What's the right status workflow for feature requests?"
- "We committed to a roadmap date and now it's slipping — what do we do?"
- "How do we tell customers their request is not planned?"

Or when the request involves feedback collection platform setup, feature request triage and prioritization, or roadmap transparency design for a SaaS product.

## Do NOT route when

- The user wants React/Next.js code to embed a widget in their product — route to `react-guardian`.
- The user wants a custom-built feedback database schema — route to `db-guardian`.
- The user wants SEO metadata on the public roadmap page — route to `seo-aeo-guardian`.
- The user wants Stripe billing for a premium feedback tier — route to `payments-guardian`.
- The user wants to set up live chat / helpdesk (Intercom, Plain, Help Scout, Crisp) — route to `live-chat-support-guardian`. Note: Featurebase blurs this boundary in 2026 (it is adding live chat features); if the user wants Featurebase for both feedback AND live chat, involve both guardians.
- The user wants product analytics event instrumentation (PostHog, Mixpanel track calls) — route to the appropriate analytics guardian.
- The user wants a changelog tool (Headway, Beamer, FeatureBase changelog) separate from their feedback platform — route to `changelog-release-notes-guardian`.

If a request straddles `product-feedback-roadmap-guardian` and `changelog-release-notes-guardian` (e.g., "Productlane has a changelog — how do I wire it with my Linear releases?"), prefer `product-feedback-roadmap-guardian` since it owns the full Productlane stack including the changelog component.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- **Current state** — which feedback tools (if any) are already in use; approximate monthly request volume.
- **Audience type** — B2B (account champions) vs B2C (mass end-users). This drives the platform decision tree.
- **Existing integrations** — Linear, Jira, HubSpot, Salesforce. Required for platform fit and integration wiring.
- **Transparency posture** — does the team want a public roadmap, semi-public, or private?
- **Prioritization maturity** — does the team have a scoring framework, or are they triaging by gut feel?

If audience type and existing integrations are unknown, the Angel will ask before producing a recommendation.

## Outputs the Angel produces

- **Platform recommendation** — specific tool selection with rationale, not just a comparison table. One primary tool per surface.
- **Collection surface design** — which surfaces to configure, in which order, with moderation settings.
- **De-duplication policy** — semantic tagging taxonomy, weekly session template, merge workflow.
- **Status-transition policy doc** — all five statuses, entry/exit conditions, notification templates, 30-day SLA. Paste-ready into Notion.
- **RICE or ICE scored table** — ranked backlog with per-item score reasoning. Uses `templates/rice-scoring-sheet.md`.
- **Public roadmap posture recommendation** — transparency spectrum position, Now/Next/Later or status-only recommendation, 20% cap governance rule.
- **Integration wiring guide** — step-by-step for the chosen platform + issue tracker pairing.

## Multi-Angel sequences this Angel participates in

- **New SaaS launch sequence:** `website-guardian` (scaffolds the marketing site with a public roadmap page) → `product-feedback-roadmap-guardian` (sets up the feedback platform and wires the voting board/portal) → `seo-aeo-guardian` (ensures the public roadmap page is discoverable).
- **Feedback consolidation sequence:** `live-chat-support-guardian` (surfaces recurring pain points from support conversations) → `product-feedback-roadmap-guardian` (receives that signal, de-duplicates against the feedback backlog, scores and prioritizes).
- **Quarterly planning sequence:** `product-feedback-roadmap-guardian` (produces the de-duplicated, RICE-scored backlog) → PM team sprint planning → status transitions and customer notifications.

## Critical directives the orchestrator should respect

- De-duplicate before scoring — this Angel will always de-duplicate the backlog before running RICE/ICE.
- Flag the Featurebase 2026 pivot risk — the Angel will surface this disclosure on every Featurebase recommendation.
- Never commit public dates on a roadmap — the Angel will enforce the no-public-dates rule.
- Surface "not planned" as a first-class status — the Angel will include it in every status policy output.

(Full list in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
