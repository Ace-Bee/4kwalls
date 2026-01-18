




import { getRandomWallpapers, getTotalWallpaperCount, Wallpaper } from '@/lib/supabase';

export const MAX_VIEWED_IDS = 500; 
export const SESSION_STORAGE_KEY = 'viewedWallpaperIds';





export function loadViewedIds(): Set<number> {
    if (typeof window === 'undefined') return new Set();

    try {
        const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (stored) {
            const parsedIds = JSON.parse(stored);
            
            const limitedIds = parsedIds.slice(-MAX_VIEWED_IDS);
            return new Set(limitedIds);
        }
    } catch (error) {
        console.error('Error loading viewed IDs:', error);
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }

    return new Set();
}





export function saveViewedIds(viewedIds: Set<number>): void {
    if (typeof window === 'undefined') return;

    try {
        const idsArray = Array.from(viewedIds).slice(-MAX_VIEWED_IDS);
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(idsArray));
    } catch (error) {
        console.error('Error saving viewed IDs:', error);
    }
}




export function clearViewedIds(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
}








export async function fetchUniqueWallpapers(
    limit: number,
    viewedIds: Set<number>
): Promise<Wallpaper[]> {
    const uniqueWallpapers: Wallpaper[] = [];
    const maxAttempts = 3; 
    let attempts = 0;

    
    
    const viewedIdsArray = Array.from(viewedIds);

    while (uniqueWallpapers.length < limit && attempts < maxAttempts) {
        const needed = limit - uniqueWallpapers.length;
        
        const fetchSize = Math.ceil(needed * 1.5);

        
        
        
        const hintExcludedIds = viewedIdsArray.slice(-50);

        const batch = await getRandomWallpapers(fetchSize, hintExcludedIds);

        if (!batch.length) break; 

        for (const wall of batch) {
            
            if (!viewedIds.has(wall.id) && !uniqueWallpapers.some(w => w.id === wall.id)) {
                uniqueWallpapers.push(wall);
                if (uniqueWallpapers.length === limit) break;
            }
        }

        attempts++;
    }

    return uniqueWallpapers;
}







export function updateViewedIds(
    currentViewedIds: Set<number>,
    newWallpapers: Wallpaper[]
): Set<number> {
    const newSet = new Set([...currentViewedIds, ...newWallpapers.map(w => w.id)]);

    
    const idsArray = Array.from(newSet);
    if (idsArray.length > MAX_VIEWED_IDS) {
        return new Set(idsArray.slice(-MAX_VIEWED_IDS));
    }

    return newSet;
}









export function shouldStopFetching(
    viewedIdsSize: number,
    totalCount: number,
    lastPageLength: number,
    requestedLimit: number
): boolean {
    
    return viewedIdsSize >= totalCount * 0.9 || lastPageLength < requestedLimit;
}





export async function fetchTotalWallpaperCount(): Promise<number> {
    return await getTotalWallpaperCount();
}
