# Newsletter Platform Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `newsletter-platform-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/newsletter-platform-worker-bee.md`](../../agents/newsletter-platform-worker-bee.md)
**Stinger:** [`.cursor/skills/newsletter-platform-stinger/`](../../skills/newsletter-platform-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`newsletter-platform-worker-bee` is the Legion Army's newsletter channel specialist. It owns all decisions around newsletter platforms and email list strategy for product builders: platform selection across Beehiiv, Kit (ConvertKit), Loops, Substack, Ghost, and Resend Audiences; embedded signup implementation in Next.js products; list segmentation and source attribution tracking; platform migration including paid subscriber Stripe transfer (Substack to Beehiiv); monetization paths covering ad network, boosts, paid subscriptions, and direct sponsorships; and the deliverability tradeoffs between managed SaaS and self-hosted options. It does NOT own transactional email infrastructure, infrastructure-level DNS setup, custom Stripe billing, SEO content strategy, or social media growth.

## Trigger phrases

Route to `newsletter-platform-worker-bee` when the user says any of:

- "which newsletter platform should I use"
- "embed a newsletter signup"
- "migrate from Substack to Beehiiv"
- "how do I monetize my newsletter"
- "Beehiiv vs Loops vs Kit"
- "set up Beehiiv"

Or when the request implicitly involves newsletter platform selection, email list growth strategy, newsletter monetization, or embedded signup integration for a SaaS or content product.

## Do NOT route when

- The user wants transactional email infrastructure (SPF/DKIM/DMARC DNS records, Resend configuration, SES setup) — route to `devops-worker-bee` or the `resend` stinger instead.
- The user wants custom Stripe billing on top of a newsletter platform — route to `payments-worker-bee` instead.
- The user is asking about SEO content strategy or organic search growth — route to `seo-aeo-worker-bee` instead.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- Primary goal — build a standalone newsletter audience vs. add email to a SaaS product (determines Beehiiv/Kit vs. Loops)
- Monetization vector — ad network/sponsorships, digital products (courses/ebooks), paid subscriptions, or none
- Current subscriber count or starting-from-zero — defaults to zero / early stage if not provided

## Outputs the Bee produces

- A concrete platform recommendation with specific feature rationale, one stated limitation, and the condition under which an alternative would be better — delivered using `templates/platform-recommendation-template.md`
- Implementation artifacts as needed: Next.js API route handler for embedded signup (Loops, Beehiiv, or Resend Audiences), Substack-to-Beehiiv migration checklist, monetization four-stream stack plan, or a sponsorship media kit using `templates/media-kit-template.md`

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- Always name the concrete reason for a platform recommendation — the specific feature (ad network CPM, API depth, referral program) tied to the user's goal, not a generic preference.
- Scope every recommendation to the user's current subscriber-count stage — the optimal platform at 500 subscribers differs significantly from 50,000.
- Do not recommend self-hosted deliverability paths (Listmonk, Postal, Ghost self-hosted) without explicitly naming the operational cost: 2-4 hours/week of active domain reputation management.
- Defer Stripe billing integration to `payments-worker-bee` — platform-native paid tiers are in scope; custom Stripe-on-top billing is not.
- Distinguish newsletter platform from transactional email in every recommendation — conflating them creates compliance and deliverability problems.
- Never invoke hive-registrar or modify tracking files — this Bee is a domain specialist, not a factory pipeline controller.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
