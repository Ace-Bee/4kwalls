'use client';

import { Heart } from 'lucide-react';
import { cn, glassIcon } from '@/utils/helpers';
import { useAuth } from '@/lib/hooks/auth/useAuth';
import { useFavorites } from '@/lib/hooks/auth/useFavorites';
import { useHaptics } from '@/components/providers/HapticsProvider';
import { notifyLoginRequired } from '@/components/common/Notifications';
import { Wallpaper } from '@/lib/supabase';
import { incrementFavoriteCount } from './WallpaperInfo';

interface FavoriteButtonProps {
    wallpaper: Wallpaper;
    className?: string;
}

export function FavoriteButton({ wallpaper, className }: FavoriteButtonProps) {
    const { user } = useAuth();
    const { isFavorite, toggleFavorite, isToggling } = useFavorites();
    const { triggerHaptic } = useHaptics();
    const favorited = isFavorite(wallpaper.id);

    const onFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            notifyLoginRequired('save to favorites', () => window.dispatchEvent(new CustomEvent('open-auth-modal')));
            return;
        }

        if (!favorited) {
            incrementFavoriteCount(wallpaper.id);
            triggerHaptic('success');
        } else {
            triggerHaptic('medium');
        }
        toggleFavorite(wallpaper.id);
    };

    return (
        <button
            onClick={onFavoriteClick}
            disabled={isToggling}
            className={cn(
                glassIcon(),
                'h-10 w-10 flex items-center justify-center rounded-full text-white',
                className
            )}
            title={favorited ? "Remove from favorites" : "Add to favorites"}
        >
            <Heart
                size={18}
                className={cn(
                    'transition-colors duration-300',
                    favorited ? 'fill-red-500 text-red-500' : 'text-white'
                )}
            />
        </button>
    );
}
