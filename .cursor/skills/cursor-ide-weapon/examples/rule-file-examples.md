# Rule File Examples

Worked `.mdc` examples for common scenarios.

## 1. Always-apply: coding standards

```mdc
---
alwaysApply: true
---

# Coding Standards

- No em dashes (`—`) or en dashes (`–`) in any prose. Use hyphens, colons, parentheses, or periods instead.
- All exported functions must have JSDoc with `@param` and `@returns`.
- Maximum file length: 400 lines. Split if exceeded.
```

**When to use:** organisation-wide conventions that apply to every file in every context. Keep this under 150 tokens; it burns budget on every invocation.

## 2. Glob-scoped: React component conventions

```mdc
---
description: React component best practices for this project.
globs: "**/*.tsx, **/*.jsx"
alwaysApply: false
---

# React Component Rules

- Use function components only. No class components.
- Name components with PascalCase. Files match the component name.
- One component per file. Exceptions: small co-located helpers under 20 lines.
- Use `shadcn/ui` primitives before reaching for raw HTML elements.
- Props interfaces: always explicitly typed with TypeScript. No implicit `any`.
```

**When to use:** language or framework-specific rules. Fires only when a `.tsx` or `.jsx` file is in context.

## 3. Apply intelligently: database query reviewer

```mdc
---
description: Apply when writing or reviewing database queries, ORM calls, Prisma schema, or SQL migrations.
alwaysApply: false
---

# Database Query Rules

- Always use parameterised queries. Never string-concatenate user input into SQL.
- Prisma: prefer `select` to limit returned fields; never return the full model when only one field is needed.
- Migrations: expand-backfill-contract. Never drop columns in the same migration that removes the code reading them.
- Add an index for every foreign key and every column used in a `WHERE` clause on large tables.
```

**When to use:** context-dependent concerns where the AI can reliably decide relevance from the `description`.

## 4. Apply manually: security audit checklist

```mdc
---
description: Security audit checklist. Mention this rule when conducting a security review.
alwaysApply: false
---

# Security Audit Checklist

1. Input validation: all user inputs validated with Zod or equivalent before use.
2. Authentication: all routes behind authentication middleware. No unauthenticated endpoints except explicit public ones.
3. Secrets: no secrets in source code or git history. All credentials in env vars.
4. SQL injection: parameterised queries everywhere.
5. XSS: user-supplied content escaped before rendering. `dangerouslySetInnerHTML` forbidden.
6. CSRF: state-changing endpoints protected by CSRF token or SameSite cookie.
```

**When to use:** reference material that is only relevant during specific workflows. `@security-audit-checklist` in chat to load it on demand.

## 5. Migration: from `.cursorrules`

**Before (`.cursorrules`):**
```
Always use TypeScript strict mode.
Never use `any` type.
Prefer functional patterns over imperative.
Use pnpm, never npm or yarn.
```

**After (`.cursor/rules/typescript-standards.mdc`):**
```mdc
---
description: TypeScript project standards.
globs: "**/*.ts, **/*.tsx"
alwaysApply: false
---

# TypeScript Standards

- Strict mode enabled in `tsconfig.json`. No exceptions.
- Never use `any`. Use `unknown` + type guard, or a specific type.
- Prefer functional patterns: `map`/`filter`/`reduce` over imperative loops for transformations.
- Package manager: `pnpm` only. Never `npm install` or `yarn add`.
```

**After (`.cursor/rules/tooling.mdc`):**
```mdc
---
alwaysApply: true
---

# Tooling

Always use `pnpm` for all package operations. Never `npm` or `yarn`.
```

The `.cursorrules` content is split into two files: a glob-scoped TypeScript file for code conventions, and a tiny always-apply file for the critical tooling directive.
