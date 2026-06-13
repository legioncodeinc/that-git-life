# knowledge-weapon

Companion skill to `library-weapon` for authoring **narrative knowledge documentation** — the technically deep, human-readable domain docs under `library/knowledge/private/<domain>/`.

## Purpose

`library-weapon` + `library-guardian` own PRDs, IRDs, and the documentation lifecycle.  
`knowledge-weapon` + `knowledge-guardian` own the knowledge/ domain — everything from system overviews to SQL schema references to coding standards.

## Directory map

```
knowledge-weapon/
  SKILL.md                          ← skill entry point (read this first)
  README.md                         ← this file
  guides/
    01-domain-taxonomy.md           ← what belongs in each of the 15 standard domains
    02-document-format.md           ← exact document format spec with annotated examples
    03-analysis-workflow.md         ← step-by-step workflow for building a full knowledge base
  templates/
    knowledge-doc-template.md       ← blank template (copy this to start a new doc)
  examples/
    example-system-overview.md      ← target quality example (architecture domain)
    example-auth-architecture.md    ← target quality example (auth domain with sequence diagram)
```

## Quick reference

| I want to... | Read this |
|---|---|
| Understand what goes in each domain folder | `guides/01-domain-taxonomy.md` |
| See the exact format every doc must follow | `guides/02-document-format.md` |
| Build a full knowledge base from scratch | `guides/03-analysis-workflow.md` |
| Start a new doc | Copy `templates/knowledge-doc-template.md` |
| See a target quality example | `examples/example-system-overview.md` |

## Relationship to library-weapon

| Artifact type | Skill | Agent |
|---|---|---|
| PRDs | `library-weapon` | `library-guardian` |
| IRDs | `library-weapon` | `library-guardian` |
| Knowledge docs | `knowledge-weapon` | `knowledge-guardian` |
| QA reports | `quality-weapon` | `quality-guardian` |
| ADRs | `adr-writing-weapon` | `adr-writing-guardian` |
