import { resolve } from 'node:path';

import { defineConfig } from 'vite';

import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  root: resolve(process.cwd()),
  build: {
    emptyOutDir: false,
    sourcemap: false,
    minify: 'terser',
    // minify: false,
    outDir: resolve(process.cwd(), 'build'),
    rollupOptions: {
      input: resolve(process.cwd(), 'src/overrideFetch.ts'),
      output: {
        dir: resolve(process.cwd(), 'build'),
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
        format: 'iife',
      },
    },
  },
  plugins: [cssInjectedByJsPlugin()],
});
