# Newsletter Platform Guardian — God's Guide

The God routing skill's record of when to invoke `newsletter-platform-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/newsletter-platform-guardian.md`](../../agents/newsletter-platform-guardian.md)
**Weapon:** [`ai-tools/skills/newsletter-platform-weapon/`](../../skills/newsletter-platform-weapon/)
**Command Brief:** [`ai-tools/command-briefs/newsletter-platform-guardian-command-brief.md`](../../../command-briefs/newsletter-platform-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`newsletter-platform-guardian` owns the newsletter-as-channel surface for product builders and founders. It covers platform selection across Beehiiv, Kit (ConvertKit), Loops, Substack, Ghost, and Resend Audiences; the embedded newsletter signup integration pattern for Next.js products; deliverability tradeoffs between managed SaaS and self-hosted stacks; monetization paths (Ad Network, Boosts, paid subscriptions, direct sponsorships); and platform migration including paid Stripe subscriber transfer. It does NOT own transactional email infrastructure, infrastructure-level DNS setup, custom Stripe billing, or SEO content strategy.

## Trigger phrases

Route to `newsletter-platform-guardian` when the user says any of:

- "which newsletter platform should I use"
- "Beehiiv vs Kit vs Loops"
- "embed a newsletter signup in my Next.js app"
- "migrate from Substack to Beehiiv"
- "how do I monetize my newsletter"
- "set up Beehiiv"
- "newsletter deliverability"
- "self-hosted newsletter"
- "newsletter ad network"
- "paid newsletter subscriptions"

Or when the request implicitly involves newsletter list strategy, audience building as a product distribution channel, or newsletter platform switching.

## Do NOT route when

- The user is asking about transactional email sending infrastructure (Resend configuration, SES setup, SMTP relay) — route to `resend` tooling or `devops-guardian`.
- The user wants SPF/DKIM/DMARC DNS records set up at the infrastructure level — route to `devops-guardian`.
- The user wants custom Stripe billing built on top of a newsletter platform (not platform-native paid tiers) — route to `payments-guardian`.
- The user is asking about SEO for newsletter content or growing organic search traffic — route to `seo-aeo-guardian`.
- The question is about email marketing platforms not covered by the weapon (Mailchimp, Klaviyo, ActiveCampaign) — `newsletter-platform-guardian` does not have researched guidance for these; answer from general knowledge only.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- Product context: SaaS, content site, indie app, or personal brand?
- Primary monetization goal: ad revenue, paid subscriptions, digital products, or top-of-funnel (no direct monetization)?
- Current subscriber count (if any) and target scale
- Technical stack (for embedded signup integration requests: Next.js version, or plain HTML)
- Current platform if migrating

If none of these are provided, the Angel will ask one targeted clarifying question before proceeding.

## Outputs the Angel produces

- **Platform recommendation**: inline markdown with concrete reasons, pricing comparison, and tradeoffs named
- **Embedded signup code**: Next.js App Router route handler + React form component for the chosen platform
- **Migration plan**: ordered checklist document (optionally saved to `library/requirements/issues/`)
- **Monetization roadmap**: four-stream revenue stack with benchmarks and platform-specific guidance

## Multi-Angel sequences this Angel participates in

- **SaaS launch sequence** — newsletter-platform-guardian handles the audience channel after `website-guardian` has scaffolded the product site; `payments-guardian` handles paid subscription billing if the user outgrows platform-native billing.
- **Content site launch** — newsletter-platform-guardian selects the newsletter layer; `seo-aeo-guardian` handles content discovery optimization.

## Critical directives the orchestrator should respect

- Always name the concrete reason for a platform recommendation — never recommend a platform without citing the specific feature tied to the user's goal.
- Distinguish newsletter platform from transactional email — never conflate the two.
- Scope recommendations to the user's current subscriber-count stage.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
