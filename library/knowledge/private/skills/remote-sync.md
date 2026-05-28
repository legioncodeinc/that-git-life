# Remote skill sync

- **Category:** Reference
- **Status:** Canonical
- **Last updated:** 2026-05-23

How TGL keeps the user's IDE skill set in sync with the public `the-notorious-llama/global-skills` repo. Implements ADR-007 (tier 2: remote sync).

---

## Source repo

| Field | Value |
|---|---|
| Repo | `github.com/the-notorious-llama/global-skills` |
| Visibility | Public, read-only to users |
| Default branch | `main` |
| Folder layout | Same `shared/<skill-id>/SKILL.md` layout as the bundled `shared/` (see `bundled-defaults.md`) |

This repo is **separately maintained** by the Notorious Llama team. TGL clones it; it does not vendor it.

---

## Local mirror

TGL keeps the clone at:

- macOS / Linux: `~/.tgl/skills-remote/`
- Windows: `%APPDATA%\tgl\skills-remote\`

The mirror is a shallow clone:

```bash
git clone --depth 1 https://github.com/the-notorious-llama/global-skills.git ~/.tgl/skills-remote
```

Subsequent syncs:

```bash
cd ~/.tgl/skills-remote
git fetch --depth 1 origin main
git reset --hard origin/main
```

We **never** preserve local edits in the mirror. It's a one-way pipeline from upstream.

---

## Sync triggers

| Trigger | When |
|---|---|
| First boot | After bundled skills land — kicks off a clone + apply. |
| Daily cron | 04:00 local time (configurable via `settings.skill_sync_cron`). |
| Manual | "Sync now" button in `/settings/skills` or `tgl sync-skills`. |
| Settings opt-out | `settings.skill_sync_enabled = '0'` disables all triggers. |

---

## Apply pipeline

After the mirror updates:

1. Run the same build step the bundled skills go through (`scripts/build-skills.ts`), but pointed at `~/.tgl/skills-remote/shared/` instead of `src/skills/bundled/shared/`.
2. Output goes to a staging dir: `~/.tgl/skills-staged/<ide>/`.
3. Diff staged vs the IDE's current skill directory.
4. For each skill in the diff:
   - **New** — copy to IDE dir. Record in `skills` table as `source: remote`.
   - **Updated** (hash differs):
     - If the user hasn't edited the skill locally (hash matches the previous remote version): replace silently.
     - If the user has edited (hash diverges): keep the user version; emit a `skill-conflict` finding.
   - **Removed upstream** — leave local copy untouched; emit `skill-removed-upstream` info finding.

---

## Conflict policy

We never blow away user edits. The conflict resolution is always:

1. Detected via hash comparison (current local file vs the previous remote hash recorded in the `skills` table).
2. Surfaced in the UI as a finding row with three actions:
   - **Keep mine** — record the user hash as the new baseline; ignore upstream until the next change.
   - **Take theirs** — overwrite with the upstream version.
   - **Open both** — opens the two files in the IDE for manual merge.

---

## Network failure

- Clone or fetch failure does **not** block the service. The bundled baseline keeps working.
- Errors land as `info`-level findings on the dashboard, not as blocking modals.
- `tgl doctor` includes a `remote-sync-reachable` check that pings the GitHub raw URL with a 5 s timeout.

---

## Privacy

We send nothing back to GitHub except the standard read traffic (`git fetch`). No telemetry, no analytics. The PAT is **not** used for the sync — the public repo doesn't require auth.

---

## Schema contract upstream

The upstream repo's `README.md` documents the folder convention TGL expects. Any breaking change to that convention requires:

1. A new `schema_version` field at the repo root (`global-skills/_meta.yaml`).
2. A TGL release that recognizes the new schema.

For v1, the upstream schema version is `1`.
