/**
 * Theme Export Component
 *
 * Provides functionality to export the current theme configuration as a JSON file.
 */

'use client';

import Button from '@mui/material/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useTranslations } from 'next-intl';
import { logger } from '@/utils/logger/logger.utils';
import type { PreviewThemeConfigType } from '@/types/preview.types';

type ThemeExportPropsType = {
    exportConfig: () => PreviewThemeConfigType;
};

export function ThemeExport({ exportConfig }: ThemeExportPropsType) {
    const t = useTranslations();

    const handleExport = () => {
        try {
            // Get current theme config
            const config = exportConfig();

            // Convert to JSON string with formatting
            const jsonString = JSON.stringify(config, null, 2);

            // Create blob
            const blob = new Blob([jsonString], { type: 'application/json' });

            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `theme-config-${new Date().toISOString().split('T')[0]}.json`;

            // Trigger download
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            void logger.error({ message: 'Failed to export theme', error });
        }
    };

    return (
        <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={handleExport} fullWidth sx={{ mb: 1 }}>
            {t('preview.export.button')}
        </Button>
    );
}
