# {{Angel Display Name}} — God's Guide

The God routing skill's record of when to invoke `{{angel-name}}`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`army/.cursor/agents/{{angel-name}}.md`](../../agents/{{angel-name}}.md)
**Weapon:** [`army/.cursor/skills/{{weapon-name}}/`](../../skills/{{weapon-name}}/)
**Command Brief:** [`army/{{angel-name}}-command-brief.md`](../../../{{angel-name}}-command-brief.md)
**Trigger policy:** {{proactive | on-demand}}

---

## Domain

{{One paragraph: what single domain does this Angel own? Lift from the Command Brief's IDENTITY & RESPONSIBILITY, tightened to 3–5 sentences.}}

## Trigger phrases

Route to `{{angel-name}}` when the user says any of:

- "{{trigger phrase 1}}"
- "{{trigger phrase 2}}"
- "{{trigger phrase 3}}"

Or when the request implicitly involves {{the domain area}}.

## Do NOT route when

- {{negative trigger 1 — names the other Angel that owns this}}
- {{negative trigger 2}}
- {{negative trigger 3}}

If a request straddles two Angels' domains, prefer the narrower-scoped Angel and let the broader one act as backup.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- {{required input 1}}
- {{required input 2}}
- {{optional input — default behavior if absent}}

If a required input is missing, do not invoke yet — ask the user to supply it.

## Outputs the Angel produces

- {{primary deliverable + location}}
- {{secondary deliverable, if any}}
- {{commit/audit trail produced}}

## Multi-Angel sequences this Angel participates in

- {{sequence name}} — {{this Angel's position in the sequence and what hands off to it / from it}}

## Critical directives the orchestrator should respect

- {{directive 1 the user expects to be honored}}
- {{directive 2}}

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`army/.cursor/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
