/**
 * Preview Theme Types
 *
 * Type definitions for the theme preview feature.
 */

export type ButtonPositionType = {
    x: number;
    y: number;
};

export type PreviewColorsType = {
    // MUI Palette colors
    primary: string; // hex color
    secondary: string;
    error: string;
    warning: string;
    info: string;
    success: string;

    // Background
    backgroundDefault: string;
    backgroundPaper: string;

    // Text
    textPrimary: string;
    textSecondary: string;
    textDisabled: string;

    // Divider
    divider: string;

    // Custom typography colors
    headingColor: string;
    bodyColor: string;
    linkColor: string;
};

export type PreviewTypographyType = {
    headingFont: string;
    bodyFont: string;
    headingWeight: number;
    bodyWeight: number;
    h1Size: number;
    h2Size: number;
    h3Size: number;
    bodySize: number;
    headingLineHeight: number;
    bodyLineHeight: number;
    headingLetterSpacing: number;
    bodyLetterSpacing: number;
};

export type PreviewThemeConfigType = {
    version: string;
    mode: 'light' | 'dark';
    colors: {
        light: PreviewColorsType;
        dark: PreviewColorsType;
    };
    typography: PreviewTypographyType;
    borderRadius: number; // in pixels
};

export type FontOptionType = {
    label: string;
    value: string;
    category?: 'sans-serif' | 'serif' | 'display' | 'system';
};

export type DemoTypeType = 'company-overview' | 'dashboard' | 'crm';

export type DemoIframePropsType = {
    demo: DemoTypeType;
    isLoading?: boolean;
    onLoad?: () => void;
    onError?: (error: Error) => void;
};
