# Scripture Historian: God's Guide

The God routing skill's record of when to invoke `scripture-historian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`.cursor/agents/scripture-historian.md`](../../agents/scripture-historian.md)
**Weapon:** none. Uses the installed Firecrawl and Exa Cursor skills for research.
**Trigger policy:** proactive

---

## Domain

`scripture-historian` is Phase 1.5 of the Legion AI Tools Factory pipeline. It conducts depth-calibrated, time-bounded research on a new Angel and Weapon pair's domain, after `command-center` writes the Command Brief and before `weapon-forge` builds the skill. It reads the depth tier (shallow, normal, deep, extreme) from the Command Brief, then uses Firecrawl and Exa to download, summarize, and categorize 2026-current sources into the weapon's `research/` folder. It starts from the most recent material and works backward, six months by default and never past twelve without explicit consent. Its job is research and filing only; it never authors guides or `SKILL.md`.

## Trigger phrases

Route to `scripture-historian` when the user says any of:

- "research this domain for the weapon"
- "run scripture-historian"
- "gather sources for the new Angel"
- "do the Phase 1.5 research"
- "collect 2026-current sources on X"

Or when `command-center` has just produced a Command Brief and the pipeline needs research before `weapon-forge`.

## Do NOT route when

- The user wants the weapon, guides, or `SKILL.md` authored. Route to **weapon-forge**.
- The user wants to propose or queue a new Angel. Route to **big-bang-space**.
- The user wants to run the whole pipeline. Route to **gods-hand**.
- The request is general web research unrelated to forging a Weapon.

If a request straddles two Angels, prefer the narrower-scoped Angel and let the broader one act as backup.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- The Command Brief for the new Angel and Weapon pair, including its research depth tier.
- The target weapon folder where research should be filed.
- Explicit consent if the tier is `extreme` (a multi-hour, token-heavy run).

If a required input is missing, do not invoke yet. Ask the user to supply it.

## Outputs the Angel produces

- One file per source, cited verbatim, filed under the weapon's `research/` folder by topic.
- A `research/index.md` manifest updated after every file write.
- Raw Firecrawl payloads preserved in `.firecrawl/` for reruns and verification.

## Multi-Angel sequences this Angel participates in

- **Legion AI Tools Factory pipeline**: `command-center` writes the brief; `scripture-historian` gathers and files the research; `weapon-forge` builds the skill from that research; `angel-creator` writes the Angel; `god-registrar` registers it.

## Critical directives the orchestrator should respect

- Stay in your lane: research, summarize, and file only. Never author guides or `SKILL.md`.
- Always start from 2026 and work backward; stop at six months unless more is needed, never exceed twelve without consent.
- One source equals one file; never aggregate.
- Cite, never paraphrase, in the raw research notes.
- Update `research/index.md` after every file write.
- Confirm before escalating to the `extreme` tier.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`.cursor/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
