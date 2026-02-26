import { locales } from '@/i18n/config';
import type { Viewport } from 'next';

// Viewport configuration (Next.js 15+)
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
};

// Minimal root layout - all locale-specific content is in [locale]/layout.tsx
export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
