import nextConfig from 'eslint-config-next/core-web-vitals';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  // Next.js core-web-vitals (includes react, react-hooks, jsx-a11y, import, next plugin)
  ...nextConfig,

  // TypeScript recommended + type-checked rules
  ...tseslint.configs.recommendedTypeChecked,

  // Prettier plugin - runs Prettier as ESLint rules
  prettierPlugin,

  // Prettier config must be last to disable conflicting rules
  prettierConfig,

  // Global language options
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Main rules for all TS/TSX files
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // TypeScript specific
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],

      // React specific
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/exhaustive-deps': 'warn',

      // General code quality
      'no-console': ['warn', { allow: ['log', 'info', 'warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  // Test file overrides - relax type-checking
  {
    files: ['**/__tests__/**/*', '**/*.test.*', '**/*.spec.*'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },

  // E2E Playwright tests - disable React-specific rules
  {
    files: ['e2e/**/*.spec.ts'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/set-state-in-effect': 'off',
      '@typescript-eslint/await-thenable': 'off',
    },
  },

  // Global ignores
  {
    ignores: [
      'node_modules/',
      '.next/',
      'out/',
      'build/',
      'dist/',
      'coverage/',
      'playwright-report/',
      'test-results/',
      '*.config.js',
      '*.config.mjs',
      '.lintstagedrc.js',
    ],
  }
);
