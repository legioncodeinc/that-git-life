// templates/components-FAQ.tsx
// Accordion FAQ component with FAQPage JSON-LD schema.
// Extracted verbatim from NEXTJS_SEO_AEO_COMPLETE_GUIDE_2026.md §6.2.
// See guides/05-answer-engine-optimization.md §5.2.
//
// Note: Google restricted FAQPage rich results to authoritative sites (March 2024).
// Still emit the schema for AI Overviews, AI assistants, and accessibility.
//
// Place at components/FAQ.tsx. Requires 'use client' because of useState.

'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQ({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Generate FAQ Schema (FAQPage → Question → Answer)
  const faqSchema = {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({ '@context': 'https://schema.org', ...faqSchema }),
        }}
      />

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors"
              aria-expanded={openIndex === index}
            >
              <h3 className="text-lg font-semibold pr-8">{item.question}</h3>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  openIndex === index ? 'transform rotate-180' : ''
                }`}
              />
            </button>

            {openIndex === index && (
              <div className="px-6 pb-6">
                <p className="text-gray-700 leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
