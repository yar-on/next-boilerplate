'use client';

import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { usePreviewTheme } from '@/hooks/use-preview-theme.hooks';
import { FloatingThemeButton } from './floating-theme-button.components';
import { ThemeMenu } from './theme-menu.components';
import { BackToTop } from './back-to-top.components';

type PreviewThemeControlsPropsType = {
    children: React.ReactNode;
};

export function PreviewThemeControls({ children }: PreviewThemeControlsPropsType) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, config, setMode, setColor, setTypography, setBorderRadius, resetToDefaults, importConfig, exportConfig } = usePreviewTheme();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
            <FloatingThemeButton isHidden={isMenuOpen} onClick={() => setIsMenuOpen(true)} />
            <ThemeMenu
                open={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                config={config}
                setMode={setMode}
                setColor={setColor}
                setTypography={setTypography}
                setBorderRadius={setBorderRadius}
                resetToDefaults={resetToDefaults}
                importConfig={importConfig}
                exportConfig={exportConfig}
            />
            <BackToTop />
        </ThemeProvider>
    );
}
