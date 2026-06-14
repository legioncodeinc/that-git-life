# Guide 04 — Entity Extraction by Type

The comprehensive 13-type catalog. For each `entity_type` value in [`references/frontmatter-schema.md`](../references/frontmatter-schema.md), this guide names the detection heuristic, the extraction library/API surface, the required frontmatter, the body sections to populate, and the gotchas.

**Scope:** TypeScript/JavaScript-first. Non-TS/JS files get filename-only stubs per [`guides/08-stub-pages-for-non-js.md`](08-stub-pages-for-non-js.md) — extraction tactics below assume `.ts/.tsx/.js/.jsx` source.

**The pairing rule (read this first):** Atomicity says every entity gets its own page. The pairing rule says every entity also lists its sibling pairs in frontmatter. Queues pair with handlers via `triggers:`. Cron jobs pair with their target. SQL tables pair with their `data-model` interface. Feature-flag entities pair with concept pages via `read_at_via:` when accessed via bulk hooks. ADRs pair `supersedes` ↔ `superseded_by`. Lint mode catches missing pairs as a first-class finding.

---

## function

**Detection heuristic:** ts-morph `sourceFile.getFunctions()` (named function declarations) PLUS `sourceFile.getVariableDeclarations()` filtered to `getInitializer()` is `ArrowFunction` or `FunctionExpression`. Both walks are required — `getFunctions()` does NOT see `const f = () => {}`.

**Extraction:** ts-morph `FunctionDeclaration` / `ArrowFunction` → name, parameters with types, return type, JSDoc.

**Frontmatter:** `entity_type: function`, `path`, `language`, `depends_on` (other entities called inside the body), `used_by` (left empty in `document` mode; populated by reverse-lookup post-pass — agent does NOT scan the whole repo for callers).

**Body sections:** Overview / Signature / Behavior / Connections / Tested by / History / Sources.

**Gotchas:**
- Anonymous arrow functions assigned to variables count as functions only if the variable name is exported or used elsewhere.
- Overloaded function declarations are ONE entity page; list all signatures in the Signature block.
- Curried functions (returning functions) are still one entity unless the inner function is exported.

---

## class

**Detection heuristic:** ts-morph `sourceFile.getClasses()`.

**Extraction:** ts-morph `ClassDeclaration` → name, members via `getMethods()`, `getProperties()`, `getDecorators()`, `getExtends()`, `getImplements()`.

**Frontmatter:** `entity_type: class`, `path`, `language`, `extends:` (parent class wikilink), `implements:` (interface wikilinks), `depends_on`, `used_by`.

**Body sections:** Overview / Class signature / Public methods / Properties / Inheritance / Connections / Tested by / History / Sources.

**Gotchas:**
- Decorated classes (`@Injectable()`, `@Service()`, `@Controller()`) hint at sub-type promotion to `service` or `endpoint`. Re-classify before writing.
- Abstract classes are still entities; mark in body, not in frontmatter.
- Methods do NOT get their own entity pages by default — they're sub-section of the class. Promote to standalone `function` entity only if the method is exported separately or has independent significance.

---

## module

**Detection heuristic:** One entity per source file with non-empty `getExportedDeclarations()`. The module entity is the file-as-thing — distinct from the per-callable entities inside it.

**Extraction:** ts-morph `getExportedDeclarations()` for the export list, `getImportDeclarations()` for the import graph.

**Frontmatter:** `entity_type: module`, `path`, `language`, `exports:` (list of entity wikilinks for everything the module exports), `imports:` (list of module wikilinks for the modules it depends on), `last_commit_hash`.

**Body sections:** Overview (one paragraph: what this module's responsibility is) / Exports / Imports / Connections / History / Sources.

**Gotchas:**
- The module narrative document (the longer-form prose) is library-guardian's job at `library/knowledge-base/<module>/`. wiki-guardian's `module` entity is a stub-style index pointing at the per-callable entities inside the file.
- Files with zero exports (test files, config files) do NOT get a module entity. Their callables (test cases, config keys) get individual entities under their own sub-types.

---

## service

**Detection heuristic:** Class with `@Injectable()` / `@Service()` decorator OR file located in a `services/` directory OR class with explicit framework registration (e.g., NestJS `@Module({ providers: [...] })`).

**Extraction:** ts-morph + decorator inspection. For NestJS, also walk `@Module` providers arrays to confirm registration.

**Frontmatter:** `entity_type: service`, `path`, `language`, `endpoints:` (list of `[[entities/<endpoint>]]` if this service exposes any), `env_vars:` (list of `[[entities/<env-var>]]` it reads), `depends_on` (other services it injects).

**Body sections:** Overview / Class signature / Endpoints / Env vars / Dependencies / Connections / Tested by / History / Sources.

**Gotchas:**
- A service often pairs with one or more `endpoint` entities — link them via `endpoints:`.
- Services in framework-less code (plain TypeScript) are inferred from the `services/` directory convention; if the user's repo doesn't use that convention, the service sub-type may be empty for v1.

---

## endpoint

**Detection heuristic:** Method decorator (`@Get(path)`, `@Post(path)`) OR call expression `app.get(path, handler)` / `router.post(path, handler)` / `Hono` route methods / tRPC router definitions.

**Extraction:** ts-morph `CallExpression` walk with framework-specific recognizers. v1 covers Express, Fastify, NestJS, Hono. tRPC is v1.5.

**Frontmatter:** `entity_type: endpoint`, `path` (source file), `language`, `http_method` (GET / POST / PUT / DELETE / PATCH), `route_path` (e.g., `/api/users/:id`), `handler:` (`[[entities/<handler-function>]]`), `auth_required` (boolean), `service:` (`[[entities/<parent-service>]]` if applicable).

**Body sections:** Overview / HTTP method + route / Handler / Auth / Request schema / Response schema / Connections / Tested by / History / Sources.

**Gotchas:**
- The `handler:` is a separate `function` entity. Always create both. The endpoint links to the handler via `handler:`; the handler's `used_by:` includes the endpoint.
- Route parameters in the path (`:id`) are NOT separate entities — they're documented in the body's Request schema section.

---

## env-var

**Detection heuristic:** AST scan for `MemberExpression` matching `process.env.X` or `import.meta.env.X` (Vite/Astro). Aggregate by name across the chunk.

**Extraction:** ts-morph descendants of kind `PropertyAccessExpression`, filter by left-side identifier `env`. Each unique key name becomes one entity.

**Frontmatter:** `entity_type: env-var`, `name` (the env var name, e.g., `DATABASE_URL`), `read_at:` (list of `{file, line}` call sites), `default_value:` (if set in code via `process.env.X || 'default'`), `is_required:` (heuristic — true if any access lacks a default), `language`, `last_commit_hash`.

**Body sections:** Overview / Default value / Required vs optional / Read sites / Connections / Sources.

**Gotchas:**
- The `path` field for `env-var` is the FIRST file where it appears, but `read_at:` is the full list. Be explicit.
- Aggregate across the chunk: if the same env var is read in 5 files, ONE entity page with 5 `read_at:` entries — not 5 entity pages.
- For framework-specific env conventions (Next.js `NEXT_PUBLIC_`, Vite `VITE_`), note in the body whether the var is exposed to the client bundle.

---

## config-key

**Detection heuristic:** Per-loader call-site recognizers. v1 covers:
- `config.get('key')` (`config` package)
- `nconf.get('key')` (`nconf`)
- `convict.get('key')` (`convict`)
- `import config from './config.json'` then property access (`config.key`)

**Extraction:** ts-morph `CallExpression` walk + per-loader pattern matching. Aggregate by key name. v1.1 may extend to `dotenv-flow`, `node-config-yaml`.

**Frontmatter:** `entity_type: config-key`, `name` (the config key, e.g., `database.host`), `loader:` (`config | nconf | convict | json | other`), `read_at:` (list of `{file, line}`), `default_value:` (if discoverable from a config schema file), `language`, `last_commit_hash`.

**Body sections:** Overview / Loader / Default / Read sites / Schema source (if applicable) / Connections / Sources.

**Gotchas:**
- Config schemas (e.g., `convict({...schema...})`) are often centralized — file the schema file as a `data-model` entity and link from each `config-key` via `schema_source:`.
- Hot-reloaded config keys vs startup-only — note in body, not frontmatter.

---

## data-model

**Detection heuristic:** TypeScript `interface`, `type` alias, OR `CallExpression` matching `z.object({...})` (Zod), `t.type({...})` (io-ts), `Type({...})` (TypeBox).

**Extraction:** ts-morph `getInterfaces()`, `getTypeAliases()`, `CallExpression` for schema-library calls.

**Frontmatter:** `entity_type: data-model`, `path`, `language`, `schema_library:` (`typescript | zod | io-ts | typebox | json-schema | other`), `fields:` (list of field names — for grep-ability), `used_by:` (entities that consume this model).

**Body sections:** Overview / Schema definition / Fields / Validation rules / Connections / Sources.

**Gotchas:**
- Cross-link `data-model` to `sql-table` if the data-model represents the same shape as a database table. Both entities exist; link via `related:`.
- For Prisma/Drizzle: prefer parsing the `.prisma` or `schema.ts` file and filing each model as a `data-model`. The corresponding `sql-table` is a separate entity (the actual table in the DB).

---

## react-component

**Detection heuristic:** PascalCase function or arrow function returning JSX in `.tsx` or `.jsx` files. Use `react-docgen-typescript` for richer prop extraction; fall back to ts-morph if the parser yields `[]`.

**Extraction:** `react-docgen-typescript` `withCustomConfig(tsconfigPath, opts).parse(file)` → returns component metadata with props (name, type, default, description). For `forwardRef`/`memo`/`styled` wrappers, use `componentNameResolver` config option.

**Frontmatter:** `entity_type: react-component`, `path`, `language` (`tsx`/`jsx`), `props_summary` (comma-separated prop names — for grep), `is_default_export` (boolean), `wraps:` (if `forwardRef`/`memo`/`styled` wrapper, the inner component).

**Body sections:** Overview / Props (markdown table — name, type, required, default, description) / State / Side effects / Connections / Tested by / Storybook stories (if applicable) / History / Sources.

**Gotchas:**
- Render props as ONE markdown table sub-section, NOT per-prop entity pages (per user decision 2026-04-29 — would explode the wiki).
- Custom hooks (`useFoo`) are NOT `react-component` — file as `function` with a `hook: true` body annotation.
- Compound components (`Card.Header`, `Card.Body`) get one entity page per sub-component, parented via `parent: [[entities/Card]]`.

---

## sql-table

**Detection heuristic:** `.sql` file containing `CREATE TABLE` statements OR ORM schema files (Prisma `schema.prisma`, Drizzle `schema.ts`).

**Extraction:** `node-sql-parser` `Parser.astify(sql, { database: dialect })` filter `type === 'create' && keyword === 'table'`. Wrap in try/catch — typed AST is loose (issue #1701 known).

For ORM-defined tables: parse the schema source and file each model as both `data-model` AND `sql-table` (linked via `related:`).

**Frontmatter:** `entity_type: sql-table`, `path` (the SQL file or schema definition), `language` (`sql` or `ts` for ORM), `dialect` (`postgres | mysql | sqlite | mssql | other`), `columns:` (list of column names — for grep), `primary_key:`, `foreign_keys:` (list of `[[entities/<other-table>]]`), `data_model:` (`[[entities/<paired-data-model>]]` if applicable).

**Body sections:** Overview / DDL / Columns (markdown table) / Primary key / Foreign keys / Indexes / Connections / Sources.

**Gotchas:**
- The `node-sql-parser` AST is loose — wrap parsing in try/catch; on failure, file the table as a `sql-table` stub entity with `status: developing` and the raw DDL in body, flagging for human review.
- Migration files create AND alter tables — only the most recent shape goes on the page; the change history is in `History` body section.

---

## queue

**Detection heuristic:**
- **BullMQ:** grep `from 'bullmq'`, then ts-morph `NewExpression` with `Queue` or `Worker` constructor.
- **Inngest:** grep `'inngest'` import, then ts-morph `CallExpression` with `.createFunction` callee.
- **SQS / other:** v1.5; out of v1 scope.

**Extraction:** ts-morph `NewExpression` / `CallExpression` + first-string-arg extraction for queue name. Pair `Queue` and `Worker` by name. For Inngest: `createFunction` config arg `id` field + `triggers` array walk.

**Frontmatter:** `entity_type: queue`, `path`, `language`, `queue_framework: bullmq | inngest | sqs | other`, `queue_name:` (the string identifier), `triggers:` (`[[entities/<handler-function>]]`), `repeat_pattern:` (cron expression if any — note: this also creates a paired `cron-job` entity).

**Body sections:** Overview / Framework / Queue name / Handler / Repeat schedule (if any) / Job options (concurrency, attempts, backoff) / Connections / Tested by / History / Sources.

**Gotchas:**
- BullMQ `repeat: { cron: '0 * * * *' }` ALSO creates a paired `cron-job` entity. Same Inngest with `triggers: [{ cron: '0 * * * *' }]`.
- Inngest functions are filed as `queue` with `queue_framework: inngest` (per user decision 2026-04-29). Do NOT introduce a 14th sub-type.
- The handler function is ALWAYS a separate `function` entity. The queue page links to it via `triggers:`; the handler's `used_by:` includes the queue.

---

## cron-job

**Detection heuristic:** String literal at known framework call sites:
- `cron.schedule('0 * * * *', handler)` (`node-cron`)
- `schedule.scheduleJob('0 * * * *', handler)` (`node-schedule`)
- `new Cron('0 * * * *', handler)` (`croner`)
- BullMQ `repeat: { cron: '...' }` (cross-references the queue page)
- Inngest `triggers: [{ cron: '...' }]` (cross-references the queue page)

**Extraction:** ts-morph + per-framework call-site walk. For each cron expression, validate via `cron-parser` `CronExpressionParser.parse(expr)` and compute next-3-fire times.

**Frontmatter:** `entity_type: cron-job`, `path`, `language`, `cron_framework: node-cron | node-schedule | croner | bullmq-repeat | inngest-cron | other`, `schedule:` (the cron expression), `timezone:` (default UTC unless framework specifies), `triggers:` (`[[entities/<target-handler>]]`).

**Body sections:** Overview / Framework / Schedule (with human-readable interpretation) / Next 3 fires (computed via `cron-parser`) / Target handler / Connections / Tested by / History / Sources.

**Gotchas:**
- Cron jobs ALWAYS pair with a target handler entity. Same atomic-pairing rule as queue↔handler.
- For BullMQ-repeat and Inngest-cron, the cron-job entity is in addition to the queue entity. Both exist; link via `related:` and `triggers:`.
- Validate the cron expression — invalid expressions are a `gap` in the response payload, not a silent skip.

---

## feature-flag

**Detection heuristic:**
- **OpenFeature:** grep `@openfeature/`, then ts-morph `CallExpression` with callee matching `getBooleanValue | getStringValue | getNumberValue | getObjectValue`.
- **LaunchDarkly:** grep `launchdarkly-`, then ts-morph `CallExpression` with callee matching `variation | boolVariation | stringVariation | numberVariation | jsonVariation`.
- **GrowthBook:** v1.5; out of v1 scope.
- **Plain env-var flags:** these are `env-var` entities, not `feature-flag` — different sub-type.

**Extraction:** ts-morph `CallExpression` + first-string-arg extraction for flag key + LAST positional arg as default value. Aggregate by flag key across the chunk.

**Frontmatter:** `entity_type: feature-flag`, `name` (flag key), `flag_provider: openfeature | launchdarkly | growthbook | other`, `default_value:`, `value_type: boolean | string | number | object`, `read_at:` (list of `{file, line}` call sites), `read_at_via:` (list of `[[concepts/<bulk-read-concept>]]` for hooks like `useFlags()`), `language`, `last_commit_hash`.

**Body sections:** Overview / Provider / Default value / Value type / Direct read sites / Bulk read sites (via concept) / Connections / Sources.

**Gotchas:**
- React `useFlags()` reads the entire flag set at once. For these call sites, file a concept page at `concepts/launchdarkly-react-flag-set.md` and link individual flag entities via `read_at_via: ["[[concepts/launchdarkly-react-flag-set]]"]` (per user decision 2026-04-29). The component using `useFlags()` is documented in the concept page, not in each flag's `read_at:`.
- The `path` field for a `feature-flag` is the FIRST file where the flag appears (alphabetically). `read_at:` is the canonical full list.
- LaunchDarkly's `client.variation('flag-key', user, defaultValue)` — flag-key is FIRST string arg, default is LAST positional arg. `boolVariation` etc. follow the same convention.

---

## Pairing reference

The pairs that lint mode catches as missing-pair findings:

| Sub-type | Pair |
|---|---|
| `endpoint` | `handler:` → `function` entity |
| `service` | `endpoints:` → list of `endpoint` entities (if any) |
| `service` | `env_vars:` → list of `env-var` entities |
| `queue` | `triggers:` → `function` (the handler) |
| `cron-job` | `triggers:` → `function` (or `queue` for queue-embedded crons) |
| `sql-table` | `data_model:` → `data-model` entity (if ORM-paired) |
| `feature-flag` | `read_at_via:` → `concept` (for bulk-read patterns) |
| `decision` | `supersedes:` ↔ `superseded_by:` |
| `class` | `extends:`, `implements:` |

When a pair is declared on one side, the other side's frontmatter MUST include the reverse link. Lint mode catches asymmetries.

## History sections (every entity)

Per [`templates/entity.md`](../templates/entity.md), every entity body has a History section populated from `git_context`:

- **Created:** `commit_sha`, author, date.
- **Last touched:** `commit_sha`, author, date.
- **Recent activity:** top 3–5 recent commits affecting the file.
- **Top contributors:** from `blame_summary.top_authors` — list top 3.
- **Churn rate:** from `blame_summary.churn_rate`.

Heuristic source: `gods-hand/refs/claude-obsidian-main/skills/wiki-ingest/SKILL.md` plus `2026-04-29-git-blame-heuristics.md`.

## Source

Per-type guidance distilled from the synthesis at `research/2026-04-29-synthesis.md`. Individual research notes per type are linked from the synthesis.
