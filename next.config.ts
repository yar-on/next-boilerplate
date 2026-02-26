/** @type {import('next').NextConfig} */

import bundleAnalyzer from '@next/bundle-analyzer';
import { type NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
    // Use Turbopack for faster local development (Next.js 15+)
    // To use: run `next dev --turbo`
    // Turbopack is now stable in Next.js 15

    // Strict mode helps identify potential problems
    reactStrictMode: true,

    // Standalone output for Docker deployment
    output: 'standalone',

    // Image optimization configuration
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            // Add your allowed image domains here
            // {
            //   protocol: 'https',
            //   hostname: 'example.com',
            //   port: '',
            //   pathname: '/images/**',
            // },
        ],
    },

    // Security headers
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                            "font-src 'self' https://fonts.gstatic.com",
                            "img-src 'self' data: https:",
                            "connect-src 'self'",
                            "frame-ancestors 'self'",
                            "base-uri 'self'",
                            "form-action 'self'",
                        ].join('; '),
                    },
                ],
            },
        ];
    },

    // Compiler options
    compiler: {
        // Remove ALL console logs in production (including error/warn)
        removeConsole: process.env.NODE_ENV === 'production' ? true : false,
    },

    // Experimental features for Next.js 15
    experimental: {
        // React 19 is now stable with Next.js 15
        // Add experimental features here as needed
    },

    // Redirect and rewrite examples
    // async redirects() {
    //   return [
    //     {
    //       source: '/old-path',
    //       destination: '/new-path',
    //       permanent: true,
    //     },
    //   ];
    // },

    // Environment variables exposed to the browser (prefix with NEXT_PUBLIC_)
    // are automatically included. Server-only variables should NOT be prefixed.
};

export default withNextIntl(withBundleAnalyzer(nextConfig));
