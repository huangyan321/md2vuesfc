// vite.config.ts
import { defineConfig } from "file:///C:/Users/16045/Desktop/code/my-project/%E6%88%91%E7%9A%84github%E5%B0%8F%E4%BD%9C%E5%93%81/md2vuesfc/node_modules/.pnpm/vite@5.0.11_@types+node@20.11.5_terser@5.27.0/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/16045/Desktop/code/my-project/%E6%88%91%E7%9A%84github%E5%B0%8F%E4%BD%9C%E5%93%81/md2vuesfc/node_modules/.pnpm/@vitejs+plugin-vue@4.6.2_vite@5.0.11_vue@3.4.14/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve } from "node:path";
import dts from "file:///C:/Users/16045/Desktop/code/my-project/%E6%88%91%E7%9A%84github%E5%B0%8F%E4%BD%9C%E5%93%81/md2vuesfc/node_modules/.pnpm/vite-plugin-dts@3.7.1_@types+node@20.11.5_typescript@5.3.3_vite@5.0.11/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\16045\\Desktop\\code\\my-project\\\u6211\u7684github\u5C0F\u4F5C\u54C1\\md2vuesfc";
var vite_config_default = defineConfig({
  build: {
    sourcemap: true,
    minify: "terser",
    outDir: "dist",
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "MarkVuePro",
      // the proper extensions will be added
      fileName: "mark-vue-pro"
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["vue"],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: "Vue"
        }
      }
    }
  },
  plugins: [
    vue(),
    {
      ...dts({
        rollupTypes: true
      }),
      apply: "build"
    }
  ],
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src"),
      test: resolve(__vite_injected_original_dirname, "test")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFwxNjA0NVxcXFxEZXNrdG9wXFxcXGNvZGVcXFxcbXktcHJvamVjdFxcXFxcdTYyMTFcdTc2ODRnaXRodWJcdTVDMEZcdTRGNUNcdTU0QzFcXFxcbWQydnVlc2ZjXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFwxNjA0NVxcXFxEZXNrdG9wXFxcXGNvZGVcXFxcbXktcHJvamVjdFxcXFxcdTYyMTFcdTc2ODRnaXRodWJcdTVDMEZcdTRGNUNcdTU0QzFcXFxcbWQydnVlc2ZjXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy8xNjA0NS9EZXNrdG9wL2NvZGUvbXktcHJvamVjdC8lRTYlODglOTElRTclOUElODRnaXRodWIlRTUlQjAlOEYlRTQlQkQlOUMlRTUlOTMlODEvbWQydnVlc2ZjL3ZpdGUuY29uZmlnLnRzXCI7LyoqIEBmb3JtYXQgKi9cclxuXHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSc7XHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdub2RlOnBhdGgnO1xyXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cyc7XHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgYnVpbGQ6IHtcclxuICAgIHNvdXJjZW1hcDogdHJ1ZSxcclxuICAgIG1pbmlmeTogJ3RlcnNlcicsXHJcbiAgICBvdXREaXI6ICdkaXN0JyxcclxuICAgIGxpYjoge1xyXG4gICAgICAvLyBDb3VsZCBhbHNvIGJlIGEgZGljdGlvbmFyeSBvciBhcnJheSBvZiBtdWx0aXBsZSBlbnRyeSBwb2ludHNcclxuICAgICAgZW50cnk6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2luZGV4LnRzJyksXHJcbiAgICAgIG5hbWU6ICdNYXJrVnVlUHJvJyxcclxuICAgICAgLy8gdGhlIHByb3BlciBleHRlbnNpb25zIHdpbGwgYmUgYWRkZWRcclxuICAgICAgZmlsZU5hbWU6ICdtYXJrLXZ1ZS1wcm8nLFxyXG4gICAgfSxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgLy8gXHU3ODZFXHU0RkREXHU1OTE2XHU5MEU4XHU1MzE2XHU1OTA0XHU3NDA2XHU5MEEzXHU0RTlCXHU0RjYwXHU0RTBEXHU2MEYzXHU2MjUzXHU1MzA1XHU4RkRCXHU1RTkzXHU3Njg0XHU0RjlEXHU4RDU2XHJcbiAgICAgIGV4dGVybmFsOiBbJ3Z1ZSddLFxyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAvLyBcdTU3MjggVU1EIFx1Njc4NFx1NUVGQVx1NkEyMVx1NUYwRlx1NEUwQlx1NEUzQVx1OEZEOVx1NEU5Qlx1NTkxNlx1OTBFOFx1NTMxNlx1NzY4NFx1NEY5RFx1OEQ1Nlx1NjNEMFx1NEY5Qlx1NEUwMFx1NEUyQVx1NTE2OFx1NUM0MFx1NTNEOFx1OTFDRlxyXG4gICAgICAgIGdsb2JhbHM6IHtcclxuICAgICAgICAgIHZ1ZTogJ1Z1ZScsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoKSxcclxuICAgIHtcclxuICAgICAgLi4uZHRzKHtcclxuICAgICAgICByb2xsdXBUeXBlczogdHJ1ZSxcclxuICAgICAgfSksXHJcbiAgICAgIGFwcGx5OiAnYnVpbGQnLFxyXG4gICAgfSxcclxuICBdLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcclxuICAgICAgdGVzdDogcmVzb2x2ZShfX2Rpcm5hbWUsICd0ZXN0JyksXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBRUEsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsZUFBZTtBQUN4QixPQUFPLFNBQVM7QUFMaEIsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsT0FBTztBQUFBLElBQ0wsV0FBVztBQUFBLElBQ1gsUUFBUTtBQUFBLElBQ1IsUUFBUTtBQUFBLElBQ1IsS0FBSztBQUFBO0FBQUEsTUFFSCxPQUFPLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQ3hDLE1BQU07QUFBQTtBQUFBLE1BRU4sVUFBVTtBQUFBLElBQ1o7QUFBQSxJQUNBLGVBQWU7QUFBQTtBQUFBLE1BRWIsVUFBVSxDQUFDLEtBQUs7QUFBQSxNQUNoQixRQUFRO0FBQUE7QUFBQSxRQUVOLFNBQVM7QUFBQSxVQUNQLEtBQUs7QUFBQSxRQUNQO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSjtBQUFBLE1BQ0UsR0FBRyxJQUFJO0FBQUEsUUFDTCxhQUFhO0FBQUEsTUFDZixDQUFDO0FBQUEsTUFDRCxPQUFPO0FBQUEsSUFDVDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsTUFDN0IsTUFBTSxRQUFRLGtDQUFXLE1BQU07QUFBQSxJQUNqQztBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
