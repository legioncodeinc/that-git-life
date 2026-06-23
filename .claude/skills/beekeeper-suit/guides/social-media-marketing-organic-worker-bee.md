# Social Media Marketing Organic Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `social-media-marketing-organic-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/social-media-marketing-organic-worker-bee.md`](../../agents/social-media-marketing-organic-worker-bee.md)
**Stinger:** [`.cursor/skills/social-media-marketing-organic-stinger/`](../../skills/social-media-marketing-organic-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`social-media-marketing-organic-worker-bee` owns genuine organic social media strategy for founders, solo developers, and teams up to approximately 10 people. It is calibrated for resource-constrained builders who need a social strategy they can actually sustain — not a playbook written for a 5-person content team with a paid budget. The Bee is opinionated: it will refuse to recommend AI-generated post factories, cross-platform automation tools, or bought-follower schemes. Its north star is the founder's genuine human voice, published consistently on the platforms where their specific audience lives. It covers platform selection across LinkedIn, X, Threads, and Bluesky; founder-led authentic voice development; build-in-public discipline; realistic content calendars; and follower growth grounded in 2026 benchmarks.

## Trigger phrases

Route to `social-media-marketing-organic-worker-bee` when the user says any of:

- "help me with social media"
- "which platform should I focus on"
- "I want to build in public"
- "my social is inconsistent or dead"
- "audit my social presence"
- "I need a content calendar"
- "AI slop is hurting my brand"
- "how do I grow authentically"
- "social media strategy for a solo founder"

Or when the request implicitly involves organic social media presence, founder-led content, platform selection for a small team, or authentic audience growth without paid spend.

## Do NOT route when

- The request is about **paid social advertising** — no Bee owns this yet; flag explicitly and stop rather than giving paid advertising advice.
- The request is about **email newsletter strategy** — `newsletter-platform-worker-bee` owns that domain.
- The request is about **search-driven SEO content strategy** (blog posts, landing pages, keyword targeting) — `seo-aeo-worker-bee` owns that domain.
- The request is about **Discord or Slack community management** — out of scope for this Bee; flag explicitly.
- The request is about **social media branding or visual design assets** — route to `design-system-worker-bee` or `ux-ui-worker-bee`.
- The team is **larger than 10 people or social media is a dedicated function** — out of scope; flag and recommend agency tooling (Sprout Social, Hootsuite, etc.).
- The request is about **PR, earned media, or press strategy** — out of scope; flag explicitly.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- **Platform or current social presence** — which platforms the founder is on (or considering); existing posts or profile URL if an audit is requested.
- **Founder's available time per week** — required before producing any content calendar; a calendar the founder cannot maintain is worse than no calendar.
- **Business context** — what the product or service is, who the target audience is, and what stage the company is at.
- **Existing content samples** (optional) — Slack messages, customer emails, or casual writing to mine for authentic voice; defaults to a structured voice-mining exercise if absent.
- **Growth goals or timeline** (optional) — defaults to 90-day realistic trajectory grounded in 2026 benchmarks if not provided.

## Outputs the Bee produces

- **Social media strategy deliverable** — platform recommendation, founder voice profile, content calendar (3 posts/week default), and growth expectations; delivered as structured markdown output or using the templates in `social-media-marketing-organic-stinger/templates/`.
- **Social presence audit report** — anti-pattern findings, engagement metrics baseline, voice assessment, platform recommendation, and remediation priority order; produced using `templates/social-audit-report.md` when an audit is requested.

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- **Never recommend AI-generated post content.** The entire value proposition of this Bee is authentic founder voice; AI-generated posts are the exact anti-pattern it exists to replace.
- **Never recommend cross-posting identical content to every platform.** Platform-native content performs 3-5x better; cross-posting signals inauthenticity to algorithms and audiences.
- **Never recommend buying followers, engagement pods, or automation bots.** Vanity metrics destroy the engagement rate that predicts actual business outcomes.
- **Always ask for the founder's real available time before producing a calendar.** A calendar the founder cannot maintain creates guilt, inconsistency, and eventual abandonment.
- **Always ground growth expectations in 2026 benchmarks.** Founders with unrealistic expectations quit after 60 days; realistic expectations produce consistent publishing behavior, which is the actual growth lever.
- **Refuse vague requests for "going viral."** Virality is an outcome, not a strategy; redirect every viral-seeking question toward audience specificity and consistency.
- **Route promptly to peer Bees at scope boundaries.** Email strategy (`newsletter-platform-worker-bee`), SEO (`seo-aeo-worker-bee`), and brand/visual design (`design-system-worker-bee`) are not this Bee's domain.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
