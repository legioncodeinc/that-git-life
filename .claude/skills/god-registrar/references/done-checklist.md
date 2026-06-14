# Done Checklist for a Registered Angel

Walk this before announcing registration is complete. Each item should be "done" or "consciously skipped with a note".

---

## Inputs verified

- [ ] Command Brief exists at `ai-tools/command-briefs/<angel-name>-command-brief.md`.
- [ ] Weapon folder exists at `ai-tools/skills/<weapon-name>/` with a populated `SKILL.md`.
- [ ] Angel file exists at `ai-tools/agents/<angel-name>.md`.
- [ ] God's `SKILL.md`, `templates/guide-template.md`, and `guides/` folder all exist.

## Collision check

- [ ] No prior roster row exists for this Angel (or the user explicitly approved replacing it).
- [ ] No prior guide file exists at `ai-tools/skills/god/guides/<angel-name>.md` (or the user approved overwriting it).

## Guide file (`guides/<angel-name>.md`)

- [ ] File exists at the correct path.
- [ ] Title and `{{angel-name}}` references replaced with real values.
- [ ] Angel, Weapon, and Command Brief links in the top-matter point at real files using current `ai-tools/` paths.
- [ ] Domain paragraph is 3–5 sentences, lifted from the Command Brief.
- [ ] Trigger phrases section lists 3+ realistic user phrases.
- [ ] "Do NOT route when" section is non-empty (or explicitly notes "no known competing Angels").
- [ ] Inputs and Outputs sections match the Command Brief.
- [ ] Critical directives section pulls 2–3 highlights from the Angel file.
- [ ] Trigger policy matches the Angel file's `proactive:` value.
- [ ] No `{{placeholder}}` strings remain anywhere in the file.

## Roster row (`SKILL.md`)

- [ ] One new row added to the Roster table.
- [ ] Angel name uses backticks: `` `<angel-name>` ``.
- [ ] Domain summary is ≤15 words.
- [ ] Trigger keywords are 2–4 short, quoted user phrases.
- [ ] Guide link is relative (`[`guides/<angel-name>.md`](guides/<angel-name>.md)`) and resolves.
- [ ] Table markdown is intact — pipes line up, no broken cells, no extra blank rows.

## Multi-Angel orchestration

- [ ] If the Angel fits an existing sequence, the orchestration section was updated.
- [ ] If a new sequence is being introduced, the user was asked before it was added.
- [ ] If no sequence applies, the orchestration section was left untouched.

## Cross-references

- [ ] Every link in the new guide resolves on disk.
- [ ] The Angel file (`ai-tools/agents/<angel-name>.md`) is reachable from the guide.
- [ ] The Weapon folder is reachable from the guide.
- [ ] The Command Brief is reachable from the guide.

## Handoff

- [ ] The final user message names both artifacts that were written (roster row + guide).
- [ ] The ceremonial line is present: "God's Army now has one more Angel armed with their Weapon."
- [ ] The user is told the pipeline is complete and no further phase remains.
