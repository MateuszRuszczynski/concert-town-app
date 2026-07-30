import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/concert-town-app/',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "${path
          .resolve(__dirname, 'src/styles/index')
          .replace(/\\/g, '/')}" as *;`
      }
    }
  }
});
