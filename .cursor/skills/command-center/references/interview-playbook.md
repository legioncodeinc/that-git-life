# The Command Brief Interview Playbook

This is a field manual for running a brief interview that produces a real, usable Command Brief — not a shell of placeholder text. Use these question banks, dialogue moves, and heuristics to keep the conversation productive.

---

## Principles

1. **One section at a time.** Finish each section in the template before moving to the next. Skipping around produces inconsistent depth.
2. **Ask why, not just what.** "Why do we need this Angel?" unlocks better answers than "What does this Angel do?"
3. **Write as you go.** Edit the brief file after every substantive answer so the user can see the shape forming and correct early.
4. **Resist the urge to scope-creep.** If the user suggests adding a capability that feels like a second Angel's job, name that and propose a separate brief.
5. **Every section needs one concrete example.** If a user's answer to EXPECTED OUTPUT is "a report", push for an example headline, an example data point, a format.

---

## Section-by-section question bank

### IDENTITY & RESPONSIBILITY

Goal: One paragraph that describes the Angel as a character with a clear job.

- "If this Angel had a one-line LinkedIn bio, what would it say?"
- "Who would be upset if this Angel didn't exist? Whose job does it support?"
- "What's one task the Angel should refuse to take on because it's out of scope?"
- "Is there a human role this Angel resembles? (security engineer, copy editor, DBA)"

**Red flag answers:** "It does everything security-related." Push back — ask them to describe a typical invocation.

### EXPECTED INPUT

Goal: Concrete enumeration of what the orchestrator will hand to this Angel.

- "What information does the Angel need to do its job?"
- "Will the orchestrator pass file paths, code diffs, natural-language descriptions, or structured data?"
- "If a piece of context is missing, should the Angel ask for it, make a best guess, or refuse to proceed?"
- "Are there preconditions the Angel should check before starting work?"

**Write the answer as a bulleted list of inputs with a one-line description each.** This section doubles as the Angel's input schema.

### ACTION

Goal: The verbs. The things the Angel actually does when invoked.

- "Walk me through a typical invocation. What does the Angel do first? Second? Third?"
- "What tools or MCP connectors will the Angel use?"
- "Are there branches — 'if the input has X, do Y; otherwise do Z'?"
- "What does the Angel do when things go wrong? Timeout? Retry? Escalate?"

**Capture this as numbered steps.** Numbered steps translate cleanly into the subagent file's procedure and into the Weapon's guides.

### EXPECTED OUTPUT

Goal: The deliverable. Not abstract — format, destination, and consumer.

- "What does the Angel hand back? A file? A chat message? A structured report?"
- "Who or what consumes this output next? The user? Another Angel? A CI system?"
- "What's the format? Markdown, JSON, an annotated diff, a slide deck?"
- "If the output is a report, what are its sections?"

**If the output has structure, sketch the structure in the brief** — a sample heading outline or a JSON schema fragment. This becomes the template stub in the Weapon folder.

### SUBAGENT CRITICAL DIRECTIVES

Goal: The non-negotiables. Rules the Angel cannot break.

- "What's the worst thing this Angel could do? How do we prevent it?"
- "Are there always/never rules? 'Always cite the file and line.' 'Never modify production config.'"
- "Are there things the Angel must confirm with the user before doing?"
- "What's the escalation path when the Angel is unsure?"

**Keep directives to 3–7 items.** More than that dilutes importance; fewer than that suggests the guardrails are fuzzy.

### REFERENCE MATERIAL (Weapon half)

Goal: The reading list the Weapon needs to be credible.

- "What are the canonical references in this domain? Docs, RFCs, standards, style guides?"
- "Are there internal documents or prior art I should pull in?"
- "Who are the opinionated authors or projects you'd want the Weapon to reflect?"
- "What search queries should weapon-forge run to flesh this out?"

**This section becomes the research plan for weapon-forge.** Be generous with links and queries; it's easier to trim later than to regenerate.

### IDEAS, SUGGESTIONS, QUESTIONS

Goal: A running list of open items.

Capture anything the user muses about but isn't ready to commit to. "Maybe we should have the Angel also handle dependency graphs?" goes here — not in ACTION — until the user confirms.

Also capture the user's questions _to you_. Turn each into an item prefixed with `Q:` so they're discoverable.

### NOTES

Goal: Everything else worth remembering.

Deadlines, inspiration ("this should feel like the vibe of X tool"), constraints ("must run offline"), anecdotes about why the Angel is being created now. Don't over-curate — notes are cheap and future-you will thank you.

---

## Dialogue moves

**When an answer is vague:**
> "Can you give me a concrete example? Even a made-up one works — I just want to see the shape."

**When the user proposes scope creep:**
> "That sounds valuable, but I think it's a different Angel. Want me to park it in NOTES and we'll do a separate brief for it?"

**When the user is stuck:**
> "Let me offer three possibilities — tell me which resonates, or none:\n> A) ...\n> B) ...\n> C) ..."

**When the user says "you decide":**
> "Happy to make a call, and here's what I'd pick and why: [pick]. Sound right? Push back if not — this is your Angel."

**When closing a section:**
> "Before we move on, let me read back what I've captured. [read it.] Anything missing or wrong?"

---

## A worked interview (abbreviated)

```
USER:  I want an Angel that handles SEO stuff.

AGENT: Let's narrow that down. When you say "SEO stuff", which of these is
       closer to what you have in mind:
       A) Technical SEO — crawl audits, robots.txt, sitemaps, canonical tags
       B) Content SEO — keyword research, on-page optimization, meta tags
       C) Both — but that's usually two Angels, so we'd pick one first.

USER:  Mostly technical. I want something that reviews PRs for SEO regressions.

AGENT: Got it. Proposed name: `seo-guardian`. Weapon: `seo-weapon`. Okay?

USER:  Sure.

AGENT: [copies template, renames to ai-tools/command-briefs/seo-guardian-command-brief.md]
       Opening IDENTITY & RESPONSIBILITY now. One sentence: what's the
       single job you want this Angel to refuse to be distracted from?

USER:  Catch SEO regressions in PRs before they ship.

AGENT: That's a clean scope — I'm going to write it as: "seo-guardian is
       a technical SEO reviewer invoked on pull requests to detect and
       block regressions in crawlability, indexability, and core
       on-page signals." Sound right?

USER:  Perfect.

[agent writes to file, proceeds to EXPECTED INPUT]
```

The goal of this kind of exchange: each question does real work, nothing is left on a hunch, and the brief fills up with specifics rather than boilerplate.
