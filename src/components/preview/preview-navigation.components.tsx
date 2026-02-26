'use client';

import { useState, type MouseEvent } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { AppBar, Toolbar, Button, Menu, MenuItem, Box, Typography } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import { LanguageSelector } from '@/components/shared/language-selector/language-selector.components';

export function PreviewNavigation() {
    const t = useTranslations('preview.navigation');
    const pathname = usePathname();
    const [demosAnchor, setDemosAnchor] = useState<null | HTMLElement>(null);

    const handleDemosClick = (event: MouseEvent<HTMLElement>) => {
        setDemosAnchor(event.currentTarget);
    };

    const handleDemosClose = () => {
        setDemosAnchor(null);
    };

    const isActive = (path: string) => pathname === path;
    const isDemoActive = pathname.startsWith('/preview/demos');

    return (
        <AppBar position="static" color="default" elevation={1} sx={{ width: '100%' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" component="div" sx={{ mr: 4 }}>
                    Preview
                </Typography>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        component={Link}
                        href="/preview/components"
                        color={isActive('/preview/components') ? 'primary' : 'inherit'}
                        sx={{
                            fontWeight: isActive('/preview/components') ? 'bold' : 'normal',
                        }}
                    >
                        {t('components')}
                    </Button>

                    <Button
                        color={isDemoActive ? 'primary' : 'inherit'}
                        onClick={handleDemosClick}
                        endIcon={<KeyboardArrowDown />}
                        sx={{
                            fontWeight: isDemoActive ? 'bold' : 'normal',
                        }}
                    >
                        {t('demos')}
                    </Button>

                    <Menu
                        anchorEl={demosAnchor}
                        open={Boolean(demosAnchor)}
                        onClose={handleDemosClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <MenuItem component={Link} href="/preview/demos/crm" onClick={handleDemosClose} selected={isActive('/preview/demos/crm')}>
                            {t('crm')}
                        </MenuItem>
                        <MenuItem component={Link} href="/preview/demos/dashboard" onClick={handleDemosClose} selected={isActive('/preview/demos/dashboard')}>
                            {t('dashboard')}
                        </MenuItem>
                        <MenuItem component={Link} href="/preview/demos/company-overview" onClick={handleDemosClose} selected={isActive('/preview/demos/company-overview')}>
                            {t('companyOverview')}
                        </MenuItem>
                    </Menu>
                </Box>
                <LanguageSelector />
            </Toolbar>
        </AppBar>
    );
}
