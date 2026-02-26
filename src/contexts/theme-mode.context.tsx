'use client';

import { createContext, useContext, useState, useEffect, useMemo } from 'react';

type ThemeModeType = 'light' | 'dark';

type ThemeModeContextType = {
    mode: ThemeModeType;
    toggleTheme: () => void;
    setThemeMode: (mode: ThemeModeType) => void;
};

const ThemeModeContext = createContext<ThemeModeContextType | undefined>(undefined);

/**
 * Theme Mode Provider
 * Manages light/dark theme mode state with localStorage persistence
 */
export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    // Initialize mode lazily to avoid hydration mismatch
    const [mode, setMode] = useState<ThemeModeType>(() => {
        // Server-side: default to light
        if (typeof window === 'undefined') {
            return 'light';
        }

        // Client-side: read from localStorage or system preference
        const savedTheme = localStorage.getItem('theme-mode') as ThemeModeType | null;
        if (savedTheme === 'light' || savedTheme === 'dark') {
            return savedTheme;
        }

        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
    });

    // Mark as mounted
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    // Save theme to localStorage when it changes
    useEffect(() => {
        if (mounted) {
            localStorage.setItem('theme-mode', mode);
        }
    }, [mode, mounted]);

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const setThemeMode = (newMode: ThemeModeType) => {
        setMode(newMode);
    };

    const value = useMemo(
        () => ({
            mode,
            toggleTheme,
            setThemeMode,
        }),
        [mode]
    );

    // Prevent flash of incorrect theme
    if (!mounted) {
        return null;
    }

    return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

/**
 * Hook to access theme mode context
 */
export function useThemeMode() {
    const context = useContext(ThemeModeContext);
    if (context === undefined) {
        throw new Error('useThemeMode must be used within a ThemeModeProvider');
    }
    return context;
}
