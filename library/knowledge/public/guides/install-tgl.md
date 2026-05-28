# Install TGL

The one-shot installer sets up your AI-coding environment and the TGL service on Windows, macOS, or Linux.

## Prerequisites

- A laptop or desktop you intend to code on.
- An internet connection.
- About 10 minutes.

## macOS / Linux

```bash
curl -fsSL https://thenotoriousllama.com/install.sh | bash
```

## Windows (PowerShell)

```powershell
iwr -useb https://thenotoriousllama.com/install.ps1 | iex
```

## What happens next

The installer will:

1. Ask you to pick an AI-native IDE: **Cursor** (recommended for solo coders) or **VS Code + Claude Code** (recommended if you already live in VS Code).
2. Install GitHub CLI, Node.js LTS, Python 3.12, `nano`, your chosen IDE, Claude Desktop, and Obsidian.
3. Install the `@thenotoriousllama/that-git-life` npm package globally.
4. Open browser tabs to each affiliate signup you'll need (GitHub, Cloudflare, GoDaddy, Claude.ai, Obsidian, your IDE plan).
5. Register the auto-start hook so TGL launches at log-on.
6. Start the TGL service at `http://localhost:3050`.
7. Open the TGL dashboard in your default browser.

## First boot

The TGL dashboard walks you through:

1. Checking off the accounts you just signed up for (you can't skip this — TGL needs them).
2. Picking the folder where your repos will live (we recommend `~/GitHub` or `%USERPROFILE%\GitHub`).
3. Pasting a GitHub Personal Access Token.
4. Generating an SSH key — TGL uploads the public half to GitHub for you.
5. Installing the bundled Notorious Llama skills into your IDE.

When the confetti hits, you're notorious.

## Already installed?

Re-running the installer is safe. It checks every dependency and only installs what's missing.

## Troubleshooting

| Problem | Fix |
|---|---|
| "Port 3050 is already in use" | Run `tgl start --port 3051` (or whichever port is free). |
| "Permission denied" on Linux | The installer asks for `sudo` only when needed; if you're in `/etc/sudoers`, accept the prompt. |
| "winget not found" on Windows | Install winget from the Microsoft Store (App Installer) and re-run. |
| The dashboard didn't open automatically | Visit [http://localhost:3050](http://localhost:3050) manually. |
| Anything else | Run `tgl doctor` for a status report, or open an issue at the [GitHub repo](https://github.com/the-notorious-llama/that-git-life). |

## Manual install

If you don't want the one-liner:

```bash
npm i -g @thenotoriousllama/that-git-life
tgl install-hook
tgl start
```

Then visit [http://localhost:3050](http://localhost:3050).
