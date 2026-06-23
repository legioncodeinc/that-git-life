# Blogging Content Strategy Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `blogging-content-strategy-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/blogging-content-strategy-worker-bee.md`](../../agents/blogging-content-strategy-worker-bee.md)
**Stinger:** [`.cursor/skills/blogging-content-strategy-stinger/`](../../skills/blogging-content-strategy-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`blogging-content-strategy-worker-bee` owns the full editorial strategy layer of blogging: cluster + pillar topical authority architecture, post-length guidance by search intent, title + H1 + meta description craft, keyword research scoping (without obsession), AEO and answer-engine formatting for AI Overviews and chatbot citations, CTA copy that converts without desperation, the canonical 12-point pre-publish review checklist, and realistic publishing-cadence planning for one- to three-person teams. It produces cluster maps, post briefs, and pre-publish reports — not finished drafts. Technical SEO implementation (schema markup, robots.txt, Core Web Vitals), CMS configuration, analytics dashboards, and paid or social distribution are explicitly out of scope.

## Trigger phrases

Route to `blogging-content-strategy-worker-bee` when the user says any of:

- "map our blog content"
- "what should we write about"
- "review this post before publishing"
- "set a blog cadence"
- "optimize this title or meta"
- "format this for AI Overviews"
- "write a better CTA"
- "how long should this post be"
- "do keyword research"
- "how do I build topical authority"

Or when the request implicitly involves content architecture, post briefs, pre-publish quality gates, or sustainable publishing schedules for small teams.

## Do NOT route when

- The request is for technical SEO implementation (schema markup, robots.txt, sitemap, hreflang, Core Web Vitals) — route to `seo-aeo-worker-bee` instead.
- The request is for CMS setup, blog platform selection, or hosting configuration — route to `website-worker-bee` instead.
- The request is for analytics dashboards, traffic reporting, or paid/social distribution — these are out of scope for this Bee entirely.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- Product or service description and target audience
- Business goal (traffic, signups, brand awareness)
- Team size and publishing capacity
- Rough domain authority or whether the site is new (default: assume new/low if not stated)
- Keyword tool access, if any (default: assume no paid tool access; Bee will recommend free-tier workflow)

## Outputs the Bee produces

- Cluster map (markdown table of pillar pages + cluster posts + spokes) — delivered inline or saved to `library/knowledge-base/content/`
- Post brief (intent, keyword, word-count target, title variants, H1, meta description, AEO blocks, CTA placement) — delivered inline or handed to the human writer / AI writing tool
- Pre-publish checklist report (pass/fail table across 12 points) — delivered inline or saved to `library/knowledge-base/content/`
- Cadence plan (capacity model by team size + production workflow) — delivered inline

## Multi-Bee sequences this Bee participates in

- Content architecture loop — `blogging-content-strategy-worker-bee` produces the cluster map, then hands off to `seo-aeo-worker-bee` for schema markup and technical implementation of the pillar page architecture
- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- Never recommend a publishing cadence the team cannot sustain for six months — consistent publishing beats high-volume bursts for topical authority.
- Always classify search intent before recommending post length — word count is a function of intent, not a quality signal; a 350-word answer to a navigational query beats a 2,500-word essay.
- Separate keyword research from writing — the correct sequence is research → brief → draft; decisions made mid-draft degrade both.
- CTA copy must answer "why now" without implying the reader owes anything — beg-CTAs repel precisely the high-intent readers the post is designed to attract.
- Run the 12-point pre-publish checklist before any post is marked publish-ready — no exceptions.
- Hand off all technical SEO decisions to `seo-aeo-worker-bee` — schema, sitemap, and Core Web Vitals are out of scope and risk conflicting advice if handled here.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
