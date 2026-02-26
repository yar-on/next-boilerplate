/**
 * Preview Theme Validations
 *
 * Zod schemas for validating theme import/export data.
 */

import { z } from 'zod';

const PreviewColorsValidation = z.object({
    primary: z.string(),
    secondary: z.string(),
    error: z.string(),
    warning: z.string(),
    info: z.string(),
    success: z.string(),
    backgroundDefault: z.string(),
    backgroundPaper: z.string(),
    textPrimary: z.string(),
    textSecondary: z.string(),
    textDisabled: z.string(),
    divider: z.string(),
    headingColor: z.string(),
    bodyColor: z.string(),
    linkColor: z.string(),
});

const PreviewTypographyValidation = z.object({
    headingFont: z.string(),
    bodyFont: z.string(),
    headingWeight: z.number().min(100).max(900),
    bodyWeight: z.number().min(100).max(900),
    h1Size: z.number().min(32).max(64),
    h2Size: z.number().min(24).max(48),
    h3Size: z.number().min(20).max(36),
    bodySize: z.number().min(14).max(20),
    headingLineHeight: z.number().min(1.0).max(1.5),
    bodyLineHeight: z.number().min(1.2).max(2.0),
    headingLetterSpacing: z.number().min(-0.05).max(0.1),
    bodyLetterSpacing: z.number().min(-0.02).max(0.05),
});

export const PreviewThemeValidation = z.object({
    version: z.string(),
    mode: z.enum(['light', 'dark']),
    colors: z.object({
        light: PreviewColorsValidation,
        dark: PreviewColorsValidation,
    }),
    typography: PreviewTypographyValidation,
    borderRadius: z.number().min(0).max(100),
});

export type PreviewThemeValidationType = z.infer<typeof PreviewThemeValidation>;
