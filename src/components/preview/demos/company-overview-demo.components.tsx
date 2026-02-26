/**
 * Company Overview Demo Component
 *
 * Marketing landing page demo showcasing MUI components with:
 * - Scroll-spy navigation
 * - Hero section with CTA
 * - Stats section
 * - Content sections (Who We Are, Vision)
 * - Filterable portfolio grid
 * - Contact form
 * - Footer
 * - Fade-in animations on scroll
 * - Full i18n support (Hebrew/English)
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';

type PortfolioCategoryType = 'All' | 'Residential' | 'Commercial' | 'Public';

type PortfolioItemType = {
    id: number;
    titleKey: string;
    category: 'Residential' | 'Commercial' | 'Public';
    descriptionKey: string;
};

export function CompanyOverviewDemo() {
    const t = useTranslations();
    const [activeSection, setActiveSection] = useState('hero');
    const [filterCategory, setFilterCategory] = useState<PortfolioCategoryType>('All');
    const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

    const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

    // Portfolio items with translation keys
    const portfolioItems: PortfolioItemType[] = [
        {
            id: 1,
            titleKey: 'preview.demos.companyOverview.portfolio.items.modernVilla.title',
            category: 'Residential',
            descriptionKey: 'preview.demos.companyOverview.portfolio.items.modernVilla.description',
        },
        {
            id: 2,
            titleKey: 'preview.demos.companyOverview.portfolio.items.techOffice.title',
            category: 'Commercial',
            descriptionKey: 'preview.demos.companyOverview.portfolio.items.techOffice.description',
        },
        {
            id: 3,
            titleKey: 'preview.demos.companyOverview.portfolio.items.cityLibrary.title',
            category: 'Public',
            descriptionKey: 'preview.demos.companyOverview.portfolio.items.cityLibrary.description',
        },
        {
            id: 4,
            titleKey: 'preview.demos.companyOverview.portfolio.items.luxuryApt.title',
            category: 'Residential',
            descriptionKey: 'preview.demos.companyOverview.portfolio.items.luxuryApt.description',
        },
        {
            id: 5,
            titleKey: 'preview.demos.companyOverview.portfolio.items.retailCenter.title',
            category: 'Commercial',
            descriptionKey: 'preview.demos.companyOverview.portfolio.items.retailCenter.description',
        },
        {
            id: 6,
            titleKey: 'preview.demos.companyOverview.portfolio.items.communityPark.title',
            category: 'Public',
            descriptionKey: 'preview.demos.companyOverview.portfolio.items.communityPark.description',
        },
    ];

    const stats = [
        { value: t('preview.demos.companyOverview.stats.projectsValue'), label: t('preview.demos.companyOverview.stats.projects') },
        { value: t('preview.demos.companyOverview.stats.teamValue'), label: t('preview.demos.companyOverview.stats.team') },
        { value: t('preview.demos.companyOverview.stats.experienceValue'), label: t('preview.demos.companyOverview.stats.experience') },
        { value: t('preview.demos.companyOverview.stats.satisfactionValue'), label: t('preview.demos.companyOverview.stats.satisfaction') },
    ];

    // Scroll-spy: track which section is in viewport
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0,
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        Object.values(sectionRefs.current).forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    // Fade-in animations: track which sections have been seen
    useEffect(() => {
        const fadeObserverOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        };

        const fadeObserverCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setVisibleSections((prev) => new Set(prev).add(entry.target.id));
                }
            });
        };

        const fadeObserver = new IntersectionObserver(fadeObserverCallback, fadeObserverOptions);

        Object.values(sectionRefs.current).forEach((ref) => {
            if (ref) fadeObserver.observe(ref);
        });

        return () => fadeObserver.disconnect();
    }, []);

    const handleNavClick = (sectionId: string) => {
        const element = sectionRefs.current[sectionId];
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const filteredPortfolio = filterCategory === 'All' ? portfolioItems : portfolioItems.filter((item) => item.category === filterCategory);

    const sectionStyle = (sectionId: string) => ({
        opacity: visibleSections.has(sectionId) ? 1 : 0,
        transform: visibleSections.has(sectionId) ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
    });

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
            {/* Navigation AppBar */}
            <AppBar position="fixed" elevation={1}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
                        {t('preview.demos.companyOverview.brand')}
                    </Typography>
                    {['hero', 'stats', 'about', 'portfolio', 'contact'].map((section) => (
                        <Link
                            key={section}
                            component="button"
                            onClick={() => handleNavClick(section)}
                            sx={{
                                mx: 1,
                                color: activeSection === section ? 'secondary.main' : 'inherit',
                                textDecoration: 'none',
                                fontWeight: activeSection === section ? 600 : 400,
                                '&:hover': {
                                    color: 'secondary.main',
                                },
                            }}
                        >
                            {t(`preview.demos.companyOverview.nav.${section}`)}
                        </Link>
                    ))}
                </Toolbar>
            </AppBar>

            {/* Hero Section */}
            <Box
                id="hero"
                ref={(el) => {
                    sectionRefs.current.hero = el as HTMLElement | null;
                }}
                sx={{
                    ...sectionStyle('hero'),
                    minHeight: '500px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    textAlign: 'center',
                    py: 8,
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
                        {t('preview.demos.companyOverview.hero.title')}
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                        {t('preview.demos.companyOverview.hero.subtitle')}
                    </Typography>
                    <Button variant="contained" color="secondary" size="large">
                        {t('preview.demos.companyOverview.hero.cta')}
                    </Button>
                </Container>
            </Box>

            {/* Stats Section */}
            <Box
                id="stats"
                ref={(el) => {
                    sectionRefs.current.stats = el as HTMLElement | null;
                }}
                sx={{ ...sectionStyle('stats'), py: 8, bgcolor: 'background.paper' }}
            >
                <Container>
                    <Grid container spacing={4}>
                        {stats.map((stat, index) => (
                            <Grid size={{ xs: 6, md: 3 }} key={index}>
                                <Card elevation={3} sx={{ textAlign: 'center', py: 3 }}>
                                    <CardContent>
                                        <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            {stat.label}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* About Section - Who We Are */}
            <Box
                id="about"
                ref={(el) => {
                    sectionRefs.current.about = el as HTMLElement | null;
                }}
                sx={{ ...sectionStyle('about'), py: 8 }}
            >
                <Container>
                    <Grid container spacing={4} alignItems="center">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
                                {t('preview.demos.companyOverview.about.whoWeAre')}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {t('preview.demos.companyOverview.about.whoWeAreDesc1')}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {t('preview.demos.companyOverview.about.whoWeAreDesc2')}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box
                                sx={{
                                    height: 300,
                                    bgcolor: 'action.hover',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 2,
                                }}
                            >
                                <Typography variant="h6" color="text.secondary">
                                    {t('preview.demos.companyOverview.about.imagePlaceholder')}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 6 }} />

                    {/* Vision Section */}
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
                            {t('preview.demos.companyOverview.about.vision')}
                        </Typography>
                        <Typography variant="body1" sx={{ maxWidth: 800, mx: 'auto' }}>
                            {t('preview.demos.companyOverview.about.visionDesc')}
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* Portfolio Section */}
            <Box
                id="portfolio"
                ref={(el) => {
                    sectionRefs.current.portfolio = el as HTMLElement | null;
                }}
                sx={{ ...sectionStyle('portfolio'), py: 8, bgcolor: 'background.paper' }}
            >
                <Container>
                    <Typography variant="h3" gutterBottom sx={{ fontWeight: 600, textAlign: 'center' }}>
                        {t('preview.demos.companyOverview.portfolio.title')}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
                        {t('preview.demos.companyOverview.portfolio.subtitle')}
                    </Typography>

                    {/* Filter Chips */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 4, flexWrap: 'wrap' }}>
                        {(['All', 'Residential', 'Commercial', 'Public'] as PortfolioCategoryType[]).map((category) => (
                            <Chip
                                key={category}
                                label={t(`preview.demos.companyOverview.portfolio.filter.${category.toLowerCase()}`)}
                                onClick={() => setFilterCategory(category)}
                                color={filterCategory === category ? 'primary' : 'default'}
                                variant={filterCategory === category ? 'filled' : 'outlined'}
                            />
                        ))}
                    </Box>

                    {/* Portfolio Grid */}
                    <Grid container spacing={3}>
                        {filteredPortfolio.map((item) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                                <Card sx={{ height: '100%' }}>
                                    <CardMedia
                                        sx={{
                                            height: 200,
                                            bgcolor: 'action.hover',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Typography variant="body2" color="text.secondary">
                                            [{item.category}]
                                        </Typography>
                                    </CardMedia>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {t(item.titleKey)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {t(item.descriptionKey)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Contact Section */}
            <Box
                id="contact"
                ref={(el) => {
                    sectionRefs.current.contact = el as HTMLElement | null;
                }}
                sx={{ ...sectionStyle('contact'), py: 8 }}
            >
                <Container maxWidth="md">
                    <Typography variant="h3" gutterBottom sx={{ fontWeight: 600, textAlign: 'center' }}>
                        {t('preview.demos.companyOverview.contact.title')}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
                        {t('preview.demos.companyOverview.contact.subtitle')}
                    </Typography>

                    <Box component="form" sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField fullWidth label={t('preview.demos.companyOverview.contact.form.firstName')} variant="outlined" />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField fullWidth label={t('preview.demos.companyOverview.contact.form.lastName')} variant="outlined" />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField fullWidth label={t('preview.demos.companyOverview.contact.form.email')} type="email" variant="outlined" />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField fullWidth label={t('preview.demos.companyOverview.contact.form.message')} multiline rows={4} variant="outlined" />
                            </Grid>
                            <Grid size={{ xs: 12 }} sx={{ textAlign: 'center' }}>
                                <Button variant="contained" size="large" color="primary">
                                    {t('preview.demos.companyOverview.contact.form.submit')}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </Box>

            {/* Footer */}
            <Box
                sx={{
                    py: 4,
                    bgcolor: 'primary.dark',
                    color: 'primary.contrastText',
                }}
            >
                <Container>
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                {t('preview.demos.companyOverview.footer.brand')}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                {t('preview.demos.companyOverview.footer.tagline')}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                {t('preview.demos.companyOverview.footer.quickLinks')}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Link component="button" color="inherit" sx={{ textAlign: 'start', opacity: 0.8 }}>
                                    {t('preview.demos.companyOverview.footer.aboutUs')}
                                </Link>
                                <Link component="button" color="inherit" sx={{ textAlign: 'start', opacity: 0.8 }}>
                                    {t('preview.demos.companyOverview.footer.services')}
                                </Link>
                                <Link component="button" color="inherit" sx={{ textAlign: 'start', opacity: 0.8 }}>
                                    {t('preview.demos.companyOverview.footer.portfolio')}
                                </Link>
                                <Link component="button" color="inherit" sx={{ textAlign: 'start', opacity: 0.8 }}>
                                    {t('preview.demos.companyOverview.footer.contact')}
                                </Link>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                {t('preview.demos.companyOverview.footer.contactInfo')}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                {t('preview.demos.companyOverview.footer.email')}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                {t('preview.demos.companyOverview.footer.phone')}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                    <Typography variant="body2" sx={{ textAlign: 'center', opacity: 0.6 }}>
                        {t('preview.demos.companyOverview.footer.copyright')}
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
}
