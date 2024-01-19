/** @format */

import { type Plugin, mergeConfig } from 'vite';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';
const genStub: Plugin = {
  name: 'gen-stub',
  apply: 'build',
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'ssr-stub.js',
      source: `module.exports = {}`,
    });
  },
};
// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  optimizeDeps: {
    // avoid late discovered deps
    include: ['typescript', 'vue/server-renderer'],
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    minify: false,
    outDir: 'dist',
    cssCodeSplit: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: {
        md2vuesfc: 'src/index.ts',
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [
        'vue',
        'markdown-it',
        '@mdit-vue/plugin-sfc',
        '@mdit-vue/plugin-component',
        '@vue/compiler-sfc',
        '@vue/server-renderer',
        '@vue/shared',
      ],
      output: {
        chunkFileNames: 'chunks/[name]-[hash].js',
      },
    },
  },
  plugins: [
    genStub,
    vue(),
    dts({
      rollupTypes: true,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      test: resolve(__dirname, 'test'),
    },
  },
});
