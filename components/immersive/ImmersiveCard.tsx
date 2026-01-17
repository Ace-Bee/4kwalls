'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Wallpaper } from '@/lib/supabase';
import { getProxiedImageUrl, glassIcon, cn } from '@/utils/helpers';
import { FavoriteButton } from '@/components/wallpapers/FavoriteButton';
import { DownloadButton } from '@/components/wallpapers/DownloadButton';
import { ShareButton } from '@/components/wallpapers/ShareButton';
import { DoubleTapLikeOverlay } from '@/components/wallpapers/DoubleTapLikeOverlay';

interface ImmersiveCardProps {
    wallpaper: Wallpaper;
    priority?: boolean;
}

export function ImmersiveCard({ wallpaper, priority = false }: ImmersiveCardProps) {
    const [currentTime, setCurrentTime] = useState<string>('');
    const [currentDate, setCurrentDate] = useState<string>('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false }));
            setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
        };
        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full h-full snap-center shrink-0 overflow-hidden bg-black select-none">
            <DoubleTapLikeOverlay wallpaper={wallpaper} className="w-full h-full">
                <Image
                    src={getProxiedImageUrl(wallpaper.image_url)}
                    alt={wallpaper.name}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={priority}
                    quality={90}
                    unoptimized
                />

                <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
            </DoubleTapLikeOverlay>

            <div className="absolute top-16 left-0 w-full flex flex-col items-center justify-center text-white/90 z-20 pointer-events-none drop-shadow-lg">
                <div className="text-lg font-medium tracking-wide opacity-90">{currentDate}</div>
                <div className="text-7xl font-bold tracking-tighter leading-tight">{currentTime}</div>
            </div>

            <div className="absolute bottom-12 left-0 w-full px-6 flex flex-col items-center gap-6 z-20 pointer-events-none">
                <div className="flex items-center gap-8 pointer-events-auto">
                    <FavoriteButton
                        wallpaper={wallpaper}
                        className={cn(
                            glassIcon(),
                            "h-14 w-14 rounded-full flex items-center justify-center",
                            "!border-white/30 !bg-black/20 backdrop-blur-md",
                            "hover:!bg-white/20 transition-transform active:scale-90"
                        )}
                    />

                    <DownloadButton
                        wallpaperId={wallpaper.id}
                        imageUrl={wallpaper.image_url}
                        filename={`wallpaper-${wallpaper.id}.jpg`}
                        variant="glass"
                        showText={false}
                        className={cn(
                            glassIcon(),
                            "h-14 w-14 rounded-full flex items-center justify-center",
                            "!border-white/30 !bg-black/20 backdrop-blur-md",
                            "hover:!bg-white/20 transition-transform active:scale-90"
                        )}
                    />

                    <ShareButton
                        url={typeof window !== 'undefined' ? `${window.location.origin}/wallpapers/${wallpaper.id}` : `/wallpapers/${wallpaper.id}`}
                        title={wallpaper.name}
                        imageUrl={wallpaper.image_url}
                        imageAlt={wallpaper.name}
                        className={cn(
                            glassIcon(),
                            "h-14 w-14 rounded-full flex items-center justify-center",
                            "!border-white/30 !bg-black/20 backdrop-blur-md",
                            "hover:!bg-white/20 transition-transform active:scale-90"
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
