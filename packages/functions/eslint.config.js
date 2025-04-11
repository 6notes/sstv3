import sixNotesRules from 'eslint-config-6notes-typescript';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  extends: [...sixNotesRules],
  files: ['**/*.{ts,tsx}'],
  ignores: ['**/sst-env.d.ts'],
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
