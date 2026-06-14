---
source_url: file:///c:/Users/mario/GitHub/legion-code/command-brief-template.md
retrieved_on: 2026-05-20
source_type: internal-repo
authority: official
relevance: high
topic: brief-template
weapon: gods-hand-weapon
---

# command-brief-template.md

## Summary
The repo-root template `command-center` writes from to produce every Command Brief at `ai-tools/command-briefs/<angel-name>-command-brief.md`. `gods-hand` does not author briefs (Phase 1 does), but it MUST recognize the template's section structure so it can verify a brief was produced correctly before invoking Phase 1.5. The template defines: YAML frontmatter (10 fields), one-paragraph pitch, Angel section with IDENTITY/INPUT/ACTION/OUTPUT/DIRECTIVES, Weapon section with REFERENCE MATERIAL/IDEAS/NOTES.

## Key quotations / statistics

- YAML frontmatter fields (10 fields, lines 1-11):
  ```
  angel_name, weapon_name, research_depth (shallow|normal|deep|extreme),
  research_model, analyst_model, builder_model, backlog_position,
  created (YYYY-MM-DD), created_by: command-center
  ```
- Section headers in order: `# {angel-name} Command Brief`, one-paragraph pitch, `## Angel (subagent)`, `### IDENTITY & RESPONSIBILITY`, `### EXPECTED INPUT`, `### ACTION`, `### EXPECTED OUTPUT`, `### SUBAGENT CRITICAL DIRECTIVES`, `## Weapon (skill)`, `### REFERENCE MATERIAL`, `### IDEAS, SUGGESTIONS, QUESTIONS`, `### NOTES`.
- ACTION section guidance: "Numbered list of the specific verbs this Angel performs. Each verb should be testable. Not 'handles security' -- rather 'audits dependency manifests for known CVEs, runs semgrep across the diff, and produces a markdown report.'"
- SUBAGENT CRITICAL DIRECTIVES section guidance: "Non-negotiables. These become the guardrails in the subagent file's body. State each as a directive plus a one-line 'why'."
- REFERENCE MATERIAL section guidance: "Authoritative sources the Weapon should draw on. Start with what the user names explicitly, then propose additional canonical sources for scripture-historian to research. This section becomes the seed reading list for the research phase."
- Search queries directive: "Search queries for scripture-historian to execute (carried over from `ai-tools/proposed-angels-backlog.md` entry; add or refine here as the interview surfaces new questions)"

## Annotations for weapon-forge
- `guides/04-phase-1-command-center.md` should document the success criterion for Phase 1: "A new file exists at `ai-tools/command-briefs/<angel-name>-command-brief.md` whose YAML frontmatter has all 10 fields populated (no `<placeholders>` remaining) and whose body contains all 13 section headers from the template." This is the lightweight integrity check `gods-hand` can run between Phase 1 and Phase 1.5.
- The `research_depth` field in the brief's frontmatter is the FIRST place `scripture-historian` looks for the depth tier (per its own agent file). The backlog metadata block is the FALLBACK. `gods-hand` must ensure `command-center` populates this field; if it does not, `gods-hand` patches it from the backlog metadata before invoking `scripture-historian`.
- The template lives at the repo root (`command-brief-template.md`), not under `ai-tools/`. This is a quirk: `command-center` reads it from there. `gods-hand` does not need to read it for normal operation, but `guides/04-phase-1-command-center.md` should mention its location for the rare case where Phase 1 fails and the user wants to inspect the template.
- The "Format / Location / Consumers" tri-anchor under EXPECTED OUTPUT (template lines 45-47) is what `gods-hand` should cite when reporting end-of-run artifacts in its final summary. `guides/11-reporting.md` can model the summary format on this tri-anchor.
