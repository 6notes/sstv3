import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sortKeysCustomOrder from 'eslint-plugin-sort-keys-custom-order';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    prettier,
  ],
  files: ['**/*.{ts,tsx}'],
  ignores: ['dist', '**/sst-env.d.ts'],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
    parserOptions: {
      /*
        Used to handle the frontend tsconfig.json file because it references
        other tsconfig files. See: https://github.com/typescript-eslint/typescript-eslint/pull/6754 .
        */
      EXPERIMENTAL_useProjectService: true,
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  plugins: {
    '@stylistic': stylistic,
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    'simple-import-sort': simpleImportSort,
    'sort-keys-custom-order': sortKeysCustomOrder,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@stylistic/spaced-comment': 'warn',
    'capitalized-comments': 'off',
    'func-style': 'off',
    'init-declarations': 'off',
    'one-var': ['error', 'never'],
    'no-ternary': 'off',
    'prefer-const': 'error',
    'require-await': 'error',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'sort-imports': 'off',
    'sort-keys': 'off',
  },
});
