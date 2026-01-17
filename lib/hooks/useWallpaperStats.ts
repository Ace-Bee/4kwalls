'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface WallpaperStats {
    download_count: number;
    fav_count: number;
}

// ============================================
// دوال مستقلة لزيادة العدادات
// ============================================

/**
 * زيادة عداد التحميل في قاعدة البيانات
 * @param wallpaperId معرف الخلفية
 */
export async function incrementDownloadCount(wallpaperId: number): Promise<void> {
    const { error } = await supabase.rpc('increment_download', {
        row_id: wallpaperId,
    });

    if (error) {
        console.error('Failed to increment download count:', error.message);
    }
}

/**
 * زيادة عداد المفضلة في قاعدة البيانات
 * @param wallpaperId معرف الخلفية
 */
export async function incrementFavoriteCount(wallpaperId: number): Promise<void> {
    const { error } = await supabase.rpc('increment_fav', {
        row_id: wallpaperId,
    });

    if (error) {
        console.error('Failed to increment fav count:', error.message);
    }
}

// ============================================
// Hook للتحديث اللحظي
// ============================================

/**
 * Hook للتحديث اللحظي لإحصائيات الخلفية
 * يستخدم Supabase Realtime للاستماع لتغييرات download_count و fav_count
 */
export function useWallpaperStats(wallpaperId: number, initialStats?: WallpaperStats) {
    const [stats, setStats] = useState<WallpaperStats>({
        download_count: initialStats?.download_count ?? 0,
        fav_count: initialStats?.fav_count ?? 0,
    });

    // تحديث الإحصائيات عند تغير الخلفية
    useEffect(() => {
        if (initialStats) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setStats({
                download_count: initialStats.download_count,
                fav_count: initialStats.fav_count,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallpaperId, initialStats?.download_count, initialStats?.fav_count]);

    // الاشتراك في التحديثات اللحظية
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

