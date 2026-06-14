# Worked Example — High: IDOR / Broken Object-Level Authorization

Demonstrates: `guides/02-vibe-coding-patterns.md` A1 · `guides/03-owasp-top-10.md` B4 · `guides/01-scan-procedure.md` Step 6 · `guides/05-remediation-playbooks.md` §IDOR.

---

## Scenario

Branch `feat/document-sharing` adds a GET endpoint for retrieving user documents. AI-generated — developer requested "a route that returns a document by id with auth".

## Vulnerable code discovered

`app/api/documents/[id]/route.ts` (lines 1–10):

```ts
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) return new Response('Unauthorized', { status: 401 });

  const doc = await prisma.document.findUnique({
    where: { id: params.id },
  });

  if (!doc) return new Response('Not found', { status: 404 });
  return Response.json(doc);
}
```

## Why it fails

The `auth()` check confirms the caller is logged in — that's **authentication**. But the lookup `findUnique({ where: { id: params.id } })` has no ownership constraint, so any authenticated user can read any document by iterating IDs. Classic IDOR (Insecure Direct Object Reference) / BOLA (Broken Object-Level Authorization).

Secondary finding: the response returns the full `Document` record including fields like `internalNotes`, `creatorIpAddress`, and `deletedAt` that should not leak across users.

## Finding text (report-ready)

> - [x] **IDOR / Broken Access Control** `app/api/documents/[id]/route.ts:9-11` — Handler authenticates the caller but does not verify ownership of the requested document. Any logged-in user can read any document by iterating `id`. Also returns all Document columns; should use `select:` DTO.

## Severity rationale

**High.** Documents may contain user-authored content subject to GDPR. If any document contains financial or regulated data, escalate to **Critical** per the never-downgrade rule. Without knowing the document corpus, default to High and flag the question in the report.

## Remediation diff (applied in-session)

```diff
--- a/app/api/documents/[id]/route.ts
+++ b/app/api/documents/[id]/route.ts
@@ -4,10 +4,14 @@ import { prisma } from '@/lib/db';
 export async function GET(
   req: Request,
   { params }: { params: { id: string } }
 ) {
   const session = await auth();
-  if (!session) return new Response('Unauthorized', { status: 401 });
+  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

-  const doc = await prisma.document.findUnique({
-    where: { id: params.id },
-  });
+  const doc = await prisma.document.findFirst({
+    where: { id: params.id, userId: session.user.id }, // scoped read
+    select: {
+      id: true, title: true, content: true, updatedAt: true,
+    },
+  });

   if (!doc) return new Response('Not found', { status: 404 });
   return Response.json(doc);
 }
```

Two targeted changes:

1. `findUnique` → `findFirst` with a `where` that includes `userId: session.user.id`. The query itself enforces ownership — no way for a later refactor to reintroduce the bug.
2. `select:` enumerates exactly the fields the client needs. No accidental leakage of internal fields.

Returning 404 (not 403) means an unauthorized caller cannot distinguish "doesn't exist" from "not yours" — prevents enumeration as a reconnaissance oracle.

## Post-fix verification

```bash
pnpm test -- documents
git diff app/api/documents/[id]/route.ts
```

Sanity: the diff touches only this file and only the identity/scoping lines.

## What goes in the audit report

Under **High Findings (fixed in this session):**

- [x] **IDOR / Broken Access Control** `app/api/documents/[id]/route.ts:9-11` — Authenticated but did not verify ownership; any logged-in user could read any document by ID. Fix: `findFirst` with `where: { id, userId: session.user.id }`, explicit `select:` DTO, 404 on miss (no enumeration).

Under **Recommended Follow-Up (architectural):**

- Audit all other `app/api/**/[id]/**` handlers for the same pattern. A CI ESLint rule that forbids `findUnique({ where: { id } })` on multi-tenant tables would be a structural fix.
