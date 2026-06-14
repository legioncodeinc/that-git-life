# Registration Procedure — long form

This is the careful, edge-case-aware version of Steps 2–4 of god-registrar's SKILL.md. Read it when the simple flow doesn't apply — duplicate names, missing templates, malformed roster tables, or registrations that require touching the orchestration section.

---

## Reading God's SKILL.md

God's SKILL.md is the source of truth for the roster. Read it end to end before editing; don't pattern-match on a fragment.

Look for these landmarks in order:

1. The YAML frontmatter — confirms you're editing the correct skill.
2. A heading named **Roster** (or close variants like "## The Roster", "## The Roster — N Active Angels", "## Active Angels"). The first markdown table after that heading is the roster.
3. A heading named **Multi-Angel orchestration** (or variants like "## Orchestration sequences", "## Known sequences"). The content under it lists ordered Angel sequences.
4. A heading named **How to use this skill** or **Adding a new Angel**. These document the conventions the file expects you to follow — read them before editing.

If God's SKILL.md is missing any of these landmarks, do not try to invent them. Stop and ask the user how to proceed — the host's God skill may be a different version than this registrar assumes.

---

## Identifying the roster table

The roster table is markdown with these typical columns:

- **Angel** — the angel name as inline code.
- **Domain** — a short prose summary.
- **Trigger keywords** OR **Proactive?** OR **Key handoffs** — varies by version.
- **Guide** — a relative link to `guides/<angel>.md`.

If the column count or names differ from what's shown in this registrar's SKILL.md, match the file's actual structure. Do not reformat the table to match this registrar's assumptions — preserve the host's conventions.

---

## Adding the new row safely

Use the Edit tool to add a single new row. The safest pattern is:

1. Find the last existing row in the roster table (by reading the file).
2. Edit by replacing that last row with itself plus the new row appended.
3. Re-read the file and confirm the table renders correctly.

If the rows look sorted alphabetically, insert in alphabetical order instead of appending. If they look sorted by registration date (oldest first), append. If you can't tell, append.

Never use `replace_all` for table edits — it's too easy to clobber unrelated rows that happen to share a prefix.

---

## Authoring the guide file

The guide is created by reading `ai-tools/skills/god/templates/guide-template.md` and substituting every `{{placeholder}}` with content derived from the three source artifacts (Command Brief, Weapon SKILL.md, Angel file).

### Sourcing each placeholder

- **`{{Angel Display Name}}`** — Title Case the angel name with the suffix capitalized normally: `seo-guardian` → `SEO Guardian`, `ux-ui-guardian` → `UX/UI Guardian`. If unsure, ask the user.
- **`{{angel-name}}`** — the slug as it appears in the angel file's frontmatter.
- **`{{weapon-name}}`** — the slug of the paired weapon folder.
- **Domain paragraph** — pull from the Command Brief's IDENTITY & RESPONSIBILITY section, tighten to 3–5 sentences. Drop any meta-commentary; the orchestrator needs only what the Angel owns.
- **Trigger phrases** — extract 3–5 from the Angel file's `description` frontmatter field. Each should be a phrase a user would actually say.
- **Do NOT route when** — look for "Do not invoke for X" in the Angel description, plus any negative scope statements in the Command Brief's IDENTITY & RESPONSIBILITY ("It does not write content, pick keywords, …"). State the competing Angel by name where possible.
- **Inputs the Angel needs** — restate the Command Brief's EXPECTED INPUT bullets, with "if absent, …" notes for optional ones.
- **Outputs the Angel produces** — restate EXPECTED OUTPUT, naming format + destination.
- **Multi-Angel sequences** — only fill if the Angel file's procedure or critical directives names other Angels, or if the Command Brief explicitly mentions handoffs. Otherwise write "None yet — this Angel currently runs standalone."
- **Critical directives** — top 2–3 from the Angel file. Don't duplicate the full list; link to the Angel file for the rest.
- **Trigger policy** — copy the Angel file's `proactive:` frontmatter value.

### Path normalization

If God's template still uses `army/.cursor/` notation, normalize when filling in:

- `army/.cursor/agents/<angel>.md` → `ai-tools/agents/<angel>.md`
- `army/.cursor/skills/<weapon>/` → `ai-tools/skills/<weapon>/`
- `army/<angel>-command-brief.md` → `ai-tools/command-briefs/<angel>-command-brief.md`

Relative links inside the guide (which lives at `ai-tools/skills/god/guides/<angel>.md`):

- to the Angel file: `../../agents/<angel>.md`
- to the Weapon folder: `../../skills/<weapon>/`
- to the Command Brief: `../../../command-briefs/<angel>-command-brief.md`

---

## Updating Multi-Angel orchestration

Default: leave it alone. Multi-Angel sequences are domain decisions the user should be involved in.

Update only when at least one of these is true:

1. The Command Brief's IDEAS, SUGGESTIONS, QUESTIONS or NOTES section explicitly names the sequence.
2. The Angel file's Procedure or Critical directives section names upstream or downstream Angels (e.g., "after this Angel runs, hand off to `quality-guardian`").
3. The user has told you which sequence to add the Angel to.

When updating, preserve the existing sequence structure. Add the Angel as a new numbered step, or extend an existing list. Never reorder existing sequences without asking.

---

## Edge cases

### The Angel was already registered

If a roster row exists with a guide file behind it, the Angel is already in the system. Tell the user:

> "`<angel-name>` is already registered in God's roster — guide at `ai-tools/skills/god/guides/<angel-name>.md`. No action taken. If you want to refresh the guide (e.g., the Angel's description or directives changed), confirm and I'll rewrite it."

Wait for explicit confirmation before re-authoring.

### A guide exists but no roster row points at it

This usually means a prior registration was half-finished. Show the user the orphan guide and ask whether to add a roster row, delete the guide, or rewrite from scratch.

### The Angel file references a Weapon that doesn't exist

Stop. Don't register. Tell the user the Weapon folder is missing and route them to `/forge-weapon`.

### The God template is missing or empty

Tell the user God's `templates/guide-template.md` is missing or empty, and ask whether they'd like to author it first or proceed with a built-in fallback structure. Do not silently invent a guide structure.

### The roster table is missing or malformed

Stop. Tell the user the Roster table can't be parsed and offer to either fix it manually first or proceed with adding a section that this registrar can extend. Do not append rows to a broken table.

---

## Verification

After every edit, re-read the modified file and confirm:

- The new content is in the right location.
- Surrounding content was not accidentally altered.
- Markdown syntax is intact (table pipes, link brackets, code fences).

The done checklist in `done-checklist.md` is the full validation pass.
