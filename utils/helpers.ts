import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Simple className merger utility
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Glassmorphism effect - Base glass style
 * Usage: className={glass()}
 */
/**
 * Color Themes for Personalization
 * 7 Primary + 7 Secondary/Neon
 */
export const THEMES = [
    // Primary (Standard/Professional)
    { name: 'Red', value: '#ef4444' },      // red-500
    { name: 'Orange', value: '#f97316' },   // orange-500
    { name: 'Yellow', value: '#eab308' },   // yellow-500
    { name: 'Green', value: '#22c55e' },    // green-500
    { name: 'Blue', value: '#3b82f6' },     // blue-500
    { name: 'Indigo', value: '#6366f1' },   // indigo-500
    { name: 'Violet', value: '#8b5cf6' },   // violet-500
    // Secondary (Neon/Vibrant/Cyberpunk)
    { name: 'Cyan', value: '#00e5ff' },     // High Neon Cyan
    { name: 'Hot Pink', value: '#ff00ff' }, // High Neon Pink (Magenta)
    { name: 'Neon Red', value: '#ff1a1a' }, // Bright Neon Red
    { name: 'Purple', value: '#d946ef' },   // Fuchsia-500 (Kept as nice purple option)
    { name: 'Acid Green', value: '#ccff00' },// High Voltage Green
    { name: 'Mint', value: '#00ffa3' },     // Bright Neon Mint
    { name: 'Electric Blue', value: '#0066ff' }, // Deep Electric Blue
];

/**
 * Glassmorphism effect - Base glass style
 * Usage: className={glass()}
 */
export function glass(): string {
    return 'backdrop-blur-none md:backdrop-blur-sm bg-black/40 border border-white/10';
}

/**
 * Glassmorphism button with hover effect
 * Usage: className={glassButton()}
 */
export function glassButton(): string {
    return cn(
        'bg-black/40 border border-white/10 backdrop-blur-none md:backdrop-blur-[2px]',
        'hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/50 hover:text-[var(--accent)] hover:backdrop-blur-md transition-all duration-300'
    );
}

/**
 * Glassmorphism active/selected state
 * Usage: className={glassActive()}
 */
export function glassActive(): string {
    return 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/50 shadow-[0_0_15px_-3px_var(--accent,rgba(255,255,255,0.1))]';
}

/**
 * Transparent overlay button with glass border
 * Usage: className={glassIcon()}
 */
export function glassIcon(): string {
    return cn(
        'bg-transparent backdrop-blur-none md:backdrop-blur-[2px] border border-white/30 text-white',
        'hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] hover:border-[var(--accent)]/50 hover:backdrop-blur-md transition-all duration-300'
    );
}

/**
 * Transparent navbar pill
 * Usage: className={glassNavbar()}
 */
export function glassNavbar(): string {
    return 'backdrop-blur-none md:backdrop-blur-md border border-white/20';
}

/**
 * Glassmorphism input field style
 * Usage: className={glassInput()}
 * Reduces repetition across AuthModal, SettingsModal, etc.
 */
export function glassInput(): string {
    return cn(
        'w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4',
        'text-white placeholder:text-gray-500 focus:outline-none',
        'focus:border-white/30 focus:bg-white/10 transition-all'
    );
}

/**
 * Format file size string to MB
 * Converts KB to MB and ensures consistent formatting
 * Usage: formatFileSize(wallpaper.file_size)
 */
export function formatFileSize(sizeStr: string): string {
    if (!sizeStr) return '0 MB';

    const num = parseFloat(sizeStr.replace(/[^0-9.]/g, ''));

    // If already in MB, return as is
    if (sizeStr.toUpperCase().includes('MB')) {
        return sizeStr;
    }

    // Convert KB to MB
    if (sizeStr.toUpperCase().includes('KB')) {
        return (num / 1024).toFixed(2) + ' MB';
    }

    // Assume bytes if no unit specified
    return (num / 1024).toFixed(2) + ' MB';
}

/**
 * Returns the original image URL proxied through Next.js rewrites.
 * Use this for downloads where the original quality is required.
 */
export function getProxiedImageUrl(url: string): string {
    if (!url) return '';

    try {
        const urlObj = new URL(url);
        // Only proxy R2 images
        if (urlObj.hostname.includes('r2.dev')) {
            return `/images${urlObj.pathname}`;
        }
        return url;
    } catch {
        return url;
    }
}

interface ThumbnailOptions {
    /** Width in pixels (default: 500) */
    width?: number;
    /** Quality 1-100 (default: 80) */
    quality?: number;
}

/**
 * Generates a wsrv.nl thumbnail URL for optimized image loading.
 * Converts to WebP format with specified width and quality.
 * Use this for card thumbnails and previews.
 */
export function getThumbnailUrl(url: string, options: ThumbnailOptions = {}): string {
    if (!url) return '';

    const { width = 500, quality = 80 } = options;

    try {
        // wsrv.nl expects the full URL as the 'url' parameter
        const proxyUrl = new URL('https://wsrv.nl/');
        proxyUrl.searchParams.set('url', url);
        proxyUrl.searchParams.set('w', width.toString());
        proxyUrl.searchParams.set('q', quality.toString());
        proxyUrl.searchParams.set('output', 'webp');
        proxyUrl.searchParams.set('fit', 'cover'); // Maintain aspect ratio with cover fit

        return proxyUrl.toString();
    } catch {
        // Fallback to original URL if parsing fails
        return url;
    }
}

/**
 * Generates a higher-resolution wsrv.nl URL for modal/lightbox views.
 * Larger width (1200px) for detailed viewing while still optimizing.
 */
export function getModalImageUrl(url: string): string {
    return getThumbnailUrl(url, { width: 1200, quality: 85 });
}

/**
 * Helper to get the canonical site URL in both Dev and Prod environment
 */
export function getSiteUrl(): string {
    // 1. Check explicitly set site URL (e.g. from Vercel Env Vars)
    // This is the preferred way for production to ensure correct canonical URL
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL;
    }

    // 2. Fallback to Vercel System URL (Preview/Deployment URLs)
    // Vercel exposes this automatically. It doesn't include https://
    // Note: On server side it might be process.env.VERCEL_URL
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
        return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    }

    if (typeof window !== 'undefined') {
        return window.location.origin;
    }

    // 3. Fallback to localhost for development default
    return 'http://localhost:3000';
}
