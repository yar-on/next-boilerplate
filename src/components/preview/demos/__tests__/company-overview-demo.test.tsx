/**
 * Component tests for Company Overview Demo with translations
 *
 * P1 Tests: Verify company overview elements use translations
 */

import { renderWithLocale } from '@/../test-utils/render-with-locale';
import { screen } from '@testing-library/react';
import { CompanyOverviewDemo } from '../company-overview-demo.components';
import { mockEnTranslations, mockHeTranslations } from '@/../test-utils/mock-translations';

// Mock IntersectionObserver for scroll animations
global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    takeRecords() {
        return [];
    }
    unobserve() {}
} as never;

describe('CompanyOverviewDemo Component - Translations', () => {
    describe('English translations', () => {
        beforeEach(() => {
            renderWithLocale(<CompanyOverviewDemo />, {
                locale: 'en',
                messages: mockEnTranslations,
            });
        });

        it('should render brand name in English', () => {
            expect(screen.getByText('BuildCo')).toBeInTheDocument();
        });

        it('should render hero section in English', () => {
            expect(screen.getByText("Building Tomorrow's Spaces Today")).toBeInTheDocument();
            expect(screen.getByText('Award-winning architecture and construction services')).toBeInTheDocument();
            expect(screen.getByText('View Our Work')).toBeInTheDocument();
        });

        it('should render stats section in English', () => {
            expect(screen.getByText('Projects Completed')).toBeInTheDocument();
            expect(screen.getByText('500+')).toBeInTheDocument();
        });

        it('should render contact section in English', () => {
            expect(screen.getByText('Get In Touch')).toBeInTheDocument();

            // Check form labels
            const firstNameInput = screen.getByLabelText('First Name');
            expect(firstNameInput).toBeInTheDocument();

            const emailInput = screen.getByLabelText('Email');
            expect(emailInput).toBeInTheDocument();
        });
    });

    describe('Hebrew translations', () => {
        beforeEach(() => {
            renderWithLocale(<CompanyOverviewDemo />, {
                locale: 'he',
                messages: mockHeTranslations,
            });
        });

        it('should render hero section in Hebrew', () => {
            expect(screen.getByText('בונים את המרחבים של מחר היום')).toBeInTheDocument();
            expect(screen.getByText('שירותי אדריכלות ובנייה עטורי פרסים')).toBeInTheDocument();
            expect(screen.getByText('צפה בעבודות שלנו')).toBeInTheDocument();
        });

        it('should render stats section in Hebrew', () => {
            expect(screen.getByText('פרויקטים שהושלמו')).toBeInTheDocument();
            expect(screen.getByText('500+')).toBeInTheDocument();
        });

        it('should render contact section in Hebrew', () => {
            expect(screen.getByText('צור קשר')).toBeInTheDocument();

            // Check form labels
            const firstNameInput = screen.getByLabelText('שם פרטי');
            expect(firstNameInput).toBeInTheDocument();

            const emailInput = screen.getByLabelText('אימייל');
            expect(emailInput).toBeInTheDocument();
        });
    });

    describe('Stats values remain unchanged', () => {
        it('should display numeric values consistently in English', () => {
            renderWithLocale(<CompanyOverviewDemo />, {
                locale: 'en',
                messages: mockEnTranslations,
            });

            expect(screen.getByText('500+')).toBeInTheDocument();
        });

        it('should display numeric values consistently in Hebrew', () => {
            renderWithLocale(<CompanyOverviewDemo />, {
                locale: 'he',
                messages: mockHeTranslations,
            });

            expect(screen.getByText('500+')).toBeInTheDocument();
        });
    });

    describe('Translation key coverage', () => {
        it('should not display any untranslated keys in English', () => {
            const { container } = renderWithLocale(<CompanyOverviewDemo />, {
                locale: 'en',
                messages: mockEnTranslations,
            });

            // Check that no translation keys (dot notation) are visible
            const text = container.textContent || '';
            const translationKeyPattern = /preview\.demos\.companyOverview\./;
            expect(text).not.toMatch(translationKeyPattern);
        });

        it('should not display any untranslated keys in Hebrew', () => {
            const { container } = renderWithLocale(<CompanyOverviewDemo />, {
                locale: 'he',
                messages: mockHeTranslations,
            });

            // Check that no translation keys (dot notation) are visible
            const text = container.textContent || '';
            const translationKeyPattern = /preview\.demos\.companyOverview\./;
            expect(text).not.toMatch(translationKeyPattern);
        });
    });

    describe('Component structure', () => {
        it('should render main sections in English', () => {
            renderWithLocale(<CompanyOverviewDemo />, {
                locale: 'en',
                messages: mockEnTranslations,
            });

            // Hero section
            expect(screen.getByText("Building Tomorrow's Spaces Today")).toBeInTheDocument();

            // Stats section (numeric values)
            expect(screen.getByText('500+')).toBeInTheDocument();

            // Contact form
            expect(screen.getByText('Get In Touch')).toBeInTheDocument();
        });

        it('should render main sections in Hebrew', () => {
            renderWithLocale(<CompanyOverviewDemo />, {
                locale: 'he',
                messages: mockHeTranslations,
            });

            // Hero section
            expect(screen.getByText('בונים את המרחבים של מחר היום')).toBeInTheDocument();

            // Stats section (numeric values)
            expect(screen.getByText('500+')).toBeInTheDocument();

            // Contact form
            expect(screen.getByText('צור קשר')).toBeInTheDocument();
        });
    });

    describe('Form elements', () => {
        it('should have properly labeled form inputs in English', () => {
            renderWithLocale(<CompanyOverviewDemo />, {
                locale: 'en',
                messages: mockEnTranslations,
            });

            // Verify form inputs have correct labels
            expect(screen.getByLabelText('First Name')).toBeInTheDocument();
            expect(screen.getByLabelText('Email')).toBeInTheDocument();
        });

        it('should have properly labeled form inputs in Hebrew', () => {
            renderWithLocale(<CompanyOverviewDemo />, {
                locale: 'he',
                messages: mockHeTranslations,
            });

            // Verify form inputs have correct labels
            expect(screen.getByLabelText('שם פרטי')).toBeInTheDocument();
            expect(screen.getByLabelText('אימייל')).toBeInTheDocument();
        });
    });

    describe('Call to action buttons', () => {
        it('should render CTA button in English', () => {
            renderWithLocale(<CompanyOverviewDemo />, {
                locale: 'en',
                messages: mockEnTranslations,
            });

            expect(screen.getByText('View Our Work')).toBeInTheDocument();
        });

        it('should render CTA button in Hebrew', () => {
            renderWithLocale(<CompanyOverviewDemo />, {
                locale: 'he',
                messages: mockHeTranslations,
            });

            expect(screen.getByText('צפה בעבודות שלנו')).toBeInTheDocument();
        });
    });
});
