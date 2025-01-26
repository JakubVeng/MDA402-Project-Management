import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://mda402-project-management-app.vercel.app/',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1
        },
        {
            url: 'https://next-deploy-gray.vercel.app/lectures',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8
        },
        {
            url: 'https://next-deploy-gray.vercel.app/practices',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5
        }
    ];
}