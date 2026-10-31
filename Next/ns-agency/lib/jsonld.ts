import { address, author, brand, members, portfolioUrl, services, tagline } from "@/lib/content";

// Set NEXT_PUBLIC_SITE_URL (for example https://nsagency.com) once the domain is
// known. Until then the url, @id and logo fields are left out instead of guessed.
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

const founder = members[0];

export function buildJsonLd() {
  const orgId = siteUrl ? `${siteUrl}/#organization` : undefined;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        ...(orgId && { "@id": orgId }),
        name: brand,
        description: tagline,
        ...(siteUrl && { url: siteUrl, logo: `${siteUrl}/icon-512.png`, image: `${siteUrl}/icon-512.png` }),
        foundingDate: "2026",
        address: {
          "@type": "PostalAddress",
          streetAddress: address.line1,
          addressLocality: "Yaoundé",
          addressCountry: "CM",
        },
        areaServed: { "@type": "Country", name: "Cameroon" },
        knowsAbout: services.map((s) => s.title.toLowerCase()),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${brand} services`,
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.title.charAt(0) + s.title.slice(1).toLowerCase(),
              description: s.text,
              serviceType: s.items.map((i) => i.toLowerCase()),
            },
          })),
        },
        founder: {
          "@type": "Person",
          name: founder.name,
          jobTitle: founder.role,
          url: portfolioUrl,
        },
        sameAs: [portfolioUrl],
      },
      {
        "@type": "WebSite",
        ...(siteUrl && { "@id": `${siteUrl}/#website`, url: siteUrl }),
        name: brand,
        inLanguage: "en",
        ...(orgId && { publisher: { "@id": orgId } }),
        creator: { "@type": "Person", name: author, url: portfolioUrl },
      },
    ],
  };
}
