# 05 — Answer Engine Optimization (AEO)

Mirrors canonical playbook §6. Featured snippets, FAQ with schema, voice search, AI assistant citation patterns.

**Source research:** `research/2026-04-24-featured-snippets-aeo.md`, `research/2026-04-24-ai-assistant-crawlers.md`.

**Templates:** `templates/components-FAQ.tsx`.

---

## 5.1 Featured-snippet formats

Three dominant formats. Each has its own content shape. Match the shape to the query intent.

### Paragraph snippets (~50%)

Used for "What is X?", "Define X", "Why does X happen?" queries.

```markdown
## What is [Topic]?

[Topic] is [concise 40–60 word definition that directly answers the question
without preamble]. This format is optimized for Google's featured snippets.

[Detailed explanation follows...]
```

Rules:

- **40–60 words** for the answer paragraph.
- Definition-style opener: `[Topic] is [...]`.
- No preamble: not "In this article, we will discuss..."
- Lives immediately after an H2/H3 that matches the question format.

### List snippets (~35%)

Used for "How to X", "Ways to X", "Steps to X", "Types of X".

```markdown
## How to [Do Something]

To [do something], follow these steps:

1. **[Action 1]**: Brief description.
2. **[Action 2]**: Brief description.
3. **[Action 3]**: Brief description.

[Detailed explanation of each step follows...]
```

Rules:

- Numbered list for sequences (how-to, process).
- Bulleted list for unordered sets (types, reasons, benefits).
- Each item: short noun phrase or imperative + brief description.
- 5–10 items optimal. Beyond 20 items, Google truncates.

### Table snippets (~15%)

Used for "X vs Y comparison", "specifications", "pricing", "schedule".

```tsx
<table>
  <thead>
    <tr>
      <th>Feature</th>
      <th>Option 1</th>
      <th>Option 2</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Price</td><td>$10</td><td>$15</td></tr>
    <tr><td>Users</td><td>5</td><td>Unlimited</td></tr>
  </tbody>
</table>
```

Rules:

- **Semantic `<table>`.** CSS `display: table` classes do not count.
- `<thead>` and `<tbody>` present.
- ≤10 rows × 5 columns extracts cleanly. More truncates.

See the `ComparisonTable` component in playbook §6.1 for the canonical React pattern (preserved there).

---

## 5.2 FAQ component with schema

Use `templates/components-FAQ.tsx` for any FAQ section. Two outputs from one source:

1. Accessible accordion UI for humans.
2. FAQPage JSON-LD for Google and AI assistants.

```tsx
import { FAQ } from '@/components/FAQ';

<FAQ items={[
  { question: 'Q1?', answer: 'A1 (conversational, 40–60 words).' },
  { question: 'Q2?', answer: 'A2.' },
]} />
```

**Note on rich result eligibility:** Since March 2024, Google restricts FAQPage rich results to authoritative government and health sites. **Still emit the schema** — it fuels AI Overviews, AI-assistant citations, and accessibility. See `research/2026-04-24-schema-org-structured-data.md`.

### FAQ answer length rule

- Answers: **40–60 words** (same as paragraph snippets).
- Conversational tone (voice-search friendly).
- Answer the question fully in the first sentence; elaborate in the remaining.

---

## 5.3 Voice search optimization

Voice assistants (Google Assistant, Alexa, Siri) pull heavily from featured snippets. Patterns:

- **Conversational question phrasing** in headings. "How do I…" not "Methodology for…".
- **Natural-language answers** that sound correct when read aloud. Read your answer paragraphs out loud — if they stumble, rewrite.
- **Short sentences.** Long sentences break mid-phrase in voice playback.
- **Units and numbers** written out: "twenty dollars per month" alongside "$20/month" when the spoken form matters.

---

## 5.4 AI assistant citation patterns

Layered on top of featured-snippet optimization. To maximize citation by ChatGPT, Perplexity, Claude:

### Required signals

- **Explicit author attribution** — assistants favor pages with clear authorship for citation. See `guides/04-content-quality-eeat.md`.
- **`datePublished` + `dateModified`** in schema AND visible on page. Assistants weight freshness heavily.
- **Question-answer structure.** Same patterns as featured snippets.
- **Schema (Article, FAQPage, HowTo, Product, Service).** Even when no Google rich result renders, the JSON-LD feeds LLM comprehension.
- **Stable URLs.** Assistants may refuse to cite URLs that 404 during answer generation. Keep 301 redirects clean.

### Pages to prioritize for AI citation

- **Glossary / definition pages.** Assistants love short, definition-style articles.
- **Original research / data pages.** Unique data is disproportionately cited (information gain).
- **Long-form guides with clear TOC.** Assistants extract specific sections; clear anchors help.
- **Comparison / "X vs Y" pages.** Frequent citation target in recommendation queries.

### Anti-patterns

- **Gated content** — if the assistant can't fetch the full page, it can't cite.
- **Heavy client-side rendering** — if the article content only appears post-hydration, some AI bots give up.
- **Paywall-only content** — may be crawl-indexed but not cite-able.
- **Duplicate / syndicated content** — AI assistants favor the canonical/original.

### `llms.txt` (emerging, optional)

A proposed convention (https://llms.txt) for providing a curated site map for LLM ingestion. Early 2026 adoption is not mandatory — include as an optional template if the user asks. Does not replace `sitemap.xml` or `robots.txt`.

---

## 5.5 Content types optimized for AEO

| Content type | Best format | Schema |
|---|---|---|
| Definition / "What is X" | Paragraph snippet | `DefinedTerm` (niche) or Article |
| How-to / process | Numbered list + `HowTo` schema | HowTo |
| Comparison | Semantic `<table>` | Article |
| FAQ | Accordion + FAQPage | FAQPage |
| Pricing | Semantic `<table>` | Product or Offer |
| Product detail | Description + bullet features | Product |
| News | Paragraph lead | NewsArticle |
| Opinion / analysis | Paragraph snippet if question, else standard | BlogPosting |

---

## Worked example

`examples/implementation-blog-post.md` — includes the paragraph snippet, list snippet, and FAQ pattern in a single post, with the `FAQ` component and `Schema` components wired up.
