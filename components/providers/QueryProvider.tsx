'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { STALE_TIME } from '@/lib/constants';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: STALE_TIME.DEFAULT,
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
