# Product Feedback & Roadmap Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `product-feedback-roadmap-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/product-feedback-roadmap-worker-bee.md`](../../agents/product-feedback-roadmap-worker-bee.md)
**Stinger:** [`.cursor/skills/product-feedback-roadmap-stinger/`](../../skills/product-feedback-roadmap-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`product-feedback-roadmap-worker-bee` owns the full customer-feedback-to-roadmap loop. It covers platform selection across Userback, Canny, Featurebase, Productboard, Frill, and Productlane; collection surface design (in-app widgets, customer portals, public voting boards); de-duplication discipline including canonical merge workflows and semantic tagging taxonomies; status-transition policy with the five-status model and customer notification templates; and RICE/ICE prioritization frameworks. It also owns public roadmap posture decisions (transparency spectrum, the 20% capacity cap rule, the no-public-dates discipline, and the Now/Next/Later horizon model) and integration wiring between feedback tools and CRMs or issue trackers such as Productlane + Linear and Canny + Jira.

## Trigger phrases

Route to `product-feedback-roadmap-worker-bee` when the user says any of:

- "set up a feedback system"
- "which feedback tool should I use" / "Canny vs Featurebase"
- "our feature requests are a mess" / "de-duplicate our feedback backlog"
- "set up a public roadmap" / "should we publish our roadmap?"
- "RICE scoring for our backlog" / "prioritize our feature requests"
- "Productlane + Linear" / "voting board for our SaaS"

Or when the request implicitly involves collecting customer feature requests, prioritizing a product backlog with a scoring framework, managing roadmap transparency, or wiring a feedback tool to an issue tracker.

## Do NOT route when

- The user wants React/Next.js code for embedding a feedback widget — route to `react-worker-bee` instead.
- The user needs a database schema for a custom-built feedback store — route to `db-worker-bee` instead.
- The user needs SEO metadata or marketing copy on the public roadmap page — route to `seo-aeo-worker-bee` instead.
- The user needs billing integration for premium feedback tiers — route to `payments-worker-bee` instead.
- The user is asking about a support conversation surface (Intercom, Plain, Help Scout, Crisp) exclusively — route to `live-chat-support-worker-bee` instead. Note: if the user wants Featurebase for both feedback AND live chat, involve both worker-bees.
- The user needs product analytics event instrumentation (PostHog, Mixpanel) — route to the appropriate analytics worker-bee.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- The team's current feedback situation (existing tools, backlog state, or the problem they are trying to solve)
- Audience type and approximate request volume (helps with platform selection)
- Integration requirements — issue tracker (Linear, Jira) and/or CRM in use, if any
- Transparency posture preference — public roadmap, private, or hybrid (optional — defaults to asking the gate-check questions from the public roadmap playbook if absent)

## Outputs the Bee produces

- A concrete platform recommendation or comparison decision with a 2-sentence rationale calibrated to the team's context
- A scored RICE or ICE backlog table with 1-sentence reasoning per item, using `templates/rice-scoring-sheet.md`
- A paste-ready status-transition policy doc (all five statuses, entry/exit conditions, notification templates, 30-day SLA) using `templates/status-transition-policy.md`
- A public roadmap posture decision with explicit transparency spectrum placement and the no-dates / 20% cap rules applied
- An integration wiring guide for the relevant feedback-tool + issue-tracker pairing, confirming bidirectional sync and sync-owner assignment

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- **De-duplicate before scoring.** Scoring 14 variants of "export to CSV" as separate items wastes prioritization budget and inflates apparent demand. The canonical merge step must precede any RICE/ICE run.
- **Every status transition must trigger a customer notification.** The loop is only "closed" when the customer hears back. A status that changes silently does not build trust and does not reduce support volume.
- **Never commit public dates on a roadmap.** Date commitments on a public roadmap become support tickets the moment a sprint slips. Use quarters, status-only, or "now/next/later" language.
- **Scope the platform recommendation to one primary tool per surface.** Running Canny for voting AND Userback for widgets AND Productboard for internal scoring produces three drifting sources of truth.
- **Always surface "not planned" as a first-class status option.** Refusing to say "no" publicly causes backlogs to grow without bound. Honest declination with a rationale is more valuable than indefinite limbo.
- **Flag the Featurebase strategic pivot risk.** Featurebase is shifting focus toward live chat/support in 2026. Teams choosing it as a primary feedback tool deserve this disclosure before committing.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
