/**
 * ServerInfo Component
 * Displays server-side rendered data demonstrating SSR capabilities
 */

import { getTranslations, getLocale } from 'next-intl/server';
import { formatDate } from '@/utils/locale-formatter.utils';
import styles from './server-info.module.css';

interface ServerData {
    timestamp: string;
    environment: string;
    nodeVersion: string;
    platform: string;
}

interface ServerInfoProps {
    data: ServerData;
}

export async function ServerInfo({ data }: ServerInfoProps) {
    const locale = await getLocale();
    const t = await getTranslations('components.serverInfo');

    const renderedAt = formatDate(new Date(data.timestamp), locale, {
        dateStyle: 'medium',
        timeStyle: 'medium',
    });

    return (
        <div className={styles.card}>
            <h2>{t('title')}</h2>
            <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                    <span className={styles.label}>{t('timestamp')}:</span>
                    <span className={styles.value}>{renderedAt}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.label}>{t('environment')}:</span>
                    <span className={styles.value}>{data.environment}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.label}>{t('nodeVersion')}:</span>
                    <span className={styles.value}>{data.nodeVersion}</span>
                </div>
                <div className={styles.infoItem}>
                    <span className={styles.label}>{t('platform')}:</span>
                    <span className={styles.value}>{data.platform}</span>
                </div>
            </div>
            <p className={styles.note}>💡 This data was fetched on the server and rendered as HTML</p>
        </div>
    );
}
