'use client';

import { createContext, useContext } from 'react';
import type { PreviewThemeConfigType } from '@/types/preview.types';

export type PreviewThemeContextType = {
    themeConfig: PreviewThemeConfigType;
    updateThemeConfig: (config: PreviewThemeConfigType) => void;
    resetTheme: () => void;
};

export const PreviewThemeContext = createContext<PreviewThemeContextType | undefined>(undefined);

export function usePreviewThemeContext(): PreviewThemeContextType {
    const context = useContext(PreviewThemeContext);
    if (!context) {
        throw new Error('usePreviewThemeContext must be used within PreviewThemeProvider');
    }
    return context;
}
