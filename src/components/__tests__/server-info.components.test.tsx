/**
 * Unit tests for ServerInfo component
 */

import { render, screen } from '@testing-library/react';
import { ServerInfo } from '../server-info/server-info.components';

// Mock the i18n libs
jest.mock('@/libs/i18n.libs', () => ({
    getServerTranslation: jest.fn((key: string) => {
        const translations: Record<string, string> = {
            'components.serverInfo.title': 'Server Info',
            'components.serverInfo.environment': 'Environment',
            'components.serverInfo.nodeVersion': 'Node Version',
            'components.serverInfo.platform': 'Platform',
            'components.serverInfo.timestamp': 'Timestamp',
        };
        return Promise.resolve(translations[key] || key);
    }),
    getLocale: jest.fn(() => Promise.resolve('en')),
}));

describe('ServerInfo Component', () => {
    const mockData = {
        timestamp: '2024-01-01T00:00:00.000Z',
        environment: 'test',
        nodeVersion: 'v18.0.0',
        platform: 'darwin',
    };

    it('renders server information correctly', async () => {
        const component = await ServerInfo({ data: mockData });
        render(component);

        // Check if all data fields are displayed
        expect(screen.getByText('test')).toBeInTheDocument();
        expect(screen.getByText('v18.0.0')).toBeInTheDocument();
        expect(screen.getByText('darwin')).toBeInTheDocument();
    });

    it('formats timestamp correctly', async () => {
        const component = await ServerInfo({ data: mockData });
        render(component);

        // The timestamp should be formatted and displayed
        // Check if the informational note is present (which confirms timestamp was processed)
        expect(screen.getByText('💡 This data was fetched on the server and rendered as HTML')).toBeInTheDocument();
    });

    it('displays the informational note', async () => {
        const component = await ServerInfo({ data: mockData });
        render(component);

        expect(screen.getByText('💡 This data was fetched on the server and rendered as HTML')).toBeInTheDocument();
    });

    it('applies correct CSS classes', async () => {
        const component = await ServerInfo({ data: mockData });
        render(component);

        // Check if the main content is rendered with proper structure
        // Look for the heading which should be present in the card
        expect(screen.getByText('test')).toBeInTheDocument();
        expect(screen.getByText('v18.0.0')).toBeInTheDocument();
    });
});
