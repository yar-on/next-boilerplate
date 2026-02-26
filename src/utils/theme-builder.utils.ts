import { createTheme, type Theme } from '@mui/material/styles';
import type { PaletteMode } from '@mui/material';
import type { PreviewThemeConfigType } from '@/types/preview.types';

/**
 * Creates an MUI Theme from a PreviewThemeConfigType.
 * Pure function - no React dependencies.
 *
 * @param config - The full theme config (colors, typography, borderRadius)
 * @param mode - The palette mode to use (picks config.colors[mode])
 */
export function createThemeFromConfig(config: PreviewThemeConfigType, mode: PaletteMode): Theme {
    const colors = config.colors[mode];

    return createTheme({
        palette: {
            mode,
            primary: { main: colors.primary },
            secondary: { main: colors.secondary },
            error: { main: colors.error },
            warning: { main: colors.warning },
            info: { main: colors.info },
            success: { main: colors.success },
            background: {
                default: colors.backgroundDefault,
                paper: colors.backgroundPaper,
            },
            text: {
                primary: colors.textPrimary,
                secondary: colors.textSecondary,
                disabled: colors.textDisabled,
            },
            divider: colors.divider,
        },
        typography: {
            fontFamily: config.typography.bodyFont,
            h1: {
                fontFamily: config.typography.headingFont,
                fontSize: `${config.typography.h1Size}px`,
                fontWeight: config.typography.headingWeight,
                lineHeight: config.typography.headingLineHeight,
                letterSpacing: `${config.typography.headingLetterSpacing}em`,
            },
            h2: {
                fontFamily: config.typography.headingFont,
                fontSize: `${config.typography.h2Size}px`,
                fontWeight: config.typography.headingWeight,
                lineHeight: config.typography.headingLineHeight,
                letterSpacing: `${config.typography.headingLetterSpacing}em`,
            },
            h3: {
                fontFamily: config.typography.headingFont,
                fontSize: `${config.typography.h3Size}px`,
                fontWeight: config.typography.headingWeight,
                lineHeight: config.typography.headingLineHeight,
                letterSpacing: `${config.typography.headingLetterSpacing}em`,
            },
            h4: {
                fontFamily: config.typography.headingFont,
                fontWeight: config.typography.headingWeight,
                lineHeight: config.typography.headingLineHeight,
                letterSpacing: `${config.typography.headingLetterSpacing}em`,
            },
            h5: {
                fontFamily: config.typography.headingFont,
                fontWeight: config.typography.headingWeight,
                lineHeight: config.typography.headingLineHeight,
                letterSpacing: `${config.typography.headingLetterSpacing}em`,
            },
            h6: {
                fontFamily: config.typography.headingFont,
                fontWeight: config.typography.headingWeight,
                lineHeight: config.typography.headingLineHeight,
                letterSpacing: `${config.typography.headingLetterSpacing}em`,
            },
            body1: {
                fontSize: `${config.typography.bodySize}px`,
                fontWeight: config.typography.bodyWeight,
                lineHeight: config.typography.bodyLineHeight,
                letterSpacing: `${config.typography.bodyLetterSpacing}em`,
            },
            body2: {
                fontSize: `${config.typography.bodySize - 2}px`,
                fontWeight: config.typography.bodyWeight,
                lineHeight: config.typography.bodyLineHeight,
                letterSpacing: `${config.typography.bodyLetterSpacing}em`,
            },
        },
        shape: {
            borderRadius: config.borderRadius,
        },
        components: {
            MuiButtonBase: {
                styleOverrides: {
                    root: {
                        '&:focus-visible': {
                            outline: '2px solid',
                            outlineColor: colors.primary,
                            outlineOffset: 2,
                        },
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        '&:focus-visible': {
                            boxShadow: `0 0 0 3px ${colors.primary}40`,
                        },
                    },
                },
            },
            MuiIconButton: {
                styleOverrides: {
                    root: {
                        '&:focus-visible': {
                            outline: '2px solid',
                            outlineColor: colors.primary,
                            outlineOffset: 2,
                        },
                    },
                },
            },
            MuiTab: {
                styleOverrides: {
                    root: {
                        '&:focus-visible': {
                            backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        },
                    },
                },
            },
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        color: colors.bodyColor,
                    },
                    'h1, h2, h3, h4, h5, h6': {
                        color: colors.headingColor,
                    },
                    a: {
                        color: colors.linkColor,
                        textDecoration: 'none',
                        '&:hover': {
                            textDecoration: 'underline',
                        },
                    },
                },
            },
        },
    });
}
