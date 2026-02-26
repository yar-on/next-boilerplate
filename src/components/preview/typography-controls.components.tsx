/**
 * Typography Controls Component
 *
 * Controls for customizing typography including font families, weights, sizes,
 * line heights, and letter spacing.
 */

'use client';

import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import ListSubheader from '@mui/material/ListSubheader';
import type { PreviewThemeConfigType, FontOptionType } from '@/types/preview.types';
import { FONT_OPTIONS, FONT_WEIGHT_OPTIONS } from '@/constants/preview.constants';

type TypographyControlsPropsType = {
    config: PreviewThemeConfigType;
    setTypography: <K extends keyof PreviewThemeConfigType['typography']>(key: K, value: PreviewThemeConfigType['typography'][K]) => void;
};

export function TypographyControls({ config, setTypography }: TypographyControlsPropsType) {
    const { typography } = config;

    // Group fonts by category for organized dropdown
    const groupedFonts = FONT_OPTIONS.reduce(
        (acc, font) => {
            const category = font.category || 'sans-serif';
            if (!acc[category]) acc[category] = [];
            acc[category].push(font);
            return acc;
        },
        {} as Record<string, FontOptionType[]>
    );

    const categoryLabels = {
        system: 'System Fonts',
        'sans-serif': 'Sans-serif',
        serif: 'Serif',
        display: 'Display',
    };

    // Render font options with category headers
    const renderFontOptions = () => {
        const categories = ['system', 'sans-serif', 'serif', 'display'] as const;
        const items: React.ReactNode[] = [];

        categories.forEach((category) => {
            if (groupedFonts[category] && groupedFonts[category].length > 0) {
                items.push(
                    <ListSubheader key={`header-${category}`} sx={{ lineHeight: '32px' }}>
                        {categoryLabels[category]}
                    </ListSubheader>
                );

                groupedFonts[category].forEach((font) => {
                    items.push(
                        <MenuItem key={font.value} value={font.value} sx={{ fontFamily: font.value, fontSize: '0.95rem' }}>
                            {font.label}
                        </MenuItem>
                    );
                });
            }
        });

        return items;
    };

    // Load Google Font when font family changes
    useEffect(() => {
        const loadFont = (fontName: string) => {
            // Skip system fonts
            if (fontName.includes('system-ui')) return;

            // Check if font is already loaded
            const linkId = `font-${fontName.replace(/\s+/g, '-')}`;
            if (document.getElementById(linkId)) return;

            // Create link element for Google Fonts
            const link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
            document.head.appendChild(link);
        };

        loadFont(typography.headingFont);
        loadFont(typography.bodyFont);
    }, [typography.headingFont, typography.bodyFont]);

    return (
        <Box>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Typography
            </Typography>

            {/* Typography Preview - Moved to top for immediate feedback */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                    Preview
                </Typography>

                <Typography
                    sx={{
                        fontFamily: typography.headingFont,
                        fontSize: `${typography.h1Size}px`,
                        fontWeight: typography.headingWeight,
                        lineHeight: typography.headingLineHeight,
                        letterSpacing: `${typography.headingLetterSpacing}em`,
                        mb: 1,
                    }}
                >
                    Heading 1
                </Typography>

                <Typography
                    sx={{
                        fontFamily: typography.headingFont,
                        fontSize: `${typography.h2Size}px`,
                        fontWeight: typography.headingWeight,
                        lineHeight: typography.headingLineHeight,
                        letterSpacing: `${typography.headingLetterSpacing}em`,
                        mb: 1,
                    }}
                >
                    Heading 2
                </Typography>

                <Typography
                    sx={{
                        fontFamily: typography.headingFont,
                        fontSize: `${typography.h3Size}px`,
                        fontWeight: typography.headingWeight,
                        lineHeight: typography.headingLineHeight,
                        letterSpacing: `${typography.headingLetterSpacing}em`,
                        mb: 2,
                    }}
                >
                    Heading 3
                </Typography>

                <Typography
                    sx={{
                        fontFamily: typography.bodyFont,
                        fontSize: `${typography.bodySize}px`,
                        fontWeight: typography.bodyWeight,
                        lineHeight: typography.bodyLineHeight,
                        letterSpacing: `${typography.bodyLetterSpacing}em`,
                    }}
                >
                    This is body text. The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Typography>
            </Box>

            {/* Font Family */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Heading Font</InputLabel>
                        <Select value={typography.headingFont} label="Heading Font" onChange={(e) => setTypography('headingFont', e.target.value)}>
                            {renderFontOptions()}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Body Font</InputLabel>
                        <Select value={typography.bodyFont} label="Body Font" onChange={(e) => setTypography('bodyFont', e.target.value)}>
                            {renderFontOptions()}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Font Weight */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Heading Weight</InputLabel>
                        <Select value={typography.headingWeight} label="Heading Weight" onChange={(e) => setTypography('headingWeight', Number(e.target.value))}>
                            {FONT_WEIGHT_OPTIONS.map((weight) => (
                                <MenuItem key={weight.value} value={weight.value}>
                                    {weight.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Body Weight</InputLabel>
                        <Select value={typography.bodyWeight} label="Body Weight" onChange={(e) => setTypography('bodyWeight', Number(e.target.value))}>
                            {FONT_WEIGHT_OPTIONS.map((weight) => (
                                <MenuItem key={weight.value} value={weight.value}>
                                    {weight.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Font Sizes */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                    Font Sizes
                </Typography>

                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="caption" sx={{ flex: 1 }}>
                            H1 Size
                        </Typography>
                        <TextField
                            type="number"
                            value={typography.h1Size}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value >= 32 && value <= 64) {
                                    setTypography('h1Size', value);
                                }
                            }}
                            size="medium"
                            InputProps={{
                                endAdornment: (
                                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                                        px
                                    </Typography>
                                ),
                            }}
                            inputProps={{ min: 32, max: 64, step: 1 }}
                        />
                    </Box>
                    <Slider
                        value={typography.h1Size}
                        onChange={(_, value) => setTypography('h1Size', value)}
                        min={32}
                        max={64}
                        step={1}
                        marks={[
                            { value: 32, label: '32px' },
                            { value: 64, label: '64px' },
                        ]}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="caption" sx={{ flex: 1 }}>
                            H2 Size
                        </Typography>
                        <TextField
                            type="number"
                            value={typography.h2Size}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value >= 24 && value <= 48) {
                                    setTypography('h2Size', value);
                                }
                            }}
                            size="medium"
                            InputProps={{
                                endAdornment: (
                                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                                        px
                                    </Typography>
                                ),
                            }}
                            inputProps={{ min: 24, max: 48, step: 1 }}
                        />
                    </Box>
                    <Slider
                        value={typography.h2Size}
                        onChange={(_, value) => setTypography('h2Size', value)}
                        min={24}
                        max={48}
                        step={1}
                        marks={[
                            { value: 24, label: '24px' },
                            { value: 48, label: '48px' },
                        ]}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="caption" sx={{ flex: 1 }}>
                            H3 Size
                        </Typography>
                        <TextField
                            type="number"
                            value={typography.h3Size}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value >= 20 && value <= 36) {
                                    setTypography('h3Size', value);
                                }
                            }}
                            size="medium"
                            InputProps={{
                                endAdornment: (
                                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                                        px
                                    </Typography>
                                ),
                            }}
                            inputProps={{ min: 20, max: 36, step: 1 }}
                        />
                    </Box>
                    <Slider
                        value={typography.h3Size}
                        onChange={(_, value) => setTypography('h3Size', value)}
                        min={20}
                        max={36}
                        step={1}
                        marks={[
                            { value: 20, label: '20px' },
                            { value: 36, label: '36px' },
                        ]}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="caption" sx={{ flex: 1 }}>
                            Body Size
                        </Typography>
                        <TextField
                            type="number"
                            value={typography.bodySize}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value >= 14 && value <= 20) {
                                    setTypography('bodySize', value);
                                }
                            }}
                            size="medium"
                            InputProps={{
                                endAdornment: (
                                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                                        px
                                    </Typography>
                                ),
                            }}
                            inputProps={{ min: 14, max: 20, step: 1 }}
                        />
                    </Box>
                    <Slider
                        value={typography.bodySize}
                        onChange={(_, value) => setTypography('bodySize', value)}
                        min={14}
                        max={20}
                        step={1}
                        marks={[
                            { value: 14, label: '14px' },
                            { value: 20, label: '20px' },
                        ]}
                    />
                </Box>
            </Box>

            {/* Line Heights */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                    Line Heights
                </Typography>

                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="caption" sx={{ flex: 1 }}>
                            Heading Line Height
                        </Typography>
                        <TextField
                            type="number"
                            value={typography.headingLineHeight.toFixed(2)}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value >= 1.0 && value <= 1.5) {
                                    setTypography('headingLineHeight', value);
                                }
                            }}
                            size="medium"
                            inputProps={{ min: 1.0, max: 1.5, step: 0.05 }}
                        />
                    </Box>
                    <Slider
                        value={typography.headingLineHeight}
                        onChange={(_, value) => setTypography('headingLineHeight', value)}
                        min={1.0}
                        max={1.5}
                        step={0.05}
                        marks={[
                            { value: 1.0, label: '1.0' },
                            { value: 1.5, label: '1.5' },
                        ]}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="caption" sx={{ flex: 1 }}>
                            Body Line Height
                        </Typography>
                        <TextField
                            type="number"
                            value={typography.bodyLineHeight.toFixed(2)}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value >= 1.2 && value <= 2.0) {
                                    setTypography('bodyLineHeight', value);
                                }
                            }}
                            size="medium"
                            inputProps={{ min: 1.2, max: 2.0, step: 0.1 }}
                        />
                    </Box>
                    <Slider
                        value={typography.bodyLineHeight}
                        onChange={(_, value) => setTypography('bodyLineHeight', value)}
                        min={1.2}
                        max={2.0}
                        step={0.1}
                        marks={[
                            { value: 1.2, label: '1.2' },
                            { value: 2.0, label: '2.0' },
                        ]}
                    />
                </Box>
            </Box>

            {/* Letter Spacing */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                    Letter Spacing
                </Typography>

                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="caption" sx={{ flex: 1 }}>
                            Heading Letter Spacing
                        </Typography>
                        <TextField
                            type="number"
                            value={typography.headingLetterSpacing.toFixed(3)}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value >= -0.05 && value <= 0.1) {
                                    setTypography('headingLetterSpacing', value);
                                }
                            }}
                            size="medium"
                            InputProps={{
                                endAdornment: (
                                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                                        em
                                    </Typography>
                                ),
                            }}
                            inputProps={{ min: -0.05, max: 0.1, step: 0.005 }}
                        />
                    </Box>
                    <Slider
                        value={typography.headingLetterSpacing}
                        onChange={(_, value) => setTypography('headingLetterSpacing', value)}
                        min={-0.05}
                        max={0.1}
                        step={0.005}
                        marks={[
                            { value: -0.05, label: '-0.05' },
                            { value: 0.1, label: '0.1' },
                        ]}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="caption" sx={{ flex: 1 }}>
                            Body Letter Spacing
                        </Typography>
                        <TextField
                            type="number"
                            value={typography.bodyLetterSpacing.toFixed(3)}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value >= -0.02 && value <= 0.05) {
                                    setTypography('bodyLetterSpacing', value);
                                }
                            }}
                            size="medium"
                            InputProps={{
                                endAdornment: (
                                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                                        em
                                    </Typography>
                                ),
                            }}
                            inputProps={{ min: -0.02, max: 0.05, step: 0.005 }}
                        />
                    </Box>
                    <Slider
                        value={typography.bodyLetterSpacing}
                        onChange={(_, value) => setTypography('bodyLetterSpacing', value)}
                        min={-0.02}
                        max={0.05}
                        step={0.005}
                        marks={[
                            { value: -0.02, label: '-0.02' },
                            { value: 0.05, label: '0.05' },
                        ]}
                    />
                </Box>
            </Box>
        </Box>
    );
}
