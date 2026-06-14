// templates/components-Author.tsx
// Author bio component for E-E-A-T attribution.
// Extracted verbatim from NEXTJS_SEO_AEO_COMPLETE_GUIDE_2026.md §5.3.
// See guides/04-content-quality-eeat.md §4.3.
//
// Pair this visible component with a Person JSON-LD schema on the author's
// dedicated /authors/{slug} page. Attribution must be BOTH visible AND in schema —
// cosmetic-only attribution is invisible to AI parsers.
//
// Place at components/AuthorBio.tsx.

import Image from 'next/image';

interface AuthorBioProps {
  name: string;
  role: string;
  bio: string;
  image: string;
  credentials: string[];
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export function AuthorBio({
  name,
  role,
  bio,
  image,
  credentials,
  socialLinks,
}: AuthorBioProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-8 my-12">
      <div className="flex items-start gap-6">
        <Image
          src={image}
          alt={`${name} — ${role}`}
          width={120}
          height={120}
          className="rounded-full"
        />

        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-1">{name}</h3>
          <p className="text-gray-600 mb-3">{role}</p>
          <p className="text-gray-700 leading-relaxed mb-4">{bio}</p>

          <div className="mb-4">
            <h4 className="font-semibold text-sm text-gray-600 mb-2">Credentials:</h4>
            <ul className="space-y-1">
              {credentials.map((credential, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {credential}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-4">
            {socialLinks.twitter && (
              <a href={socialLinks.twitter} className="text-gray-600 hover:text-blue-600">
                Twitter
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} className="text-gray-600 hover:text-blue-600">
                LinkedIn
              </a>
            )}
            {socialLinks.website && (
              <a href={socialLinks.website} className="text-gray-600 hover:text-blue-600">
                Website
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
