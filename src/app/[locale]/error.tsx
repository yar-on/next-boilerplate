'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { logger } from '@/utils/logger/logger.utils';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    const t = useTranslations();

    useEffect(() => {
        void logger.error({ message: 'Unhandled page error', error });
    }, [error]);

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>{t('common.error')}</h2>
            <p>{error.message || 'Something went wrong!'}</p>
            <button onClick={() => reset()}>Try again</button>
        </div>
    );
}
