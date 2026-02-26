'use client';

import { LanguageSelector } from '../language-selector/language-selector.components';
import { ThemeToggle } from '../theme-toggle/theme-toggle.components';

export function Header() {
    return (
        <header
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 2rem',
                borderBottom: '1px solid #e5e7eb',
                marginBottom: '2rem',
            }}
        >
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Next.js Boilerplate</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ThemeToggle />
                <LanguageSelector />
            </div>
        </header>
    );
}
