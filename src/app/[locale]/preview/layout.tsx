import { PreviewThemeProvider } from '@/components/preview/preview-theme-provider.components';
import { PreviewThemeControls } from '@/components/preview/preview-theme-controls.components';
import { Box } from '@mui/material';

type PreviewLayoutPropsType = {
    children: React.ReactNode;
};

export default function PreviewLayout({ children }: PreviewLayoutPropsType) {
    return (
        <PreviewThemeProvider>
            <PreviewThemeControls>
                <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <Box component="main" sx={{ flexGrow: 1, p: 3, padding: 0 }}>
                        {children}
                    </Box>
                </Box>
            </PreviewThemeControls>
        </PreviewThemeProvider>
    );
}
