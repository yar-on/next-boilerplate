/**
 * Dashboard Demo Component
 *
 * Analytics dashboard demo showcasing:
 * - AppBar with search and user menu
 * - Drawer sidebar with navigation
 * - Metric cards
 * - Chart placeholders
 * - Recent activity table
 * - Responsive layout
 * - Full i18n support (Hebrew/English)
 */

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const DRAWER_WIDTH = 240;

export function DashboardDemo() {
    const t = useTranslations();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(!isMobile);
    const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

    // Move nav items inside component to access t()
    const navItems = [
        { text: t('preview.demos.dashboard.nav.dashboard'), icon: <DashboardIcon /> },
        { text: t('preview.demos.dashboard.nav.analytics'), icon: <BarChartIcon /> },
        { text: t('preview.demos.dashboard.nav.users'), icon: <PeopleIcon /> },
        { text: t('preview.demos.dashboard.nav.settings'), icon: <SettingsIcon /> },
    ];

    const metrics = [
        {
            label: t('preview.demos.dashboard.metrics.revenue'),
            value: '$45,231',
            change: '+12%',
            trend: 'up' as const,
            icon: <AttachMoneyIcon />,
            color: 'success.main' as const,
        },
        {
            label: t('preview.demos.dashboard.metrics.orders'),
            value: '1,423',
            change: '+8%',
            trend: 'up' as const,
            icon: <ShoppingCartIcon />,
            color: 'info.main' as const,
        },
        {
            label: t('preview.demos.dashboard.metrics.users'),
            value: '8,492',
            change: '-3%',
            trend: 'down' as const,
            icon: <PeopleIcon />,
            color: 'warning.main' as const,
        },
        {
            label: t('preview.demos.dashboard.metrics.conversion'),
            value: '3.24%',
            change: '+5%',
            trend: 'up' as const,
            icon: <TrendingUpIcon />,
            color: 'secondary.main' as const,
        },
    ];

    const recentActivity = [
        {
            id: 1,
            user: t('preview.demos.dashboard.activity.rows.johnDoe.user'),
            action: t('preview.demos.dashboard.activity.rows.johnDoe.action'),
            timestamp: t('preview.demos.dashboard.activity.rows.johnDoe.timestamp'),
            status: t('preview.demos.dashboard.activity.rows.johnDoe.status'),
        },
        {
            id: 2,
            user: t('preview.demos.dashboard.activity.rows.janeSmith.user'),
            action: t('preview.demos.dashboard.activity.rows.janeSmith.action'),
            timestamp: t('preview.demos.dashboard.activity.rows.janeSmith.timestamp'),
            status: t('preview.demos.dashboard.activity.rows.janeSmith.status'),
        },
        {
            id: 3,
            user: t('preview.demos.dashboard.activity.rows.bobJohnson.user'),
            action: t('preview.demos.dashboard.activity.rows.bobJohnson.action'),
            timestamp: t('preview.demos.dashboard.activity.rows.bobJohnson.timestamp'),
            status: t('preview.demos.dashboard.activity.rows.bobJohnson.status'),
        },
        {
            id: 4,
            user: t('preview.demos.dashboard.activity.rows.aliceWilliams.user'),
            action: t('preview.demos.dashboard.activity.rows.aliceWilliams.action'),
            timestamp: t('preview.demos.dashboard.activity.rows.aliceWilliams.timestamp'),
            status: t('preview.demos.dashboard.activity.rows.aliceWilliams.status'),
        },
    ];

    const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setUserMenuAnchor(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserMenuAnchor(null);
    };

    const drawerContent = (
        <Box>
            <Toolbar>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {t('preview.demos.dashboard.brand')}
                </Typography>
            </Toolbar>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* AppBar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerOpen ? DRAWER_WIDTH : 0}px)` },
                    ml: { md: `${drawerOpen ? DRAWER_WIDTH : 0}px` },
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Toolbar>
                    <IconButton color="inherit" aria-label={t('preview.demos.dashboard.openDrawer')} edge="start" onClick={() => setDrawerOpen(!drawerOpen)} sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {t('preview.demos.dashboard.title')}
                    </Typography>

                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder={t('preview.demos.dashboard.search')}
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                            width: 250,
                            mr: 2,
                            '& .MuiOutlinedInput-root': {
                                bgcolor: 'rgba(255, 255, 255, 0.15)',
                                color: 'inherit',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.25)',
                                },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: 'inherit' }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <IconButton color="inherit">
                        <Badge badgeContent={3} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    <IconButton color="inherit" onClick={handleUserMenuOpen}>
                        <AccountCircleIcon />
                    </IconButton>

                    <Menu anchorEl={userMenuAnchor} open={Boolean(userMenuAnchor)} onClose={handleUserMenuClose}>
                        <MenuItem onClick={handleUserMenuClose}>{t('preview.demos.dashboard.menu.profile')}</MenuItem>
                        <MenuItem onClick={handleUserMenuClose}>{t('preview.demos.dashboard.menu.settings')}</MenuItem>
                        <MenuItem onClick={handleUserMenuClose}>{t('preview.demos.dashboard.menu.logout')}</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Drawer */}
            <Drawer
                variant={isMobile ? 'temporary' : 'persistent'}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={{
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${drawerOpen ? DRAWER_WIDTH : 0}px)` },
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Toolbar />

                {/* Metric Cards */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    {metrics.map((metric, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Box
                                            sx={{
                                                bgcolor: metric.color,
                                                color: 'white',
                                                p: 1,
                                                borderRadius: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {metric.icon}
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {metric.trend === 'up' ? <TrendingUpIcon color="success" fontSize="small" /> : <TrendingDownIcon color="error" fontSize="small" />}
                                            <Typography variant="caption" color={metric.trend === 'up' ? 'success.main' : 'error.main'} sx={{ ml: 0.5 }}>
                                                {metric.change}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                                        {metric.value}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {metric.label}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Charts */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Paper sx={{ p: 3, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="h6" color="text.secondary">
                                {t('preview.demos.dashboard.charts.revenuePlaceholder')}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper sx={{ p: 3, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="h6" color="text.secondary">
                                {t('preview.demos.dashboard.charts.trafficPlaceholder')}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Recent Activity Table */}
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        {t('preview.demos.dashboard.activity.title')}
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t('preview.demos.dashboard.activity.headers.user')}</TableCell>
                                    <TableCell>{t('preview.demos.dashboard.activity.headers.action')}</TableCell>
                                    <TableCell>{t('preview.demos.dashboard.activity.headers.time')}</TableCell>
                                    <TableCell>{t('preview.demos.dashboard.activity.headers.status')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recentActivity.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{
                                            '&:hover': {
                                                bgcolor: 'action.hover',
                                                cursor: 'pointer',
                                            },
                                        }}
                                    >
                                        <TableCell>{row.user}</TableCell>
                                        <TableCell>{row.action}</TableCell>
                                        <TableCell>{row.timestamp}</TableCell>
                                        <TableCell>
                                            <Box
                                                component="span"
                                                sx={{
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    bgcolor:
                                                        row.status === t('preview.demos.dashboard.activity.statuses.completed')
                                                            ? 'success.light'
                                                            : row.status === t('preview.demos.dashboard.activity.statuses.inProgress')
                                                              ? 'warning.light'
                                                              : 'info.light',
                                                    color:
                                                        row.status === t('preview.demos.dashboard.activity.statuses.completed')
                                                            ? 'success.dark'
                                                            : row.status === t('preview.demos.dashboard.activity.statuses.inProgress')
                                                              ? 'warning.dark'
                                                              : 'info.dark',
                                                }}
                                            >
                                                {row.status}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </Box>
    );
}
