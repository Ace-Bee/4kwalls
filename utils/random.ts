/**
 * Random Wallpaper Fetching Utility
 * Handles fetching random wallpapers with viewed IDs tracking and session storage
 */

import { getRandomWallpapers, getTotalWallpaperCount, Wallpaper } from '@/lib/supabase';

export const MAX_VIEWED_IDS = 500; // Limit for performance
export const SESSION_STORAGE_KEY = 'viewedWallpaperIds';

/**
 * Load viewed wallpaper IDs from session storage
 * @returns Set of viewed wallpaper IDs
 */
export function loadViewedIds(): Set<number> {
    if (typeof window === 'undefined') return new Set();

    try {
        const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (stored) {
            const parsedIds = JSON.parse(stored);
            // Limit to last MAX_VIEWED_IDS items
            const limitedIds = parsedIds.slice(-MAX_VIEWED_IDS);
            return new Set(limitedIds);
        }
    } catch (error) {
        console.error('Error loading viewed IDs:', error);
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }

    return new Set();
}

/**
 * Save viewed wallpaper IDs to session storage
 * @param viewedIds - Set of viewed wallpaper IDs
 */
export function saveViewedIds(viewedIds: Set<number>): void {
    if (typeof window === 'undefined') return;

    try {
        const idsArray = Array.from(viewedIds).slice(-MAX_VIEWED_IDS);
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(idsArray));
    } catch (error) {
        console.error('Error saving viewed IDs:', error);
    }
}

/**
 * Clear viewed wallpaper IDs from session storage
 */
export function clearViewedIds(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
}

/**
 * Fetch unique random wallpapers by filtering client-side
 * Handles multiple fetch attempts to satisfy the requested limit
 * @param limit - Number of wallpapers to fetch
 * @param viewedIds - Set of already viewed wallpaper IDs
 * @returns Promise of unique random wallpapers
 */
export async function fetchUniqueWallpapers(
    limit: number,
    viewedIds: Set<number>
): Promise<Wallpaper[]> {
    const uniqueWallpapers: Wallpaper[] = [];
    const maxAttempts = 3; // Prevent infinite loops
    let attempts = 0;

    // Convert Set to Array once for exclusion logic (optional optimization)
    // We pass a small slice to the server just to help it out, but rely on client filtering
    const viewedIdsArray = Array.from(viewedIds);

    while (uniqueWallpapers.length < limit && attempts < maxAttempts) {
        const needed = limit - uniqueWallpapers.length;
        // Request slightly more than needed to account for collisions
        const fetchSize = Math.ceil(needed * 1.5);

        // We pass empty excludeIds or a small subset to getRandomWallpapers
        // The server function is fast but limited in exclusion memory.
        // Let's pass the last 50 IDs to give it a hint, but do the main work here.
        const hintExcludedIds = viewedIdsArray.slice(-50);

        const batch = await getRandomWallpapers(fetchSize, hintExcludedIds);

        if (!batch.length) break; // Stop if server returns nothing

        for (const wall of batch) {
            // Strict client-side deduplication
            if (!viewedIds.has(wall.id) && !uniqueWallpapers.some(w => w.id === wall.id)) {
                uniqueWallpapers.push(wall);
                if (uniqueWallpapers.length === limit) break;
            }
        }

        attempts++;
    }

    return uniqueWallpapers;
}

/**
 * Update viewed IDs set with new wallpaper IDs
 * @param currentViewedIds - Current set of viewed IDs
 * @param newWallpapers - Array of newly fetched wallpapers
 * @returns Updated set of viewed IDs (limited to MAX_VIEWED_IDS)
 */
export function updateViewedIds(
    currentViewedIds: Set<number>,
    newWallpapers: Wallpaper[]
): Set<number> {
    const newSet = new Set([...currentViewedIds, ...newWallpapers.map(w => w.id)]);

    // Keep only last MAX_VIEWED_IDS items for performance
    const idsArray = Array.from(newSet);
    if (idsArray.length > MAX_VIEWED_IDS) {
        return new Set(idsArray.slice(-MAX_VIEWED_IDS));
    }

    return newSet;
}

/**
 * Check if we should stop fetching more wallpapers
 * @param viewedIdsSize - Number of viewed wallpaper IDs
 * @param totalCount - Total number of wallpapers in database
 * @param lastPageLength - Number of wallpapers in last fetched page
 * @param requestedLimit - Number of wallpapers requested
 * @returns true if should stop fetching
 */
export function shouldStopFetching(
    viewedIdsSize: number,
    totalCount: number,
    lastPageLength: number,
    requestedLimit: number
): boolean {
    // Stop if we've viewed most images (90%) or got less than requested
    return viewedIdsSize >= totalCount * 0.9 || lastPageLength < requestedLimit;
}

/**
 * Get total wallpaper count from database
 * @returns Promise of total count
 */
export async function fetchTotalWallpaperCount(): Promise<number> {
    return await getTotalWallpaperCount();
}
