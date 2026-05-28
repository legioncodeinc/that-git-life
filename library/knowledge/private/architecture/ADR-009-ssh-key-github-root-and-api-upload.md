# ADR-009 — SSH key generated in chosen GitHub root, public key auto-uploaded via GitHub API

- **Status:** Accepted
- **Date:** 2026-05-23
- **Decision owner:** Mario Aldayuz
- **Supersedes:** —

## Context

The brief asks TGL to generate an SSH key pair and place it in the user's chosen GitHub root folder. We need a placement that the user can find, a key type that's modern, and an upload mechanism that gets the public key onto GitHub without manual copy/paste.

## Decision

- **Key type:** `ed25519` (modern, short, broadly supported).
- **Generation location:** the user's chosen GitHub root folder (e.g., `~/GitHub/`) at `.ssh-keys/`:
  - Private key: `<github-root>/.ssh-keys/id_ed25519_tgl`
  - Public key: `<github-root>/.ssh-keys/id_ed25519_tgl.pub`
  - Mode: `0600` on the private key, `0644` on the public key.
- **SSH config:** TGL appends a `Host github.com` block to `~/.ssh/config` (creating the file if missing) that points GitHub authentication at the new key:
  ```
  # Added by that-git-life on <ISO date>
  Host github.com
    HostName github.com
    User git
    IdentityFile <github-root>/.ssh-keys/id_ed25519_tgl
    AddKeysToAgent yes
    IdentitiesOnly yes
  ```
- **Upload:** TGL uploads the public key to the user's GitHub account via `POST /user/keys` using Octokit with the user's PAT. The key title is `that-git-life — <hostname>` so the user can identify it on GitHub.
- **PAT capture:** the onboarding flow includes a step where the user pastes a PAT scoped to `admin:public_key, repo, read:org`. The PAT is stored in the OS keychain via keytar (ADR-004), never on disk.

## Why

- **Co-locating the key with the user's GitHub root** matches the brief and gives the user one mental folder for "all my GitHub stuff."
- **API upload removes the only manual step left.** No more copy/paste into the SSH-keys page.
- **`Host github.com` block scopes the key to GitHub only**, avoiding accidental use against other hosts.
- **Ed25519** is the modern default and produces a short public key the user can quickly verify on GitHub's UI if curious.

## Consequences

- We touch `~/.ssh/config`. We do so additively, with a clearly-commented block, and `tgl uninstall` removes the block.
- If a key with the same title already exists on GitHub, we surface the conflict and let the user delete it from the UI before retrying.
- If the PAT lacks the `admin:public_key` scope, we surface a clear error with a link to regenerate.
- The private key lives under the user's chosen GitHub folder, which means if they sync that folder to Dropbox, the private key syncs too. The web UI warns about this on the SSH step and recommends excluding `.ssh-keys/` from any sync tool.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Use standard `~/.ssh/id_ed25519` | Conflicts with any existing key the user has. |
| Generate key, show in UI, user uploads manually | Adds a copy/paste step that often goes wrong. |
| Use GitHub OAuth Device Flow instead of PAT | Better UX but more code; PAT is acceptable for v1. Reconsider in a later ADR. |
| RSA 4096 | Larger key, older default. No reason to prefer over ed25519. |
| Generate key in `~/.ssh/` despite the brief | Goes against an explicit user spec — defer to brief. |
