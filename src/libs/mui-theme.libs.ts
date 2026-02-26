import { createTheme } from '@mui/material/styles';
import type { PaletteMode } from '@mui/material';

/**
 * Material UI theme configuration
 * Supports light and dark modes
 * Customized for the application's design system
 */
export const getTheme = (mode: PaletteMode) =>
    createTheme({
        palette: {
            mode,
            primary: {
                main: '#1976d2',
                light: '#42a5f5',
                dark: '#1565c0',
                contrastText: '#ffffff',
            },
            secondary: {
                main: '#9c27b0',
                light: '#ba68c8',
                dark: '#7b1fa2',
                contrastText: '#ffffff',
            },
            error: {
                main: '#d32f2f',
                light: '#ef5350',
                dark: '#c62828',
            },
            warning: {
                main: '#ed6c02',
                light: '#ff9800',
                dark: '#e65100',
            },
            info: {
                main: '#0288d1',
                light: '#03a9f4',
                dark: '#01579b',
            },
            success: {
                main: '#2e7d32',
                light: '#4caf50',
                dark: '#1b5e20',
            },
            ...(mode === 'light'
                ? {
                      // Light mode colors
                      background: {
                          default: '#ffffff',
                          paper: '#f5f5f5',
                      },
                      text: {
                          primary: '#1a1a1a',
                          secondary: '#666666',
                      },
                  }
                : {
                      // Dark mode colors
                      background: {
                          default: '#121212',
                          paper: '#1e1e1e',
                      },
                      text: {
                          primary: '#ffffff',
                          secondary: '#b0b0b0',
                      },
                  }),
        },
        typography: {
            fontFamily: 'var(--font-inter), sans-serif',
            h1: {
                fontSize: '2.5rem',
                fontWeight: 600,
            },
            h2: {
                fontSize: '2rem',
                fontWeight: 600,
            },
            h3: {
                fontSize: '1.75rem',
                fontWeight: 600,
            },
            h4: {
                fontSize: '1.5rem',
                fontWeight: 600,
            },
            h5: {
                fontSize: '1.25rem',
                fontWeight: 600,
            },
            h6: {
                fontSize: '1rem',
                fontWeight: 600,
            },
            button: {
                textTransform: 'none',
            },
        },
        shape: {
            borderRadius: 8,
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        padding: '8px 16px',
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        boxShadow: mode === 'light' ? '0 2px 8px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.4)',
                    },
                },
            },
        },
    });
