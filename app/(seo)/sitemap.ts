
import { MetadataRoute } from 'next';
import { getAllWallpaperIds } from '@/lib/supabase';
import { getSiteUrl } from '@/utils/helpers';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = getSiteUrl();

    // 1. Static Routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/wallpapers`,
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 0.9,
        },
        // Favorites page is user-specific, usually usually disallowed or just ignored, 
        // but we can include it as a landing page if we want, though standard practice is noindex for user pages.
        // We'll skip favorites.
    ];

    // 2. Dynamic Wallpaper Routes
    const wallpaperIds = await getAllWallpaperIds();

    const dynamicRoutes: MetadataRoute.Sitemap = wallpaperIds.map((id) => ({
        url: `${baseUrl}/wallpapers/${id}`,
        lastModified: new Date(), // Ideally this would be the wallpaper's created_at
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    return [...staticRoutes, ...dynamicRoutes];
}
