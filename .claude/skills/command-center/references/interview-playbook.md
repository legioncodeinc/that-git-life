# The Command Brief Interview Playbook

This is a field manual for running a brief interview that produces a real, usable Command Brief — not a shell of placeholder text. Use these question banks, dialogue moves, and heuristics to keep the conversation productive.

---

## Principles

1. **One section at a time.** Finish each section in the template before moving to the next. Skipping around produces inconsistent depth.
2. **Ask why, not just what.** "Why do we need this Bee?" unlocks better answers than "What does this Bee do?"
3. **Write as you go.** Edit the brief file after every substantive answer so the user can see the shape forming and correct early.
4. **Resist the urge to scope-creep.** If the user suggests adding a capability that feels like a second Bee's job, name that and propose a separate brief.
5. **Every section needs one concrete example.** If a user's answer to EXPECTED OUTPUT is "a report", push for an example headline, an example data point, a format.

---

## Section-by-section question bank

### IDENTITY & RESPONSIBILITY

Goal: One paragraph that describes the Bee as a character with a clear job.

- "If this Bee had a one-line LinkedIn bio, what would it say?"
- "Who would be upset if this Bee didn't exist? Whose job does it support?"
- "What's one task the Bee should refuse to take on because it's out of scope?"
- "Is there a human role this Bee resembles? (security engineer, copy editor, DBA)"

**Red flag answers:** "It does everything security-related." Push back — ask them to describe a typical invocation.

### EXPECTED INPUT

Goal: Concrete enumeration of what the orchestrator will hand to this Bee.

- "What information does the Bee need to do its job?"
- "Will the orchestrator pass file paths, code diffs, natural-language descriptions, or structured data?"
- "If a piece of context is missing, should the Bee ask for it, make a best guess, or refuse to proceed?"
- "Are there preconditions the Bee should check before starting work?"

**Write the answer as a bulleted list of inputs with a one-line description each.** This section doubles as the Bee's input schema.

### ACTION

Goal: The verbs. The things the Bee actually does when invoked.

- "Walk me through a typical invocation. What does the Bee do first? Second? Third?"
- "What tools or MCP connectors will the Bee use?"
- "Are there branches — 'if the input has X, do Y; otherwise do Z'?"
- "What does the Bee do when things go wrong? Timeout? Retry? Escalate?"

**Capture this as numbered steps.** Numbered steps translate cleanly into the subagent file's procedure and into the Stinger's guides.

### EXPECTED OUTPUT

Goal: The deliverable. Not abstract — format, destination, and consumer.

- "What does the Bee hand back? A file? A chat message? A structured report?"
- "Who or what consumes this output next? The user? Another Bee? A CI system?"
- "What's the format? Markdown, JSON, an annotated diff, a slide deck?"
- "If the output is a report, what are its sections?"

**If the output has structure, sketch the structure in the brief** — a sample heading outline or a JSON schema fragment. This becomes the template stub in the Stinger folder.

### SUBAGENT CRITICAL DIRECTIVES

Goal: The non-negotiables. Rules the Bee cannot break.

- "What's the worst thing this Bee could do? How do we prevent it?"
- "Are there always/never rules? 'Always cite the file and line.' 'Never modify production config.'"
- "Are there things the Bee must confirm with the user before doing?"
- "What's the escalation path when the Bee is unsure?"

**Keep directives to 3–7 items.** More than that dilutes importance; fewer than that suggests the guardrails are fuzzy.

### REFERENCE MATERIAL (Stinger half)

Goal: The reading list the Stinger needs to be credible.

- "What are the canonical references in this domain? Docs, RFCs, standards, style guides?"
- "Are there internal documents or prior art I should pull in?"
- "Who are the opinionated authors or projects you'd want the Stinger to reflect?"
- "What search queries should stinger-forge run to flesh this out?"

**This section becomes the research plan for stinger-forge.** Be generous with links and queries; it's easier to trim later than to regenerate.

### IDEAS, SUGGESTIONS, QUESTIONS

Goal: A running list of open items.

Capture anything the user muses about but isn't ready to commit to. "Maybe we should have the Bee also handle dependency graphs?" goes here — not in ACTION — until the user confirms.

Also capture the user's questions _to you_. Turn each into an item prefixed with `Q:` so they're discoverable.

### NOTES

Goal: Everything else worth remembering.

Deadlines, inspiration ("this should feel like the vibe of X tool"), constraints ("must run offline"), anecdotes about why the Bee is being created now. Don't over-curate — notes are cheap and future-you will thank you.

---

## Dialogue moves

**When an answer is vague:**
> "Can you give me a concrete example? Even a made-up one works — I just want to see the shape."

**When the user proposes scope creep:**
> "That sounds valuable, but I think it's a different Bee. Want me to park it in NOTES and we'll do a separate brief for it?"

**When the user is stuck:**
> "Let me offer three possibilities — tell me which resonates, or none:\n> A) ...\n> B) ...\n> C) ..."

**When the user says "you decide":**
> "Happy to make a call, and here's what I'd pick and why: [pick]. Sound right? Push back if not — this is your Bee."

**When closing a section:**
> "Before we move on, let me read back what I've captured. [read it.] Anything missing or wrong?"

---

## A worked interview (abbreviated)

```
USER:  I want an Bee that handles SEO stuff.

AGENT: Let's narrow that down. When you say "SEO stuff", which of these is
       closer to what you have in mind:
       A) Technical SEO — crawl audits, robots.txt, sitemaps, canonical tags
       B) Content SEO — keyword research, on-page optimization, meta tags
       C) Both — but that's usually two Bees, so we'd pick one first.

USER:  Mostly technical. I want something that reviews PRs for SEO regressions.

AGENT: Got it. Proposed name: `seo-worker-bee`. Stinger: `seo-stinger`. Okay?

USER:  Sure.

AGENT: [copies template, renames to ai-tools/command-briefs/seo-worker-bee-command-brief.md]
       Opening IDENTITY & RESPONSIBILITY now. One sentence: what's the
       single job you want this Bee to refuse to be distracted from?

USER:  Catch SEO regressions in PRs before they ship.

AGENT: That's a clean scope — I'm going to write it as: "seo-worker-bee is
       a technical SEO reviewer invoked on pull requests to detect and
       block regressions in crawlability, indexability, and core
       on-page signals." Sound right?

USER:  Perfect.

[agent writes to file, proceeds to EXPECTED INPUT]
```

The goal of this kind of exchange: each question does real work, nothing is left on a hunch, and the brief fills up with specifics rather than boilerplate.
