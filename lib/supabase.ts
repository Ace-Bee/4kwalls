
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Wallpaper {
    id: number;
    name: string;
    image_url: string;
    download_count: number;
    fav_count: number;
    width: number;
    height: number;
    file_size: string;
    format: string;
}

/**
 * Fetch random wallpapers using optimized PostgreSQL RPC function
 * @param limit - Number of wallpapers to fetch
 * @param excludeIds - Optional array of IDs to exclude (default empty)
 * @returns Array of random wallpapers
 */
export async function getRandomWallpapers(
    limit: number = 12,
    excludeIds: number[] = []
): Promise<Wallpaper[]> {



    const limitedExcludeIds = excludeIds.slice(-500);

    const { data, error } = await supabase
        .rpc('get_random_wallpapers', {
            batch_size: limit,
            excluded_ids: limitedExcludeIds
        });

    if (error) {
        console.error('Error fetching random wallpapers:', error);
        return [];
    }

    return (data || []) as Wallpaper[];
}



export async function getTotalWallpaperCount(): Promise<number> {
    const { count, error } = await supabase
        .from('wallpapers')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error fetching total wallpaper count:', error);
        return 0;
    }

    return count || 0;
}

export async function getWallpapersByIds(ids: number[]) {
    if (!ids.length) return [];

    const { data, error } = await supabase
        .from('wallpapers')
        .select('*')
        .in('id', ids)
        .order('id', { ascending: false });

    if (error) {
        console.error('Error fetching favorite wallpapers:', error);
        return [];
    }

    return data as Wallpaper[];
}

export async function getWallpaperById(id: number): Promise<Wallpaper | null> {
    const wallpapers = await getWallpapersByIds([id]);
    return wallpapers.length > 0 ? wallpapers[0] : null;
}

export async function getAllWallpaperIds(): Promise<number[]> {
    const { data, error } = await supabase
        .from('wallpapers')
        .select('id')
        .order('id', { ascending: false })
        .limit(50000);

    if (error) {
        console.error('Error fetching wallpaper IDs:', error);
        return [];
    }

    return data.map(w => w.id);
}

/**
 * Fetch wallpapers by category using a seeded random sort.
 * Uses the `get_category_wallpapers` RPC function.
 * 
 * @param category - Name of the category (matches against `name` field via ILIKE)
 * @param seed - Random seed string for consistent sorting
 * @param offset - Pagination offset
 * @param limit - Number of wallpapers to fetch
 * @returns Array of wallpapers
 */
export async function getCategoryWallpapers(
    category: string,
    seed: string,
    offset: number = 0,
    limit: number = 24
): Promise<Wallpaper[]> {
    const { data, error } = await supabase
        .rpc('get_category_wallpapers', {
            category_text: category,
            seed_val: seed,
            page_offset: offset,
            page_limit: limit
        });

    if (error) {
        console.error('Error fetching category wallpapers:', error);
        return [];
    }

    return (data || []) as Wallpaper[];
}
