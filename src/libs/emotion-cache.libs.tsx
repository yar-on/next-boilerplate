'use client';

import { useServerInsertedHTML } from 'next/navigation';
import { useState } from 'react';
import createCache from '@emotion/cache';
import { CacheProvider as DefaultCacheProvider } from '@emotion/react';
import type { EmotionCache, Options as OptionsOfCreateCache } from '@emotion/cache';

/**
 * Emotion cache registry for Next.js App Router
 * Ensures proper SSR styling with Material UI
 */
export type NextAppDirEmotionCacheProviderPropsType = {
    options: Omit<OptionsOfCreateCache, 'insertionPoint'>;
    CacheProvider?: (props: { value: EmotionCache; children: React.ReactNode }) => React.JSX.Element;
    children: React.ReactNode;
};

export function NextAppDirEmotionCacheProvider(props: NextAppDirEmotionCacheProviderPropsType) {
    const { options, CacheProvider = DefaultCacheProvider, children } = props;

    const [registry] = useState(() => {
        const cache = createCache(options);
        cache.compat = true;
        const prevInsert = cache.insert;
        let inserted: Array<{ name: string; isGlobal: boolean }> = [];
        cache.insert = (...args) => {
            const [selector, serialized] = args;
            if (cache.inserted[serialized.name] === undefined) {
                inserted.push({
                    name: serialized.name,
                    isGlobal: !selector,
                });
            }
            return prevInsert(...args);
        };
        const flush = () => {
            const prevInserted = inserted;
            inserted = [];
            return prevInserted;
        };
        return { cache, flush };
    });

    useServerInsertedHTML(() => {
        const inserted = registry.flush();
        if (inserted.length === 0) {
            return null;
        }
        let styles = '';
        let dataEmotionAttribute = registry.cache.key;

        const globals: Array<{ name: string; style: string }> = [];

        inserted.forEach(({ name, isGlobal }) => {
            const style = registry.cache.inserted[name];

            if (typeof style === 'string') {
                if (isGlobal) {
                    globals.push({ name, style });
                } else {
                    styles += style;
                    dataEmotionAttribute += ` ${name}`;
                }
            }
        });

        return (
            <>
                {globals.map(({ name, style }) => (
                    <style key={name} data-emotion={`${registry.cache.key}-global ${name}`} dangerouslySetInnerHTML={{ __html: style }} />
                ))}
                {styles && <style data-emotion={dataEmotionAttribute} dangerouslySetInnerHTML={{ __html: styles }} />}
            </>
        );
    });

    return <CacheProvider value={registry.cache}>{children}</CacheProvider>;
}
