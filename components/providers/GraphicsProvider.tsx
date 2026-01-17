'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface GraphicsContextType {
    showBackground: boolean;
    setShowBackground: (value: boolean) => void;
    reduceBlur: boolean;
    setReduceBlur: (value: boolean) => void;
}

const GraphicsContext = createContext<GraphicsContextType | undefined>(undefined);

export function GraphicsProvider({ children }: { children: React.ReactNode }) {
    const [showBackground, setShowBackground] = useState(true);
    const [reduceBlur, setReduceBlur] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const storedShowBg = localStorage.getItem('graphics_showBackground');
        const storedReduceBlur = localStorage.getItem('graphics_reduceBlur');

        if (storedShowBg !== null) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setShowBackground(storedShowBg === 'true');
        }
        if (storedReduceBlur !== null) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setReduceBlur(storedReduceBlur === 'true');
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (!isLoaded) return;

        if (reduceBlur) {
            document.body.classList.add('low-graphics');
        } else {
            document.body.classList.remove('low-graphics');
        }

        localStorage.setItem('graphics_reduceBlur', String(reduceBlur));
    }, [reduceBlur, isLoaded]);

    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem('graphics_showBackground', String(showBackground));
    }, [showBackground, isLoaded]);

    return (
        <GraphicsContext.Provider value={{ showBackground, setShowBackground, reduceBlur, setReduceBlur }}>
            {children}
        </GraphicsContext.Provider>
    );
}

export function useGraphics() {
    const context = useContext(GraphicsContext);
    if (!context) {
        throw new Error('useGraphics must be used within a GraphicsProvider');
    }
    return context;
}
