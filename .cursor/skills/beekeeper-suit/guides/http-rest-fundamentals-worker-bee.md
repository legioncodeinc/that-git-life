# HTTP/REST Fundamentals Worker Bee - Beekeeper-Suit's Guide

The Beekeeper-Suit routing skill's record of when to invoke `http-rest-fundamentals-worker-bee`. Use this guide to decide whether a user request belongs to this Bee.

**Bee:** [`.cursor/agents/http-rest-fundamentals-worker-bee.md`](../../agents/http-rest-fundamentals-worker-bee.md)
**Stinger:** [`.cursor/skills/http-rest-fundamentals-stinger/`](../../skills/http-rest-fundamentals-stinger/)
**Command Brief:** not available (synthesized from agent + stinger files)
**Trigger policy:** on-demand

---

## Domain

`http-rest-fundamentals-worker-bee` owns the HTTP protocol surface and REST architectural-style compliance for any stack. It covers HTTP methods and their idempotency and safety contracts, status-code semantics (including codes that misrepresent outcomes), request and response headers (caching, content negotiation, security-adjacent), CORS preflight mechanics, conditional requests (ETag, If-None-Match, If-Match), range requests, HTTP/2 multiplexing, HTTP/3 QUIC transport, and the Fielding architectural constraints that distinguish REST from RPC-over-HTTP. It audits route handlers, OpenAPI specs, and HTTP traces against RFC semantics and flags all findings with the authoritative RFC section citation. Security findings scoped to HTTP header misconfiguration are surfaced here and handed off to `security-worker-bee` for remediation tracking.

## Trigger phrases

Route to `http-rest-fundamentals-worker-bee` when the user says any of:

- "is this status code correct?"
- "why is CORS failing?"
- "explain preflight"
- "PUT vs PATCH"
- "HTTP/3 ready?"
- "audit this API"

Or when the request implicitly involves reviewing a route handler, OpenAPI spec, HTTP trace, caching headers, content negotiation, or REST architectural compliance.

## Do NOT route when

- The concern is TLS configuration, cipher suites, or certificate validity — route to `devops-worker-bee` instead.
- The concern is authentication token semantics, JWTs, OAuth flows, or session cookies — route to `auth-worker-bee` instead.
- The concern is crawler-facing HTTP headers or Core Web Vitals — route to `seo-aeo-worker-bee` instead.
- The concern is OWASP-level security header enforcement — route to `security-worker-bee` instead.

If a request straddles two Bees' domains, prefer the narrower-scoped Bee and let the broader one act as backup.

## Inputs the Bee needs

Before invoking, ensure the user has provided (or you can infer):

- The artifact under review: route handler code, OpenAPI spec file, HTTP trace/log, or a description of the API endpoint behavior.
- The specific concern area, if known (method choice, status code, headers, CORS, caching, protocol version, REST compliance) — defaults to a full-surface audit if absent.
- Server configuration files if HTTP/3 readiness is in scope and the stack is self-hosted (nginx, Caddy, Envoy config); the Bee will escalate and stop rather than guess if these are missing.

## Outputs the Bee produces

- A severity-tagged findings report (Critical / High / Medium / Informational) following `templates/findings-report.md`, with an RFC section citation for every status-code and method ruling.
- A handoff list naming any findings that belong to `security-worker-bee`, `auth-worker-bee`, or `devops-worker-bee`, with the specific concern noted for each.

## Multi-Bee sequences this Bee participates in

- Plan execution loop — always closes with `security-worker-bee` then `quality-worker-bee`

## Critical directives the orchestrator should respect

- Cite the RFC section for every status-code and method ruling — RFC citations are the only way the developer can verify the ruling and learn the underlying principle, not just take the Bee's word for it.
- Never conflate HTTP-layer correctness with framework convention — frameworks sometimes diverge from RFC semantics for DX reasons; the developer needs to know when they are following the spec vs the framework because the distinction matters for interoperability.
- Flag CORS `Access-Control-Allow-Origin: *` combined with `Access-Control-Allow-Credentials: true` as Critical severity, not Informational — this specific misconfiguration is exploitable by cross-origin attackers.
- Do not audit authentication tokens, JWTs, or session cookies — hand off explicitly to `auth-worker-bee`.
- Do not audit TLS configuration, cipher suites, or certificate validity — hand off explicitly to `devops-worker-bee`.
- Always read `guides/00-principles.md` as the first action on every invocation — RFC-first reasoning and the safety/idempotency distinction underpin every ruling.

(Full list lives in the Bee file's `## Critical directives` section.)

---

*Part of Beekeeper-Suit's roster. See [`.cursor/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full Army.*
