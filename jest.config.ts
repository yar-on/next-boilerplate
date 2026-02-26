/**
 * Jest Configuration for Next.js
 * See: https://nextjs.org/docs/app/building-your-application/testing/jest
 */

import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .envLibs files in your test environment
    dir: './',
});

const config = {
    // Add more setup options before each test is run
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

    // Test environment
    testEnvironment: 'jest-environment-jsdom',

    // Module paths for absolute imports
    modulePaths: ['<rootDir>/src'],

    // Module name mapper for path aliases
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },

    // Coverage configuration
    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts', '!src/**/*.stories.{js,jsx,ts,tsx}', '!src/**/__tests__/**', '!src/**/__mocks__/**'],

    // Coverage thresholds
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },

    // Test match patterns
    testMatch: ['<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}', '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'],

    // Transform ignore patterns
    transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss)$'],

    // Watch plugins for better DX
    watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],

    // Verbose output
    verbose: true,

    // Clear mocks between tests
    clearMocks: true,

    // Restore mocks between tests
    restoreMocks: true,

    // Reset mocks between tests
    resetMocks: true,
} satisfies Config;

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
