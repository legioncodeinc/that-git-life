# What's a "standardized" repo?

A standardized repo follows the Notorious Llama **Library Schema v2** — a canonical folder layout that gives every project:

- A `library/` directory with predictable folders for product requirements (PRDs), bug fixes (IRDs), architectural decision records (ADRs), engineering standards, and operational knowledge.
- READMEs in every folder with YAML frontmatter so AI agents know what's allowed where.
- A "lifecycle by location" rule: PRDs and IRDs literally move between `backlog/`, `in-work/`, and `completed/` folders. No frontmatter status fields to keep in sync.
- A sacred `notes/` folder where humans can scribble and agents won't touch.

## Why bother?

- **Every repo feels the same.** New contributors (human or AI) learn the layout once.
- **AI agents can navigate without guessing.** The headmatter tells them what each folder is for.
- **Drift gets caught early.** TGL's scanner re-checks every repo and flags any deviation.
- **PRDs travel.** Move a folder to mark a PRD as shipped. Move it back if it wasn't actually shipped. That's it.

## How TGL helps

- `tgl standardize <repo>` scaffolds a fresh repo or migrates an existing one.
- The scanner runs daily and flags any drift.
- Bundled IDE skills know the schema and refuse to violate it.

## How to start

- New repo: `tgl standardize ~/GitHub/my-new-project`
- Existing repo: same command. TGL preserves your existing content and adds what's missing.
- Whole folder: `tgl standardize --root`
