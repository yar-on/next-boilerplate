'use client';

import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeMode } from '@/contexts/theme-mode.context';

/**
 * Theme Toggle Button
 * Switches between light and dark mode
 */
export function ThemeToggle() {
    const { mode, toggleTheme } = useThemeMode();

    return (
        <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton
                onClick={toggleTheme}
                color="inherit"
                aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
                sx={{
                    ml: 1,
                    color: mode === 'light' ? '#1a1a1a' : '#ffffff',
                }}
            >
                {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
        </Tooltip>
    );
}
