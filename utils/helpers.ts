import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { IMAGE_CONFIG } from '@/lib/constants';




export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}









export const THEMES = [
    
    { name: 'Red', value: '#ef4444' },      
    { name: 'Orange', value: '#f97316' },   
    { name: 'Yellow', value: '#eab308' },   
    { name: 'Green', value: '#22c55e' },    
    { name: 'Blue', value: '#3b82f6' },     
    { name: 'Indigo', value: '#6366f1' },   
    { name: 'Violet', value: '#8b5cf6' },   
    
    { name: 'Cyan', value: '#00e5ff' },     
    { name: 'Hot Pink', value: '#ff00ff' }, 
    { name: 'Neon Red', value: '#ff1a1a' }, 
    { name: 'Purple', value: '#d946ef' },   
    { name: 'Acid Green', value: '#ccff00' },
    { name: 'Mint', value: '#00ffa3' },     
    { name: 'Electric Blue', value: '#0066ff' }, 
];





export function glass(): string {
    return 'backdrop-blur-none md:backdrop-blur-sm bg-black/40 border border-white/10';
}





export function glassButton(): string {
    return cn(
        'bg-black/40 border border-white/10 backdrop-blur-none md:backdrop-blur-[2px]',
        'hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/50 hover:text-[var(--accent)] hover:backdrop-blur-md transition-all duration-300'
    );
}





export function glassActive(): string {
    return 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/50 shadow-[0_0_15px_-3px_var(--accent,rgba(255,255,255,0.1))]';
}





export function glassIcon(): string {
    return cn(
        'bg-transparent backdrop-blur-none md:backdrop-blur-[2px] border border-white/30 text-white',
        'hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] hover:border-[var(--accent)]/50 hover:backdrop-blur-md transition-all duration-300'
    );
}





export function glassNavbar(): string {
    return 'backdrop-blur-none md:backdrop-blur-md border border-white/20';
}






export function glassInput(): string {
    return cn(
        'w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4',
        'text-white placeholder:text-gray-500 focus:outline-none',
        'focus:border-white/30 focus:bg-white/10 transition-all'
    );
}






export function formatFileSize(sizeStr: string): string {
    if (!sizeStr) return '0 MB';

    const num = parseFloat(sizeStr.replace(/[^0-9.]/g, ''));

    
    if (sizeStr.toUpperCase().includes('MB')) {
        return sizeStr;
    }

    
    if (sizeStr.toUpperCase().includes('KB')) {
        return (num / 1024).toFixed(2) + ' MB';
    }

    
    return (num / 1024).toFixed(2) + ' MB';
}





export function getProxiedImageUrl(url: string): string {
    if (!url) return '';

    try {
        const urlObj = new URL(url);
        
        if (urlObj.hostname.includes('r2.dev')) {
            return `/images${urlObj.pathname}`;
        }
        return url;
    } catch {
        return url;
    }
}



interface ThumbnailOptions {
    
    width?: number;
    
    quality?: number;
}






export function getThumbnailUrl(url: string, options: ThumbnailOptions = {}): string {
    if (!url) return '';

    const { width = IMAGE_CONFIG.THUMBNAIL_WIDTH, quality = IMAGE_CONFIG.THUMBNAIL_QUALITY } = options;

    try {
        
        const proxyUrl = new URL('https://wsrv.nl/');
        proxyUrl.searchParams.set('url', url);
        proxyUrl.searchParams.set('w', width.toString());
        proxyUrl.searchParams.set('q', quality.toString());
        proxyUrl.searchParams.set('output', 'webp');
        proxyUrl.searchParams.set('fit', 'cover'); 

        return proxyUrl.toString();
    } catch {
        
        return url;
    }
}





export function getModalImageUrl(url: string): string {
    return getThumbnailUrl(url, { width: IMAGE_CONFIG.MODAL_WIDTH, quality: IMAGE_CONFIG.MODAL_QUALITY });
}





export function getSiteUrl(): string {
    
    
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL;
    }

    
    
    
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
        return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    }

    if (typeof window !== 'undefined') {
        return window.location.origin;
    }

    
    return 'http://localhost:3000';
}
