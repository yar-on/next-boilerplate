/**
 * Theme Import Component
 *
 * Provides functionality to import theme configuration from a JSON file.
 * Includes file size validation, JSON parsing, and Zod schema validation.
 */

'use client';

import { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useTranslations } from 'next-intl';
import type { PreviewThemeConfigType } from '@/types/preview.types';
import { PreviewThemeValidation } from '@/validations/preview-theme.validations';

type ThemeImportPropsType = {
    importConfig: (config: PreviewThemeConfigType) => {
        success: boolean;
        error?: unknown;
    };
};

type SnackbarStateType = {
    open: boolean;
    message: string;
    severity: 'success' | 'error';
};

const MAX_FILE_SIZE = 100 * 1024; // 100KB in bytes

export function ThemeImport({ importConfig }: ThemeImportPropsType) {
    const t = useTranslations();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [snackbar, setSnackbar] = useState<SnackbarStateType>({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        // Validate file type
        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            setSnackbar({
                open: true,
                message: t('preview.import.errors.invalidFileType'),
                severity: 'error',
            });
            event.target.value = '';
            return;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            setSnackbar({
                open: true,
                message: t('preview.import.errors.fileSizeExceeds', {
                    size: (file.size / 1024).toFixed(2),
                }),
                severity: 'error',
            });
            event.target.value = '';
            return;
        }

        try {
            // Read file
            const text = await file.text();

            // Parse JSON
            let jsonData: unknown;
            try {
                jsonData = JSON.parse(text);
            } catch {
                setSnackbar({
                    open: true,
                    message: t('preview.import.errors.invalidJson'),
                    severity: 'error',
                });
                event.target.value = '';
                return;
            }

            // Validate with Zod schema
            const validation = PreviewThemeValidation.safeParse(jsonData);

            if (!validation.success) {
                const errorMessages = validation.error.issues.map((err) => err.message).join(', ');
                setSnackbar({
                    open: true,
                    message: t('preview.import.errors.validationFailed', { errors: errorMessages }),
                    severity: 'error',
                });
                event.target.value = '';
                return;
            }

            // Import config
            const result = importConfig(validation.data);

            if (result.success) {
                setSnackbar({
                    open: true,
                    message: t('preview.import.success'),
                    severity: 'success',
                });
            } else {
                const errorMessage = result.error instanceof Error ? result.error.message : t('preview.import.errors.importFailed');
                setSnackbar({
                    open: true,
                    message: errorMessage,
                    severity: 'error',
                });
            }

            // Reset file input
            event.target.value = '';
        } catch (error) {
            setSnackbar({
                open: true,
                message: error instanceof Error ? error.message : t('preview.import.errors.readFailed'),
                severity: 'error',
            });
            event.target.value = '';
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={(e) => {
                    void handleFileChange(e);
                }}
                style={{ display: 'none' }}
            />
            <Button variant="outlined" startIcon={<FileUploadIcon />} onClick={handleImportClick} fullWidth sx={{ mb: 1 }}>
                {t('preview.import.button')}
            </Button>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}
