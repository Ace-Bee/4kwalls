'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

import { HAPTIC_PATTERNS, STORAGE_KEYS } from '@/lib/constants';

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';


interface HapticsContextType {
    hapticsEnabled: boolean;
    isSupported: boolean;
    toggleHaptics: () => void;
    triggerHaptic: (type: HapticType) => void;
}

const HapticsContext = createContext<HapticsContextType | undefined>(undefined);

export function HapticsProvider({ children }: { children: React.ReactNode }) {
    const [hapticsEnabled, setHapticsEnabled] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEYS.HAPTICS_ENABLED);
        if (stored !== null) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setHapticsEnabled(stored === 'true');
        }
        setIsLoaded(true);

        // Check and log support
        if (typeof navigator !== 'undefined') {
            if (!navigator.vibrate) {
                console.warn('[Haptics] Device/Browser does NOT support vibration API (likely iOS).');
                setIsSupported(false);
            } else {
                console.log('[Haptics] Vibration API supported ✅');
                setIsSupported(true);
            }
        }
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem(STORAGE_KEYS.HAPTICS_ENABLED, String(hapticsEnabled));
    }, [hapticsEnabled, isLoaded]);

    const toggleHaptics = useCallback(() => {
        setHapticsEnabled(prev => !prev);
    }, []);

    const triggerHaptic = useCallback((type: HapticType) => {
        if (!hapticsEnabled || typeof navigator === 'undefined') return;

        // Debug logging in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[Haptics] Triggered: ${type}`);
        }

        if (!navigator.vibrate) return;

        try {
            switch (type) {
                case 'light':
                    navigator.vibrate(HAPTIC_PATTERNS.LIGHT);
                    break;
                case 'medium':
                    navigator.vibrate(HAPTIC_PATTERNS.MEDIUM);
                    break;
                case 'heavy':
                    navigator.vibrate(HAPTIC_PATTERNS.HEAVY);
                    break;
                case 'success':
                    navigator.vibrate([...HAPTIC_PATTERNS.SUCCESS]);
                    break;
                case 'warning':
                    navigator.vibrate([...HAPTIC_PATTERNS.WARNING]);
                    break;
                case 'error':
                    navigator.vibrate([...HAPTIC_PATTERNS.ERROR]);
                    break;
            }
        } catch (e) {
            // Ignore errors on devices that don't support it
            console.error('[Haptics] Error:', e);
        }
    }, [hapticsEnabled]);

    return (
        <HapticsContext.Provider value={{ hapticsEnabled, isSupported, toggleHaptics, triggerHaptic }}>
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
