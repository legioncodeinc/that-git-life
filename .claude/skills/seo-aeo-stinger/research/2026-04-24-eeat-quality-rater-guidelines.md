# E-E-A-T — Experience, Expertise, Authoritativeness, Trustworthiness

**Sources:**
- https://services.google.com/fh/files/misc/hsw-sqrg.pdf — Search Quality Rater Guidelines (SQRG), current edition
- https://developers.google.com/search/blog/2022/12/google-raters-guidelines-e-e-a-t — E-E-A-T introduction post (added the second E — Experience — December 2022)
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content — Helpful, reliable, people-first content
- https://developers.google.com/search/updates/ranking — Core algorithm updates context

**Retrieved:** 2026-04-24
**Query used:** "E-E-A-T content signals technical implementation" and "Google Search Quality Rater Guidelines 2025"

## Summary

E-E-A-T (pronounced "double-E-A-T") is the framework Google's human quality raters use to score page quality. It is not a direct ranking factor — rater scores feed algorithmic training, not live ranking — but the signals raters look for correlate strongly with systems Google does rank on. E-E-A-T became E-E-A-T (from E-A-T) in December 2022 with the addition of **Experience**: first-hand, lived experience with the topic.

The four signals (in the order raters weight them for YMYL — Your Money or Your Life — topics):

- **Experience** — Has the author personally done/used/witnessed what they describe? A product review from someone who owns the product. A medical explainer from a patient who underwent treatment.
- **Expertise** — Credentials, training, demonstrated deep knowledge of the topic.
- **Authoritativeness** — External recognition as a go-to source. Citations, backlinks from authoritative sites, industry awards, Wikipedia presence.
- **Trustworthiness** — The foundation. Accurate, transparent, safe, honest. Untrustworthy pages can't be rescued by the other three.

## How E-E-A-T signals become technical implementation

The brief's SUBAGENT CRITICAL DIRECTIVE: "E-E-A-T signals are structural, not cosmetic." Translated to Next.js:

### Author attribution

- Every content page has a visible author byline.
- Author byline links to an `/authors/{slug}` page with credentials, bio, social `sameAs` links.
- Page schema includes `author: { '@type': 'Person', name, url }` pointing at that page.
- Person schema on the author page includes `jobTitle`, `worksFor`, `alumniOf`, `knowsAbout`, `sameAs`.

### Content freshness

- Visible `datePublished` and `dateModified` on every content page.
- `dateModified` in schema matches the visible date.
- Stale content (not updated in 12+ months on drifting topics) flagged for review.
- Ideally: a visible "Last reviewed by" byline for high-YMYL topics.

### Citations & sources

- External citations link out to primary sources (not just Wikipedia).
- Citations visible in the page, not hidden in tooltips.
- Inline numeric refs (`[1]`, `[2]`) back to a sources section with full titles, authors, publications.

### Trustworthiness surface area

- HTTPS everywhere. Valid cert. HSTS.
- Privacy policy, terms of service, contact page with real address / phone for businesses.
- Clear editorial policy on About page for content sites.
- No deceptive design patterns (dark patterns, hidden subscription traps, etc.).

## YMYL topics

"Your Money or Your Life" — topics that can impact happiness, health, financial stability, or safety. Medical, legal, financial, news, civic, safety. Raters apply the strictest E-E-A-T bar to YMYL pages.

## Relevance to this stinger

- `guides/04-content-quality-eeat.md` encodes the E-E-A-T framework verbatim from playbook §5.1.
- `templates/components-Author.tsx` (the AuthorBio component) wires the visible byline + schema-compatible fields.
- The Bee must flag any content page missing author attribution as a Critical finding for YMYL topics, High otherwise.
- Cross-reference: `library-worker-bee` owns editorial policy documents; the Bee flags missing policy pages but doesn't author them.
