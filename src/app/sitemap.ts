import type { MetadataRoute } from "next";
import { listPublishedProfileSlugs } from "@/actions/sales-profile-actions";
// Import your DB logic or Action
import { getAllSpecDossiers } from "@/actions/spec-actions";
import { BLOG_BASE_PATH, BLOG_POSTS } from "@/config/blog";
import { COUNTRY_BASE_PATH, COUNTRY_PAGES } from "@/config/countries";
import {
  getPopulatedCategories,
  NEWS_ARTICLES,
  NEWS_BASE_PATH,
  NEWS_CATEGORY_BASE_PATH,
} from "@/config/news";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.providenceauto.co.uk";

  // 1. Static Routes
  const staticRoutes = [
    "",
    "/b2c/gallery",
    "/about",
    "/contact",
    "/dealer-dashboard",
    "/import-japanese-cars",
    "/import-japanese-cars-to-ireland",
    "/indian-manufactured-cars",
    "/ireland-cost-calculator",
    BLOG_BASE_PATH,
    NEWS_BASE_PATH,
    COUNTRY_BASE_PATH,
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1,
  }));

  // 1a. Source-country landing pages (one per physical office)
  const countryRoutes = COUNTRY_PAGES.map((country) => ({
    url: `${baseUrl}${COUNTRY_BASE_PATH}/${country.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // 1b. Blog posts (import-to-Ireland content cluster)
  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}${BLOG_BASE_PATH}/${post.slug}`,
    lastModified: new Date(post.updatedDate),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 1c. Latest News articles. Recency is the whole ranking proposition for a
  // news section, so a story still inside its first week is advertised as
  // hourly/0.9 to pull crawlers back; after that it settles to the slower
  // cadence appropriate to dated reporting that no longer changes.
  const now = Date.now();
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const newsRoutes = NEWS_ARTICLES.map((article) => {
    const published = new Date(article.publishDate).getTime();
    const isFresh = Number.isFinite(published) && now - published < WEEK_MS;
    return {
      url: `${baseUrl}${NEWS_BASE_PATH}/${article.slug}`,
      lastModified: new Date(article.updatedDate),
      changeFrequency: isFresh ? ("hourly" as const) : ("monthly" as const),
      priority: isFresh ? 0.9 : 0.7,
    };
  });

  // 1d. News category archives — the pages that actually target the head terms
  // ("car industry news", "new car releases").
  const newsCategoryRoutes = getPopulatedCategories().map((category) => ({
    url: `${baseUrl}${NEWS_CATEGORY_BASE_PATH}/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // 2. Dynamic Routes (fetching your Car Dossiers)
  const dossiers = (await getAllSpecDossiers()).data; // Fetch only "Active" status
  const carRoutes = dossiers.map((car: any) => ({
    url: `${baseUrl}/b2c/gallery/${car._id}`,
    lastModified: car.updatedAt || new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 3. Sales-member profile pages (/team/[slug]) — published only.
  const profiles = await listPublishedProfileSlugs();
  const profileRoutes = profiles.map((p) => ({
    url: `${baseUrl}/team/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...countryRoutes,
    ...blogRoutes,
    ...newsRoutes,
    ...newsCategoryRoutes,
    ...carRoutes,
    ...profileRoutes,
  ];
}
