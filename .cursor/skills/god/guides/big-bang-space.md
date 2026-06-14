# Big Bang Space: God's Guide

The God routing skill's record of when to invoke `big-bang-space`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`.cursor/agents/big-bang-space.md`](../../agents/big-bang-space.md)
**Weapon:** [`.cursor/skills/big-bang-earth/`](../../skills/big-bang-earth/)
**Trigger policy:** proactive

---

## Domain

`big-bang-space` is the front-of-the-pipeline Angel for the Legion AI Tools Factory. It creates a brand new guardian proposal by appending a fully-formed entry to the proposed-angels backlog and the matching row to the proposed-angels queue. It is where a new domain enters the factory. It always reads the `big-bang-earth` weapon first, which encodes the proposal rubric, the four-tier research depth model, and the model-routing logic. It mirrors `gods-hand` on the production side of the same queue: `big-bang-space` fills the queue, `gods-hand` drains it.

## Trigger phrases

Route to `big-bang-space` when the user says any of:

- "propose a new Angel"
- "I want a new guardian for X"
- "add an Angel that does Y"
- "queue up a new subagent proposal"
- "extend the roster with Z"

Or when the user hands over a domain (Stripe Connect, Datadog APM, Helm charts, and so on) and expects it to enter the factory pipeline.

## Do NOT route when

- The user wants to actually build the weapon, command brief, agent file, or registry row. Those are downstream phases: route to **gods-hand** (to run the pipeline) or the individual factory skills.
- The user wants to register an already-built Angel. Route to **god-registrar**.
- The request is a normal domain task rather than proposing a new specialist.

If a request straddles two Angels, prefer the narrower-scoped Angel and let the broader one act as backup.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- The domain the new Angel should own.
- Optional: the desired research depth tier and any specific scope boundaries.

If a required input is missing, do not invoke yet. Ask the user to supply it.

## Outputs the Angel produces

- A new entry appended to the proposed-angels backlog.
- A matching row appended to the proposed-angels queue.

## Multi-Angel sequences this Angel participates in

- **Legion AI Tools Factory pipeline**: `big-bang-space` proposes and queues a new Angel; `gods-hand` then drives one queued row through command-center, scripture-historian, weapon-forge, angel-creator, and god-registrar.

## Critical directives the orchestrator should respect

- Always read the `big-bang-earth` weapon before authoring a proposal.
- Only propose and queue; never build the weapon, agent file, or registry row.
- Keep the backlog and queue entries consistent with each other.

(Full list lives in the Angel file's instructions.)

---

*Part of God's roster. See [`.cursor/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
