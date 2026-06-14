# 04 — Content Quality & E-E-A-T

Mirrors canonical playbook §5. Covers the E-E-A-T framework, content structure for AI extraction, author attribution, and freshness.

**Source research:** `research/2026-04-24-eeat-quality-rater-guidelines.md`.

**Templates:** `templates/components-Author.tsx`.

---

## 4.1 The E-E-A-T framework

Four signals Google's quality raters use to score page quality. Not direct ranking factors — but signals raters look for correlate strongly with algorithmic ranking systems.

- **Experience** (added December 2022) — first-hand, lived experience with the topic. A product reviewer who owns the product. A medical writer who underwent the treatment.
- **Expertise** — credentials, training, demonstrated deep knowledge.
- **Authoritativeness** — external recognition as a go-to source. Citations, inbound links, Wikipedia presence, industry awards.
- **Trustworthiness** — the foundation. Accurate, transparent, safe, honest. Untrustworthy pages cannot be rescued by the other three.

### YMYL (Your Money or Your Life)

Topics impacting happiness, health, financial stability, or safety. Medical, legal, financial, news, civic. **Strictest E-E-A-T bar.** On YMYL topics, missing author attribution is a Critical finding; elsewhere High.

---

## 4.2 Content structure for AI extraction

The rules in playbook §5.2, preserved:

### Question-answer format

```markdown
## How Does [Topic] Work?

**Short Answer (40–60 words):**
[Direct, concise answer that fully addresses the question. This is what AI systems extract.]

**Detailed Explanation:**
[Comprehensive explanation with supporting evidence, examples, details.]

### Key Points:
- Point 1 with specific details
- Point 2 with data or statistics
- Point 3 with practical application

**Supporting Evidence:**
[Citations, studies, data.]
```

### The "Quick Answer" box

Canonical pattern from playbook §5.2 (preserved in source):

```tsx
<div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
  <h3 className="text-lg font-semibold mb-2">Quick Answer:</h3>
  <p className="text-gray-800 leading-relaxed">{shortAnswer}</p>
</div>
```

This is not decoration — it's structural. The 40–60-word direct answer, visually separated, is explicitly shaped for Google's paragraph-snippet algorithm AND for AI-assistant extraction.

### Key Takeaways list

Short, scannable list at the end of long content. AI systems favor list extraction for bullet-format summaries.

### Sources & References

Visible at the bottom of every substantive content page. Linked out to primary sources (not just Wikipedia). An inline `[1]`, `[2]` reference system ties claims to sources.

---

## 4.3 Author attribution

Every content page has:

1. **Visible byline** at the top of the article.
2. **Link from byline to an author page** at `/authors/{slug}`.
3. **Author schema** on the article (`author: { '@type': 'Person', name, url }`).
4. **Person schema** on the author page with credentials (`jobTitle`, `worksFor`, `alumniOf`, `knowsAbout`, `sameAs`).

The `AuthorBio` component (`templates/components-Author.tsx`) renders the visible bio with:

- Headshot (Next Image, optimized).
- Name + role.
- Bio (2–3 sentences).
- Credentials (bulleted list).
- Social links (`sameAs` targets — Twitter, LinkedIn, website).

### Author page requirements

```
app/authors/[slug]/page.tsx
```

Every author mentioned in any article byline gets a page. The page emits `Person` schema with:

```jsonc
{
  "@type": "Person",
  "@id": "https://yourdomain.com/authors/jane-doe#person",
  "name": "Jane Doe",
  "jobTitle": "Senior Editor",
  "worksFor": { "@type": "Organization", "@id": "https://yourdomain.com/#organization" },
  "alumniOf": "University Name",
  "knowsAbout": ["topic 1", "topic 2"],
  "sameAs": [
    "https://twitter.com/janedoe",
    "https://linkedin.com/in/janedoe",
    "https://janedoe.com"
  ]
}
```

### Anti-pattern: "by Admin" or missing author

Flag as:

- **Critical** on YMYL topics (health, finance, legal, news).
- **High** on everything else.

AI assistants deprioritize citing pages without attributable authorship. Featured snippets still fire without authorship, but E-E-A-T drift compounds over time.

---

## 4.4 Content freshness

### Visible dates (mandatory)

Every content page displays:

- **Published:** original publication date (`datePublished` in schema).
- **Last Updated:** most recent substantive edit (`dateModified`).

Both use `<time dateTime={ISO}>` for machine readability. Example: `<time dateTime="2026-04-24">April 24, 2026</time>`.

### Freshness threshold

The `ContentMetadata` component (playbook §5.4, preserved in source) displays a "Recently Updated" badge when `dateModified` is within 90 days. Tune as needed, but the 90-day window is a good default — AI assistants treat content older than ~1 year as stale on drifting topics.

### Review process for evergreen content

- Schedule a quarterly review of high-traffic pages.
- Any substantive update bumps `dateModified` AND is reflected in the sitemap's `lastModified`.
- Cosmetic edits (typo fixes) do not warrant a `dateModified` bump — would mislead both humans and algorithms.

### "Reviewed by" attribution (optional, YMYL)

Some sites add a "Medically reviewed by" or "Fact-checked by" byline alongside the author. On YMYL topics this is a legitimate E-E-A-T signal. In schema, add:

```jsonc
"reviewedBy": {
  "@type": "Person",
  "name": "Dr. Reviewer Name",
  "jobTitle": "Medical Director",
  "url": "https://yourdomain.com/authors/dr-reviewer"
}
```

---

## 4.5 The structural-not-cosmetic directive

The brief's SUBAGENT CRITICAL DIRECTIVE: "E-E-A-T signals are structural, not cosmetic."

Concretely:

- Author byline in visible DOM + in schema. Not just a CSS pseudo-element.
- Dates as `<time>` elements with `dateTime` attributes. Not just styled text.
- Sources as `<a>` elements linking out. Not just visual citations.
- Credentials in the Person schema, not just visible text on the bio page.

AI systems (both Google's extractors and LLM assistants) parse the DOM structure. Cosmetic-only attribution is invisible to them.

---

## Worked example

`examples/implementation-blog-post.md` — shows the full author attribution + freshness + content structure pattern on a single post.
