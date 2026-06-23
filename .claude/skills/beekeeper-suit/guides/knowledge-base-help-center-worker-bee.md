# Knowledge Base & Help Center Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `knowledge-base-help-center-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/knowledge-base-help-center-worker-bee.md`](../../agents/knowledge-base-help-center-worker-bee.md)
**Stinger:** [`.cursor/skills/knowledge-base-help-center-stinger/`](../../skills/knowledge-base-help-center-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`knowledge-base-help-center-worker-bee` owns the full product lifecycle of a customer-facing self-service knowledge base. It covers platform selection and migration across Intercom Articles, Help Scout Docs, ReadMe.com, Document360, HelpJuice, and Zendesk Guide. It designs search-first information architecture, wires AI deflection (platform-native chatbots, Fin standalone, Eddy AI, and the llms.txt standard), configures KB versioning (Document360 branch versioning, ReadMe git-backed), manages multi-language and multi-locale setups (50+ language auto-translate, RTL, TMS integrations), and runs the analytics-driven content-gap feedback loop using the CRAVA framework. It treats the knowledge base as a product surface — applying engineering discipline to search quality, content versioning, CI/CD for content, and analytics — not as a static document dump.

## Trigger phrases

Route to `knowledge-base-help-center-worker-bee` when the user says any of:

- "pick a KB platform"
- "set up a help center"
- "migrate Zendesk Guide"
- "add AI deflection to our docs"
- "fix our search no-results"
- "localize our KB"
- "we need chat-with-your-docs"
- "set up llms.txt"

Or when the request implicitly involves selecting, migrating, architecting, or improving a customer-facing self-service knowledge base or documentation hub.

## Do NOT route when

- The user needs support inbox routing, ticketing setup, or SLA tiers — route to `customer-support-tooling-worker-bee` instead.
- The user needs live chat widget HMAC identity verification or conversation routing — route to `live-chat-support-worker-bee` instead.
- The user needs organic keyword strategy, metadata optimization, or schema markup for KB articles — route to `seo-aeo-worker-bee` instead.
- The user needs the embedding model, vector store, or retrieval API implemented for a custom RAG endpoint — route to `mind-worker-bee` instead (this Bee specifies the KB export format and chunking inputs, then hands off).

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- **Scenario type** — greenfield KB setup, platform migration, or KB improvement (search quality, AI deflection, analytics, versioning, or localization).
- **Current platform** (if migrating or improving) — e.g. Zendesk Guide, Intercom Articles, or a homegrown solution.
- **Key constraints** — content volume, authoring persona (technical or non-technical), versioning needs, AI deflection requirement, budget range, and language/locale requirements (optional — the Bee will ask one targeted clarifying question if absent and ambiguous).

## Outputs the Bee produces

- **`docs/kb-plan.md`** — scored platform recommendation with named trade-offs, information architecture design, AI deflection pattern selection, and launch checklist for new setups.
- **Platform-specific migration checklist** — for migration scenarios, a step-by-step checklist covering content export, 301 redirects, and AI deflection re-wiring (based on `templates/kb-setup-checklist.md`).

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`
- AI deflection Pattern C handoff — this Bee specifies the KB export format and chunking inputs, then hands RAG/embedding implementation to `mind-worker-bee`

## Critical directives the orchestrator should respect

- **Always name the concrete trade-off before recommending a platform** — "use Document360" without naming the quote-only pricing barrier, or "use Intercom" without naming the per-seat + per-resolution cost stack, produces buyer's regret.
- **Never recommend a platform without checking its AI deflection maturity** — by 2026 every major KB platform has some form of chat-with-your-docs; recommending one with no AI deflection path forces a future migration.
- **Default to search-first architecture** — all taxonomy and AI layer decisions must serve search quality first; wire search analytics before any AI deflection layer.
- **Flag llms.txt on every new KB setup as a Day-1 step** — Google Lighthouse now validates llms.txt (May 20, 2026); a 10-minute investment gives permanent AI assistant discoverability benefit.
- **Route embedding/RAG implementation to `mind-worker-bee`** — do not cross that boundary; vector search setup, chunking strategies, and retrieval tuning are a distinct speciality.
- **Flag HelpJuice as a 2026 data gap** — no current pricing, AI deflection, or versioning data was found; direct users to helpjuice.com/whats-new before committing.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
