# Page specs

- **Category:** Reference
- **Status:** Canonical
- **Last updated:** 2026-05-23

Page-by-page spec for TGL's web UI. Routes live at `http://localhost:3050/<path>`. The app uses `react-router-dom`.

---

## Route map

```
/                       <Home />                  Dashboard (or onboarding if not complete)
/onboarding             <Onboarding />            First-boot guided flow
/onboarding/welcome     step 1 — welcome
/onboarding/signups     step 2 — blocking checklist (ADR-008)
/onboarding/root        step 3 — pick GitHub root
/onboarding/pat         step 4 — paste GitHub PAT
/onboarding/ssh         step 5 — generate + upload SSH key (ADR-009)
/onboarding/skills      step 6 — install bundled skills, kick first sync
/onboarding/done        step 7 — confetti + "Go to dashboard"
/repos                  <RepoList />              all tracked repos
/repos/:id              <RepoDetail />            repo's findings + actions
/settings               <Settings />              all settings
/settings/account       account checklist + signup status
/settings/root          change GitHub root folder
/settings/ignored       ignored folders
/settings/skills        bundled + remote skills, sync status
/settings/updates       package update channel + manual update
/logs                   <Logs />                  tail of service log
/about                  <About />                 version, links, brand love
```

---

## Onboarding (`/onboarding/*`)

### Step 1 — Welcome

- Big Anton headline: "Welcome to **That Git Life**."
- Subhead: "Six quick steps. Let's get you notorious."
- "Let's go" CTA → `/onboarding/signups`.
- Skip button is **disabled** — the brief requires forced onboarding completion.

### Step 2 — Signups (blocking checklist)

- Headline: "Sign up for the apps. We'll wait."
- Checklist of 6–7 rows (one per affiliate URL from `affiliate-urls.ts`).
- Each row: name, short description, "Open signup" button (`window.open(url)`), "I signed up" checkbox.
- "Continue" button is **disabled** until every row's checkbox is checked.
- State persisted via `POST /api/v1/onboarding/checklist/:id` on each toggle.

### Step 3 — Pick GitHub root

- Headline: "Where should your GitHub folder live?"
- Default suggestion: `~/GitHub` (`%USERPROFILE%\GitHub` on Windows).
- "Browse…" opens a native folder picker (via a backend endpoint that shells out to the OS file dialog — see PRD-003 for the per-OS approach).
- Confirms it will create the folder if absent.
- "Continue" calls `POST /api/v1/onboarding/github-root`.

### Step 4 — Paste GitHub PAT

- Headline: "Paste a GitHub Personal Access Token."
- Helper copy lists required scopes: `admin:public_key`, `repo`, `read:org`.
- Inline link: "Generate a new PAT" → opens `https://github.com/settings/tokens/new?scopes=...&description=that-git-life`.
- Input field; "Test & save" validates the PAT by hitting `GET /user` via Octokit before storing.
- Token stored via `POST /api/v1/onboarding/github-pat`. The web UI never sees the token again after submit.

### Step 5 — Generate + upload SSH key

- Headline: "Let's get you onto GitHub."
- Reads: "We'll generate an SSH key in `<github-root>/.ssh-keys/` and add it to your GitHub account."
- Single button: "Generate & upload" → `POST /api/v1/onboarding/ssh-key`.
- On success: shows the key fingerprint, links to GitHub's SSH-keys page so the user can verify.
- On failure: surface the GitHub error verbatim with a "Try again" button.

### Step 6 — Skills

- Headline: "Stocking your IDE with skills."
- Shows progress as the bundled skills copy + the first remote sync runs.
- Lists each skill as it lands.
- "Continue" enabled once both jobs are `succeeded`.

### Step 7 — Done

- Confetti animation (Framer Motion).
- Headline: "You're notorious."
- "Open dashboard" CTA → `/`.

---

## Home / Dashboard (`/`)

Layout: two columns at `lg+`, stacked below.

**Left column — health card:**

- Top-of-the-fold: "Your Git Life is **<healthy|drifting|broken>**."
- Three KPI tiles: tracked repos, open findings, last scan time.

**Right column — recent activity:**

- Last 5 scan results, each with a HealthDot + repo name + "View" link.
- "Run scan now" button (kicks off `POST /api/v1/repos/:id/scan` for every tracked repo via a "scan all" job).

**Below the fold — quick actions row:**

- "Add a repo" — opens a picker, scaffolds with the standardizer.
- "Standardize all" — runs the standardizer over every tracked repo (with dry-run preview first).
- "Sync skills" — manual remote sync.

---

## Repos (`/repos`)

Table:

| Health | Name | Path | Last scan | Open findings | Actions |
|---|---|---|---|---|---|

Filters: `?ignored=true|false`, search by name. "Add repo" button at top-right.

Row actions: "Scan", "Standardize", "Ignore", "Open in IDE" (deep link).

---

## Repo detail (`/repos/:id`)

Header: repo name + health dot + path + remote + last-scanned timestamp.

Tabs:

1. **Findings** — table of findings grouped by check, with severity badges. Click a finding → side panel with details + a "Resolve" button (marks `resolved_at`).
2. **Standardization** — diff view of what `tgl standardize` would change, with a "Run" button. Disabled if already compliant (then shows a green check).
3. **Activity** — chronological log of scans, standardize runs, finding changes.

---

## Settings

Each subroute is its own form. All forms save inline (no global "Save" button).

- **`/settings/account`** — re-display the signup checklist; users can mark items un-done if they want to redo a signup.
- **`/settings/root`** — change GitHub root. Warns about side effects (re-discovers repos, may move SSH keys).
- **`/settings/ignored`** — toggleable list of folders within the root that TGL should ignore.
- **`/settings/skills`** — list of installed skills + last-synced timestamps + a "Disable" toggle + "Sync now" button.
- **`/settings/updates`** — current version, latest published version, "Install update" button, auto-update toggle.

---

## Logs (`/logs`)

Live-tail of `~/.tgl/logs/service.log` via `GET /api/v1/logs` (polled every 2 s). Filterable by level. "Download log" button bundles the last 7 days into a zip.

---

## About (`/about`)

- Brand mark.
- Version + build date.
- Links: docs (this library), GitHub repo, Notorious Llama site.
- License snippet.
- Easter egg: pressing **G I T L I F E** on the keyboard plays the llama mark hip-hop bounce animation. Required for v1.

---

## Loading + error states

Every async page:

- Initial: brand mark spinner ("Loading the Git life…").
- Empty: `<EmptyState />` with brand voice (see `branding.md` §7).
- Error: red toast + inline retry button. Don't dump stack traces.

---

## Keyboard shortcuts

| Combo | Action |
|---|---|
| `?` | Open shortcuts modal |
| `g d` | Go to dashboard |
| `g r` | Go to repos |
| `g s` | Go to settings |
| `s` | Run scan-all |
| `/` | Focus search on `/repos` |
