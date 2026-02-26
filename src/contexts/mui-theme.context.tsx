'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useMemo } from 'react';
import { NextAppDirEmotionCacheProvider } from '@/libs/emotion-cache.libs';
import { getTheme } from '@/libs/mui-theme.libs';
import { createThemeFromConfig } from '@/utils/theme-builder.utils';
import { ThemeModeProvider, useThemeMode } from '@/contexts/theme-mode.context';
import type { PreviewThemeConfigType } from '@/types/preview.types';

type MuiThemeProviderPropsType = {
    children: React.ReactNode;
    themeConfig?: PreviewThemeConfigType | null;
};

/**
 * MUI Theme Provider (Internal)
 * Applies the theme based on current mode.
 * Uses themeConfig from theme-config.json when available, otherwise falls back to defaults.
 */
function MuiThemeProviderInternal({ children, themeConfig }: MuiThemeProviderPropsType) {
    const { mode } = useThemeMode();
    const theme = useMemo(() => (themeConfig ? createThemeFromConfig(themeConfig, mode) : getTheme(mode)), [mode, themeConfig]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}

/**
 * Material UI Theme Provider
 * Wraps the application with theme mode context, MUI theme, and Emotion cache for SSR support
 */
export function MuiThemeProvider({ children, themeConfig }: MuiThemeProviderPropsType) {
    return (
        <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
            <ThemeModeProvider>
                <MuiThemeProviderInternal themeConfig={themeConfig ?? null}>{children}</MuiThemeProviderInternal>
            </ThemeModeProvider>
        </NextAppDirEmotionCacheProvider>
    );
}
