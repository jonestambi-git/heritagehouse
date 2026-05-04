import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ag2choba.org';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/announcements',
          '/community',
          '/contact',
          '/events',
          '/give',
          '/live-service',
          '/location',
          '/media',
          '/ministry',
          '/mission',
          '/project',
          '/sermons',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/admin-login',
          '/api/*',
          '/giving/verify/*',
          '/_next/*',
          '/register',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: ['/'],
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'],
      },
      {
        userAgent: 'anthropic-ai',
        disallow: ['/'],
      },
      {
        userAgent: 'Claude-Web',
        disallow: ['/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
