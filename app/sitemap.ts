import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ag2choba.org';
  const currentDate = new Date();

  // Static routes with their priorities and change frequencies
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/announcements`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sermons`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/live-service`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/give`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/media`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ministry`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/mission`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/project`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/location`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // Dynamic routes - sermons
  let sermonRoutes: MetadataRoute.Sitemap = [];
  try {
    const sermonsResponse = await fetch(`${baseUrl}/api/v1/sermons?limit=100`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (sermonsResponse.ok) {
      const sermonsData = await sermonsResponse.json();
      const sermons = sermonsData.sermons || [];
      
      sermonRoutes = sermons.map((sermon: any) => ({
        url: `${baseUrl}/sermons/${sermon.slug}`,
        lastModified: sermon.updatedAt ? new Date(sermon.updatedAt) : currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Error fetching sermons for sitemap:', error);
  }

  // Dynamic routes - projects
  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const projectsResponse = await fetch(`${baseUrl}/api/v1/ministries?limit=100`, {
      next: { revalidate: 3600 },
    });
    
    if (projectsResponse.ok) {
      const projectsData = await projectsResponse.json();
      const projects = projectsData.ministries || [];
      
      projectRoutes = projects.map((project: any) => ({
        url: `${baseUrl}/project/${project.slug}`,
        lastModified: project.updatedAt ? new Date(project.updatedAt) : currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error);
  }

  // Dynamic routes - events
  let eventRoutes: MetadataRoute.Sitemap = [];
  try {
    const eventsResponse = await fetch(`${baseUrl}/api/v1/events?limit=100`, {
      next: { revalidate: 3600 },
    });
    
    if (eventsResponse.ok) {
      const eventsData = await eventsResponse.json();
      const events = eventsData.events || [];
      
      eventRoutes = events.map((event: any) => ({
        url: `${baseUrl}/events/${event.id}`,
        lastModified: event.updatedAt ? new Date(event.updatedAt) : currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Error fetching events for sitemap:', error);
  }

  return [...staticRoutes, ...sermonRoutes, ...projectRoutes, ...eventRoutes];
}
