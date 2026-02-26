/**
 * Components Tab
 *
 * Comprehensive showcase of MUI components with the current theme applied.
 * Organized by category for easy navigation.
 */

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Pagination from '@mui/material/Pagination';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PreviewNavigation } from '@/components/preview/preview-navigation.components';

type SectionPropsType = {
    title: string;
    children: React.ReactNode;
};

function Section({ title, children }: SectionPropsType) {
    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                {title}
            </Typography>
            {children}
        </Box>
    );
}

// Touch target sizing constant for accessibility (44x44px minimum)
const touchTargetSx = {
    minWidth: 44,
    minHeight: 44,
};

export function ComponentsTab() {
    const t = useTranslations();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectValue, setSelectValue] = useState('option1');
    const [sliderValue, setSliderValue] = useState(30);
    const [tabValue, setTabValue] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);

    return (
        <Box sx={{ width: '100%', padding: 0 }}>
            <Box sx={{ position: 'sticky' }} id={'sticky-navigation'}>
                <PreviewNavigation />
            </Box>
            <Box sx={{ maxWidth: 1200, mx: 'auto', marginTop: '1em' }}>
                {/* Typography Section */}
                <Section title={t('preview.components.sections.typography')}>
                    <Grid container spacing={3}>
                        {/* Headings in a more readable vertical format */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {(
                                    [
                                        { variant: 'h1', label: 'h1' },
                                        { variant: 'h2', label: 'h2' },
                                        { variant: 'h3', label: 'h3' },
                                        { variant: 'h4', label: 'h4' },
                                        { variant: 'h5', label: 'h5' },
                                        { variant: 'h6', label: 'h6' },
                                    ] as const
                                ).map(({ variant, label }) => (
                                    <Box key={variant} sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                minWidth: 32,
                                                color: 'text.secondary',
                                                fontFamily: 'monospace',
                                            }}
                                        >
                                            {label}
                                        </Typography>
                                        <Typography variant={variant}>{t(`preview.typography.heading${label.slice(1)}`)}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Grid>

                        {/* Body text examples */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                                        {t('preview.typography.body1')}
                                    </Typography>
                                    <Typography variant="body1">{t('preview.typography.bodyText')}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                                        {t('preview.typography.body2')}
                                    </Typography>
                                    <Typography variant="body2">{t('preview.typography.bodyText')}</Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Section>

                <Divider sx={{ my: 4 }} />

                {/* Buttons Section */}
                <Section title={t('preview.components.sections.buttons')}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* Contained Buttons */}
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                {t('preview.components.buttons.contained')}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                <Button variant="contained" color="primary">
                                    {t('preview.colors.labels.primary')}
                                </Button>
                                <Button variant="contained" color="secondary">
                                    {t('preview.colors.labels.secondary')}
                                </Button>
                                <Button variant="contained" color="success">
                                    {t('preview.colors.labels.success')}
                                </Button>
                                <Button variant="contained" color="error">
                                    {t('preview.colors.labels.error')}
                                </Button>
                                <Button variant="contained" color="warning">
                                    {t('preview.colors.labels.warning')}
                                </Button>
                                <Button variant="contained" color="info">
                                    {t('preview.colors.labels.info')}
                                </Button>
                            </Box>
                        </Box>

                        {/* Outlined Buttons */}
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                {t('preview.components.buttons.outlined')}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                <Button variant="outlined" color="primary">
                                    {t('preview.colors.labels.primary')}
                                </Button>
                                <Button variant="outlined" color="secondary">
                                    {t('preview.colors.labels.secondary')}
                                </Button>
                                <Button variant="outlined" color="success">
                                    {t('preview.colors.labels.success')}
                                </Button>
                                <Button variant="outlined" color="error">
                                    {t('preview.colors.labels.error')}
                                </Button>
                                <Button variant="outlined" color="warning">
                                    {t('preview.colors.labels.warning')}
                                </Button>
                                <Button variant="outlined" color="info">
                                    {t('preview.colors.labels.info')}
                                </Button>
                            </Box>
                        </Box>

                        {/* Text Buttons */}
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                {t('preview.components.buttons.text')}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                <Button variant="text" color="primary">
                                    {t('preview.colors.labels.primary')}
                                </Button>
                                <Button variant="text" color="secondary">
                                    {t('preview.colors.labels.secondary')}
                                </Button>
                                <Button variant="text" color="success">
                                    {t('preview.colors.labels.success')}
                                </Button>
                                <Button variant="text" color="error">
                                    {t('preview.colors.labels.error')}
                                </Button>
                                <Button variant="text" color="warning">
                                    {t('preview.colors.labels.warning')}
                                </Button>
                                <Button variant="text" color="info">
                                    {t('preview.colors.labels.info')}
                                </Button>
                            </Box>
                        </Box>

                        {/* Loading Buttons */}
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                {t('preview.components.buttons.loadingStates')}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                <Button
                                    loading={isLoading}
                                    variant="contained"
                                    onClick={() => {
                                        setIsLoading(true);
                                        setTimeout(() => setIsLoading(false), 2000);
                                    }}
                                >
                                    {t('preview.components.buttons.clickToLoad')}
                                </Button>
                                <Button loading loadingPosition="start" startIcon={<SaveIcon />} variant="outlined">
                                    {t('preview.components.buttons.saving')}
                                </Button>
                                <Button loading variant="outlined">
                                    {t('preview.components.buttons.loading')}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Section>

                <Divider sx={{ my: 4 }} />

                {/* Form Inputs Section */}
                <Section title={t('preview.components.sections.formInputs')}>
                    <Grid container spacing={3}>
                        {/* TextFields */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField label={t('preview.components.formInputs.outlined')} variant="outlined" fullWidth />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField label={t('preview.components.formInputs.filled')} variant="filled" fullWidth />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField label={t('preview.components.formInputs.standard')} variant="standard" fullWidth />
                        </Grid>

                        {/* Validation States */}
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                                {t('preview.components.formInputs.validationStates')}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                label={t('preview.components.formInputs.email')}
                                variant="outlined"
                                fullWidth
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setEmailError(!e.target.value.includes('@'));
                                }}
                                error={emailError && email.length > 0}
                                helperText={emailError && email.length > 0 ? t('preview.components.formInputs.emailError') : t('preview.components.formInputs.emailHelper')}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                label={t('preview.components.formInputs.errorState')}
                                variant="outlined"
                                fullWidth
                                error
                                helperText={t('preview.components.formInputs.errorHelper')}
                                value={t('preview.components.formInputs.errorValue')}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                label={t('preview.components.formInputs.successState')}
                                variant="outlined"
                                fullWidth
                                color="success"
                                helperText={t('preview.components.formInputs.successHelper')}
                                value={t('preview.components.formInputs.successValue')}
                                focused
                            />
                        </Grid>

                        {/* Select */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel>{t('preview.components.formInputs.selectExample')}</InputLabel>
                                <Select value={selectValue} label={t('preview.components.formInputs.selectExample')} onChange={(e) => setSelectValue(e.target.value)}>
                                    <MenuItem value="option1">{t('preview.components.formInputs.option', { number: '1' })}</MenuItem>
                                    <MenuItem value="option2">{t('preview.components.formInputs.option', { number: '2' })}</MenuItem>
                                    <MenuItem value="option3">{t('preview.components.formInputs.option', { number: '3' })}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Checkboxes */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                    {t('preview.components.formInputs.checkboxes')}
                                </Typography>
                                <FormControlLabel control={<Checkbox defaultChecked />} label={t('preview.components.formInputs.checked')} />
                                <FormControlLabel control={<Checkbox />} label={t('preview.components.formInputs.unchecked')} />
                                <FormControlLabel control={<Checkbox disabled />} label={t('preview.components.formInputs.disabled')} />
                            </Box>
                        </Grid>

                        {/* Radio Buttons */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                    {t('preview.components.formInputs.radioButtons')}
                                </Typography>
                                <RadioGroup defaultValue="option1">
                                    <FormControlLabel value="option1" control={<Radio />} label={t('preview.components.formInputs.option', { number: '1' })} />
                                    <FormControlLabel value="option2" control={<Radio />} label={t('preview.components.formInputs.option', { number: '2' })} />
                                    <FormControlLabel value="option3" control={<Radio />} label={t('preview.components.formInputs.option', { number: '3' })} />
                                </RadioGroup>
                            </Box>
                        </Grid>

                        {/* Switches */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                    {t('preview.components.formInputs.switches')}
                                </Typography>
                                <FormControlLabel control={<Switch defaultChecked />} label={t('preview.components.formInputs.checked')} />
                                <FormControlLabel control={<Switch />} label={t('preview.components.formInputs.unchecked')} />
                                <FormControlLabel control={<Switch disabled />} label={t('preview.components.formInputs.disabled')} />
                            </Box>
                        </Grid>

                        {/* Slider */}
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                {t('preview.components.formInputs.slider', { value: sliderValue })}
                            </Typography>
                            <Slider
                                value={sliderValue}
                                onChange={(_, value) => setSliderValue(value)}
                                min={0}
                                max={100}
                                marks={[
                                    { value: 0, label: '0' },
                                    { value: 50, label: '50' },
                                    { value: 100, label: '100' },
                                ]}
                            />
                        </Grid>
                    </Grid>
                </Section>

                <Divider sx={{ my: 4 }} />

                {/* Chips Section */}
                <Section title={t('preview.components.sections.chips')}>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label={t('preview.components.chips.default')} />
                        <Chip label={t('preview.colors.labels.primary')} color="primary" />
                        <Chip label={t('preview.colors.labels.secondary')} color="secondary" />
                        <Chip label={t('preview.colors.labels.success')} color="success" />
                        <Chip label={t('preview.colors.labels.error')} color="error" />
                        <Chip label={t('preview.colors.labels.warning')} color="warning" />
                        <Chip label={t('preview.colors.labels.info')} color="info" />
                        <Chip label={t('preview.components.chips.clickable')} onClick={() => {}} />
                        <Chip label={t('preview.components.chips.deletable')} onDelete={() => {}} />
                    </Box>
                </Section>

                <Divider sx={{ my: 4 }} />

                {/* Alerts Section */}
                <Section title={t('preview.components.sections.alerts')}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Alert severity="error">{t('preview.components.alerts.error')}</Alert>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Alert severity="warning">{t('preview.components.alerts.warning')}</Alert>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Alert severity="info">{t('preview.components.alerts.info')}</Alert>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Alert severity="success">{t('preview.components.alerts.success')}</Alert>
                        </Grid>
                    </Grid>

                    {/* Optional: Add variant examples */}
                    <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
                        {t('preview.components.alerts.filledVariants')}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Alert severity="error" variant="filled">
                                {t('preview.components.alerts.filledError')}
                            </Alert>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Alert severity="success" variant="filled">
                                {t('preview.components.alerts.filledSuccess')}
                            </Alert>
                        </Grid>
                    </Grid>
                </Section>

                <Divider sx={{ my: 4 }} />

                {/* Cards & Papers Section */}
                <Section title={t('preview.components.sections.cardsPapers')}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card sx={{ bgcolor: 'background.paper' }}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {t('preview.components.cards.title')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('preview.components.cards.description')}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small">{t('preview.components.cards.learnMore')}</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper elevation={3} sx={{ p: 2, bgcolor: 'background.paper' }}>
                                <Typography variant="h6" gutterBottom>
                                    {t('preview.components.cards.paperTitle')}
                                </Typography>
                                <Typography variant="body2">{t('preview.components.cards.paperDescription')}</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Section>

                <Divider sx={{ my: 4 }} />

                {/* Avatars Section */}
                <Section title={t('preview.components.sections.avatars')}>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                        <Avatar>A</Avatar>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>B</Avatar>
                        <Avatar sx={{ bgcolor: 'success.main' }}>C</Avatar>
                        <Avatar sx={{ width: 56, height: 56 }}>L</Avatar>
                        <AvatarGroup max={4}>
                            <Avatar alt="User 1">U1</Avatar>
                            <Avatar alt="User 2">U2</Avatar>
                            <Avatar alt="User 3">U3</Avatar>
                            <Avatar alt="User 4">U4</Avatar>
                            <Avatar alt="User 5">U5</Avatar>
                        </AvatarGroup>
                    </Box>
                </Section>

                <Divider sx={{ my: 4 }} />

                {/* Table Section */}
                <Section title={t('preview.components.sections.table')}>
                    <Box
                        sx={{
                            width: '100%',
                            overflowX: 'auto',
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                bottom: 0,
                                width: 24,
                                background: (theme) => `linear-gradient(to right, transparent, ${theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff'})`,
                                pointerEvents: 'none',
                                display: { xs: 'block', md: 'none' },
                            },
                        }}
                    >
                        <TableContainer component={Paper} sx={{ minWidth: 500, bgcolor: 'background.paper' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ minWidth: 120 }}>{t('preview.components.table.name')}</TableCell>
                                        <TableCell sx={{ minWidth: 100 }}>{t('preview.components.table.role')}</TableCell>
                                        <TableCell sx={{ minWidth: 80 }}>{t('preview.components.table.status')}</TableCell>
                                        <TableCell align="right" sx={{ minWidth: 80 }}>
                                            {t('preview.components.table.actions')}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{t('preview.components.table.rows.johnDoe')}</TableCell>
                                        <TableCell>{t('preview.components.table.rows.developer')}</TableCell>
                                        <TableCell>
                                            <Chip label={t('preview.components.table.active')} color="success" size="small" />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button size="small">{t('preview.components.table.edit')}</Button>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>{t('preview.components.table.rows.janeSmith')}</TableCell>
                                        <TableCell>{t('preview.components.table.rows.designer')}</TableCell>
                                        <TableCell>
                                            <Chip label={t('preview.components.table.active')} color="success" size="small" />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button size="small">{t('preview.components.table.edit')}</Button>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>{t('preview.components.table.rows.bobJohnson')}</TableCell>
                                        <TableCell>{t('preview.components.table.rows.manager')}</TableCell>
                                        <TableCell>
                                            <Chip label={t('preview.components.table.away')} color="warning" size="small" />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button size="small">{t('preview.components.table.edit')}</Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Section>

                <Divider sx={{ my: 4 }} />

                {/* Dialog Section */}
                <Section title={t('preview.components.sections.dialog')}>
                    <Button variant="contained" onClick={() => setDialogOpen(true)}>
                        {t('preview.components.dialog.openButton')}
                    </Button>
                    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} aria-labelledby="dialog-title" aria-describedby="dialog-description">
                        <DialogTitle id="dialog-title" sx={{ m: 0, p: 2, pr: 6 }}>
                            {t('preview.components.dialog.title')}
                            <IconButton
                                aria-label={t('preview.components.dialog.closeAriaLabel')}
                                onClick={() => setDialogOpen(false)}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent id="dialog-description">
                            <Typography>{t('preview.components.dialog.description')}</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDialogOpen(false)}>{t('buttons.cancel')}</Button>
                            <Button onClick={() => setDialogOpen(false)} variant="contained">
                                {t('preview.components.dialog.confirm')}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Section>

                <Divider sx={{ my: 4 }} />

                {/* Tabs Section */}
                <Section title={t('preview.components.sections.tabs')}>
                    <Paper>
                        <Tabs
                            value={tabValue}
                            onChange={(_, value) => {
                                if (typeof value === 'number') {
                                    setTabValue(value);
                                }
                            }}
                        >
                            <Tab label={t('preview.components.tabs.tabOne')} />
                            <Tab label={t('preview.components.tabs.tabTwo')} />
                            <Tab label={t('preview.components.tabs.tabThree')} />
                        </Tabs>
                        <Box sx={{ p: 2 }}>
                            {tabValue === 0 && <Typography>{t('preview.components.tabs.contentOne')}</Typography>}
                            {tabValue === 1 && <Typography>{t('preview.components.tabs.contentTwo')}</Typography>}
                            {tabValue === 2 && <Typography>{t('preview.components.tabs.contentThree')}</Typography>}
                        </Box>
                    </Paper>
                </Section>

                <Divider sx={{ my: 4 }} />

                {/* Accordion Section */}
                <Section title={t('preview.components.sections.accordion')}>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>{t('preview.components.accordion.accordion1')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>{t('preview.components.accordion.content1')}</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>{t('preview.components.accordion.accordion2')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>{t('preview.components.accordion.content2')}</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>{t('preview.components.accordion.accordion3')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>{t('preview.components.accordion.content3')}</Typography>
                        </AccordionDetails>
                    </Accordion>
                </Section>

                <Divider sx={{ my: 4 }} />

                {/* Progress Indicators Section */}
                <Section title={t('preview.components.sections.progress')}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                {t('preview.components.progress.linear')}
                            </Typography>
                            <LinearProgress variant="determinate" value={50} sx={{ mb: 2 }} />
                            <LinearProgress sx={{ mb: 2 }} />
                            <LinearProgress color="secondary" sx={{ mb: 2 }} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                {t('preview.components.progress.circular')}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <CircularProgress />
                                <CircularProgress color="secondary" />
                                <CircularProgress variant="determinate" value={75} />
                            </Box>
                        </Grid>
                    </Grid>
                </Section>

                <Divider sx={{ my: 4 }} />

                {/* Tooltip Section */}
                <Section title={t('preview.components.sections.tooltips')}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Tooltip title={t('preview.components.tooltips.tooltip')}>
                            <Button variant="contained" sx={touchTargetSx}>
                                {t('preview.components.tooltips.hoverMe')}
                            </Button>
                        </Tooltip>
                        <Tooltip title={t('preview.components.tooltips.tooltipTop')} placement="top">
                            <Button variant="outlined" sx={{ ...touchTargetSx, px: 2 }}>
                                {t('preview.components.tooltips.top')}
                            </Button>
                        </Tooltip>
                        <Tooltip title={t('preview.components.tooltips.tooltipRight')} placement="right">
                            <Button variant="outlined" sx={{ ...touchTargetSx, px: 2 }}>
                                {t('preview.components.tooltips.right')}
                            </Button>
                        </Tooltip>
                        <Tooltip title={t('preview.components.tooltips.tooltipBottom')} placement="bottom">
                            <Button variant="outlined" sx={{ ...touchTargetSx, px: 2 }}>
                                {t('preview.components.tooltips.bottom')}
                            </Button>
                        </Tooltip>
                        <Tooltip title={t('preview.components.tooltips.tooltipLeft')} placement="left">
                            <Button variant="outlined" sx={{ ...touchTargetSx, px: 2 }}>
                                {t('preview.components.tooltips.left')}
                            </Button>
                        </Tooltip>
                    </Box>
                </Section>

                <Divider sx={{ my: 4 }} />

                {/* Breadcrumbs Section */}
                <Section title={t('preview.components.sections.breadcrumbs')}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link underline="hover" color="inherit" href="#">
                            {t('preview.components.breadcrumbs.home')}
                        </Link>
                        <Link underline="hover" color="inherit" href="#">
                            {t('preview.components.breadcrumbs.category')}
                        </Link>
                        <Typography color="text.primary">{t('preview.components.breadcrumbs.currentPage')}</Typography>
                    </Breadcrumbs>
                </Section>

                <Divider sx={{ my: 4 }} />

                {/* Pagination Section */}
                <Section title={t('preview.components.sections.pagination')}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Pagination
                            count={10}
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    minWidth: { xs: 36, sm: 32 },
                                    minHeight: { xs: 36, sm: 32 },
                                },
                            }}
                        />
                        <Pagination
                            count={10}
                            color="primary"
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    minWidth: { xs: 36, sm: 32 },
                                    minHeight: { xs: 36, sm: 32 },
                                },
                            }}
                        />
                        <Pagination
                            count={10}
                            color="secondary"
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    minWidth: { xs: 36, sm: 32 },
                                    minHeight: { xs: 36, sm: 32 },
                                },
                            }}
                        />
                        <Pagination
                            count={10}
                            variant="outlined"
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    minWidth: { xs: 36, sm: 32 },
                                    minHeight: { xs: 36, sm: 32 },
                                },
                            }}
                        />
                    </Box>
                </Section>
            </Box>
        </Box>
    );
}
