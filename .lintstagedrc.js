module.exports = {
    // Run type-check on changes to TypeScript files
    '**/*.ts?(x)': () => 'npm run type-check',

    // Run ESLint on changes to JavaScript/TypeScript files
    '**/*.(ts|tsx|js|jsx)': (filenames) => [`eslint --fix ${filenames.join(' ')}`, `prettier --write ${filenames.join(' ')}`],

    // Run Prettier on other supported files
    '**/*.(json|md|css|scss)': (filenames) => `prettier --write ${filenames.join(' ')}`,
};
