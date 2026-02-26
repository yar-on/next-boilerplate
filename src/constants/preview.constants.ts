/**
 * Preview Constants
 *
 * Constants and default configurations for the theme preview feature.
 */

import type { PreviewThemeConfigType, FontOptionType } from '@/types/preview.types';

/**
 * localStorage keys
 */
export const STORAGE_KEYS = {
    THEME_CONFIG: 'preview-theme-config',
    BUTTON_POSITION: 'theme-button-position',
} as const;

/**
 * Font family options grouped by category
 */
export const FONT_OPTIONS: FontOptionType[] = [
    // System Fonts
    {
        label: 'System UI',
        value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        category: 'system',
    },

    // Sans-serif Fonts
    { label: 'Inter', value: 'Inter', category: 'sans-serif' },
    { label: 'Roboto', value: 'Roboto', category: 'sans-serif' },
    { label: 'Open Sans', value: 'Open Sans', category: 'sans-serif' },
    { label: 'Lato', value: 'Lato', category: 'sans-serif' },
    { label: 'Montserrat', value: 'Montserrat', category: 'sans-serif' },
    { label: 'Poppins', value: 'Poppins', category: 'sans-serif' },

    // Serif Fonts
    { label: 'Merriweather', value: 'Merriweather', category: 'serif' },
    { label: 'Lora', value: 'Lora', category: 'serif' },

    // Display Fonts
    { label: 'Playfair Display', value: 'Playfair Display', category: 'display' },
];

/**
 * Font weight options
 */
export const FONT_WEIGHT_OPTIONS = [
    { label: '100 - Thin', value: 100 },
    { label: '200 - Extra Light', value: 200 },
    { label: '300 - Light', value: 300 },
    { label: '400 - Regular', value: 400 },
    { label: '500 - Medium', value: 500 },
    { label: '600 - Semi Bold', value: 600 },
    { label: '700 - Bold', value: 700 },
    { label: '800 - Extra Bold', value: 800 },
    { label: '900 - Black', value: 900 },
];

/**
 * Default theme configuration
 */
export const DEFAULT_PREVIEW_THEME: PreviewThemeConfigType = {
    version: '1.0',
    mode: 'light',
    colors: {
        light: {
            // MUI Palette
            primary: '#1976d2',
            secondary: '#9c27b0',
            error: '#d32f2f',
            warning: '#ed6c02',
            info: '#0288d1',
            success: '#2e7d32',

            // Background
            backgroundDefault: '#ffffff',
            backgroundPaper: '#ffffff',

            // Text
            textPrimary: 'rgba(0, 0, 0, 0.87)',
            textSecondary: 'rgba(0, 0, 0, 0.6)',
            textDisabled: 'rgba(0, 0, 0, 0.38)',

            // Divider
            divider: 'rgba(0, 0, 0, 0.12)',

            // Custom
            headingColor: 'rgba(0, 0, 0, 0.87)',
            bodyColor: 'rgba(0, 0, 0, 0.87)',
            linkColor: '#1976d2',
        },
        dark: {
            // MUI Palette
            primary: '#90caf9',
            secondary: '#ce93d8',
            error: '#f44336',
            warning: '#ffa726',
            info: '#29b6f6',
            success: '#66bb6a',

            // Background
            backgroundDefault: '#121212',
            backgroundPaper: '#1e1e1e',

            // Text
            textPrimary: '#ffffff',
            textSecondary: 'rgba(255, 255, 255, 0.7)',
            textDisabled: 'rgba(255, 255, 255, 0.5)',

            // Divider
            divider: 'rgba(255, 255, 255, 0.12)',

            // Custom
            headingColor: '#ffffff',
            bodyColor: '#ffffff',
            linkColor: '#90caf9',
        },
    },
    typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        headingWeight: 700,
        bodyWeight: 400,
        h1Size: 48,
        h2Size: 36,
        h3Size: 28,
        bodySize: 16,
        headingLineHeight: 1.2,
        bodyLineHeight: 1.6,
        headingLetterSpacing: 0,
        bodyLetterSpacing: 0,
    },
    borderRadius: 8,
};

/**
 * Debounce delay for localStorage writes (in milliseconds)
 */
export const LOCALSTORAGE_DEBOUNCE_DELAY = 300;

/**
 * Maximum file size for theme import (100KB)
 */
export const MAX_IMPORT_FILE_SIZE = 100 * 1024; // 100KB in bytes
