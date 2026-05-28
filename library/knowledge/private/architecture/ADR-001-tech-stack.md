# ADR-001 — Tech stack

- **Status:** Accepted
- **Date:** 2026-05-23
- **Decision owner:** Mario Aldayuz
- **Supersedes:** —

## Context

`that-git-life` ships as a single globally-installed npm package that runs a long-lived local service and serves a web UI. It needs to work cross-platform (Windows + macOS + Linux), be installable with one command, and feel fast to develop against. The audience is "vibe coders" — devs who don't want to think about plumbing.

## Decision

| Layer | Choice |
|---|---|
| Language | TypeScript everywhere |
| Runtime | Node.js LTS (≥ 20) |
| HTTP server | [Fastify](https://fastify.dev/) |
| Database | SQLite via [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3) |
| Secret storage | [`keytar`](https://github.com/atom/node-keytar) (OS keychain) |
| Git ops | [`simple-git`](https://github.com/steveukx/git-js) |
| GitHub API | [`@octokit/rest`](https://github.com/octokit/octokit.js) |
| File watching | [`chokidar`](https://github.com/paulmillr/chokidar) |
| Cron | [`node-cron`](https://github.com/node-cron/node-cron) |
| CLI parsing | [`commander`](https://github.com/tj/commander.js) |
| Web framework | React 18 |
| Web bundler | [Vite](https://vitejs.dev/) |
| CSS | [Tailwind CSS](https://tailwindcss.com/) |
| Components | [shadcn/ui](https://ui.shadcn.com/) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Routing (web) | [`react-router-dom`](https://reactrouter.com/) |
| Build pipeline | [`tsup`](https://tsup.egoist.dev/) for service; Vite for web; everything bundled into `dist/` for `npm pack` |
| Test runner | [Vitest](https://vitest.dev/) |
| Lint/format | ESLint + Prettier |

## Why each choice

- **TypeScript everywhere** — one language end-to-end keeps the cognitive cost low for a vibe-coder audience and lets us share types between service and web.
- **Fastify over Express** — schema-first validation, better perf, native TypeScript types, simpler plugin model.
- **better-sqlite3 over node-sqlite3 or sql.js** — synchronous API (fine for a single-user local app), zero-config, ships as native binary that npm resolves per platform.
- **keytar** — keeps the GitHub PAT out of SQLite and out of disk. Uses Windows Credential Vault, macOS Keychain, and libsecret on Linux.
- **simple-git** — wraps the local `git` CLI rather than reimplementing protocol, which matches what users will see when they run git themselves.
- **Octokit** — official client, handles PAT auth + rate limits.
- **Vite + Tailwind + shadcn** — the Notorious Llama default frontend stack. Fast HMR, low-runtime, copy-in components we can re-style for the brand.
- **Framer Motion** — required for the "clever Notorious Llama styles" the brief calls for; lets us do hip-hop-loud entrance animations cheaply.

## Consequences

- Native modules (`better-sqlite3`, `keytar`) require a prebuilt-binary strategy. We rely on each library's bundled prebuilds; if npm install fails on an exotic OS, the install script surfaces a clear error.
- We commit to TypeScript-first contributors. Cursor builds in TS by default, which matches.
- We don't use a backend framework like NestJS or tRPC. Fastify routes are plain handlers; tRPC was considered and rejected to keep the API discoverable from `curl` and easy to consume from any future client.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Electron app | Brief specifies a web UI on `localhost:3050`, not a desktop app. Electron is heavier and harder to install via `npm i -g`. |
| Tauri | Same reason. |
| Go service + React | Adds a second toolchain; loses TS type sharing. |
| Express | Less ergonomic for TS; Fastify is the modern default. |
| Postgres / DuckDB | Overkill for single-user local state. |
| Next.js | Server-rendering is irrelevant for a local-only UI; Vite's faster dev loop. |
