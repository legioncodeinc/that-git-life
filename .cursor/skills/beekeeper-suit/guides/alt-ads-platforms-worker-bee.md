# Alt Ads Platforms Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `alt-ads-platforms-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/alt-ads-platforms-worker-bee.md`](../../agents/alt-ads-platforms-worker-bee.md)
**Stinger:** [`.cursor/skills/alt-ads-platforms-stinger/`](../../skills/alt-ads-platforms-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`alt-ads-platforms-worker-bee` owns paid acquisition strategy and campaign setup across the 10 alternative ad platforms: LinkedIn Ads, TikTok Ads, Reddit Ads, Microsoft/Bing Ads, X/Twitter Ads, Pinterest Ads, Quora Ads, YouTube standalone video, Spotify Ad Studio, and the broader podcast advertising ecosystem. It is diagnosis-first: before any campaign setup work, it runs an ICP-to-platform channel-fit scoring step and will explicitly tell users when a platform is the wrong choice for their audience. It is calibrated for founders and small growth teams (1–3 marketers) diversifying away from saturated Meta/Google channels, with monthly budgets ranging from $1,000 to $20,000. It does not own Meta/Facebook/Instagram Ads, Google Search Ads, organic social posting, CRM schema design, pixel code implementation in a React/Next.js codebase, or GDPR/CCPA compliance audits — those are escalated to peer Bees.

## Trigger phrases

Route to `alt-ads-platforms-worker-bee` when the user says any of:

- "which ad platform beyond Meta/Google for my ICP"
- "set up LinkedIn Ads for B2B SaaS"
- "TikTok CAPI setup"
- "Reddit Ads for developers / technical buyers"
- "Microsoft Ads LinkedIn targeting"
- "podcast advertising on Spotify Ad Studio"
- "channel diversification for paid acquisition"
- "our Meta CPL is too high, what else should we try"

Or when the request implicitly involves selecting or launching a paid campaign on any platform outside of Meta/Facebook/Instagram and Google Search.

## Do NOT route when

- The user is asking about Meta Ads, Facebook Ads, or Instagram Ads — no peer Bee owns this today; handle inline or flag.
- The user is asking about Google Search Ads — no peer Bee owns this today; handle inline or flag.
- The user wants organic social content strategy — route to `social-media-marketing-organic-worker-bee`.
- The user needs CRM schema design for ad attribution or lead status fields — route to `db-worker-bee`.
- The user needs analytics pixel or conversion tag implementation inside a React/Next.js codebase — route to `react-worker-bee`.
- The user needs a GDPR/CCPA compliance audit of tracking pixels — route to `security-worker-bee`.
- The user needs cold outreach or email sequences — route to `cold-outreach-worker-bee`.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- **ICP description** — job title, seniority, company size, industry, or consumer demographic the campaign must reach.
- **Monthly ad budget** — required to apply minimum viable spend threshold gates (LinkedIn <$1,500/month; TikTok <$50/day floor).
- **Business model / offer type** — B2B SaaS, D2C, app install, or lead-gen; determines which platforms are scored as viable.
- **Existing channel context** — which platforms are already running (optional; defaults to assuming no prior campaigns).
- **Conversion goal** — lead form submission, purchase, app install, brand awareness (optional; defaults to lead generation if not stated).

## Outputs the Bee produces

- **Channel-fit scorecard** — ranked primary + test + hold channel stack using `templates/channel-fit-scorecard.md`, delivered as a filled-in table with budget allocation and MVS pass/fail status.
- **Campaign architecture spec** — campaign objectives, audience targeting layers, bid strategy, and budget pacing for each selected platform, per `guides/11-campaign-architecture.md`.
- **Creative requirements brief** — format specs, copy limits, aspect ratios, and A/B testing variable per `templates/creative-specs-table.md`.
- **CAPI wiring instructions** — dual pixel + server-side CAPI setup for TikTok, LinkedIn, and Microsoft/Bing, per `guides/12-capi-wiring.md`.
- **Launch checklist** — per-platform pre-launch QA using `templates/campaign-launch-checklist.md`.
- **Success metrics framework** — CPL target ranges, volume targets, frequency caps, and 60-day scale/pivot/kill criteria.

## Multi-Bee sequences this Bee participates in

- Channel diversification plan — this Bee runs first (channel fit + campaign architecture), then hands off to `db-worker-bee` (CRM attribution schema), `react-worker-bee` (pixel implementation), and `security-worker-bee` (GDPR/CCPA audit).
- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`.

## Critical directives the orchestrator should respect

- **Channel-fit diagnosis before any setup.** Never begin platform-specific campaign architecture until the ICP-to-platform scoring matrix is complete. An incorrectly selected channel cannot be rescued by good execution.
- **Minimum viable spend thresholds are gates, not guidelines.** LinkedIn under $1,500/month and TikTok under $50/day produce unoptimizable data. State the threshold explicitly every time the budget falls below it.
- **CAPI is the 2026 baseline for TikTok, LinkedIn, and Microsoft/Bing.** Pixel-only attribution is ~60–70% accurate post-iOS 14.5. Never deliver a pixel-only setup as complete.
- **Depth over breadth.** Never recommend more platforms than the team can execute at full optimization cadence. One well-run campaign beats three mediocre ones.
- **State benchmark CPL ranges, not single numbers.** Initial testing typically runs 2–3x above mature-campaign benchmarks; a single CPL target sets false expectations.
- **X/Twitter requires a quarterly review caveat.** Always tell the user to verify current platform status at business.twitter.com before acting on X Ads guidance.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
