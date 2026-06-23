# Research Protocol

A Stinger is only as credible as the research behind it. This protocol keeps research rigorous, attributable, and maintainable over time.

---

## The rule

**Nothing factual enters a guide without a source in `research/`.**

If you write "canonical tags must point to a fully-qualified URL" in a guide, there must be a file in `research/` citing the Google Search Central page that says so. If you can't cite it, either research it until you can or remove the claim.

---

## Using web_search_exa

`web_search_exa` is the primary research tool. It returns semantic search results with URLs, titles, and snippets. Use it for:

- Canonical documentation (framework docs, RFCs, standards)
- Authoritative analysis (blog posts from recognized experts)
- Current best practice (dated posts from the last 18 months)
- Counter-opinions — search for "X considered harmful" or "mistakes with X"

Phrase queries naturally. `web_search_exa` does well with question-style queries ("how should canonical tags be implemented in Next.js 15?") and poorly with keyword soup ("canonical tags next.js").

Queries to consider for every research pass:

1. A query for the authoritative documentation
2. A query for common mistakes or anti-patterns
3. A query for recent updates or changes in the last 12 months
4. A query for the adjacent topics the Bee might encounter

---

## Other research tools

If additional MCPs are available, use them when they fit:

- **WebFetch** — when a specific URL is cited in REFERENCE MATERIAL, fetch it directly. Don't rely on search for known URLs.
- **Notion, Confluence, Google Drive, Box, SharePoint** — for internal documentation. Always check whether the brief's REFERENCE MATERIAL mentions internal sources before going external.
- **GitHub MCP** — when the domain involves code patterns, search repositories for canonical implementations.
- **Slack** — when the brief mentions "ask #channel-name", search the channel's history.

If a tool the brief mentions is not available in the current environment, note the gap in `research/gaps.md` and proceed with what's available. Do not block the forge over a missing tool.

---

## Recording findings

Every research session produces files in `research/`. Use this file name pattern:

```
research/YYYY-MM-DD-<topic-slug>.md
```

Each file should be a self-contained note:

```markdown
# <Topic>

**Source:** <URL>
**Retrieved:** <YYYY-MM-DD>
**Query used:** <exact query string>

## Summary
<2–4 sentence summary of what this source teaches>

## Key quotations
> "..."

## Data and statistics
- <number>: <what it measures>

## Relevance to this stinger
<Your annotations on how this fits the Bee's job>
```

A `research/README.md` at the folder's root can list the notes and their topics for quick navigation once there are more than five or six.

---

## When to stop researching

You do not need to find every source. You need enough to:

1. Justify each rule in the guides.
2. Handle the common cases the Bee will see.
3. Recognize when the Bee is in unfamiliar territory (so it can escalate).

As a rough heuristic: three to seven research files per Stinger is typical. Less suggests the research was superficial; more suggests the Stinger's scope is too broad and should have been split into two Bees at brief time.

---

## Research gaps

If you finish research with open questions the user should resolve (because they're organization-specific or judgment calls), write them to `research/open-questions.md` and pause for user input before writing the affected guides. Don't guess on things the user can answer.

Examples of questions that belong in `open-questions.md`:

- "Which internal channel should seo-worker-bee post to when it flags a blocker?"
- "Is there a deprecation timeline for our existing analytics library that should influence this guide?"
- "What's our organization's stance on X, which is contested in the industry?"
