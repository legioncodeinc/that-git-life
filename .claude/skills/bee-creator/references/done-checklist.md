# Done Checklist for a Created Bee

Walk this checklist before announcing the Bee is ready. Each item should be "done" or "consciously skipped with a note".

---

## Inputs verified

- [ ] Command Brief exists at `ai-tools/command-briefs/<bee-name>-command-brief.md` and is complete (every section has substantive content).
- [ ] Stinger folder exists at `ai-tools/skills/<stinger-name>/` with populated guides, examples, templates, reports, and research.
- [ ] Stinger's `SKILL.md` has a triggering description.

## File location and naming

- [ ] Bee file is at `ai-tools/agents/<bee-name>.md`.
- [ ] Filename matches the `name` frontmatter field.
- [ ] Bee name ends in `-worker-bee`.
- [ ] Paired Stinger name ends in `-stinger` and shares the same prefix.

## YAML frontmatter

- [ ] `name` is present and matches the filename.
- [ ] `description` is specific — names the domain, the task type, and at least 2 example trigger phrases.
- [ ] `description` includes a "do not invoke for X" clause if competing Bees exist.
- [ ] `proactive` (or equivalent) is set based on Step 2 decision.
- [ ] Any optional fields used are confirmed against the live Cursor docs.

## Body

- [ ] Identity & responsibility section is 2–4 sentences.
- [ ] Paired Stinger is linked with its full path.
- [ ] Procedure is a numbered list where each step either contains its logic inline or names the guide that does.
- [ ] Critical directives are present with short "why" annotations.
- [ ] Escalation section answers "what do I do when I'm unsure?"
- [ ] References to skill files section lists every guide, example, and template from the Stinger folder.

## Cross-references

- [ ] Every file path referenced in the Bee resolves on disk.
- [ ] The Bee file is referenced from the Stinger's `SKILL.md` or `README.md` (so the pairing is discoverable from either side).
- [ ] No broken links inside the file.

## Quality

- [ ] Reading the file top to bottom produces a clear one-sentence summary of what this Bee does.
- [ ] A junior engineer could read this file and know when to invoke the Bee.
- [ ] The Bee does not duplicate instructions that live in the Stinger — it points to them.

## Handoff

- [ ] The final user message includes the path to the Bee file.
- [ ] The handoff line explicitly names **hive-registrar** as the next phase.
- [ ] No completion ritual phrase is used — Phase 3 is not the end of the pipeline. The ritual belongs to hive-registrar's final message.
