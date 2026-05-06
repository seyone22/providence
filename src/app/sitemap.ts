import { MetadataRoute } from 'next';
// Import your DB logic or Action
import { getAllSpecDossiers } from '@/actions/spec-actions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://www.providenceauto.co.uk/";

    // 1. Static Routes
    const staticRoutes = [
        "",
        "/b2c/gallery",
        "/about",
        "/contact",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    // 2. Dynamic Routes (fetching your Car Dossiers)
    const dossiers = (await getAllSpecDossiers()).data; // Fetch only "Active" status
    const carRoutes = dossiers.map((car: any) => ({
        url: `${baseUrl}/b2c/gallery/${car._id}`,
        lastModified: car.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...staticRoutes, ...carRoutes];
}