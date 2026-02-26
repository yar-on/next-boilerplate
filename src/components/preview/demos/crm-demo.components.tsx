/**
 * CRM Demo Component
 *
 * Customer Relationship Management demo showcasing:
 * - AppBar and Drawer navigation
 * - Filterable leads with Chips
 * - Sortable data with Select dropdown
 * - View toggle (list/grid)
 * - Details panel (Drawer)
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
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SettingsIcon from '@mui/icons-material/Settings';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';

type LeadStatusType = 'All' | 'New' | 'Contacted' | 'Qualified' | 'Lost';
type ViewModeType = 'list' | 'grid';

type LeadType = {
    id: number;
    nameKey: string;
    emailKey: string;
    phoneKey: string;
    companyKey: string;
    status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
    valueKey: string;
    notesKey: string;
    lastActivityKey: string;
};

const DRAWER_WIDTH = 240;

const STATUS_COLORS: Record<'New' | 'Contacted' | 'Qualified' | 'Lost', 'primary' | 'info' | 'success' | 'error'> = {
    New: 'primary',
    Contacted: 'info',
    Qualified: 'success',
    Lost: 'error',
};

export function CrmDemo() {
    const t = useTranslations();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [navDrawerOpen, setNavDrawerOpen] = useState(!isMobile);
    const [filterStatus, setFilterStatus] = useState<LeadStatusType>('All');
    const [sortBy, setSortBy] = useState<string>('name');
    const [viewMode, setViewMode] = useState<ViewModeType>('list');
    const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<LeadType | null>(null);

    // Nav items with translations
    const navItems = [
        { text: t('preview.demos.crm.nav.leads'), icon: <PeopleIcon /> },
        { text: t('preview.demos.crm.nav.deals'), icon: <TrendingUpIcon /> },
        { text: t('preview.demos.crm.nav.settings'), icon: <SettingsIcon /> },
    ];

    // Sample leads with translation keys
    const sampleLeads: LeadType[] = [
        {
            id: 1,
            nameKey: 'preview.demos.crm.leads.johnDoe.name',
            emailKey: 'preview.demos.crm.leads.johnDoe.email',
            phoneKey: 'preview.demos.crm.leads.johnDoe.phone',
            companyKey: 'preview.demos.crm.leads.johnDoe.company',
            status: 'New',
            valueKey: 'preview.demos.crm.leads.johnDoe.value',
            notesKey: 'preview.demos.crm.leads.johnDoe.notes',
            lastActivityKey: 'preview.demos.crm.leads.johnDoe.lastActivity',
        },
        {
            id: 2,
            nameKey: 'preview.demos.crm.leads.janeSmith.name',
            emailKey: 'preview.demos.crm.leads.janeSmith.email',
            phoneKey: 'preview.demos.crm.leads.janeSmith.phone',
            companyKey: 'preview.demos.crm.leads.janeSmith.company',
            status: 'Contacted',
            valueKey: 'preview.demos.crm.leads.janeSmith.value',
            notesKey: 'preview.demos.crm.leads.janeSmith.notes',
            lastActivityKey: 'preview.demos.crm.leads.janeSmith.lastActivity',
        },
        {
            id: 3,
            nameKey: 'preview.demos.crm.leads.bobJohnson.name',
            emailKey: 'preview.demos.crm.leads.bobJohnson.email',
            phoneKey: 'preview.demos.crm.leads.bobJohnson.phone',
            companyKey: 'preview.demos.crm.leads.bobJohnson.company',
            status: 'Qualified',
            valueKey: 'preview.demos.crm.leads.bobJohnson.value',
            notesKey: 'preview.demos.crm.leads.bobJohnson.notes',
            lastActivityKey: 'preview.demos.crm.leads.bobJohnson.lastActivity',
        },
        {
            id: 4,
            nameKey: 'preview.demos.crm.leads.aliceWilliams.name',
            emailKey: 'preview.demos.crm.leads.aliceWilliams.email',
            phoneKey: 'preview.demos.crm.leads.aliceWilliams.phone',
            companyKey: 'preview.demos.crm.leads.aliceWilliams.company',
            status: 'Lost',
            valueKey: 'preview.demos.crm.leads.aliceWilliams.value',
            notesKey: 'preview.demos.crm.leads.aliceWilliams.notes',
            lastActivityKey: 'preview.demos.crm.leads.aliceWilliams.lastActivity',
        },
    ];

    const handleLeadClick = (lead: LeadType) => {
        setSelectedLead(lead);
        setDetailsDrawerOpen(true);
    };

    const filteredLeads = filterStatus === 'All' ? sampleLeads : sampleLeads.filter((lead) => lead.status === filterStatus);

    const navDrawerContent = (
        <Box>
            <Toolbar>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {t('preview.demos.crm.brand')}
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

    const detailsDrawerContent = selectedLead && (
        <Box sx={{ width: isMobile ? '100%' : 400, p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {t('preview.demos.crm.drawer.title')}
                </Typography>
                <IconButton onClick={() => setDetailsDrawerOpen(false)} aria-label={t('preview.demos.crm.drawer.close')}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    {t(selectedLead.nameKey)}
                </Typography>
                <Chip label={t(`preview.demos.crm.filters.${selectedLead.status.toLowerCase()}`)} color={STATUS_COLORS[selectedLead.status]} size="small" />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {t('preview.demos.crm.drawer.contactInfo')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2">{t(selectedLead.emailKey)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="body2">{t(selectedLead.phoneKey)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon fontSize="small" color="action" />
                    <Typography variant="body2">{t(selectedLead.companyKey)}</Typography>
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {t('preview.demos.crm.drawer.dealValue')}
                </Typography>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                    {t(selectedLead.valueKey)}
                </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {t('preview.demos.crm.drawer.notes')}
                </Typography>
                <Typography variant="body2">{t(selectedLead.notesKey)}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {t('preview.demos.crm.drawer.activityTimeline')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {t('preview.demos.crm.drawer.lastActivity', { time: t(selectedLead.lastActivityKey) })}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                <Button variant="contained" fullWidth>
                    {t('preview.demos.crm.drawer.actions.sendEmail')}
                </Button>
                <Button variant="outlined" fullWidth>
                    {t('preview.demos.crm.drawer.actions.call')}
                </Button>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* AppBar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${navDrawerOpen ? DRAWER_WIDTH : 0}px)` },
                    ml: { md: `${navDrawerOpen ? DRAWER_WIDTH : 0}px` },
                }}
            >
                <Toolbar>
                    <IconButton color="inherit" aria-label={t('preview.demos.crm.openDrawer')} edge="start" onClick={() => setNavDrawerOpen(!navDrawerOpen)} sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {t('preview.demos.crm.title')}
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Navigation Drawer */}
            <Drawer
                variant={isMobile ? 'temporary' : 'persistent'}
                open={navDrawerOpen}
                onClose={() => setNavDrawerOpen(false)}
                sx={{
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                    },
                }}
            >
                {navDrawerContent}
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${navDrawerOpen ? DRAWER_WIDTH : 0}px)` },
                }}
            >
                <Toolbar />

                {/* Filters and Controls */}
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        {(['All', 'New', 'Contacted', 'Qualified', 'Lost'] as LeadStatusType[]).map((status) => (
                            <Chip
                                key={status}
                                label={t(`preview.demos.crm.filters.${status.toLowerCase()}`)}
                                onClick={() => setFilterStatus(status)}
                                color={filterStatus === status ? 'primary' : 'default'}
                                variant={filterStatus === status ? 'filled' : 'outlined'}
                            />
                        ))}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>{t('preview.demos.crm.sorting.label')}</InputLabel>
                            <Select value={sortBy} label={t('preview.demos.crm.sorting.label')} onChange={(e) => setSortBy(e.target.value)}>
                                <MenuItem value="name">{t('preview.demos.crm.sorting.name')}</MenuItem>
                                <MenuItem value="company">{t('preview.demos.crm.sorting.company')}</MenuItem>
                                <MenuItem value="value">{t('preview.demos.crm.sorting.value')}</MenuItem>
                            </Select>
                        </FormControl>

                        <ToggleButtonGroup
                            value={viewMode}
                            exclusive
                            onChange={(_, value) => {
                                if (value && (value === 'list' || value === 'grid')) {
                                    setViewMode(value as ViewModeType);
                                }
                            }}
                            size="small"
                        >
                            <ToggleButton value="list" aria-label={t('preview.demos.crm.views.list')}>
                                <ViewListIcon />
                            </ToggleButton>
                            <ToggleButton value="grid" aria-label={t('preview.demos.crm.views.grid')}>
                                <ViewModuleIcon />
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                </Box>

                {/* List View */}
                {viewMode === 'list' && (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t('preview.demos.crm.table.headers.name')}</TableCell>
                                    <TableCell>{t('preview.demos.crm.table.headers.company')}</TableCell>
                                    <TableCell>{t('preview.demos.crm.table.headers.email')}</TableCell>
                                    <TableCell>{t('preview.demos.crm.table.headers.status')}</TableCell>
                                    <TableCell>{t('preview.demos.crm.table.headers.value')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredLeads.map((lead) => (
                                    <TableRow
                                        key={lead.id}
                                        onClick={() => handleLeadClick(lead)}
                                        sx={{
                                            '&:hover': {
                                                bgcolor: 'action.hover',
                                                cursor: 'pointer',
                                            },
                                        }}
                                    >
                                        <TableCell>{t(lead.nameKey)}</TableCell>
                                        <TableCell>{t(lead.companyKey)}</TableCell>
                                        <TableCell>{t(lead.emailKey)}</TableCell>
                                        <TableCell>
                                            <Chip label={t(`preview.demos.crm.filters.${lead.status.toLowerCase()}`)} color={STATUS_COLORS[lead.status]} size="small" />
                                        </TableCell>
                                        <TableCell>{t(lead.valueKey)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Grid View */}
                {viewMode === 'grid' && (
                    <Grid container spacing={3}>
                        {filteredLeads.map((lead) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={lead.id}>
                                <Card
                                    onClick={() => handleLeadClick(lead)}
                                    sx={{
                                        height: '100%',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            boxShadow: 4,
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {t(lead.nameKey)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {t(lead.companyKey)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {t(lead.emailKey)}
                                        </Typography>
                                        <Box sx={{ mt: 2, mb: 1 }}>
                                            <Chip label={t(`preview.demos.crm.filters.${lead.status.toLowerCase()}`)} color={STATUS_COLORS[lead.status]} size="small" />
                                        </Box>
                                        <Typography variant="h6" color="primary">
                                            {t(lead.valueKey)}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small">{t('preview.demos.crm.drawer.actions.viewDetails')}</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>

            {/* Details Drawer */}
            <Drawer
                anchor="right"
                open={detailsDrawerOpen}
                onClose={() => setDetailsDrawerOpen(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: isMobile ? '100%' : 400,
                    },
                }}
            >
                {detailsDrawerContent}
            </Drawer>
        </Box>
    );
}
