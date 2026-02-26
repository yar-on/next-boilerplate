/**
 * Component tests for CRM Demo with translations
 *
 * P1 Tests: Verify CRM elements use translations
 */

import { renderWithLocale } from '@/../test-utils/render-with-locale';
import { screen } from '@testing-library/react';
import { CrmDemo } from '../crm-demo.components';
import { mockEnTranslations, mockHeTranslations } from '@/../test-utils/mock-translations';

// Mock MUI's useMediaQuery to control mobile/desktop state
jest.mock('@mui/material/useMediaQuery', () => ({
    __esModule: true,
    default: jest.fn(() => false), // Default to desktop
}));

describe('CrmDemo Component - Translations', () => {
    describe('English translations', () => {
        beforeEach(() => {
            renderWithLocale(<CrmDemo />, {
                locale: 'en',
                messages: mockEnTranslations,
            });
        });

        it('should render brand name in English', () => {
            expect(screen.getByText('CRM Pro')).toBeInTheDocument();
        });

        it('should render page title in English', () => {
            expect(screen.getByText('Leads')).toBeInTheDocument();
        });

        it('should render navigation items in English', () => {
            expect(screen.getByText('Deals')).toBeInTheDocument();
            expect(screen.getByText('Settings')).toBeInTheDocument();
        });

        it('should render filter chips in English', () => {
            expect(screen.getByText('All')).toBeInTheDocument();
            expect(screen.getByText('New')).toBeInTheDocument();
        });

        it('should render sorting dropdown in English', () => {
            expect(screen.getByText('Sort By')).toBeInTheDocument();
        });

        it('should render table headers in English', () => {
            expect(screen.getByText('Name')).toBeInTheDocument();
            expect(screen.getByText('Company')).toBeInTheDocument();
            expect(screen.getByText('Email')).toBeInTheDocument();
            expect(screen.getByText('Status')).toBeInTheDocument();
            expect(screen.getByText('Value')).toBeInTheDocument();
        });
    });

    describe('Hebrew translations', () => {
        beforeEach(() => {
            renderWithLocale(<CrmDemo />, {
                locale: 'he',
                messages: mockHeTranslations,
            });
        });

        it('should render page title in Hebrew', () => {
            expect(screen.getByText('לידים')).toBeInTheDocument();
        });

        it('should render navigation items in Hebrew', () => {
            expect(screen.getByText('עסקאות')).toBeInTheDocument();
            expect(screen.getByText('הגדרות')).toBeInTheDocument();
        });

        it('should render filter chips in Hebrew', () => {
            expect(screen.getByText('הכל')).toBeInTheDocument();
            expect(screen.getByText('חדש')).toBeInTheDocument();
        });

        it('should render sorting dropdown in Hebrew', () => {
            expect(screen.getByText('מיין לפי')).toBeInTheDocument();
        });

        it('should render table headers in Hebrew', () => {
            expect(screen.getByText('שם')).toBeInTheDocument();
            expect(screen.getByText('חברה')).toBeInTheDocument();
            expect(screen.getByText('אימייל')).toBeInTheDocument();
            expect(screen.getByText('סטטוס')).toBeInTheDocument();
            expect(screen.getByText('ערך')).toBeInTheDocument();
        });
    });

    describe('ARIA labels use translations', () => {
        it('should use English ARIA label for drawer button', () => {
            renderWithLocale(<CrmDemo />, {
                locale: 'en',
                messages: mockEnTranslations,
            });

            const drawerButton = screen.getByLabelText('Open drawer');
            expect(drawerButton).toBeInTheDocument();
        });

        it('should use Hebrew ARIA label for drawer button', () => {
            renderWithLocale(<CrmDemo />, {
                locale: 'he',
                messages: mockHeTranslations,
            });

            const drawerButton = screen.getByLabelText('פתח תפריט');
            expect(drawerButton).toBeInTheDocument();
        });
    });

    describe('View mode toggles', () => {
        it('should render view mode buttons in English', () => {
            renderWithLocale(<CrmDemo />, {
                locale: 'en',
                messages: mockEnTranslations,
            });

            // List and grid view buttons should be present
            const listButton = screen.getByLabelText('list view');
            const gridButton = screen.getByLabelText('grid view');

            expect(listButton).toBeInTheDocument();
            expect(gridButton).toBeInTheDocument();
        });

        it('should render view mode buttons in Hebrew', () => {
            renderWithLocale(<CrmDemo />, {
                locale: 'he',
                messages: mockHeTranslations,
            });

            // List and grid view buttons should be present
            const listButton = screen.getByLabelText('תצוגת רשימה');
            const gridButton = screen.getByLabelText('תצוגת רשת');

            expect(listButton).toBeInTheDocument();
            expect(gridButton).toBeInTheDocument();
        });
    });

    describe('Translation key coverage', () => {
        it('should not display any untranslated keys in English', () => {
            const { container } = renderWithLocale(<CrmDemo />, {
                locale: 'en',
                messages: mockEnTranslations,
            });

            // Check that no translation keys (dot notation) are visible
            const text = container.textContent || '';
            const translationKeyPattern = /preview\.demos\.crm\./;
            expect(text).not.toMatch(translationKeyPattern);
        });

        it('should not display any untranslated keys in Hebrew', () => {
            const { container } = renderWithLocale(<CrmDemo />, {
                locale: 'he',
                messages: mockHeTranslations,
            });

            // Check that no translation keys (dot notation) are visible
            const text = container.textContent || '';
            const translationKeyPattern = /preview\.demos\.crm\./;
            expect(text).not.toMatch(translationKeyPattern);
        });
    });

    describe('Sorting options', () => {
        it('should have sort options available in English', () => {
            renderWithLocale(<CrmDemo />, {
                locale: 'en',
                messages: mockEnTranslations,
            });

            // Sort By label should be visible
            expect(screen.getByText('Sort By')).toBeInTheDocument();
        });

        it('should have sort options available in Hebrew', () => {
            renderWithLocale(<CrmDemo />, {
                locale: 'he',
                messages: mockHeTranslations,
            });

            // Sort By label should be visible
            expect(screen.getByText('מיין לפי')).toBeInTheDocument();
        });
    });

    describe('Filter chips', () => {
        it('should render all filter options in English', () => {
            renderWithLocale(<CrmDemo />, {
                locale: 'en',
                messages: mockEnTranslations,
            });

            expect(screen.getByText('All')).toBeInTheDocument();
            expect(screen.getByText('New')).toBeInTheDocument();
        });

        it('should render all filter options in Hebrew', () => {
            renderWithLocale(<CrmDemo />, {
                locale: 'he',
                messages: mockHeTranslations,
            });

            expect(screen.getByText('הכל')).toBeInTheDocument();
            expect(screen.getByText('חדש')).toBeInTheDocument();
        });
    });

    describe('Component structure', () => {
        it('should render main sections in English', () => {
            renderWithLocale(<CrmDemo />, {
                locale: 'en',
                messages: mockEnTranslations,
            });

            // AppBar with title
            expect(screen.getByText('Leads')).toBeInTheDocument();

            // Navigation drawer
            expect(screen.getByText('Deals')).toBeInTheDocument();
            expect(screen.getByText('Settings')).toBeInTheDocument();

            // Table section
            expect(screen.getByText('Name')).toBeInTheDocument();
            expect(screen.getByText('Company')).toBeInTheDocument();
        });

        it('should render main sections in Hebrew', () => {
            renderWithLocale(<CrmDemo />, {
                locale: 'he',
                messages: mockHeTranslations,
            });

            // AppBar with title
            expect(screen.getByText('לידים')).toBeInTheDocument();

            // Navigation drawer
            expect(screen.getByText('עסקאות')).toBeInTheDocument();
            expect(screen.getByText('הגדרות')).toBeInTheDocument();

            // Table section
            expect(screen.getByText('שם')).toBeInTheDocument();
            expect(screen.getByText('חברה')).toBeInTheDocument();
        });
    });

    describe('Table functionality', () => {
        it('should render table with correct headers in English', () => {
            renderWithLocale(<CrmDemo />, {
                locale: 'en',
                messages: mockEnTranslations,
            });

            const headers = ['Name', 'Company', 'Email', 'Status', 'Value'];
            headers.forEach((header) => {
                expect(screen.getByText(header)).toBeInTheDocument();
            });
        });

        it('should render table with correct headers in Hebrew', () => {
            renderWithLocale(<CrmDemo />, {
                locale: 'he',
                messages: mockHeTranslations,
            });

            const headers = ['שם', 'חברה', 'אימייל', 'סטטוס', 'ערך'];
            headers.forEach((header) => {
                expect(screen.getByText(header)).toBeInTheDocument();
            });
        });
    });

    describe('Drawer component', () => {
        it('should have drawer close button with correct label in English', () => {
            renderWithLocale(<CrmDemo />, {
                locale: 'en',
                messages: mockEnTranslations,
            });

            // Drawer button should be accessible
            const drawerButton = screen.getByLabelText('Open drawer');
            expect(drawerButton).toBeInTheDocument();
        });

        it('should have drawer close button with correct label in Hebrew', () => {
            renderWithLocale(<CrmDemo />, {
                locale: 'he',
                messages: mockHeTranslations,
            });

            // Drawer button should be accessible
            const drawerButton = screen.getByLabelText('פתח תפריט');
            expect(drawerButton).toBeInTheDocument();
        });
    });
});
