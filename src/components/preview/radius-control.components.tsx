/**
 * Radius Control Component
 *
 * Control for adjusting the global border radius of all components.
 */

'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import type { PreviewThemeConfigType } from '@/types/preview.types';

type RadiusControlPropsType = {
    config: PreviewThemeConfigType;
    setBorderRadius: (radius: number) => void;
};

export function RadiusControl({ config, setBorderRadius }: RadiusControlPropsType) {
    const { borderRadius } = config;

    return (
        <Box>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Border Radius
            </Typography>

            {/* Radius Slider */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="caption" gutterBottom>
                    Radius: {borderRadius}px
                </Typography>
                <Slider
                    value={borderRadius}
                    onChange={(_, value) => setBorderRadius(value)}
                    min={0}
                    max={50}
                    step={1}
                    marks={[
                        { value: 0, label: '0px (Sharp)' },
                        { value: 25, label: '25px' },
                        { value: 50, label: '50px (Rounded)' },
                    ]}
                    sx={{ mt: 2 }}
                />
            </Box>

            {/* Preview Boxes */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                    Preview
                </Typography>

                <Grid container spacing={2}>
                    {/* Small Box */}
                    <Grid size={{ xs: 4 }}>
                        {/*<Paper*/}
                        {/*  elevation={2}*/}
                        {/*  sx={{*/}
                        {/*    height: 60,*/}
                        {/*    display: 'flex',*/}
                        {/*    alignItems: 'center',*/}
                        {/*    justifyContent: 'center',*/}
                        {/*    borderRadius: `${borderRadius}px`,*/}
                        {/*    bgcolor: 'primary.main',*/}
                        {/*    color: 'primary.contrastText',*/}
                        {/*  }}*/}
                        {/*>*/}
                        {/*  <Typography variant="caption">Small</Typography>*/}
                        {/*</Paper>*/}
                    </Grid>

                    {/* Medium Box */}
                    <Grid size={{ xs: 4 }}>
                        <Paper
                            elevation={2}
                            sx={{
                                height: 60,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: `${borderRadius}px`,
                                bgcolor: 'secondary.main',
                                color: 'secondary.contrastText',
                            }}
                        >
                            <Typography variant="caption">Medium</Typography>
                        </Paper>
                    </Grid>

                    {/* Large Box */}
                    <Grid size={{ xs: 4 }}>
                        {/*<Paper*/}
                        {/*  elevation={2}*/}
                        {/*  sx={{*/}
                        {/*    height: 60,*/}
                        {/*    display: 'flex',*/}
                        {/*    alignItems: 'center',*/}
                        {/*    justifyContent: 'center',*/}
                        {/*    borderRadius: `${borderRadius}px`,*/}
                        {/*    bgcolor: 'success.main',*/}
                        {/*    color: 'success.contrastText',*/}
                        {/*  }}*/}
                        {/*>*/}
                        {/*  <Typography variant="caption">Large</Typography>*/}
                        {/*</Paper>*/}
                    </Grid>

                    {/* Full Width Box */}
                    <Grid size={{ xs: 12 }}>
                        <Paper
                            elevation={2}
                            sx={{
                                height: 80,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: `${borderRadius}px`,
                                bgcolor: 'info.main',
                                color: 'info.contrastText',
                            }}
                        >
                            <Typography variant="body2">Full Width Component</Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    This radius applies to all components including buttons, cards, inputs, and modals.
                </Typography>
            </Box>
        </Box>
    );
}
