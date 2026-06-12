import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://brainstormhub.com';

  return [
    { url: baseUrl, lastModified: new Date(), priority: 1, changeFrequency: 'weekly' },
    { url: `${baseUrl}/login`, lastModified: new Date(), priority: 0.8, changeFrequency: 'monthly' },
    { url: `${baseUrl}/register`, lastModified: new Date(), priority: 0.8, changeFrequency: 'monthly' },
  ];
}
