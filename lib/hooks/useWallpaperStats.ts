'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface WallpaperStats {
    download_count: number;
    fav_count: number;
}









export async function incrementDownloadCount(wallpaperId: number): Promise<void> {
    const { error } = await supabase.rpc('increment_download', {
        row_id: wallpaperId,
    });

    if (error) {
        console.error('Failed to increment download count:', error.message);
    }
}





export async function incrementFavoriteCount(wallpaperId: number): Promise<void> {
    const { error } = await supabase.rpc('increment_fav', {
        row_id: wallpaperId,
    });

    if (error) {
        console.error('Failed to increment fav count:', error.message);
    }
}









export function useWallpaperStats(wallpaperId: number, initialStats?: WallpaperStats) {
    const [stats, setStats] = useState<WallpaperStats>({
        download_count: initialStats?.download_count ?? 0,
        fav_count: initialStats?.fav_count ?? 0,
    });

    
    useEffect(() => {
        if (initialStats) {
            
            setStats({
                download_count: initialStats.download_count,
                fav_count: initialStats.fav_count,
            });
        }
        
    }, [wallpaperId, initialStats?.download_count, initialStats?.fav_count]);

    
    useEffect(() => {
        if (!wallpaperId) return;

        const channel = supabase
            .channel(`wallpaper-stats-${wallpaperId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'wallpapers',
                    filter: `id=eq.${wallpaperId}`,
                },
                (payload) => {
                    const newData = payload.new as WallpaperStats;
                    setStats({
                        download_count: newData.download_count,
                        fav_count: newData.fav_count,
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [wallpaperId]);

    return { stats };
}

