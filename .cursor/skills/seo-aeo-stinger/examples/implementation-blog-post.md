# Example — Implementing a Blog Post with Full Article Schema + E-E-A-T + AEO

**Scenario:** A Next.js 15 content site publishing a new long-form blog post: "How to Choose a Standing Desk in 2026". The user invokes `seo-aeo-worker-bee` with "implement this blog post following the playbook."

**Guides exercised:** `02-on-page-optimization.md`, `03-schema-markup.md`, `04-content-quality-eeat.md`, `05-answer-engine-optimization.md`.

**Templates used:** `lib-metadata.ts`, `lib-schema.ts`, `components-Schema.tsx`, `components-FAQ.tsx`, `components-Author.tsx`.

---

## Step 1 — Scoping

**Invocation:** "Implement the blog post at `content/posts/choosing-standing-desk-2026.mdx` with the full SEO/AEO treatment."

**Classification:** Implementation mode. Author files; demonstrate the pattern.

**Target:** `app/blog/[slug]/page.tsx` dynamic route, with metadata via `generateMetadata`, Article + BreadcrumbList + FAQPage + Organization schemas, visible author attribution, visible dates, and AEO-shaped content.

---

## Step 2 — `app/blog/[slug]/page.tsx`

```tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateMetadata as genMeta } from '@/lib/metadata';
import { createArticleSchema, createBreadcrumbSchema, createFAQSchema } from '@/lib/schema';
import { Schema } from '@/components/Schema';
import { AuthorBio } from '@/components/AuthorBio';
import { FAQ } from '@/components/FAQ';

interface Params { slug: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return genMeta({
    title: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    url: `/blog/${post.slug}`,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    author: post.author.name,
    section: post.category,
    tags: post.tags,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const articleSchema = createArticleSchema({
    title: post.title,
    description: post.excerpt,
    author: post.author.name,
    publishedAt: post.publishedAt,
    modifiedAt: post.updatedAt,
    image: post.featuredImage,
    url: `https://yourdomain.com/blog/${post.slug}`,
  });

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: 'https://yourdomain.com/' },
    { name: 'Blog', url: 'https://yourdomain.com/blog' },
    { name: post.title, url: `https://yourdomain.com/blog/${post.slug}` },
  ]);

  const faqSchema = createFAQSchema(post.faqs);

  return (
    <>
      <Schema schema={articleSchema} />
      <Schema schema={breadcrumbSchema} />
      <Schema schema={faqSchema} />

      <article className="prose prose-lg max-w-none">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-gray-600 mb-4">
          <a href="/">Home</a> / <a href="/blog">Blog</a> / {post.title}
        </nav>

        <header>
          <h1>{post.title}</h1>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>By <a href={`/authors/${post.author.slug}`}>{post.author.name}</a></span>
            <span>
              Published <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString()}
              </time>
            </span>
            <span>
              Updated <time dateTime={post.updatedAt}>
                {new Date(post.updatedAt).toLocaleDateString()}
              </time>
            </span>
          </div>
        </header>

        {/* Quick Answer box — AEO pattern */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8 not-prose">
          <h3 className="text-lg font-semibold mb-2">Quick Answer:</h3>
          <p>
            To choose a standing desk in 2026, prioritize (1) electric
            dual-motor height adjustment for consistency, (2) a width of at
            least 48 inches to fit two monitors, (3) a frame rated for 250+ lbs
            of load capacity, and (4) programmable memory presets. Expect to
            pay $400–$900 for mid-range quality.
          </p>
        </div>

        {/* Long-form article content follows... */}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* FAQ section with schema */}
        <section className="my-12 not-prose">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <FAQ items={post.faqs} />
        </section>

        {/* Author bio — E-E-A-T attribution */}
        <AuthorBio
          name={post.author.name}
          role={post.author.role}
          bio={post.author.bio}
          image={post.author.image}
          credentials={post.author.credentials}
          socialLinks={post.author.socialLinks}
        />

        {/* Sources */}
        <footer className="mt-12 p-6 bg-gray-50 rounded-lg not-prose">
          <h3 className="text-lg font-semibold mb-4">Sources & References</h3>
          <ol className="space-y-2 text-sm text-gray-700">
            {post.sources.map((s, i) => (
              <li key={i}>
                <a href={s.url}>{s.title}</a> — {s.publication}, {s.year}
              </li>
            ))}
          </ol>
        </footer>
      </article>
    </>
  );
}

async function getPost(slug: string) {
  // Implementation — fetch from CMS / filesystem / database.
  return null;
}
```

---

## Step 3 — Content shape (AEO patterns)

The MDX source for `choosing-standing-desk-2026.mdx` follows the patterns from `guides/05-answer-engine-optimization.md`:

### Paragraph snippet (opener after the Quick Answer box)

```md
## What is the best standing desk for 2026?

The best standing desk for 2026 is an electric dual-motor model with a
height range of 24 to 50 inches, a width of at least 48 inches, and 250+
lbs load capacity. For most home offices, the Uplift V2 Commercial and
the Fully Jarvis lead their respective price brackets.
```

(60 words. Opens with the question as a noun-restated statement. Direct.)

### List snippet (numbered for process)

```md
## How to set up a standing desk for proper ergonomics

To set up a standing desk ergonomically, follow these steps:

1. **Adjust desk height** so your elbows form a 90-degree angle with the keyboard.
2. **Position the monitor** at eye level, about an arm's length away.
3. **Use an anti-fatigue mat** to reduce leg strain during prolonged standing.
4. **Alternate every 30–60 minutes** between sitting and standing.
5. **Wear supportive shoes** — slippers and barefoot standing lead to foot fatigue.

Detailed explanation of each step follows…
```

### Table snippet (comparison)

```md
## Standing desk comparison: Uplift V2 vs Jarvis vs FlexiSpot E7

| Feature | Uplift V2 | Jarvis | FlexiSpot E7 |
|---|---|---|---|
| Height range | 25.3"–50.9" | 24.5"–50" | 22"–48" |
| Load capacity | 355 lb | 350 lb | 355 lb |
| Warranty | 15 year | 15 year | 15 year |
| Base price | $549 | $479 | $399 |
```

### FAQ (FAQPage schema via the FAQ component)

```jsonc
[
  {
    "question": "How much does a quality standing desk cost in 2026?",
    "answer": "A quality standing desk in 2026 costs between $400 and $900 for mid-range electric models, $1,000–$2,000 for commercial-grade options with advanced features, and $200–$400 for entry-level electric or manual crank desks."
  },
  {
    "question": "Are standing desks better than sitting desks?",
    "answer": "Standing desks are better than sitting desks when used in alternation — 30–60 minute intervals of standing and sitting improve circulation, reduce back pain, and increase daily energy expenditure. Pure standing for 8 hours straight causes more harm than sitting; the benefit comes from movement."
  }
  // More FAQs...
]
```

---

## Step 4 — Author page (E-E-A-T)

`app/authors/[slug]/page.tsx` with Person schema:

```tsx
import { Schema } from '@/components/Schema';

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = await getAuthor(slug);
  if (!author) notFound();

  const personSchema = {
    '@type': 'Person',
    '@id': `https://yourdomain.com/authors/${slug}#person`,
    name: author.name,
    jobTitle: author.role,
    worksFor: { '@type': 'Organization', '@id': 'https://yourdomain.com/#organization' },
    alumniOf: author.alumniOf,
    knowsAbout: author.expertise,
    sameAs: [author.socialLinks.twitter, author.socialLinks.linkedin, author.socialLinks.website].filter(Boolean),
    image: author.image,
  };

  return (
    <>
      <Schema schema={personSchema} />
      <main>{/* Author page content */}</main>
    </>
  );
}
```

---

## Step 5 — Validation

Before merge, run:

1. **Rich Results Test** — https://search.google.com/test/rich-results?url=https://yourdomain.com/blog/choosing-standing-desk-2026. Expected: Article + Breadcrumb eligible. FAQPage parse-valid but may show "not eligible" (restricted since March 2024 — acceptable).

2. **Schema Markup Validator** — https://validator.schema.org/validate?url=https://yourdomain.com/blog/choosing-standing-desk-2026. Expected: zero errors on all 4 schemas.

3. **Record in `library/qa/seo/`** — paste the validator outputs alongside this post's entry in the project's running audit log (e.g., `library/qa/seo/<date>-schema-validation.md`).

---

## Three discovery systems cross-check

| Decision | Traditional search | AI Overviews | AI assistants |
|---|---|---|---|
| Article + BreadcrumbList schema | Article rich result + breadcrumb in SERP | Structured extraction for summaries | LLM comprehension + citation |
| FAQPage schema | Rich result restricted (marketing sites), still valid | FAQ extraction | Citation-eligible Q&A |
| Author attribution + Person schema + `/authors/{slug}` | E-E-A-T signal for quality raters | Minor signal | **Primary citation signal** |
| Quick Answer box (40–60 words) | Paragraph snippet eligibility | Direct extraction candidate | LLM summary source |
| `datePublished` + `dateModified` | Freshness signal | Freshness signal | **Critical freshness signal** |
| Cited sources (linked out) | E-E-A-T trustworthiness | Minor signal | Assistant trust signal |

Every decision affects all three. This is the playbook's shape.

---

## Handoff line

> "Implemented `app/blog/choosing-standing-desk-2026`. Article + BreadcrumbList + FAQPage + Person schema emitted. Run Rich Results Test and Schema Markup Validator before merge; record outputs at `library/qa/seo/<date>-schema-validation.md`."
