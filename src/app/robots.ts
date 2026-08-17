import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"], // Keep your builder and internal APIs private
    },
    // Both are declared: /sitemap.xml carries every indexable URL, while
    // /news-sitemap.xml is the Google News feed of stories from the last 48h.
    sitemap: [
      "https://www.providenceauto.co.uk/sitemap.xml",
      "https://www.providenceauto.co.uk/news-sitemap.xml",
    ],
  };
}
