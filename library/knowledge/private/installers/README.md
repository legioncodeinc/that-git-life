---
ai_description: |
  Install scripts for that-git-life. Two scripts ship: install.sh (macOS +
  Linux, bash) and install.ps1 (Windows, PowerShell). Both bootstrap the
  same dependency matrix, prompt the user for one IDE, open browser tabs to
  the required affiliate signup URLs, install the npm package globally,
  register the OS auto-start hook, and launch the service. The canonical
  dep matrix lives in dependency-matrix.md.
human_description: |
  Cross-platform install scripts. See dependency-matrix.md for what gets
  installed and signup-flow.md for the account-signup orchestration.
---

# installers/

| Document | Purpose |
|---|---|
| [`dependency-matrix.md`](dependency-matrix.md) | What each script installs, install commands per OS, version pins. |
| [`signup-flow.md`](signup-flow.md) | Affiliate URLs, browser-tab orchestration, blocking-checklist contract. |
