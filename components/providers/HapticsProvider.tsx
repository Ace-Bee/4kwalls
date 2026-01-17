'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

interface HapticsContextType {
    hapticsEnabled: boolean;
    toggleHaptics: () => void;
    triggerHaptic: (type: HapticType) => void;
}

const HapticsContext = createContext<HapticsContextType | undefined>(undefined);

export function HapticsProvider({ children }: { children: React.ReactNode }) {
    const [hapticsEnabled, setHapticsEnabled] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('haptics_enabled');
        if (stored !== null) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setHapticsEnabled(stored === 'true');
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem('haptics_enabled', String(hapticsEnabled));
    }, [hapticsEnabled, isLoaded]);

    const toggleHaptics = useCallback(() => {
        setHapticsEnabled(prev => !prev);
    }, []);

    const triggerHaptic = useCallback((type: HapticType) => {
        if (!hapticsEnabled || typeof navigator === 'undefined' || !navigator.vibrate) return;

        try {
            switch (type) {
                case 'light':
                    navigator.vibrate(10);
                    break;
                case 'medium':
                    navigator.vibrate(40);
                    break;
                case 'heavy':
                    navigator.vibrate(70);
                    break;
                case 'success':
                    navigator.vibrate([30, 40, 30]);
                    break;
                case 'warning':
                    navigator.vibrate([30, 50, 30]);
                    break;
                case 'error':
                    navigator.vibrate([50, 100, 50, 50]);
                    break;
            }
        } catch {
            // Ignore errors on devices that don't support it
        }
    }, [hapticsEnabled]);

    return (
        <HapticsContext.Provider value={{ hapticsEnabled, toggleHaptics, triggerHaptic }}>
            {children}
        </HapticsContext.Provider>
    );
}

export function useHaptics() {
    const context = useContext(HapticsContext);
    if (!context) {
        throw new Error('useHaptics must be used within a HapticsProvider');
    }
    return context;
}
