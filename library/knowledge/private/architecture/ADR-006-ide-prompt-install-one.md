# ADR-006 — Install script prompts for one IDE and installs only that one

- **Status:** Accepted
- **Date:** 2026-05-23
- **Decision owner:** Mario Aldayuz
- **Supersedes:** —

## Context

The brief lists two IDE paths: "Cursor IDE" or "VS Code + Claude Code (select on install)." We could install both on every machine, prompt the user, or expose a CLI flag.

## Decision

The install script **prompts the user once and installs exactly one IDE**.

```
Which AI-native IDE do you want to standardize on?

  [1] Cursor (Pro plan)        — recommended for solo vibe coders
  [2] VS Code + Claude Code    — recommended if you already live in VS Code

Choose 1 or 2:
```

The choice is recorded in `~/.tgl/tgl.db` (`settings.ide = 'cursor' | 'claude-code'`) and drives:

- Which IDE installer runs.
- Which affiliate signup tab opens (Cursor Pro vs Claude Max).
- Which global-skills directory receives the bundled skills.
- Which subset of bundled skills is copied (Cursor `.cursor/rules` format vs Claude Code `.claude/skills` format).

## Why

- **One IDE at a time matches how solo coders actually work.** Installing both clutters the system and forces a "which one is canonical?" decision later anyway.
- **The skill format differs between IDEs.** Picking one upfront lets us copy the right files to the right place without disk-wasting both formats.
- **Affiliate clarity.** We open the signup link the user will actually use — no mystery tab.

## CLI override

For headless installs and re-runs:

```bash
# bash
./install.sh --ide cursor
./install.sh --ide claude-code

# powershell
./install.ps1 -IDE cursor
./install.ps1 -IDE claude-code
```

If the flag is provided, the prompt is skipped.

## Consequences

- Users who genuinely want both IDEs can run TGL twice (`--ide=cursor` then `--ide=claude-code`). The second run skips already-installed deps and writes a second skills set. UX-acceptable for an edge case.
- The default surface area we test is "one IDE, freshly installed." Cross-IDE switching is supported via `tgl switch-ide` but is a second-class flow.
- Skills must be authored once and have a translator step that emits both Cursor and Claude Code formats from a single source. See PRD-009.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Install both on every machine | Wastes disk; forces canonical-IDE decision later. |
| CLI flag only (no prompt) | Hostile to first-time users running `curl … \| bash`. |
| Detect existing IDEs and pick automatically | Silent magic; users won't know which one TGL chose. |
