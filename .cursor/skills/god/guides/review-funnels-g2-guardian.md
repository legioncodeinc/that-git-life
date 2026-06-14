# review-funnels-g2-guardian — God's Guide

The God routing skill's record of when to invoke `review-funnels-g2-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/review-funnels-g2-guardian.md`](../../agents/review-funnels-g2-guardian.md)
**Weapon:** [`ai-tools/skills/review-funnels-g2-weapon/`](../../skills/review-funnels-g2-weapon/)
**Command Brief:** [`ai-tools/command-briefs/review-funnels-g2-guardian-command-brief.md`](../../../command-briefs/review-funnels-g2-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`review-funnels-g2-guardian` owns the review-collection and online-reputation surface for SaaS products. It covers: (1) platform selection and profile setup across G2 (and its 2026 Capterra/Software Advice/GetApp acquisitions), Trustpilot, Product Hunt, AppSumo, and Software Advice; (2) in-product and email review-request UX including the mandatory two-step happiness-check pattern; (3) G2 incentive compliance and the FTC Consumer Reviews and Testimonials Rule (effective October 2024); (4) the Product Hunt launch-day playbook anchored to the 12:01 AM PT launch rule; (5) negative-review response strategy and templates; and (6) deploying earned badges as social-proof conversion assets. Critical 2026 context: G2 acquired Capterra in February 2026, making "diversify across both platforms" obsolete advice.

## Trigger phrases

Route to `review-funnels-g2-guardian` when the user says any of:

- "set up G2" / "claim our G2 profile"
- "get more reviews" / "how do we collect more reviews"
- "Product Hunt launch" / "we're launching on PH"
- "is this incentive compliant" / "can we offer a gift card for reviews"
- "respond to a negative review"
- "deploy G2 badges" / "add G2 badge to our website"
- "Capterra strategy" / "AppSumo listing"
- "Trustpilot setup" / "build our Trustpilot presence"
- "review request UX" / "when should we ask for reviews"
- "G2 Leader badge" / "how do we earn G2 High Performer"

Or when the request implicitly involves building or managing a SaaS product's review presence on external platforms.

## Do NOT route when

- The user asks about structured data / JSON-LD markup for review schema (`AggregateRating`) -- route to `seo-aeo-guardian`.
- The user asks about building a multi-step outbound email sequence or cold outreach infrastructure -- route to `cold-outreach-guardian` (review-request drips are in scope for this Angel; full outbound sequences are not).
- The user asks about amplifying reviews on LinkedIn, X, or Threads -- route to `social-media-marketing-organic-guardian`.
- The user asks about in-app chat widgets or support tools that might surface reviews (e.g., Intercom) -- route to `live-chat-support-guardian`.

If a request straddles two Angels' domains, prefer the narrower-scoped Angel and let the broader one act as backup.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- The product name, website URL, and ICP (B2B / SMB / Enterprise / consumer) -- required for platform recommendation.
- Existing review profile links if any -- helps with audit and gap analysis.
- The specific task: platform setup, review-request UX, Product Hunt launch, incentive audit, negative-review response, or badge deployment.
- (Optional) Current NPS or CSAT score range -- helps assess review-request readiness.
- (Optional) Tech stack -- if an in-product review widget is being implemented.

If the specific task is unclear, the Angel will ask one clarifying question before proceeding.

## Outputs the Angel produces

- **Platform recommendation:** prioritized shortlist with rationale and profile setup checklists.
- **Review-request copy:** ready-to-use email variants and in-product modal copy.
- **Incentive-compliance verdict:** compliant / non-compliant / compliant-with-modification, with specific issue and disclosure language.
- **Product Hunt launch timeline:** printable day-of checklist with hour-by-hour actions.
- **Negative-review response:** filled-in response template per review, platform, and star-rating band.
- **Badge deployment spec:** which badges apply, embed code, and conversion placement recommendations.
- Reports saved to `docs/reputation/` if the user is building a persistent playbook.

## Multi-Angel sequences this Angel participates in

- **Review-collection and distribution sequence:** `review-funnels-g2-guardian` (collect and manage) → `seo-aeo-guardian` (schema markup for star ratings) → `social-media-marketing-organic-guardian` (amplify on social).

## Critical directives the orchestrator should respect

- Always apply the happiness-check-first (two-step) pattern before routing to any public review platform.
- Always check current G2 incentive policy (`https://sell.g2.com/review-validity`) before recommending any reward program.
- Never suggest fake or purchased reviews under any circumstances.
- Flag the G2-Capterra 2026 acquisition proactively when users mention "diversifying across both platforms."

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
