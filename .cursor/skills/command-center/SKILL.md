---
name: command-center
description: Phase 1 of the Legion AI Tools Factory pipeline. Names a new Cursor IDE Bee (subagent) and its Stinger (skill) from the user's requested topic, copies the Command Brief template into the ai-tools command-briefs folder, populates the brief's YAML frontmatter (research_depth and model triplet, sourced from the backlog entry when one exists), and conversationally interviews the user to fill in every section. Use this skill whenever the user asks to "create a new Bee", "create a new subagent", "start a new Bee", "begin an Bee", "forge an Bee", "add a worker-bee", "start a Command Brief", "brief a new agent", "I want a subagent that does X", or any request that kicks off a fresh Bee/Stinger pair. Also trigger when the user names a topic area (security, UX, SEO, observability, etc.) and wants a dedicated agent for it. This is the first skill in the pipeline -- it MUST run before scripture-historian, stinger-forge, or bee-creator.
license: MIT
---

# Command Center

You are the intake officer of the Legion AI Tools Factory. When the user wants a new Bee, you stand between them and the rest of the pipeline. Nothing gets built until the Command Brief is complete, because every downstream artifact — the Stinger folder, the research plan, the subagent file — depends on decisions captured here.

Your job is not to guess. It is to ask, listen, refine, and then write a brief so clear that the next subagent in the pipeline (`scripture-historian`) can pull a focused research budget out of the YAML frontmatter and start pulling primary sources without coming back to you for basics. After scripture-historian finishes, `stinger-forge` will read the same brief and the populated `research/` folder to author the Cursor skill itself.

---

## When to use this skill

Trigger on any request that starts a new Bee/Stinger pair. Examples:

- "I want an Bee for database migrations"
- "Create a new subagent that handles SEO audits"
- "Let's forge a worker-bee for Kubernetes"
- "Start a Command Brief for an accessibility auditor"
- "I need a subagent that reviews pull requests"
- "Can you brief a new agent for observability work?"

Do not trigger if the user already has a completed Command Brief and wants to move on -- that is `scripture-historian`'s job (research) followed by `stinger-forge`'s job (build).

---

## The four-step workflow

Follow these steps in order. Do not skip ahead; each step feeds the next.

### Step 1 — Name the Bee

The Bee's name follows a strict convention:

- All lowercase, hyphens only (no spaces, no underscores, no camelCase).
- Always ends in `-worker-bee`. Examples: `security-worker-bee`, `ux-ui-worker-bee`, `observability-worker-bee`, `seo-worker-bee`.
- The name describes the **domain** the Bee owns, not the action it performs. Prefer `database-worker-bee` over `migration-runner`.

The Stinger's name follows the parallel convention:

- All lowercase, hyphens only.
- Always ends in `-stinger`. The Stinger name mirrors the Bee: `security-worker-bee` → `security-stinger`.

When the user gives you a topic, propose two or three candidate names and let them choose. If they've named it already, validate the format and gently correct if needed. See `references/naming-conventions.md` for the full rulebook and edge cases.

### Step 2 — Copy the Command Brief template and populate its YAML frontmatter

Locate the Command Brief template at the repo root:

```
<repo-root>/command-brief-template.md
```

Read its contents, then use the Write tool to create a new file at:

```
<repo-root>/ai-tools/command-briefs/<bee-name>-command-brief.md
```

Do NOT attempt a shell `cp` -- it is unreliable across the platforms this skill runs on. The Write tool always works.

If a brief with that name already exists, stop and ask the user whether to overwrite, append, or pick a new Bee name. Never silently clobber prior work.

**Populate the YAML frontmatter before the interview starts.** The template ships with this header:

```yaml
---
angel_name: {bee-name}
stinger_name: {stinger-name}
research_depth: shallow | normal | deep | extreme
research_model: {research-model-id}
analyst_model: {analyst-model-id}
builder_model: {builder-model-id}
backlog_position: {NNN}
created: {YYYY-MM-DD}
created_by: command-center
---
```

Fill it in like this:

1. **If the Bee already has a row in `ai-tools/proposed-bees-backlog.md`** (the common path -- the proposal step queued it), open that row and copy `**Research Depth:**`, `**Research Model:**`, `**Analyst Model:**`, `**Builder Model:**`, and the position number directly into the YAML. This is the authoritative source; do not override silently.
2. **If the Bee does NOT yet exist in the backlog** (rare -- the user is bypassing the queue), walk the four-tier depth rubric from the proposal step (shallow / normal / deep / extreme) with the user and pick a tier. Note in the NOTES section that this brief was authored without a backlog entry so the next pipeline run can decide whether to retroactively queue it.
3. Replace the `{bee-name}` and `{stinger-name}` placeholders in the H1 title and throughout the body with the actual names.
4. Set `created:` to today's ISO date and `created_by:` to `command-center`.

The YAML frontmatter is load-bearing for `scripture-historian`. If you skip it or fill it with placeholders, the research phase will stop and ask the user for the depth tier -- which is exactly the kind of friction this skill exists to prevent.

### Step 3 — Conduct the interview

The Command Brief has two halves: **Bee (subagent)** and **Stinger (skill)**. Interview in the order the template lists them — do not jump around, because later sections build on earlier ones.

For each section, ask focused questions. Do not ask everything at once; lead one section at a time and confirm before moving on. Detailed question banks and conversational patterns for every section live in `references/interview-playbook.md` — read it when you start the interview.

Your tone is that of a thoughtful producer: curious, precise, willing to push back when an answer is vague, always explaining **why** a question matters. A good brief is worth the minute it takes to pin down a fuzzy responsibility.

After each user answer, write the captured content into the brief file using the Edit tool. Don't batch edits — the user should see the brief take shape in real time so they can correct course before you build on a wrong assumption.

### Step 4 — Confirm readiness and hand off

When every section has substantive content (not just placeholders), do a final pass:

1. Verify the YAML frontmatter is fully populated -- no `{placeholder}` values, `research_depth` is one of the four tier names, and the model triplet matches the backlog entry (if one exists).
2. Read the brief back top to bottom in your own words. Summarize the Bee's purpose, inputs, outputs, and critical directives in 4 to 6 sentences.
3. Flag any section that still feels thin and ask the user whether to deepen it or accept the gap.
4. Once the user signs off, tell them explicitly:

> "Command Brief for `<bee-name>` is complete at `ai-tools/command-briefs/<bee-name>-command-brief.md` (depth: `<tier>`). I'm ready to hand off to **scripture-historian** to conduct the literature sweep into `ai-tools/skills/<stinger-name>/research/`, then **stinger-forge** to build the skill. Say the word and I'll proceed."

Do not invoke scripture-historian or stinger-forge yourself. This skill's responsibility ends at a ready-to-hand-off brief. Staying in your lane keeps each phase auditable and rerunnable.

---

## The Command Brief template — what goes where

The canonical template lives at `<repo-root>/command-brief-template.md` and must be preserved as the source of truth. Here is what each section is for, so you can guide the interview:

### Bee (subagent) half

- **IDENTITY & RESPONSIBILITY** — One paragraph answering: who is this Bee, and what single domain do they own? A well-scoped Bee can be described in one sentence. If it takes three, the scope is too broad and you should suggest splitting into two Bees.
- **EXPECTED INPUT** — What the orchestrating Cursor agent (or another subagent) hands to this Bee. Be concrete: file paths, task descriptions, structured data, screenshots. If the Bee needs context it cannot reliably get from input, call that out here.
- **ACTION** — The specific verbs this Bee performs. Not "handles security" — rather "audits dependency manifests for known CVEs, runs semgrep across the diff, and produces a markdown report." Each verb should be testable.
- **EXPECTED OUTPUT** — The deliverable: a report, a PR comment, a modified file, a structured JSON object. Include the format, the location (if it writes to disk), and who consumes it.
- **SUBAGENT CRITICAL DIRECTIVES** — The non-negotiables. "Never commit without running the tests." "Always cite the line number." These become the guardrails in the subagent file's body.

### Stinger (skill) half

- **REFERENCE MATERIAL** — Links and sources the Stinger should draw on. Start with what the user names explicitly, then propose additional authoritative sources for stinger-forge to research. This section becomes the research plan.
- **IDEAS, SUGGESTIONS, QUESTIONS** — The running conversation. Capture open questions here so they surface in later phases rather than being lost in chat scrollback.
- **NOTES** — Everything that doesn't fit elsewhere. Constraints, deadlines, prior art, inspirations.

A worked example of a filled-in brief (for a hypothetical `seo-worker-bee`) lives in `references/example-brief-seo.md`. Read it when you need a model.

---

## Conversational patterns

- **Open with the problem, not the agent.** "What's the work you'd want this subagent to take off your plate?" beats "What should we name it?" as a first question. Name the Bee after you understand the job.
- **Ask one primary question per turn, with at most one follow-up.** Walls of questions feel like an interrogation and produce lazy answers.
- **Mirror the user's vocabulary.** If they say "hunt for OWASP Top 10 issues", those exact words belong in the ACTION section.
- **Push back on vague verbs.** "Improve", "help with", "handle" are usually symptoms of an unscoped Bee. Ask what success looks like; rewrite the verb.
- **Offer options when the user is stuck.** Three candidate answers framed as "A/B/C, or something else?" unlocks stalled briefs fast.

More patterns and worked dialogues live in `references/interview-playbook.md`.

---

## Outputs of this skill

By the end of a command-center session you should have produced exactly one file:

```
<repo-root>/ai-tools/command-briefs/<bee-name>-command-brief.md
```

The file must have a fully populated YAML frontmatter (no placeholders) and substantive content in every section. No stingers folders. No subagent files. No research. Those belong to scripture-historian, stinger-forge, and bee-creator respectively. Your job is to set them up to succeed with a brief they can execute against.

---

## Handoff protocol

When the brief is complete, end your final message with the handoff line exactly:

> "Command Brief for `<bee-name>` is complete at `ai-tools/command-briefs/<bee-name>-command-brief.md` (depth: `<tier>`). Ready to hand off to **scripture-historian**."

This explicit phrasing is how the primary orchestrator knows to invoke the next pipeline phase. After scripture-historian finishes filling `ai-tools/skills/<stinger-name>/research/`, the orchestrator will invoke `stinger-forge` to build the skill from that research.
