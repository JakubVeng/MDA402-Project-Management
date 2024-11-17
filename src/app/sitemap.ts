import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://next-deploy-gray.vercel.app/',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1
        },
        {
            url: 'https://next-deploy-gray.vercel.app/reservation/list',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8
        },
        {
            url: 'https://next-deploy-gray.vercel.app/reservation/calendar',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5
        }
    ];
}