# Coding conventions

- **Category:** Standards
- **Status:** Canonical
- **Last updated:** 2026-05-23

These are the engineering rules for `@thenotoriousllama/that-git-life`. They are deliberately short — fewer rules, hit harder.

---

## 1. Language

- **TypeScript 5.x**, strict mode on. `tsconfig.json` extends `@tsconfig/strictest`.
- No `any` in committed code. If you must, use `unknown` and narrow.
- Prefer `type` aliases for unions/utility shapes; `interface` for public object shapes that may be extended.
- Top-level `await` is fine inside the service entry point.

---

## 2. File layout

```
src/
  service/
    index.ts              # Fastify server bootstrap
    routes/
      <feature>.routes.ts # one router file per feature
    services/
      <feature>.service.ts# business logic
    db/
      schema.ts           # better-sqlite3 schema accessors
      migrations/
    public/               # built web app (Vite output target)
  web/
    main.tsx              # Vite entry
    app.tsx
    pages/
    components/
    lib/                  # client utilities
    brand/                # CSS tokens + logo imports (sourced from /brand)
  standardizer/
    index.ts              # public API
    scaffold/
    migrate/
    validate/
    templates/            # readme templates per folder
  scanner/
    index.ts
    checks/
      <check-id>.ts
  installers/             # bash + ps1 templates, post-install runner
  hooks/
    windows/
    macos/
    linux/
    templates/
  skills/
    bundle/
    sync/
  shared/
    types.ts              # types crossing the service/web boundary
    paths.ts              # canonical paths (~/.tgl/, etc.)
```

**Rule:** modules import only from their own subtree, `shared/`, or third-party. The service never imports from `web/`. The web never imports from `service/` at runtime — it talks over HTTP.

---

## 3. Naming

- Files: kebab-case (`repo-list.tsx`, `scan-runner.ts`).
- React components: PascalCase (`<RepoList />`).
- Functions and variables: camelCase.
- Constants (true compile-time constants): `SCREAMING_SNAKE`.
- Types and interfaces: PascalCase.

---

## 4. Error handling

- Throw `Error` subclasses, not strings. Define typed error classes per domain (`InstallError`, `ScanError`, `GitHubAPIError`).
- API routes return the standard error envelope (see `api-contract-conventions.md`).
- Never `console.log` from production code paths. Use the shared logger (`src/shared/logger.ts`).

---

## 5. Logging

- One logger per process, configured at startup. We use Pino (Fastify's default).
- Log levels: `trace`, `debug`, `info`, `warn`, `error`, `fatal`.
- `info` and above are written to `~/.tgl/logs/service.log`. `debug` and below are dropped unless `TGL_LOG_LEVEL=debug` is set.
- Never log the GitHub PAT, SSH private key, or any secret.

---

## 6. Testing

- Vitest. Test files live next to source: `foo.ts` + `foo.test.ts`.
- Every standardizer check + every scanner check has unit tests with fixture repos under `__fixtures__/`.
- Integration tests for API routes hit the real Fastify instance with a temp SQLite file.
- We don't chase 100% coverage. We do require tests on the standardizer, scanner, and migration runner — those are the parts where regressions break user data.

---

## 7. Cross-platform

- Use `path.join`. Never hardcode `/` or `\`.
- Use `os.homedir()` and `os.tmpdir()`. Never `~`.
- Shell-out only inside the installer scripts (which already know their platform). The service never shells out except via `simple-git` and `keytar`.
- Line endings: `.gitattributes` enforces LF for source, CRLF for `.ps1`.

---

## 8. Dependency policy

- New runtime dependencies require a one-line justification in the PR description.
- We prefer libraries with TypeScript types, recent commits, and < 500 KB unpacked.
- Dev dependencies are unrestricted.

---

## 9. Commit hygiene

- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
- One PRD or sub-PRD per branch where possible. Branch names: `prd-<###>-<slug>` or `ird-<###>-<slug>`.
- The PR description links to the PRD/IRD it implements.

---

## 10. Performance budget

- Cold service start (after `tgl start`): < 1.5 s on a modern machine.
- Web app initial paint: < 500 ms after the service is up.
- Repo scan (single repo, all four checks): < 2 s for a typical repo.
- Full multi-repo scan: parallel where safe, capped at `os.cpus().length`.
