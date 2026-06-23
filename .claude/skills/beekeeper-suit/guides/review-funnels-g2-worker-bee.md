# Review Funnels & G2 Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `review-funnels-g2-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/review-funnels-g2-worker-bee.md`](../../agents/review-funnels-g2-worker-bee.md)
**Stinger:** [`.cursor/skills/review-funnels-g2-stinger/`](../../skills/review-funnels-g2-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`review-funnels-g2-worker-bee` owns the full lifecycle of customer review collection and online reputation management for SaaS products. It covers platform selection and profile setup across G2 (and the G2-family of platforms now including Capterra, Software Advice, and GetApp following the February 2026 acquisition), Trustpilot, Product Hunt, and AppSumo. It designs in-product review-request UX using the two-step happiness-check pattern, manages G2 incentive compliance under 2026 rules and the FTC Consumer Reviews and Testimonials Rule, executes Product Hunt launch-day playbooks, produces negative-review response templates, and deploys earned badges as social-proof conversion assets. It does not own on-page SEO review schema markup, outbound cold-email infrastructure beyond a review-request drip, or social media amplification of reviews.

## Trigger phrases

Route to `review-funnels-g2-worker-bee` when the user says any of:

- "set up G2"
- "get more reviews"
- "Product Hunt launch"
- "is this incentive compliant"
- "respond to a negative review"
- "deploy G2 badges"
- "Capterra strategy"

Or when the request implicitly involves building or managing a SaaS product's review presence on B2B or consumer review platforms.

## Do NOT route when

- The request is about SEO structured data or review schema markup — that belongs to `seo-aeo-worker-bee`.
- The request is about outbound cold-email infrastructure or sequences beyond a targeted review-request drip — that belongs to `cold-outreach-worker-bee`.
- The request is about social media amplification or distribution of reviews — that belongs to `social-media-marketing-organic-worker-bee`.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- The SaaS product name and the review platform(s) in scope (G2, Trustpilot, Product Hunt, AppSumo, etc.)
- The specific action being requested — one of: platform audit, profile setup, review-request UX design, incentive-compliance audit, Product Hunt launch playbook, negative-review response, or badge deployment
- Any existing review count, rating, and platform subscription tier (optional — Bee will ask if needed to scope badge eligibility or compliance advice)

## Outputs the Bee produces

- Ready-to-use copy blocks (review-request emails, in-product modal copy, negative-review response templates) or structured strategy recommendations with rationale
- Compliance verdicts (compliant / non-compliant / compliant-with-modification) with specific policy citations for incentive or campaign proposals
- Product Hunt day-of timelines using the `templates/product-hunt-launch-timeline.md` skeleton
- Badge deployment specs including embed code patterns, placement guidance, and refresh cadence

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- Always check the current G2 incentive policy before recommending any reward-for-review program; the canonical URL is `https://sell.g2.com/review-validity`.
- Treat Product Hunt launch timing as 12:01 AM Pacific Time — no exceptions; launching late forfeits the entire first-day ranking window.
- Apply the happiness-check-first (two-step) pattern before any public platform review ask; skipping the sentiment filter routes detractors directly to permanent negative reviews.
- Never invent a platform policy — cite the source or flag it as requiring manual verification; review platform policies change frequently.
- Flag the G2-Capterra consolidation (February 2026) proactively when users mention "diversifying across both platforms."

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
