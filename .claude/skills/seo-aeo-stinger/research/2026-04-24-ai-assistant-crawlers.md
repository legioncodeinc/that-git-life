# AI Assistant Crawlers — GPTBot, PerplexityBot, ClaudeBot, Google-Extended

**Sources:**
- https://platform.openai.com/docs/gptbot — GPTBot
- https://openai.com/blog/introducing-chatgpt-and-whisper-apis (background)
- https://docs.perplexity.ai/guides/bots — PerplexityBot (and Perplexity-User for citations)
- https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler — ClaudeBot / anthropic-ai / Claude-Web
- https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers — Google-Extended (for Gemini/Bard training, opt-out-only)
- https://darkvisitors.com/agents — Third-party registry of AI user agents

**Retrieved:** 2026-04-24
**Query used:** "GPTBot PerplexityBot ClaudeBot robots.txt 2026" and "AI assistant citation patterns optimization"

## Summary

Three classes of AI crawler exist in 2025–2026:

1. **Training crawlers** — download pages to incorporate into model training sets (GPTBot, ClaudeBot, anthropic-ai, CCBot for Common Crawl, Google-Extended).
2. **Indexing crawlers** — power retrieval for real-time AI answers (PerplexityBot, OAI-SearchBot).
3. **User-agent crawlers** — fetch a single page in response to a specific user query inside the assistant (Perplexity-User, ChatGPT-User). These are often *not* blockable via robots.txt by policy because they represent a human user's real-time action.

## User agents (exact strings)

| Bot | UA substring | Purpose | robots.txt respected? |
|---|---|---|---|
| GPTBot | `GPTBot` | OpenAI model training | Yes |
| OAI-SearchBot | `OAI-SearchBot` | ChatGPT Search index | Yes |
| ChatGPT-User | `ChatGPT-User` | Single-page fetch on user's behalf | Yes (but OpenAI recommends allowing) |
| ClaudeBot | `ClaudeBot` | Anthropic training | Yes |
| anthropic-ai | `anthropic-ai` | Legacy Anthropic agent | Yes |
| Claude-Web | `Claude-Web` | Anthropic user-agent fetches | Yes |
| PerplexityBot | `PerplexityBot` | Perplexity indexing | Yes |
| Perplexity-User | `Perplexity-User` | Per-user real-time fetch | Partial (Perplexity states this is a user action) |
| Google-Extended | `Google-Extended` | Opt-out-only token for Google AI (Gemini) training — not a UA, a robots.txt directive | Yes |
| CCBot | `CCBot` | Common Crawl (feeds many training corpora) | Yes |

## robots.txt policy choices

The decision is business, not technical. Options:

1. **Allow all AI bots** — maximizes discoverability in AI answers. Accepts training on your content. Best for marketing-led / top-of-funnel content sites where citation is the goal.
2. **Block training bots, allow indexing/user bots** — keeps content out of model training corpora but still reachable for real-time AI answers with citation. Middle path.
3. **Block everything** — strongest stance; sacrifices AI-assistant discoverability. Appropriate for paid content, subscriber-only, or content whose commercial value depends on exclusivity.

Default in the Stinger templates: **allow all** with a note. The canonical playbook §2.4 allows GPTBot and CCBot explicitly. User sets the policy; the Bee must not silently change it.

## AEO (Answer Engine Optimization) citation patterns

For content to surface as a cited source in ChatGPT, Perplexity, or Claude answers:

- **Explicit author attribution** — assistants favor pages with clear authorship for citation.
- **Dated content** — `datePublished` and `dateModified` in schema and visible on page; assistants weight freshness.
- **Question-answer structure** — the paragraph/list/table snippet patterns that feed featured snippets also feed AI answers.
- **Schema FAQ/HowTo/Article** — even when no Google rich result renders, the JSON-LD feeds AI comprehension.
- **Stable URLs** — assistants may refuse to cite URLs that 404 during answer generation. Keep redirects (301) clean.
- **`llms.txt` (emerging)** — a proposed convention (https://llms.txt) for providing a curated map of a site's most useful content for LLM ingestion. Adoption is early-2026 and non-mandatory; include as optional template but do not require it.

## Relevance to this stinger

- `guides/01-technical-foundation.md` covers robots.txt policy with an explicit decision point.
- `guides/05-answer-engine-optimization.md` captures the citation-pattern playbook.
- `templates/app-robots.ts` ships with the playbook's allow-all default and inline comments explaining the tradeoff.
- The "three parallel discovery systems" directive is rooted here — AI assistants are the third system, and this file is the ground truth for that system's crawl mechanics.
