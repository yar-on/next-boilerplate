/**
 * Theme Color Section Component
 *
 * Color customization section with Light/Dark mode tabs.
 * Displays color buttons for all theme colors organized by category.
 */

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import type { PreviewThemeConfigType, PreviewColorsType } from '@/types/preview.types';
import { detectColorFormat, extractAlpha, toHexForPicker, fromPickerToOriginalFormat } from '@/utils/color-conversion.utils';

type ThemeColorSectionPropsType = {
    config: PreviewThemeConfigType;
    setColor: (mode: 'light' | 'dark', colorKey: keyof PreviewColorsType, value: string) => void;
    setMode: (mode: 'light' | 'dark') => void;
};

type ColorButtonType = {
    key: keyof PreviewColorsType;
    label: string;
};

// Debounce delay for color changes (in milliseconds)
// Prevents excessive re-renders while user is adjusting the color picker
const COLOR_CHANGE_DEBOUNCE_MS = 300;

const PALETTE_COLORS: ColorButtonType[] = [
    { key: 'primary', label: 'Primary' },
    { key: 'secondary', label: 'Secondary' },
    { key: 'error', label: 'Error' },
    { key: 'warning', label: 'Warning' },
    { key: 'info', label: 'Info' },
    { key: 'success', label: 'Success' },
];

const BACKGROUND_COLORS: ColorButtonType[] = [
    { key: 'backgroundDefault', label: 'Background Default' },
    { key: 'backgroundPaper', label: 'Background Paper' },
];

const TEXT_COLORS: ColorButtonType[] = [
    { key: 'textPrimary', label: 'Text Primary' },
    { key: 'textSecondary', label: 'Text Secondary' },
    { key: 'textDisabled', label: 'Text Disabled' },
    { key: 'divider', label: 'Divider' },
];

const CUSTOM_COLORS: ColorButtonType[] = [
    { key: 'headingColor', label: 'Heading Color' },
    { key: 'bodyColor', label: 'Body Color' },
    { key: 'linkColor', label: 'Link Color' },
];

export function ThemeColorSection({ config, setColor, setMode }: ThemeColorSectionPropsType) {
    const [modeTab, setModeTab] = useState<0 | 1>(config.mode === 'light' ? 0 : 1);

    // Refs for hidden color inputs
    const colorInputRefs = useRef<Partial<Record<keyof PreviewColorsType, HTMLInputElement | null>>>({});

    // Ref for debounce timeout
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const currentMode: 'light' | 'dark' = modeTab === 0 ? 'light' : 'dark';
    const colors = config.colors[currentMode];

    const handleModeChange = (_: React.SyntheticEvent, value: number) => {
        setModeTab(value as 0 | 1);
        const newMode = value === 0 ? 'light' : 'dark';
        setMode(newMode);
    };

    // Handle color button click - triggers native color picker
    const handleColorButtonClick = useCallback((colorKey: keyof PreviewColorsType) => {
        const inputRef = colorInputRefs.current[colorKey];
        if (inputRef) {
            inputRef.click(); // Trigger native color picker
        }
    }, []);

    // Handle color input change - debounced updates for smoother experience
    const handleColorInputChange = useCallback(
        (colorKey: keyof PreviewColorsType, newHexValue: string) => {
            // Clear any pending debounce timeout
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }

            // Set new debounce timeout
            debounceTimeoutRef.current = setTimeout(() => {
                // Get original color to detect format
                const originalColor = colors[colorKey];
                const originalFormat = detectColorFormat(originalColor);

                // Preserve alpha if original was rgba
                const alpha = originalFormat === 'rgba' ? extractAlpha(originalColor) : 1.0;

                // Convert back to original format
                const finalColor = fromPickerToOriginalFormat(newHexValue, originalFormat, alpha);

                // Update theme after debounce
                setColor(currentMode, colorKey, finalColor);
            }, COLOR_CHANGE_DEBOUNCE_MS);
        },
        [colors, currentMode, setColor]
    );

    // Cleanup debounce timeout on unmount
    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    const renderColorButton = (colorButton: ColorButtonType) => {
        const color = colors[colorButton.key];

        return (
            <Grid size={{ xs: 6, sm: 4 }} key={colorButton.key}>
                <Tooltip title={`${colorButton.label}: ${color}`}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1,
                            position: 'relative',
                        }}
                    >
                        <IconButton
                            onClick={() => handleColorButtonClick(colorButton.key)}
                            aria-label={`${colorButton.label} color`}
                            sx={{
                                width: { xs: 64, sm: 56 },
                                height: { xs: 64, sm: 56 },
                                bgcolor: color,
                                border: '2px solid',
                                borderColor: 'divider',
                                boxShadow: 1,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    bgcolor: color,
                                    transform: 'scale(1.1)',
                                    boxShadow: 3,
                                },
                            }}
                        />
                        {/* Hidden native color picker */}
                        <input
                            type="color"
                            ref={(el) => {
                                colorInputRefs.current[colorButton.key] = el;
                            }}
                            value={toHexForPicker(color)}
                            onChange={(e) => handleColorInputChange(colorButton.key, e.target.value)}
                            style={{
                                position: 'absolute',
                                width: 0,
                                height: 0,
                                opacity: 0,
                                pointerEvents: 'none',
                            }}
                            aria-hidden="true"
                        />
                        <Typography variant="caption" sx={{ textAlign: 'center', fontSize: '0.7rem' }}>
                            {colorButton.label}
                        </Typography>
                    </Box>
                </Tooltip>
            </Grid>
        );
    };

    return (
        <Box>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Colors
            </Typography>

            {/* Light/Dark Mode Tabs */}
            <Tabs value={modeTab} onChange={handleModeChange} sx={{ mb: 2 }} variant="fullWidth">
                <Tab label="Light Mode" />
                <Tab label="Dark Mode" />
            </Tabs>

            {/* Mode Indicator Badge */}
            <Box
                sx={{
                    mb: 2,
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: currentMode === 'light' ? 'grey.100' : 'grey.900',
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                }}
            >
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 500,
                        color: currentMode === 'light' ? 'text.primary' : 'grey.100',
                    }}
                >
                    {currentMode === 'light' ? '☀️ Editing Light Mode Colors' : '🌙 Editing Dark Mode Colors'}
                </Typography>
            </Box>

            {/* Palette Colors */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Palette Colors
                </Typography>
                <Grid container spacing={2}>
                    {PALETTE_COLORS.map(renderColorButton)}
                </Grid>
            </Box>

            {/* Background Colors */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Background Colors
                </Typography>
                <Grid container spacing={2}>
                    {BACKGROUND_COLORS.map(renderColorButton)}
                </Grid>
            </Box>

            {/* Text Colors */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Text & Divider
                </Typography>
                <Grid container spacing={2}>
                    {TEXT_COLORS.map(renderColorButton)}
                </Grid>
            </Box>

            {/* Custom Colors */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Custom Typography Colors
                </Typography>
                <Grid container spacing={2}>
                    {CUSTOM_COLORS.map(renderColorButton)}
                </Grid>
            </Box>
        </Box>
    );
}
