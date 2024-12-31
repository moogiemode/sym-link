import eslint from '@eslint/js';
import typescriptEslintParser from '@typescript-eslint/parser';
// import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default tseslint.config(
  { ignores: ['**/.vite/*', '**/.node_modules/*', 'dist'] },
  {
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended, ...tseslint.configs.stylistic],
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      sourceType: 'module', //check if necessary or correct
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      pluginReact,
      'react-hooks': reactHooks,
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect React version
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'], // Add this if you are using React 17+
  // eslintPluginPrettierRecommended,
);
