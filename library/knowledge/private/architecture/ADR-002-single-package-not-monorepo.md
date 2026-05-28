# ADR-002 — Single npm package, not a monorepo

- **Status:** Accepted
- **Date:** 2026-05-23
- **Decision owner:** Mario Aldayuz
- **Supersedes:** —

## Context

The product has three logical pieces — install scripts, a Node service, and a React web app — plus bundled skills and OS hook templates. We could ship these as separate packages in a pnpm/turbo monorepo, or as a single package with internal folders.

## Decision

Ship as a **single npm package** named `@thenotoriousllama/that-git-life`.

Internal layout:

```
that-git-life/
├── bin/                 # tgl CLI entry
├── src/
│   ├── service/         # Fastify backend
│   ├── web/             # React + Vite app (built into src/service/public/)
│   ├── standardizer/    # Library Schema v2 engine
│   ├── scanner/         # repo health checks
│   ├── installers/      # install.sh + install.ps1 templates
│   ├── hooks/           # OS auto-start writers
│   ├── skills/          # bundled default skills/agents
│   └── shared/          # types, utils, brand tokens
├── brand/               # copied Notorious Llama assets (read-only source)
├── library/             # PRDs + ADRs + standards (this folder)
└── package.json
```

## Why

- **One thing to publish, one thing to install.** `npm i -g @thenotoriousllama/that-git-life` is the entire user experience. A monorepo would require publishing N packages or a custom bundler step.
- **Versioning is simple.** One semver, one changelog. No risk of `service@1.2` paired with `web@0.9`.
- **Cursor moves faster.** Less infra to reason about; no workspace plumbing.
- **The components don't have independent consumers.** The web app only ever talks to this service. The standardizer is never invoked outside `tgl`. There's no reuse story that a monorepo would unlock.

## Consequences

- We must enforce internal module boundaries by convention (TypeScript path aliases + ESLint rules) instead of by package boundary.
- If `standardizer/` or `skills/` ever needs to be consumed by another product (e.g., a Notorious Llama CLI in a different repo), we'll extract it then. YAGNI now.
- Web app builds to `src/service/public/` at build time; Fastify serves that folder statically.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| pnpm + turborepo monorepo | No shared-consumer story justifies the overhead. |
| Two packages (`tgl-cli` + `tgl-service`) | Same artifact gets shipped via global install regardless; arbitrary split. |
| Lerna | Older, less ergonomic than pnpm workspaces; same rejection reason. |
