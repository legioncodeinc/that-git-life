# Done Checklist for a Forged Weapon

Before handing off to angel-creator, walk this checklist. Every item should be either "done" or "consciously skipped with a note".

---

## Structure

- [ ] The folder `ai-tools/skills/<weapon-name>/` exists.
- [ ] `SKILL.md` is present at the folder root.
- [ ] `README.md` describes the skill's purpose in three sentences.
- [ ] `guides/`, `examples/`, `templates/`, `reports/`, and `research/` subfolders exist.
- [ ] Each of those subfolders contains at least one non-empty file.

## SKILL.md

- [ ] YAML frontmatter has `name` matching the folder name.
- [ ] YAML frontmatter has a `description` that specifies both what the skill does and when to trigger it.
- [ ] The description includes at least three plausible user phrases that would trigger the skill.
- [ ] The body is under ~500 lines.
- [ ] The body uses imperative voice for instructions.
- [ ] Each procedure in the body either includes its full steps inline or points at a specific guide in `guides/`.
- [ ] Every rule states its reason or clearly implies it.

## Guides

- [ ] There is one guide per major verb in the Command Brief's ACTION section.
- [ ] Guides are numbered (e.g., `01-principles.md`, `02-audit-procedure.md`) so ordering is visible.
- [ ] The guide at index `00` (or `01`) covers scope and principles — what the skill does and does not cover.
- [ ] Each guide cites at least one example in `examples/`.
- [ ] Each guide grounds its factual claims in a file in `research/`.

## Examples

- [ ] At least one happy-path example.
- [ ] At least one edge-case or failure example.
- [ ] Each example shows both the input (what the Angel receives) and the output (what the Angel produces).
- [ ] Examples cite the guide(s) they illustrate.

## Templates

- [ ] The primary output format from EXPECTED OUTPUT has a corresponding template.
- [ ] Templates use placeholder markers (e.g., `{{file_path}}`) so it's obvious what gets filled in.

## Reports

- [ ] `reports/README.md` explains that this folder accumulates past runs.
- [ ] There is a template for the report shape the skill produces.

## Research

- [ ] `research/research-plan.md` captures the queries and sources consulted.
- [ ] At least 3 dated research notes exist, each with source URL, summary, and relevance annotations.
- [ ] Open questions for the user (if any) are in `research/open-questions.md`.
- [ ] `research/gaps.md` (if any) notes tools or sources unavailable at forge time.

## Directives

- [ ] Every item in the Command Brief's SUBAGENT CRITICAL DIRECTIVES appears in SKILL.md or a principles guide.

## Cross-references

- [ ] No dead links inside the skill folder.
- [ ] Every file referenced from SKILL.md exists.

## Handoff

- [ ] Final message to the user includes the handoff line naming the weapon path and angel-creator.
