import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://zaprint.in'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ]

  // Programmatic SEO: Location-based pages (ready for when you create them)
  const cities = [
    'mumbai', 'delhi', 'bangalore', 'pune', 'hyderabad',
    'chennai', 'kolkata', 'ahmedabad', 'jaipur', 'lucknow',
    'chandigarh', 'indore', 'bhopal', 'nagpur', 'surat',
    'kochi', 'coimbatore', 'visakhapatnam', 'noida', 'gurgaon',
  ]

  const locationPages: MetadataRoute.Sitemap = cities.map(city => ({
    url: `${baseUrl}/print-shops/${city}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Programmatic SEO: Service type pages (ready for when you create them)
  const services = [
    'thesis-printing', 'color-printing', 'bulk-printing',
    'assignment-printing', 'poster-printing', 'business-card-printing',
    'resume-printing', 'booklet-printing', 'presentation-printing',
    'bw-printing',
  ]

  const servicePages: MetadataRoute.Sitemap = services.map(service => ({
    url: `${baseUrl}/services/${service}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...locationPages, ...servicePages]
}
