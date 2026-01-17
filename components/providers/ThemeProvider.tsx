'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
    accentColor: string;
    setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [accentColor, setAccentColor] = useState('#00e5ff');

    useEffect(() => {
        const savedColor = localStorage.getItem('accent-color');
        if (savedColor) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAccentColor(savedColor);
        }
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--accent', accentColor);

        const hex = accentColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        root.style.setProperty('--accent-rgb', `${r} ${g} ${b}`);

        localStorage.setItem('accent-color', accentColor);
    }, [accentColor]);

    return (
        <ThemeContext.Provider value={{ accentColor, setAccentColor }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
