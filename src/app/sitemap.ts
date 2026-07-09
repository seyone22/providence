import type { MetadataRoute } from "next";
import { listPublishedProfileSlugs } from "@/actions/sales-profile-actions";
// Import your DB logic or Action
import { getAllSpecDossiers } from "@/actions/spec-actions";
import { BLOG_BASE_PATH, BLOG_POSTS } from "@/config/blog";

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
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1,
  }));

  // 1b. Blog posts (import-to-Ireland content cluster)
  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}${BLOG_BASE_PATH}/${post.slug}`,
    lastModified: new Date(post.updatedDate),
    changeFrequency: "weekly" as const,
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

  return [...staticRoutes, ...blogRoutes, ...carRoutes, ...profileRoutes];
}
