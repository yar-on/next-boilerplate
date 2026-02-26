'use client';

import { useEffect, useState } from 'react';
import { PreviewThemeContext } from '@/contexts/preview-theme.context';
import type { PreviewThemeConfigType } from '@/types/preview.types';
import { DEFAULT_PREVIEW_THEME, STORAGE_KEYS } from '@/constants/preview.constants';
import { logger } from '@/utils/logger/logger.utils';

type PreviewThemeProviderPropsType = {
    children: React.ReactNode;
};

export function PreviewThemeProvider({ children }: PreviewThemeProviderPropsType) {
    // Initialize theme config lazily from localStorage
    const [themeConfig, setThemeConfig] = useState<PreviewThemeConfigType>(() => {
        if (typeof window === 'undefined') {
            return DEFAULT_PREVIEW_THEME;
        }

        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME_CONFIG);
        if (savedTheme) {
            try {
                const parsed: unknown = JSON.parse(savedTheme);
                // Basic validation - you could use Zod schema here for stricter validation
                if (parsed && typeof parsed === 'object') {
                    return parsed as PreviewThemeConfigType;
                }
            } catch (error) {
                void logger.error({ message: 'Failed to parse saved theme config', error });
            }
        }

        return DEFAULT_PREVIEW_THEME;
    });

    const [isInitialized, setIsInitialized] = useState(false);

    // Mark as initialized
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsInitialized(true);
    }, []);

    const updateThemeConfig = (config: PreviewThemeConfigType) => {
        setThemeConfig(config);
        localStorage.setItem(STORAGE_KEYS.THEME_CONFIG, JSON.stringify(config));
    };

    const resetTheme = () => {
        setThemeConfig(DEFAULT_PREVIEW_THEME);
        localStorage.removeItem(STORAGE_KEYS.THEME_CONFIG);
    };

    // Don't render children until theme is loaded to prevent flash
    if (!isInitialized) {
        return null;
    }

    return <PreviewThemeContext.Provider value={{ themeConfig, updateThemeConfig, resetTheme }}>{children}</PreviewThemeContext.Provider>;
}
