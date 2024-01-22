/** @format */

import { type Plugin, mergeConfig } from 'vite';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';
// https://vitejs.dev/config/
export default defineConfig({
  base: './',
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
        '@vue/server-renderer',
        'markdown-it',
        '@mdit-vue/plugin-sfc',
        '@mdit-vue/plugin-component',
        'sucrase',
        'juice',
      ],
    },
  },
  plugins: [
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
