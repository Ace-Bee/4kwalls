'use client';

import { useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ImmersiveCard } from '@/components/immersive/ImmersiveCard';
import {
    fetchUniqueWallpapers,
    updateViewedIds
} from '@/utils/random';
import { glassIcon, cn } from '@/utils/helpers';

// Helper for mobile verification
// Ideally we check user agent? Or just let desktop users enjoy tiktok style too?
// Let's allow everyone.

export default function ImmersivePage() {
    const [viewedIds, setViewedIds] = useState<Set<number>>(new Set());
    const [isHydrated, setIsHydrated] = useState(false);

    // Clear viewed IDs on mount for fresh randomness in immersive mode
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // We want a fresh random stream every time we enter immersive mode
            // So we don't load previous session history here.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setViewedIds(new Set());
            setIsHydrated(true);
        }
    }, []);

    // Save viewed (optional: if we want to avoid duplicates within this session)
    useEffect(() => {
        if (!isHydrated) return;
        // logic to save if needed, or we can skip saving to global session for immersive
        // But user might want to avoid duplicates while scrolling
        // So we keep local state but don't strictly enforce global session persistence for immersive
        // strictly speaking, user said "bring random image on every new entry".
    }, [viewedIds, isHydrated]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ['wallpapers', 'immersive', isHydrated ? 'active' : 'idle'], // Add dependency to force refetch
        queryFn: async ({ pageParam = 0 }) => {
            // Fetch fewer for immersive (heavier images)
            const wallpapers = await fetchUniqueWallpapers(5, viewedIds);
            setViewedIds(prev => updateViewedIds(prev, wallpapers));
            return wallpapers;
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.length > 0 ? 1 : undefined,
        staleTime: 0, // Ensure fresh fetch
        enabled: isHydrated
    });

    const allWallpapers = data?.pages.flat() || [];

    // Scroll Observer to trigger fetch next
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        // Load only when very close to bottom to prevent premature fetching causing jumps
        if (scrollHeight - scrollTop - clientHeight < 200) {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }
    };

    if (isLoading && !data) {
        return (
            <div className="h-screen w-full bg-black flex items-center justify-center">
                <Loader2 className="animate-spin text-cyan-400" size={32} />
            </div>
        );
    }

    return (
        <main
            className="h-screen w-full bg-black overflow-y-scroll snap-y snap-mandatory"
            onScroll={handleScroll}
            style={{ overscrollBehaviorY: 'contain' }}
        >
            {/* Floating Back Button - Glass Effect */}
            <Link
                href="/"
                className={cn(
                    glassIcon(),
                    "fixed top-6 left-6 z-50 p-3 rounded-full flex items-center justify-center !border-white/20 hover:!bg-white/20 active:scale-95 transition-all"
                )}
            >
                <ArrowLeft size={24} />
            </Link>

            {allWallpapers.map((wallpaper, index) => (
                <div key={`${wallpaper.id}-${index}`} className="h-screen w-full snap-start">
                    <ImmersiveCard wallpaper={wallpaper} priority={index < 3} />
                </div>
            ))}

            {/* Loading more indicator */}
            <div className="h-20 w-full flex items-center justify-center snap-center">
                <Loader2 className="animate-spin text-white/20" />
            </div>
        </main>
    );
}
