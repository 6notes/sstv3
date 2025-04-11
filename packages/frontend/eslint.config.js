import sixNotesRules from 'eslint-config-6notes-typescript';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  extends: [...sixNotesRules],
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
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
});
