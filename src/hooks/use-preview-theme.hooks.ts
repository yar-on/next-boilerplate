/**
 * usePreviewTheme Hook
 *
 * Main hook for managing theme preview state and MUI theme creation.
 * Now uses PreviewThemeContext for state management.
 */

'use client';

import { useMemo, useCallback } from 'react';
import type { PreviewThemeConfigType, PreviewColorsType, PreviewTypographyType } from '@/types/preview.types';
import { usePreviewThemeContext } from '@/contexts/preview-theme.context';
import { PreviewThemeValidation } from '@/validations/preview-theme.validations';
import { createThemeFromConfig } from '@/utils/theme-builder.utils';

export function usePreviewTheme() {
    const { themeConfig: config, updateThemeConfig, resetTheme } = usePreviewThemeContext();

    // Create MUI theme from config
    const theme = useMemo(() => createThemeFromConfig(config, config.mode), [config]);

    // Update mode
    const setMode = useCallback(
        (mode: 'light' | 'dark') => {
            updateThemeConfig({ ...config, mode });
        },
        [config, updateThemeConfig]
    );

    // Update color
    const setColor = useCallback(
        (mode: 'light' | 'dark', colorKey: keyof PreviewColorsType, value: string) => {
            updateThemeConfig({
                ...config,
                colors: {
                    ...config.colors,
                    [mode]: {
                        ...config.colors[mode],
                        [colorKey]: value,
                    },
                },
            });
        },
        [config, updateThemeConfig]
    );

    // Update typography
    const setTypography = useCallback(
        <K extends keyof PreviewTypographyType>(key: K, value: PreviewTypographyType[K]) => {
            updateThemeConfig({
                ...config,
                typography: {
                    ...config.typography,
                    [key]: value,
                },
            });
        },
        [config, updateThemeConfig]
    );

    // Update border radius
    const setBorderRadius = useCallback(
        (radius: number) => {
            updateThemeConfig({ ...config, borderRadius: radius });
        },
        [config, updateThemeConfig]
    );

    // Reset to defaults (uses context's resetTheme)
    const resetToDefaults = useCallback(() => {
        resetTheme();
    }, [resetTheme]);

    // Import config
    const importConfig = useCallback(
        (newConfig: PreviewThemeConfigType) => {
            const validated = PreviewThemeValidation.safeParse(newConfig);

            if (validated.success) {
                updateThemeConfig(validated.data);
                return { success: true as const };
            } else {
                return {
                    success: false as const,
                    error: validated.error.flatten().fieldErrors,
                };
            }
        },
        [updateThemeConfig]
    );

    // Export config
    const exportConfig = useCallback(() => {
        return { ...config, version: '1.0' };
    }, [config]);

    return {
        config,
        theme,
        isLoaded: true, // Always loaded since context handles initialization
        setMode,
        setColor,
        setTypography,
        setBorderRadius,
        resetToDefaults,
        importConfig,
        exportConfig,
    };
}
