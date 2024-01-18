/** @format */

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    minify: 'terser',
    outDir: 'dist',
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MarkVuePro',
      // the proper extensions will be added
      fileName: 'mark-vue-pro',
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [
        'vue',
        'markdown-it',
        '@mdit-vue/plugin-sfc',
        '@mdit-vue/plugin-component',
        'hash-sum',
        '@vue/compiler-sfc',
      ],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
          'markdown-it': 'MarkDownIt',
          '@vue/compiler-sfc': 'compilerSfc',
          'hash-sum': 'hash-sum',
          '@mdit-vue/plugin-sfc': 'pluginSfc',
          '@mdit-vue/plugin-component': 'pluginComponent',
        },
      },
    },
  },
  plugins: [
    vue(),
    {
      ...dts({
        rollupTypes: true,
      }),
      apply: 'build',
    },
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      test: resolve(__dirname, 'test'),
    },
  },
});
