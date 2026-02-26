/**
 * Theme Menu Component
 *
 * Sliding drawer panel for theme customization controls.
 * Contains sections for colors, typography, radius, and export/import.
 */

'use client';

import { useState, type FC } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PaletteIcon from '@mui/icons-material/Palette';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import BorderStyleIcon from '@mui/icons-material/BorderStyle';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import CloseIcon from '@mui/icons-material/Close';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useTranslations } from 'next-intl';
import { logger } from '@/utils/logger/logger.utils';
import type { PreviewColorsType, PreviewThemeConfigType } from '@/types/preview.types';
import { ThemeColorSection } from './theme-color-section.components';
import { TypographyControls } from './typography-controls.components';
import { RadiusControl } from './radius-control.components';
import { ThemeExport } from './theme-export.components';
import { ThemeImport } from './theme-import.components';

const STORAGE_KEY_EXPANDED_SECTIONS = 'theme-menu-expanded-sections';

interface ThemeMenuPropsType {
    open: boolean;
    onClose: () => void;
    config: PreviewThemeConfigType;
    setMode: (mode: 'light' | 'dark') => void;
    setColor: (mode: 'light' | 'dark', colorKey: keyof PreviewColorsType, value: string) => void;
    setTypography: <K extends keyof PreviewThemeConfigType['typography']>(key: K, value: PreviewThemeConfigType['typography'][K]) => void;
    setBorderRadius: (radius: number) => void;
    resetToDefaults: () => void;
    importConfig: (config: PreviewThemeConfigType) => {
        success: boolean;
        error?: unknown;
    };
    exportConfig: () => PreviewThemeConfigType;
}

export const ThemeMenu: FC<ThemeMenuPropsType> = ({ open, onClose, config, setMode, setColor, setTypography, setBorderRadius, resetToDefaults, importConfig, exportConfig }) => {
    const theme = useTheme();
    const t = useTranslations();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [resetDialogOpen, setResetDialogOpen] = useState(false);

    // Initialize expanded sections lazily from localStorage
    const [expandedSections, setExpandedSections] = useState<string[]>(() => {
        if (typeof window === 'undefined') {
            return ['colors', 'typography'];
        }

        try {
            const stored = localStorage.getItem(STORAGE_KEY_EXPANDED_SECTIONS);
            if (stored) {
                const parsed: unknown = JSON.parse(stored);
                // Validate that it's an array of strings
                if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
                    return parsed;
                }
            }
        } catch (error) {
            void logger.error({ message: 'Failed to load expanded sections', error });
        }

        return ['colors', 'typography'];
    });

    // Save expanded sections to localStorage
    const handleAccordionChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
        const newExpanded = isExpanded ? [...expandedSections, panel] : expandedSections.filter((item) => item !== panel);

        setExpandedSections(newExpanded);

        try {
            localStorage.setItem(STORAGE_KEY_EXPANDED_SECTIONS, JSON.stringify(newExpanded));
        } catch (error) {
            void logger.error({ message: 'Failed to save expanded sections', error });
        }
    };

    const handleResetClick = () => {
        setResetDialogOpen(true);
    };

    const handleResetCancel = () => {
        setResetDialogOpen(false);
    };

    const handleResetConfirm = () => {
        resetToDefaults();
        setResetDialogOpen(false);
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiDrawer-paper': {
                    width: isMobile ? '100%' : 400,
                    boxSizing: 'border-box',
                },
            }}
        >
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box
                    sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography variant="h6" component="h2">
                        {t('preview.menu.title')}
                    </Typography>
                    <IconButton edge="end" onClick={onClose} aria-label={t('preview.menu.closeAriaLabel')}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Divider />

                {/* Content - Scrollable with Accordions */}
                <Box
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        // padding: '1em'
                    }}
                >
                    {/* Colors Accordion */}
                    <Accordion
                        expanded={expandedSections.includes('colors')}
                        onChange={handleAccordionChange('colors')}
                        disableGutters
                        elevation={0}
                        sx={{
                            '&:before': { display: 'none' },
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            padding: '0 1em',
                        }}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="colors-content" id="colors-header">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <PaletteIcon color="primary" />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {t('preview.menu.sections.colors')}
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0 }}>
                            <ThemeColorSection config={config} setColor={setColor} setMode={setMode} />
                        </AccordionDetails>
                    </Accordion>

                    {/* Typography Accordion */}
                    <Accordion
                        expanded={expandedSections.includes('typography')}
                        onChange={handleAccordionChange('typography')}
                        disableGutters
                        elevation={0}
                        sx={{
                            '&:before': { display: 'none' },
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            padding: '0 1em',
                        }}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="typography-content" id="typography-header">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <TextFieldsIcon color="secondary" />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {t('preview.menu.sections.typography')}
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0 }}>
                            <TypographyControls config={config} setTypography={setTypography} />
                        </AccordionDetails>
                    </Accordion>

                    {/* Border Radius Accordion */}
                    <Accordion
                        expanded={expandedSections.includes('radius')}
                        onChange={handleAccordionChange('radius')}
                        disableGutters
                        elevation={0}
                        sx={{
                            '&:before': { display: 'none' },
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            padding: '0 1em',
                        }}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="radius-content" id="radius-header">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <BorderStyleIcon color="success" />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {t('preview.menu.sections.borderRadius')}
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0 }}>
                            <RadiusControl config={config} setBorderRadius={setBorderRadius} />
                        </AccordionDetails>
                    </Accordion>

                    {/* Export/Import Accordion */}
                    <Accordion
                        expanded={expandedSections.includes('export')}
                        onChange={handleAccordionChange('export')}
                        disableGutters
                        elevation={0}
                        sx={{
                            '&:before': { display: 'none' },
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            padding: '0 1em',
                        }}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="export-content" id="export-header">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <ImportExportIcon color="info" />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {t('preview.menu.sections.exportImport')}
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0 }}>
                            <Box>
                                <ThemeExport exportConfig={exportConfig} />
                                <ThemeImport importConfig={importConfig} />

                                <Button variant="outlined" color="warning" onClick={handleResetClick} fullWidth sx={{ mt: 1 }}>
                                    {t('preview.reset.button')}
                                </Button>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Box>

            {/* Reset Confirmation Dialog */}
            <Dialog open={resetDialogOpen} onClose={handleResetCancel} aria-labelledby="reset-dialog-title" aria-describedby="reset-dialog-description">
                <DialogTitle id="reset-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningAmberIcon color="warning" />
                    {t('preview.reset.dialog.title')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="reset-dialog-description">{t('preview.reset.dialog.description')}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleResetCancel}>{t('buttons.cancel')}</Button>
                    <Button onClick={handleResetConfirm} color="warning" variant="contained" autoFocus>
                        {t('preview.reset.dialog.confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Drawer>
    );
};
