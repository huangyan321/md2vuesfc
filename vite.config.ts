/** @format */

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';
// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  optimizeDeps: {
    // avoid late discovered deps
    include: ['vue/server-renderer'],
  },
  resolve: {
    alias: {
      '@vue/compiler-dom': '@vue/compiler-dom/dist/compiler-dom.cjs.js',
      '@vue/compiler-core': '@vue/compiler-core/dist/compiler-core.cjs.js',
      '@': resolve(__dirname, 'src'),
      test: resolve(__dirname, 'test'),
    },
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
      formats: ['es'],
    },
    commonjsOptions: {
      ignore: ['typescript'],
    },
    rollupOptions: {
      output: {
        chunkFileNames: 'chunks/[name]-[hash].js',
      },
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue', 'vue/compiler-sfc', 'juice'],
    },
  },
  plugins: [
    vue(),
    dts({
      rollupTypes: true,
    }),
  ],
});
