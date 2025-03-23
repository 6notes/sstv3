import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import prettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sortKeysCustomOrder from 'eslint-plugin-sort-keys-custom-order';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  extends: [
    eslint.configs.all,
    ...tseslint.configs.strictTypeChecked,
    prettier,
  ],
  files: ['**/*.{ts,tsx}'],
  ignores: ['**/sst-env.d.ts'],
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  plugins: {
    '@stylistic': stylistic,
    'simple-import-sort': simpleImportSort,
    'sort-keys-custom-order': sortKeysCustomOrder,
  },
  rules: {
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
