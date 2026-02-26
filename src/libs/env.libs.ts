/**
 * Environment variable validation using Zod
 * This ensures type-safety and validation for environment variables
 */

import { z } from 'zod';

// Define the schema for environment variables
const envSchema = z.object({
    // Node environment
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    NODE_VERSION: z.string(),
    NODE_PLATFORM: z.string(),

    // Public environment variables (exposed to browser)
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),

    // Internationalization (i18n)
    DEFAULT_LOCALE: z.enum(['en', 'he']).default('en'),
    SUPPORTED_LOCALES: z.string().default('en,he'),

    // Server-only environment variables
    // Add your server-side envLibs vars here
    DATABASE_URL: z
        .string()
        .url()
        .refine((url) => url.startsWith('postgresql://') || url.startsWith('postgres://'), { message: 'DATABASE_URL must be a valid PostgreSQL connection string' }),
    API_SECRET_KEY: z.string().optional(),
});

// Parse and validate environment variables
const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    NODE_VERSION: process.version,
    NODE_PLATFORM: process.platform,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    DEFAULT_LOCALE: process.env.DEFAULT_LOCALE,
    SUPPORTED_LOCALES: process.env.SUPPORTED_LOCALES,
    DATABASE_URL: process.env.DATABASE_URL,
    API_SECRET_KEY: process.env.API_SECRET_KEY,
};

// Validate and export typed environment variables
export const Env = envSchema.parse(envVars);

// Type-safe environment variable access
export type EnvType = z.infer<typeof envSchema>;
