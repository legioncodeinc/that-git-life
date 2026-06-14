# ADR Writing Guardian: God's Guide

The God routing skill's record of when to invoke `adr-writing-guardian`. Use this guide to decide whether a user request belongs to this Angel.

**Angel:** [`.cursor/agents/adr-writing-guardian.md`](../../agents/adr-writing-guardian.md)
**Weapon:** [`.cursor/skills/adr-writing-weapon/`](../../skills/adr-writing-weapon/)
**Trigger policy:** on-demand

---

## Domain

`adr-writing-guardian` owns Architecture Decision Records end to end. It authors new records in Nygard format (Context, Decision, Consequences, Alternatives Considered), the MADR extended template, and Y-statement framing. It governs the full lifecycle: drafting a record, superseding an existing decision with bidirectional links, assigning sequential numbers, setting up tooling like Log4brains or adr-tools, auditing an ADR log for completeness, and using the corpus as an onboarding artifact. Its guiding principle is "decisions, not docs": records stay scannable, closed, and trustworthy.

## Trigger phrases

Route to `adr-writing-guardian` when the user says any of:

- "write an ADR"
- "record this decision"
- "supersede ADR-NNN"
- "set up our ADR log"
- "which ADR format should we use?"
- "document this architecture choice"
- "Nygard vs MADR"
- "Log4brains setup"

Or when the request implicitly involves capturing or governing an architecture decision record.

## Do NOT route when

- The request is to write narrative architecture documentation rather than a decision record. Route to **knowledge-guardian**.
- The decision touches auth, secrets, or PII and needs a security posture review. Record the ADR here, then escalate to **security-guardian**.
- The request is to plan or spec a feature rather than record a decision. Route to **library-guardian**.

If a request straddles two Angels, prefer the narrower-scoped Angel and let the broader one act as backup.

## Inputs the Angel needs

Before invoking, ensure the user has provided (or you can infer):

- The decision to record, or the existing ADR number to supersede.
- The existing ADR format and location, if a log already exists.
- Optional: the alternatives that were considered and why they were rejected.

If a required input is missing, do not invoke yet. Ask the user to supply it.

## Outputs the Angel produces

- A new ADR file in the repository's ADR log, numbered sequentially.
- Bidirectional supersession links when an old decision is replaced.
- Tooling setup (Log4brains or adr-tools) when requested.
- An audit report of the ADR log when asked.

## Multi-Angel sequences this Angel participates in

- **Schema-touching or security-sensitive decision**: `adr-writing-guardian` records the decision; `security-guardian` reviews its security posture afterward.
- **Knowledge base build-out**: `adr-writing-guardian` records the decisions; `knowledge-guardian` writes the narrative docs that reference them.

## Critical directives the orchestrator should respect

- Always determine the existing ADR format before writing.
- Never conflate ADRs with design docs or meeting notes.
- Supersession is bidirectional; both links are mandatory.
- Assign sequential numbers; never reuse or skip.
- Do not record a decision that is still open.
- Always include Alternatives Considered.
- Escalate to `security-guardian` after recording ADRs that touch auth, secrets, or PII.

(Full list lives in the Angel file's `## Critical directives` section.)

---

*Part of God's roster. See [`.cursor/skills/god/SKILL.md`](../SKILL.md) for the full Army.*
