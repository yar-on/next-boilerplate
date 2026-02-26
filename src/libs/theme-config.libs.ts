import fs from 'node:fs';
import path from 'node:path';
import { PreviewThemeValidation } from '@/validations/preview-theme.validations';
import type { PreviewThemeConfigType } from '@/types/preview.types';
import { logger } from '@/utils/logger/logger.server.utils';

const CONFIG_FILE = 'theme-config.json';

let cachedConfig: PreviewThemeConfigType | null | undefined;

/**
 * Loads and validates theme-config.json from the project root.
 * Returns null if the file doesn't exist or is invalid.
 * Caches the result in production; re-reads on every call in development.
 */
export function loadThemeConfig(): PreviewThemeConfigType | null {
    if (cachedConfig !== undefined && process.env.NODE_ENV === 'production') {
        return cachedConfig;
    }

    const filePath = path.join(process.cwd(), CONFIG_FILE);

    if (!fs.existsSync(filePath)) {
        cachedConfig = null;
        return null;
    }

    try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const json: unknown = JSON.parse(raw);
        const result = PreviewThemeValidation.safeParse(json);

        if (!result.success) {
            void logger.warn({ message: `Invalid ${CONFIG_FILE}`, context: { issues: result.error.issues.map((i) => i.message) } });
            cachedConfig = null;
            return null;
        }

        cachedConfig = result.data;
        return result.data;
    } catch (error) {
        void logger.warn({ message: `Failed to read ${CONFIG_FILE}`, error });
        cachedConfig = null;
        return null;
    }
}
