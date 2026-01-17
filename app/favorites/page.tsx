'use client';

import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/auth/useAuth';
import { useFavorites } from '@/lib/hooks/auth/useFavorites';
import { useQuery } from '@tanstack/react-query';
import { getWallpapersByIds, Wallpaper } from '@/lib/supabase';
import { Header } from '@/components/common/Header';
import { Card } from '@/components/wallpapers/Card';
import { ImageModal } from '@/components/wallpapers/ImageModal';
import { motion, AnimatePresence } from 'framer-motion';
import { STALE_TIME } from '@/lib/constants';

export default function FavoritesPage() {
    const { user, loading: authLoading } = useAuth();
    const { favoriteIds } = useFavorites();
    const router = useRouter();
    const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    const { data: favoriteWallpapers = [], isLoading: wallpapersLoading } = useQuery({
        queryKey: ['favoriteWallpapers', favoriteIds],
        queryFn: () => getWallpapersByIds(favoriteIds),
        enabled: !!user && favoriteIds.length > 0,
        placeholderData: (previousData) => previousData,
        staleTime: STALE_TIME.FAVORITES,
    });

    if (authLoading) return <div className="min-h-screen bg-black" />;

    if (!user) return null;

    return (
        <main className="min-h-screen bg-black text-white font-sans relative">
            <Header />

            <div className="p-4 md:p-8 pt-0 md:pt-4">
                <h1 className="text-3xl font-bold mb-8 px-2">My Favorites</h1>

                {wallpapersLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="animate-spin text-white/50" size={32} />
                    </div>
                ) : favoriteWallpapers.length > 0 ? (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[6px] max-w-full mx-auto"
                    >
                        <AnimatePresence mode='popLayout'>
                            {favoriteWallpapers.map((wallpaper: Wallpaper) => (
                                <Card
                                    key={wallpaper.id}
                                    wallpaper={wallpaper}
                                    onClick={setSelectedWallpaper}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div className="text-center text-gray-500 mt-20">
                        <p>You haven&apos;t favorited any wallpapers yet.</p>
                    </div>
                )}
            </div>

            <ImageModal wallpaper={selectedWallpaper} onClose={() => setSelectedWallpaper(null)} />
        </main>
    );
}
