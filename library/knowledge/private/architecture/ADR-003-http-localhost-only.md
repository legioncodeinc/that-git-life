# ADR-003 — Web UI served over plain HTTP on localhost:3050

- **Status:** Accepted
- **Date:** 2026-05-23
- **Decision owner:** Mario Aldayuz
- **Supersedes:** —

## Context

The brief originally specified `https://localhost:3050`. HTTPS to localhost means either (a) shipping a self-signed cert and clicking through a browser warning, or (b) installing a local CA via mkcert. Both add friction to a one-shot installer that prides itself on "just works."

## Decision

Serve the web UI over plain **HTTP** at `http://localhost:3050`.

- Fastify binds to `127.0.0.1` (loopback) only — **never** to `0.0.0.0`.
- The port is fixed at 3050. If the port is in use, the CLI surfaces a clear error and offers `tgl start --port <n>` for advanced users.
- All API calls happen over the same `http://localhost:3050` origin (no CORS needed).

## Why

- **Loopback HTTP is private to the user's machine.** Browsers treat `127.0.0.1` as a secure context for most APIs (service workers, secure cookies, etc.). HTTPS adds zero confidentiality benefit over loopback HTTP.
- **No cert install means zero "browser is warning me" moments.** The brief's audience would bounce on a warning page.
- **Faster local dev.** No mkcert bootstrap, no cert renewal, no port-collision-with-cert headaches.

## Consequences

- We can never serve TGL over LAN or expose it to the public internet without re-architecting. That's a feature, not a bug — TGL is a single-user tool.
- The address-bar `https://` in the original brief is deliberately downgraded to `http://`. Documentation, install scripts, and the browser-open call must all use `http://`.
- Service workers and clipboard APIs work fine on `http://localhost`.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Self-signed cert | One-time browser warning kills the vibe of a polished installer. |
| mkcert + local CA | Adds a dependency the user didn't ask for, plus admin prompts on Windows. |
| Cloudflare Tunnel / ngrok proxy | TGL is local-only by design. Tunneling defeats the threat model. |
| Unix socket only (no HTTP) | Browsers can't speak Unix sockets, so we'd still need a localhost listener — back to square one. |
