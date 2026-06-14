# Done Checklist for a Created Angel

Walk this checklist before announcing the Angel is ready. Each item should be "done" or "consciously skipped with a note".

---

## Inputs verified

- [ ] Command Brief exists at `ai-tools/command-briefs/<angel-name>-command-brief.md` and is complete (every section has substantive content).
- [ ] Weapon folder exists at `ai-tools/skills/<weapon-name>/` with populated guides, examples, templates, reports, and research.
- [ ] Weapon's `SKILL.md` has a triggering description.

## File location and naming

- [ ] Angel file is at `ai-tools/agents/<angel-name>.md`.
- [ ] Filename matches the `name` frontmatter field.
- [ ] Angel name ends in `-guardian`.
- [ ] Paired Weapon name ends in `-weapon` and shares the same prefix.

## YAML frontmatter

- [ ] `name` is present and matches the filename.
- [ ] `description` is specific — names the domain, the task type, and at least 2 example trigger phrases.
- [ ] `description` includes a "do not invoke for X" clause if competing Angels exist.
- [ ] `proactive` (or equivalent) is set based on Step 2 decision.
- [ ] Any optional fields used are confirmed against the live Cursor docs.

## Body

- [ ] Identity & responsibility section is 2–4 sentences.
- [ ] Paired Weapon is linked with its full path.
- [ ] Procedure is a numbered list where each step either contains its logic inline or names the guide that does.
- [ ] Critical directives are present with short "why" annotations.
- [ ] Escalation section answers "what do I do when I'm unsure?"
- [ ] References to skill files section lists every guide, example, and template from the Weapon folder.

## Cross-references

- [ ] Every file path referenced in the Angel resolves on disk.
- [ ] The Angel file is referenced from the Weapon's `SKILL.md` or `README.md` (so the pairing is discoverable from either side).
- [ ] No broken links inside the file.

## Quality

- [ ] Reading the file top to bottom produces a clear one-sentence summary of what this Angel does.
- [ ] A junior engineer could read this file and know when to invoke the Angel.
- [ ] The Angel does not duplicate instructions that live in the Weapon — it points to them.

## Handoff

- [ ] The final user message includes the path to the Angel file.
- [ ] The handoff line explicitly names **god-registrar** as the next phase.
- [ ] No completion ritual phrase is used — Phase 3 is not the end of the pipeline. The ritual belongs to god-registrar's final message.
