import type { MetadataRoute } from "next";

// Add a `sitemap` entry here once the production domain is known.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
  };
}
