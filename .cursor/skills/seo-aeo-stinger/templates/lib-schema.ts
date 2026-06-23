// templates/lib-schema.ts
// Schema markup utility library — Organization, LocalBusiness, Article, FAQPage,
// BreadcrumbList, Product, Service, Review, HowTo, VideoObject.
// Extracted verbatim from NEXTJS_SEO_AEO_COMPLETE_GUIDE_2026.md §4.1 & §4.3.
// See guides/03-schema-markup.md for the type catalog and validation workflow.
//
// Requires: npm install schema-dts
// Place at lib/schema.ts.

import { Organization, LocalBusiness, Article, FAQPage, BreadcrumbList } from 'schema-dts';

export const organizationSchema: Organization = {
  '@type': 'Organization',
  '@id': 'https://yourdomain.com/#organization',
  name: 'Your Company Name',
  url: 'https://yourdomain.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://yourdomain.com/logo.png',
    width: '600',
    height: '60',
  },
  description: 'Your company description',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Main St',
    addressLocality: 'City',
    addressRegion: 'ST',
    postalCode: '12345',
    addressCountry: 'US',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-555-5555',
    contactType: 'customer service',
    email: 'support@yourdomain.com',
    areaServed: 'US',
    availableLanguage: ['English', 'Spanish'],
  },
  sameAs: [
    'https://facebook.com/yourpage',
    'https://twitter.com/yourhandle',
    'https://linkedin.com/company/yourcompany',
    'https://instagram.com/yourhandle',
    'https://youtube.com/@yourchannel',
  ],
  founder: {
    '@type': 'Person',
    name: 'Founder Name',
    jobTitle: 'Founder & CEO',
  },
};

export function createLocalBusinessSchema(location: {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  coordinates: { lat: number; lng: number };
  hours: { weekday: string; saturday: string; sunday: string };
  priceRange: string;
}): LocalBusiness {
  return {
    '@type': 'LocalBusiness',
    '@id': `https://yourdomain.com/locations/${location.name}#business`,
    name: `Your Business — ${location.name}`,
    image: `https://yourdomain.com/locations/${location.name}/image.jpg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: location.address,
      addressLocality: location.city,
      addressRegion: location.state,
      postalCode: location.zip,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: location.coordinates.lat,
      longitude: location.coordinates.lng,
    },
    telephone: location.phone,
    priceRange: location.priceRange,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: location.hours.weekday.split('-')[0].trim(),
        closes: location.hours.weekday.split('-')[1].trim(),
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: location.hours.saturday.split('-')[0].trim(),
        closes: location.hours.saturday.split('-')[1].trim(),
      },
    ],
    url: `https://yourdomain.com/locations/${location.name}`,
  };
}

export function createArticleSchema(article: {
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  modifiedAt: string;
  image: string;
  url: string;
}): Article {
  return {
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: organizationSchema,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  };
}

export function createFAQSchema(faqs: Array<{ question: string; answer: string }>): FAQPage {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function createBreadcrumbSchema(items: Array<{ name: string; url: string }>): BreadcrumbList {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Product
export function createProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  availability: string;
  rating?: number;
  reviewCount?: number;
  brand: string;
  sku: string;
}) {
  return {
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: { '@type': 'Brand', name: product.brand },
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability}`,
      url: `https://yourdomain.com/products/${product.sku}`,
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
      },
    }),
  };
}

// Service
export function createServiceSchema(service: {
  name: string;
  description: string;
  provider: string;
  areaServed: string;
  priceRange: string;
}) {
  return {
    '@type': 'Service',
    serviceType: service.name,
    description: service.description,
    provider: { '@type': 'Organization', name: service.provider },
    areaServed: { '@type': 'Place', name: service.areaServed },
    priceRange: service.priceRange,
  };
}

// Review
export function createReviewSchema(review: {
  itemName: string;
  rating: number;
  author: string;
  reviewBody: string;
  datePublished: string;
}) {
  return {
    '@type': 'Review',
    itemReviewed: { '@type': 'Thing', name: review.itemName },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
    },
    author: { '@type': 'Person', name: review.author },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished,
  };
}

// HowTo — note: Google rich-result deprecated Sept 2023; still useful for AI assistants.
export function createHowToSchema(howTo: {
  name: string;
  description: string;
  image: string;
  totalTime: string;
  steps: Array<{ name: string; text: string; image?: string }>;
}) {
  return {
    '@type': 'HowTo',
    name: howTo.name,
    description: howTo.description,
    image: howTo.image,
    totalTime: howTo.totalTime,
    step: howTo.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
    })),
  };
}

// VideoObject
export function createVideoSchema(video: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
  contentUrl: string;
}) {
  return {
    '@type': 'VideoObject',
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    duration: video.duration,
    contentUrl: video.contentUrl,
    embedUrl: video.contentUrl,
  };
}
