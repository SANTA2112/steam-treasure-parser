import { resolve } from 'node:path';

import { defineConfig } from 'vite';

import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  root: resolve(process.cwd()),
  build: {
    minify: 'esbuild',
    outDir: resolve(process.cwd(), 'build'),
    rollupOptions: {
      input: resolve(process.cwd(), 'src/index.ts'),
      output: {
        dir: resolve(process.cwd(), 'build'),
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  plugins: [cssInjectedByJsPlugin()],
});
