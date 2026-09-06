import type { MetadataRoute } from "next";

/**
 * Production robots.txt.
 *
 * staging.* and dev.* do NOT serve this file — next.config.ts rewrites
 * /robots.txt to /robots-noindex.txt on those hosts. See the note in that file
 * for why it still allows crawling rather than blocking it.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/", // the builder
        "/api/", // internal APIs
        "/auth/", // sign-in, sign-up, password reset — nothing to index
        "/embed/", // chrome-less iframe copies of real pages
        "/track/", // one customer's order, by link. Never index a real name.
        "/motion-lab", // internal animation reference page
      ],
    },
    // Both are declared: /sitemap.xml carries every indexable URL, while
    // /news-sitemap.xml is the Google News feed of recent stories.
    sitemap: [
      "https://www.providenceauto.co.uk/sitemap.xml",
      "https://www.providenceauto.co.uk/news-sitemap.xml",
    ],
  };
}
