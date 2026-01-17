'use client';

import Link from 'next/link';
import { cn } from '@/utils/helpers';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={cn(
            "w-full py-4 px-6",
            "flex items-center justify-center",
            "text-xs text-gray-500",
            "bg-transparent border-t border-white/5"
        )}>
            <div className="flex items-center gap-1.5">
                <span>© {currentYear}</span>
                <Link
                    href="https://github.com/Ace-Bee"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    Ace-Bee
                </Link>
                <span className="text-gray-600">•</span>
                <span>All rights reserved</span>
            </div>
        </footer>
    );
}
