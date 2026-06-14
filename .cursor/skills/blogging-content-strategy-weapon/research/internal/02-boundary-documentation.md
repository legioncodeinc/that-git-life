---
source_url: internal://command-briefs/blogging-content-strategy-guardian-command-brief.md
retrieved_on: 2026-05-20
source_type: internal-brief
authority: official
relevance: critical
topic: boundaries
weapon: blogging-content-strategy-weapon
---

# Boundary Documentation: Overlap with seo-aeo-guardian and newsletter-platform-guardian

## Summary

This weapon pairs closely with two other Legion Angels. Getting the handoff lines right prevents scope creep and quality dilution. This file defines the exact boundaries so weapon-forge can encode clear escalation paths in SKILL.md and guides.

## Boundary 1: seo-aeo-guardian

### What seo-aeo-guardian owns (NOT this weapon)
- Canonical tags and hreflang configuration
- robots.txt and crawl budget management
- Core Web Vitals optimization (LCP, INP, CLS)
- Schema markup implementation (the JSON-LD code, not the conceptual structure)
- Site architecture and URL structure
- Internal link equity distribution (technical crawl layer)
- Image compression and technical image SEO
- Page speed and render-blocking resources

### What blogging-content-strategy-guardian owns (THIS weapon)
- Which content to write and how to structure it
- Heading hierarchy (H1/H2/H3) from an editorial perspective
- AEO formatting concepts (question-based headings, definition blocks, FAQ sections, concise paragraphs) — the WHAT, not the HOW of JSON-LD
- Internal linking from an editorial strategy perspective (which posts should link to which)
- Content cluster architecture (the editorial model, not the technical crawl model)
- Title tags and meta descriptions (the copy, not the technical implementation)

### The handoff rule (from Command Brief)
> "If it involves HTML meta tags or server response codes, route to `seo-aeo-guardian`. If it involves what to write and how to structure it, route here."

### Practical examples

| Task | Owner |
|---|---|
| "Should this post target this keyword?" | blogging-content-strategy-guardian |
| "Write the title tag and meta description copy" | blogging-content-strategy-guardian |
| "Implement the title tag in the CMS" | seo-aeo-guardian |
| "Add FAQPage schema JSON-LD to this post" | seo-aeo-guardian |
| "Structure this post's headings for AEO" | blogging-content-strategy-guardian |
| "Fix the canonical tag for this URL" | seo-aeo-guardian |
| "Add internal links to this post" | blogging-content-strategy-guardian |
| "Audit crawl efficiency of internal link graph" | seo-aeo-guardian |
| "Write a topic cluster architecture for this site" | blogging-content-strategy-guardian |
| "Optimize Core Web Vitals on the blog" | seo-aeo-guardian |

### How to surface the handoff in the weapon
When `blogging-content-strategy-guardian` identifies a technical SEO issue (e.g., a canonical tag problem, a slow-loading page affecting a cluster), it must:
1. Note the finding in its output
2. Explicitly state: "This requires `seo-aeo-guardian` — route there for [specific issue]"
3. NOT attempt to fix or recommend the technical implementation itself

---

## Boundary 2: newsletter-platform-guardian

### What newsletter-platform-guardian owns (NOT this weapon)
- Platform selection (Beehiiv, ConvertKit, Loops, Substack, Resend, Ghost)
- Email deliverability, SPF/DKIM/DMARC, domain warmup
- Subscriber lifecycle and segmentation strategy
- Newsletter monetization (ad networks, paid subscriptions, sponsorships)
- Email template and design for newsletters
- Platform migration (e.g., Substack to Beehiiv)

### What blogging-content-strategy-guardian owns (THIS weapon)
- Recommending "cross-post to newsletter" as a distribution step in the content workflow
- The CTA that invites blog readers to subscribe to a newsletter
- Whether and how blog content should be repurposed into newsletter format (the editorial decision, not the platform configuration)
- The relationship between blog cluster strategy and newsletter content planning (editorial alignment)

### The handoff rule (from Command Brief)
> "`newsletter-platform-guardian` owns the email distribution layer; this Angel may recommend 'cross-post to newsletter' in the distribution checklist but does not configure the platform."

### Practical examples

| Task | Owner |
|---|---|
| "Should I repurpose this blog post into a newsletter?" | blogging-content-strategy-guardian |
| "Write a newsletter CTA for this blog post" | blogging-content-strategy-guardian |
| "Set up Beehiiv for my blog" | newsletter-platform-guardian |
| "Configure double opt-in on my newsletter" | newsletter-platform-guardian |
| "How often should I send my newsletter?" | newsletter-platform-guardian |
| "How does my blog calendar align with newsletter sends?" | blogging-content-strategy-guardian (editorial) |
| "How do I import my subscriber list from Mailchimp?" | newsletter-platform-guardian |

---

## Boundary 3: website-guardian

### What website-guardian owns (NOT this weapon)
- Landing page architecture and conversion rate optimization
- Website hosting and deployment
- Overall site information architecture
- Product and pricing page copy strategy

### What blogging-content-strategy-guardian owns (THIS weapon)
- Blog section architecture and cluster structure
- Blog post page layout recommendations (from an editorial perspective)
- Content positioning relative to the buyer journey

### Practical note
This boundary is less common to hit in practice. Most handoffs to `website-guardian` are triggered when the user asks about non-blog pages (product pages, landing pages, the homepage).

---

## Annotations for weapon-forge

- SKILL.md trigger phrases should explicitly exclude: "set up Beehiiv/ConvertKit", "fix canonical", "Core Web Vitals", "robots.txt", "schema JSON-LD"
- SKILL.md should include a "DO NOT USE FOR" list that references all three boundary Angels by name
- `guides/01-cluster-pillar-architecture.md` should note that the pillar/cluster architecture is an editorial concept; the technical internal-link audit is `seo-aeo-guardian`'s domain
- `guides/05-aeo-formatting.md` must distinguish clearly: "This guide covers the editorial layer (content structure, heading choices, FAQ section authoring). For implementing FAQPage schema markup in JSON-LD, route to `seo-aeo-guardian`."
