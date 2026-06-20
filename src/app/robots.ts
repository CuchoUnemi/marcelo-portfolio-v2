import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mrcucho.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/admin/'], // Evitar que los motores de búsqueda indexen el panel de administración y sus APIs
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
