import { defineConfig } from 'electron-vite';
import { resolve } from 'node:path';

export default defineConfig({
  main: {
    build: {
      outDir: 'out/main',
    },
  },
  preload: {
    build: {
      outDir: 'out/preload',
    },
  },
  renderer: {
    // Renderer is served by Next.js; keep minimal Vite config.
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
      },
    },
  },
});
