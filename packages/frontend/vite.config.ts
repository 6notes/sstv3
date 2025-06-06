import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [viteReact()],
  build: {
    // NOTE: Needed when deploying
    chunkSizeWarningLimit: 800,
  },
});
