// templates/components-Schema.tsx
// JSON-LD schema component. Wraps a schema object in the @context wrapper
// and renders it as <script type="application/ld+json">.
// Extracted verbatim from NEXTJS_SEO_AEO_COMPLETE_GUIDE_2026.md §4.2.
// See guides/03-schema-markup.md §3.2.
//
// Requires: npm install schema-dts
// Place at components/Schema.tsx.

import { Thing, WithContext } from 'schema-dts';

interface SchemaProps {
  schema: WithContext<Thing> | Thing;
}

export function Schema({ schema }: SchemaProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          ...schema,
        }),
      }}
    />
  );
}
