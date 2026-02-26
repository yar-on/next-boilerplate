/**
 * Web Vitals Component
 * Tracks and reports Core Web Vitals metrics for performance monitoring
 */

'use client';

import { useEffect } from 'react';
import { type Metric, onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';
import { logger } from '@/utils/logger/logger.utils';

function sendToAnalytics(metric: Metric) {
    void logger.debug({
        message: `[Web Vitals] ${metric.name}: ${Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value)}ms (${metric.rating})`,
        context: { name: metric.name, value: metric.value, rating: metric.rating, id: metric.id },
    });

    // In production, send to your analytics service
    // Example: Google Analytics
    // window.gtag?.('event', metric.name, {
    //   value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    //   event_category: 'Web Vitals',
    //   event_label: metric.id,
    //   non_interaction: true,
    // });

    // Example: Custom analytics endpoint
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   body: JSON.stringify(metric),
    //   headers: { 'Content-Type': 'application/json' },
    // });
}

export function WebVitals() {
    useEffect(() => {
        // Cumulative Layout Shift
        onCLS(sendToAnalytics);

        // First Contentful Paint
        onFCP(sendToAnalytics);

        // Interaction to Next Paint (replaces FID)
        onINP(sendToAnalytics);

        // Largest Contentful Paint
        onLCP(sendToAnalytics);

        // Time to First Byte
        onTTFB(sendToAnalytics);
    }, []);

    return null;
}
