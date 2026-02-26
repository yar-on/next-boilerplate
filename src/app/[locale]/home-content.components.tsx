'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import CheckCircle from '@mui/icons-material/CheckCircle';

type ServerDataType = {
    timestamp: string;
    environment: string;
    nodeVersion: string;
    platform: string;
};

type HomeContentPropsType = {
    title: string;
    description: string;
    featuresTitle: string;
    featureItems: string[];
    apiRoutesTitle: string;
    apiRoutesDescription: string;
    documentationTitle: string;
    documentationDescription: string;
    footerText: string;
    serverData: ServerDataType;
    renderedAt: string;
    serverInfoLabels: {
        title: string;
        timestamp: string;
        environment: string;
        nodeVersion: string;
        platform: string;
    };
};

const cardHoverSx = {
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 6,
    },
} as const;

export function HomeContent({
    title,
    description,
    featuresTitle,
    featureItems,
    apiRoutesTitle,
    apiRoutesDescription,
    documentationTitle,
    documentationDescription,
    footerText,
    serverData,
    renderedAt,
    serverInfoLabels,
}: HomeContentPropsType) {
    const serverInfoItems = [
        { label: serverInfoLabels.timestamp, value: renderedAt },
        { label: serverInfoLabels.environment, value: serverData.environment },
        { label: serverInfoLabels.nodeVersion, value: serverData.nodeVersion },
        { label: serverInfoLabels.platform, value: serverData.platform },
    ];

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box
                component="main"
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: { xs: 2, md: 4 },
                }}
            >
                <Typography
                    variant="h1"
                    sx={{
                        textAlign: 'center',
                        mb: 2,
                        fontSize: { xs: '2rem', md: '3rem' },
                        fontWeight: 700,
                        lineHeight: 1.2,
                    }}
                >
                    {title.includes('Next.js 15') ? (
                        <>
                            {title.split('Next.js 15')[0]}
                            <Box
                                component="span"
                                sx={{
                                    background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Next.js 15
                            </Box>
                            {title.split('Next.js 15')[1]}
                        </>
                    ) : (
                        title
                    )}
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{
                        textAlign: 'center',
                        maxWidth: 600,
                        mb: 6,
                        fontSize: { xs: '1rem', md: '1.25rem' },
                    }}
                >
                    {description}
                </Typography>

                <Container maxWidth="lg" disableGutters>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(auto-fit, minmax(300px, 1fr))',
                            },
                            gap: 3,
                        }}
                    >
                        {/* Server Info Card */}
                        <Card sx={cardHoverSx}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    {serverInfoLabels.title}
                                </Typography>
                                {serverInfoItems.map((item) => (
                                    <Box
                                        key={item.label}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            p: 1,
                                            mb: 1,
                                            bgcolor: 'action.hover',
                                            borderRadius: 1,
                                        }}
                                    >
                                        <Typography variant="body2" fontWeight={600}>
                                            {item.label}:
                                        </Typography>
                                        <Typography variant="body2" color="primary" sx={{ fontFamily: 'monospace' }}>
                                            {item.value}
                                        </Typography>
                                    </Box>
                                ))}
                                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', mt: 2, display: 'block' }}>
                                    This data was fetched on the server and rendered as HTML
                                </Typography>
                            </CardContent>
                        </Card>

                        {/* Features Card */}
                        <Card sx={cardHoverSx}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    {featuresTitle}
                                </Typography>
                                <List dense disablePadding>
                                    {featureItems.map((item) => (
                                        <ListItem key={item} disableGutters sx={{ py: 0.5 }}>
                                            <ListItemIcon sx={{ minWidth: 32 }}>
                                                <CheckCircle color="success" fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText primary={item} primaryTypographyProps={{ color: 'text.secondary' }} />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>

                        {/* API Routes Card */}
                        <Card component="a" href="/api/hello" target="_blank" rel="noopener noreferrer" sx={{ textDecoration: 'none', color: 'inherit', ...cardHoverSx }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    {apiRoutesTitle}
                                </Typography>
                                <Typography color="text.secondary">{apiRoutesDescription}</Typography>
                            </CardContent>
                        </Card>

                        {/* Documentation Card */}
                        <Card
                            component="a"
                            href="https://nextjs.org/docs"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ textDecoration: 'none', color: 'inherit', ...cardHoverSx }}
                        >
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    {documentationTitle}
                                </Typography>
                                <Typography color="text.secondary">{documentationDescription}</Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Container>
            </Box>

            <Divider />
            <Box component="footer" sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">{footerText}</Typography>
            </Box>
        </Box>
    );
}
