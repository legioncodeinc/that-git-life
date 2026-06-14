# Alt Ads Platforms Guardian — God's Guide

The God routing skill's record of when to invoke `alt-ads-platforms-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`ai-tools/agents/alt-ads-platforms-guardian.md`](../../agents/alt-ads-platforms-guardian.md)
**Weapon:** [`ai-tools/skills/alt-ads-platforms-weapon/`](../../skills/alt-ads-platforms-weapon/)
**Command Brief:** [`ai-tools/command-briefs/alt-ads-platforms-guardian-command-brief.md`](../../../command-briefs/alt-ads-platforms-guardian-command-brief.md)
**Trigger policy:** proactive

---

## Domain

`alt-ads-platforms-guardian` owns paid acquisition strategy and implementation across 10 alternative platforms: LinkedIn Ads (B2B Lead Gen Forms, Thought Leader Ads, ABM company lists), TikTok Ads (Smart+ 2026 default, CAPI wiring), Reddit Ads (community/subreddit targeting, AI citation compound value), Microsoft/Bing Ads (LinkedIn Profile Targeting layer, UET + Enhanced Conversions), X/Twitter Ads (brand/thought leadership only; platform volatile), Pinterest Ads (Shopping Catalogs, 70-90 day attribution), Quora Ads (comparison-intent B2B niche), YouTube standalone video (TrueView, Bumpers, Shorts), Spotify Ad Studio + podcast advertising (host-read vs produced, promo code attribution), and the channel-fit-by-ICP heuristic that selects among them. The Angel is diagnosis-first: it always scores ICP-to-platform fit before any campaign setup, and it will tell you when a channel is wrong rather than just how to run ads on it.

## Trigger phrases

Route to `alt-ads-platforms-guardian` when the user says any of:

- "which ad platform should I use besides Meta/Google"
- "set up LinkedIn Ads" / "LinkedIn Ads for B2B SaaS" / "LinkedIn Lead Gen Forms"
- "TikTok CAPI setup" / "TikTok Ads conversion tracking" / "TikTok Smart+"
- "Reddit Ads for [technical audience]" / "Reddit community targeting"
- "Microsoft Ads LinkedIn targeting" / "Bing Ads LinkedIn Profile Targeting"
- "Spotify Ad Studio" / "podcast advertising" / "audio ads"
- "Pinterest Shopping Ads" / "Pinterest Catalogs"
- "Quora Ads B2B" / "Quora question targeting"
- "YouTube video ads" (when run as standalone brand channel)
- "channel diversification" / "paid acquisition beyond Meta and Google"
- "our Meta CPL is too high, what else should we try"
- "channel fit for our ICP"

Or when the request implicitly involves selecting, setting up, or diagnosing paid campaigns on any of the 10 alternative platforms.

## Do NOT route when

- **Meta Ads / Facebook / Instagram:** No peer Angel today. Handle inline or flag as out of scope for this Angel. Do not route to `alt-ads-platforms-guardian`.
- **Google Search Ads / Google Display Network:** No peer Angel today. Handle inline or flag.
- **Organic social content strategy (LinkedIn posts, TikTok organic, Reddit organic):** Route to `social-media-marketing-organic-guardian`.
- **Cold email / outbound sequences:** Route to `cold-outreach-guardian`.
- **CRM schema design for ad attribution tables:** Route to `db-guardian`.
- **Analytics pixel implementation in React/Next.js codebase:** Route to `react-guardian` for implementation; `alt-ads-platforms-guardian` specifies what to implement.
- **GDPR/CCPA compliance audit of tracking pixels:** Route to `security-guardian`.

If a request straddles Meta/Google vs alternative channels, route the alternative-channel work to `alt-ads-platforms-guardian` and handle Meta/Google inline.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- **ICP description:** target industry, company size, job title, buying trigger, geography (required for channel-fit diagnosis).
- **Monthly ad budget:** total budget across all channels (required — determines which platforms meet MVS).
- **Conversion goal:** leads/demos, purchases, app installs, brand awareness (shapes platform recommendations).
- **Existing channels:** which platforms are already running and at what performance level (for diversification context).
- **Creative assets available (optional):** static images, video, audio, blog content — constrains which platforms are feasible.

If ICP and budget are missing, ask for them before any setup guidance.

## Outputs the Angel produces

- **Channel-fit scorecard:** Ranked platform scores with rationale, recommended channel stack (primary + test), and budget allocation. Filed using `templates/channel-fit-scorecard.md`.
- **Campaign architecture doc:** Targeting layers, campaign structure, bid strategy, and budget pacing for selected platforms.
- **Creative requirements spec:** Format specs, copy limits, A/B testing framework per `templates/creative-specs-table.md`.
- **CAPI wiring instructions:** Step-by-step server-side Conversions API setup per `guides/12-capi-wiring.md`.
- **Launch checklist:** Per-platform QA checklist per `templates/campaign-launch-checklist.md`.
- **UTM schema:** Consistent parameter definitions per `templates/utm-naming-convention.md`.
- For full engagements, filed at `library/requirements/paid-acquisition/` (or inline for quick diagnostics).

## Multi-Angel sequences this Angel participates in

- **Paid acquisition + CRM schema:** `alt-ads-platforms-guardian` specifies the lead data fields (source, campaign, channel, ad variant); `db-guardian` designs the attribution schema.
- **Paid acquisition + security audit:** `alt-ads-platforms-guardian` implements pixel/CAPI tracking; `security-guardian` audits PII data handling and GDPR/CCPA compliance.
- **Paid acquisition + analytics implementation:** `alt-ads-platforms-guardian` defines what conversion events to track; `react-guardian` implements the pixel/CAPI JavaScript in the product codebase.
- **GTM strategy:** `library-guardian` authors the ICP/GTM PRD and target audience definition; `alt-ads-platforms-guardian` implements the paid acquisition program against it.

## Critical directives the orchestrator should respect

- Always run channel-fit diagnosis (scoring matrix) before any platform setup work.
- State MVS thresholds explicitly when user budget is below them; do not skip this.
- Always include CAPI in TikTok, LinkedIn, and Microsoft/Bing setups — pixel-only is incomplete in 2026.
- X/Twitter Ads guidance requires a quarterly-review caveat; always tell users to verify current platform status.
- Benchmark CPLs are stated as ranges; 2-3x above benchmark is normal for initial campaigns.

(Full list lives in `alt-ads-platforms-guardian.md`'s `## Critical directives` section.)

---

*Part of God's roster. See [`ai-tools/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
