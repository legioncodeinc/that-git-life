# Installer dependency matrix

- **Category:** Reference
- **Status:** Canonical
- **Last updated:** 2026-05-23

What `install.sh` (bash) and `install.ps1` (PowerShell) install, and how. Per-OS commands below. The brief specifies the dependency set; the scripts must be idempotent — re-running on a fully-bootstrapped machine is a no-op.

---

## Common (all platforms)

| Tool | Version | Verification command |
|---|---|---|
| GitHub CLI | latest stable | `gh --version` |
| Node.js | LTS (≥ 20) | `node -v` |
| npm | bundled with Node | `npm -v` |
| Python | 3.12 (LTS for vibe coding) | `python --version` |
| nano | latest available | `nano --version` |
| Claude Desktop | latest | (check app presence per OS) |
| Obsidian | latest | (check app presence per OS) |
| IDE (per ADR-006) | Cursor latest **or** VS Code latest + Claude Code extension | `cursor --version` **or** `code --version` |
| `@thenotoriousllama/that-git-life` | latest | `npm ls -g @thenotoriousllama/that-git-life` |

Every install is preceded by a "is it already installed?" check. Skip if present at the right major version.

---

## macOS — Homebrew route

```bash
# 1. Homebrew (if missing)
if ! command -v brew >/dev/null; then
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# 2. Core deps
brew install gh node@20 python@3.12 nano

# 3. Casks (apps)
brew install --cask claude obsidian

# 4. IDE (interactive choice)
case "$IDE" in
  cursor)
    brew install --cask cursor ;;
  claude-code)
    brew install --cask visual-studio-code
    code --install-extension anthropic.claude-code ;;
esac

# 5. TGL itself
npm i -g @thenotoriousllama/that-git-life

# 6. Auto-start hook
tgl install-hook
tgl start --daemon

# 7. Open browser tabs
"$BROWSER" "$AFFILIATE_URL_GITHUB"
# ... one per signup
```

Required Xcode CLT prompt fires automatically if missing.

---

## Linux — Debian / Ubuntu route (apt)

```bash
sudo apt-get update
sudo apt-get install -y curl ca-certificates gnupg

# gh CLI repo
type -p curl >/dev/null || sudo apt install curl -y
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
  | sudo tee /etc/apt/sources.list.d/github-cli.list >/dev/null
sudo apt update && sudo apt install -y gh

# nodesource for Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# python + nano
sudo apt install -y python3.12 python3.12-venv nano

# apps via Flatpak (preferred) or .deb (fallback)
flatpak install -y flathub com.anthropic.Claude md.obsidian.Obsidian || true
# (provide .deb fallback in the script if flatpak unavailable)

# IDE
case "$IDE" in
  cursor) curl -fsSL https://cursor.com/install.sh | sh ;;
  claude-code)
    # Microsoft VS Code apt source
    wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
    sudo install -D -o root -g root -m 644 packages.microsoft.gpg /etc/apt/keyrings/packages.microsoft.gpg
    echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" \
      | sudo tee /etc/apt/sources.list.d/vscode.list >/dev/null
    sudo apt update && sudo apt install -y code
    code --install-extension anthropic.claude-code
    ;;
esac

# TGL
sudo npm i -g @thenotoriousllama/that-git-life

# Hook (systemd --user)
tgl install-hook
tgl start --daemon
```

Fedora/Arch variants follow the same logic with dnf/pacman; included as a fallback branch in `install.sh`.

---

## Windows — winget route (PowerShell)

```powershell
# 1. winget assumed present (Windows 10 1809+ ships it)

# 2. Core deps
winget install --id GitHub.cli -e
winget install --id OpenJS.NodeJS.LTS -e
winget install --id Python.Python.3.12 -e
winget install --id GNU.Nano -e

# 3. Apps
winget install --id Anthropic.Claude -e
winget install --id Obsidian.Obsidian -e

# 4. IDE
switch ($IDE) {
  'cursor'      { winget install --id Anysphere.Cursor -e }
  'claude-code' {
    winget install --id Microsoft.VisualStudioCode -e
    code --install-extension anthropic.claude-code
  }
}

# 5. TGL
npm i -g @thenotoriousllama/that-git-life

# 6. Hook
tgl install-hook
tgl start --daemon

# 7. Open browser tabs
Start-Process $env:AFFILIATE_URL_GITHUB
# ... one per signup
```

If `winget` isn't available (older Windows 10), the script falls back to chocolatey, with a final fallback of "we couldn't find a package manager — please install winget from the Microsoft Store and re-run."

---

## Affiliate URLs

All URLs live in `src/installers/affiliate-urls.ts` (see ADR-008). Placeholders ship in v0; Mario fills them before public launch:

```ts
github:     'TODO_AFFILIATE_URL_GITHUB'
cloudflare: 'TODO_AFFILIATE_URL_CLOUDFLARE'
godaddy:    'TODO_AFFILIATE_URL_GODADDY'
claudeAi:   'TODO_AFFILIATE_URL_CLAUDE_AI'
obsidian:   'TODO_AFFILIATE_URL_OBSIDIAN'
cursorPro:  'TODO_AFFILIATE_URL_CURSOR_PRO'
claudeMax:  'TODO_AFFILIATE_URL_CLAUDE_MAX'
```

The shell scripts source these by referencing the constants file (we generate per-OS env files at build time so the bash + ps1 scripts each have their own resolved URLs).

---

## Idempotency

Each script step is wrapped in a "is it already installed at the right version?" guard. The script logs:

```
[ ok ] gh 2.45 already installed
[ ok ] node v20.11 already installed
[ -- ] installing python@3.12 …
[ ok ] python 3.12.3 installed
```

Re-running on a healthy machine prints all `[ ok ]` lines and exits successfully in under 10 s.

---

## Failure modes

- **Network down** — script exits after first failed download with a clear error and a "re-run when online" note.
- **Permissions** — script asks for sudo / admin only when needed and explains each prompt.
- **Disk space** — pre-flight check (≥ 4 GB free) before any install.
- **Conflicting installs** — if a tool is present at a wrong version, the script does **not** auto-upgrade. It surfaces the conflict and gives the user an upgrade command to run.
