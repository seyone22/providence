import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // Keep your builder and internal APIs private
    },
    sitemap: 'https://www.providenceauto.co.uk/sitemap.xml',
  };
}