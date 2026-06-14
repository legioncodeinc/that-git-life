# Social Media Marketing Organic Guardian — God's Guide

The God routing skill's record of when to invoke `social-media-marketing-organic-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/social-media-marketing-organic-guardian.md`](../../agents/social-media-marketing-organic-guardian.md)
**Weapon:** [`ai-tools/skills/social-media-marketing-organic-weapon/`](../../skills/social-media-marketing-organic-weapon/)
**Command Brief:** [`ai-tools/command-briefs/social-media-marketing-organic-guardian-command-brief.md`](../../../command-briefs/social-media-marketing-organic-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`social-media-marketing-organic-guardian` owns genuine organic social media strategy for solo developers, founders, and small product teams (up to ~10 people). It covers platform selection and prioritization (LinkedIn, X, Threads, Bluesky), founder-led authentic voice development, the build-in-public methodology, realistic content calendars grounded in actual founder bandwidth, and follower and engagement growth strategies that do not rely on AI-generated content, cross-post automation, or purchased followers. The Angel is calibrated for resource-constrained teams who need sustainable social strategies — not agency-scale playbooks. It is opinionated in the extreme against slop-producing tactics and grounds all growth expectations in 2026 benchmark data.

## Trigger phrases

Route to `social-media-marketing-organic-guardian` when the user says any of:

- "help me with social media"
- "which platform should I focus on for my product"
- "I want to build in public"
- "my social presence is inconsistent / dead"
- "audit my social media posts"
- "I need a content calendar"
- "how do I grow authentically without buying followers"
- "AI-generated social posts are hurting my brand"
- "social media strategy for a solo founder"
- "LinkedIn vs Bluesky vs X for a solo dev"
- "how do I find my founder voice"
- "realistic follower growth expectations"
- "my social engagement is too low"
- "should I post on Threads or Bluesky"

Or when the request implicitly involves organic social media growth, platform selection, or content strategy for a founder building an audience without paid advertising.

## Do NOT route when

- The user asks about email newsletter strategy, newsletter platform selection, or email list growth — route to `newsletter-platform-guardian`
- The user asks about search-driven content (blog posts, landing pages, keyword optimization) — route to `seo-aeo-guardian`
- The user asks about paid social advertising or paid acquisition — no Angel owns this yet; flag explicitly and stop
- The user asks about visual branding, design tokens, or social media asset design — route to `design-system-guardian` or `ux-ui-guardian`
- The user is managing a social media team of > 10 people or needs agency-scale tooling (Sprout Social, Hootsuite enterprise features) — out of scope; flag and recommend appropriate tools
- The user asks about Discord or Slack community management — out of scope; say so explicitly

If a request straddles social and email (e.g., "how do I use social to grow my newsletter?"), default to `social-media-marketing-organic-guardian` for the social side and hand off to `newsletter-platform-guardian` for the email-list conversion strategy.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- A description of the product or project being promoted
- The founder's current social media situation (zero presence, inconsistent, or pivoting away from AI-slop strategy)
- The platforms in scope or under consideration (LinkedIn, X, Threads, Bluesky, or "help me choose")
- Optionally: existing posts or analytics the founder wants audited

If the user hasn't provided their realistic available time per week, the Angel will ask — this is required before building a calendar.

## Outputs the Angel produces

- **Social presence audit:** markdown findings report using `templates/social-audit-report.md` (for audit requests)
- **Platform selection recommendation:** one primary platform with clear rationale, optional secondary
- **4-week content calendar:** using `templates/content-calendar-4-week.md`
- **Sample posts:** 2-3 posts per type in the founder's authenticated voice, passing the 12-point authenticity checklist
- **Growth expectations summary:** 90-day and 12-month trajectory using `templates/growth-expectations-summary.md`
- **Build-in-public playbook:** content types, cadence, and platform-specific formats

All outputs are terminal deliverables — there is no downstream Angel in this workflow.

## Multi-Angel sequences this Angel participates in

- **Social-to-newsletter handoff:** `social-media-marketing-organic-guardian` owns top-of-funnel social audience building; when a post is designed to drive newsletter signups, `newsletter-platform-guardian` takes the email-list conversion and newsletter strategy from there.
- **Social-to-brand handoff:** when a founder needs visual assets for their social presence, `social-media-marketing-organic-guardian` flags the need and routes to `design-system-guardian` for the visual system.

## Critical directives the orchestrator should respect

- Never recommend AI-generated post content — the Angel's value proposition depends on this boundary
- Always ask for the founder's honest available time before building a calendar
- Refuse "going viral" requests — redirect to audience specificity and consistency
- Ground all growth projections in 2026 benchmarks from `guides/07-growth-benchmarks.md`, not aspirational estimates

(Full list with rationale in `ai-tools/agents/social-media-marketing-organic-guardian.md#critical-directives`)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
