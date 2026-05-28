# How do I uninstall TGL?

Two-step (in this order):

```bash
tgl uninstall-hook       # removes the auto-start hook
npm uninstall -g @thenotoriousllama/that-git-life
```

That removes the service, the CLI, and the OS hook. Everything else (your repos, GitHub account, SSH keys) stays put.

## What gets left behind

By design, TGL doesn't touch anything outside its own scope. After `npm uninstall`:

| Stays | Where | Why |
|---|---|---|
| Your GitHub repos | The folder you chose | Your code, not ours. |
| The SSH key TGL generated | `<github-root>/.ssh-keys/` | You may still want to use it. Delete manually if not. |
| The SSH config block | `~/.ssh/config` | Remove the `# Added by that-git-life` block if you no longer want it. |
| The GitHub PAT | OS keychain | Remove from your keychain app (Keychain Access on macOS, Credential Vault on Windows). |
| TGL's data | `~/.tgl/` (or `%APPDATA%\tgl\` on Windows) | `rm -rf ~/.tgl` if you want it gone. |

## Full clean uninstall (one-liner)

macOS / Linux:

```bash
tgl uninstall-hook && \
  npm uninstall -g @thenotoriousllama/that-git-life && \
  rm -rf ~/.tgl
```

Windows (PowerShell):

```powershell
tgl uninstall-hook
npm uninstall -g @thenotoriousllama/that-git-life
Remove-Item -Recurse -Force $env:APPDATA\tgl
```

> The PAT in your OS keychain isn't removed by these commands — open Keychain Access (macOS) or Credential Manager (Windows) and delete the `that-git-life` entry if you want it gone.
