// vite.config.js
import { defineConfig, loadEnv } from "file:///D:/study/3d_study/node_modules/.pnpm/vite@4.4.5_sass@1.69.5_stylus@0.61.0/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/study/3d_study/node_modules/.pnpm/@vitejs+plugin-vue@4.2.3_vite@4.4.5_vue@3.3.4/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import cesium from "file:///D:/study/3d_study/node_modules/.pnpm/vite-plugin-cesium@1.2.22_cesium@1.111.0_rollup@2.79.1_vite@4.4.5/node_modules/vite-plugin-cesium/dist/index.mjs";
import { resolve } from "path";
import Components from "file:///D:/study/3d_study/node_modules/.pnpm/unplugin-vue-components@0.25.2_rollup@2.79.1_vue@3.3.4/node_modules/unplugin-vue-components/dist/vite.mjs";
import AutoImport from "file:///D:/study/3d_study/node_modules/.pnpm/unplugin-auto-import@0.16.7_rollup@2.79.1/node_modules/unplugin-auto-import/dist/vite.js";
import { createSvgIconsPlugin } from "file:///D:/study/3d_study/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_vite@4.4.5/node_modules/vite-plugin-svg-icons/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\study\\3d_study\\packages\\CesiumInit";
var r = (...args) => resolve(__vite_injected_original_dirname, ".", ...args);
var vite_config_default = defineConfig(({ command, mode }) => {
  const envConfig = loadEnv(mode, "./");
  const alias = {
    "~": `${resolve(__vite_injected_original_dirname, "./")}`,
    "@/": `${resolve(__vite_injected_original_dirname, "src")}/`
  };
  return {
    plugins: [
      vue(),
      cesium(),
      AutoImport({
        imports: ["vue", "vue-router"],
        dts: r("src/auto-imports.d.ts")
      }),
      // 组件按需引入
      Components({
        dirs: [r("src/components")],
        dts: false,
        resolvers: []
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹;path.resolve(process.cwd())的作用是将当前工作目录转换为绝对路径。
        iconDirs: [resolve(process.cwd(), "src/components/svg-icon/svgs")],
        // 指定symbolId格式
        symbolId: "[name]"
      })
    ],
    build: {
      target: ["edge90", "chrome90", "firefox90", "safari15"]
    },
    server: {
      // 开发时才生效
      port: envConfig.VITE_PORT,
      proxy: {
        "/api": {
          target: envConfig.VITE_API_BASEURL,
          ws: false,
          changeOrigin: true
          // rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    resolve: {
      alias
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxzdHVkeVxcXFwzZF9zdHVkeVxcXFxwYWNrYWdlc1xcXFxDZXNpdW1Jbml0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxzdHVkeVxcXFwzZF9zdHVkeVxcXFxwYWNrYWdlc1xcXFxDZXNpdW1Jbml0XFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9zdHVkeS8zZF9zdHVkeS9wYWNrYWdlcy9DZXNpdW1Jbml0L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBjZXNpdW0gZnJvbSAndml0ZS1wbHVnaW4tY2VzaXVtJ1xyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcclxuXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXHJcbmltcG9ydCB7IGNyZWF0ZVN2Z0ljb25zUGx1Z2luIH0gZnJvbSAndml0ZS1wbHVnaW4tc3ZnLWljb25zJ1xyXG5cclxuY29uc3QgciA9ICguLi5hcmdzKSA9PiByZXNvbHZlKF9fZGlybmFtZSwgJy4nLCAuLi5hcmdzKVxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgY29tbWFuZCwgbW9kZSB9KSA9PiB7XHJcbiAgY29uc3QgZW52Q29uZmlnID0gbG9hZEVudihtb2RlLCAnLi8nKVxyXG4gIGNvbnN0IGFsaWFzID0ge1xyXG4gICAgJ34nOiBgJHtyZXNvbHZlKF9fZGlybmFtZSwgJy4vJyl9YCxcclxuICAgICdALyc6IGAke3Jlc29sdmUoX19kaXJuYW1lLCAnc3JjJyl9L2BcclxuICB9XHJcbiAgcmV0dXJuIHtcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgdnVlKCksXHJcbiAgICAgIGNlc2l1bSgpLFxyXG4gICAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgICBpbXBvcnRzOiBbJ3Z1ZScsICd2dWUtcm91dGVyJ10sXHJcbiAgICAgICAgZHRzOiByKCdzcmMvYXV0by1pbXBvcnRzLmQudHMnKVxyXG4gICAgICB9KSxcclxuICAgICAgLy8gXHU3RUM0XHU0RUY2XHU2MzA5XHU5NzAwXHU1RjE1XHU1MTY1XHJcbiAgICAgIENvbXBvbmVudHMoe1xyXG4gICAgICAgIGRpcnM6IFtyKCdzcmMvY29tcG9uZW50cycpXSxcclxuICAgICAgICBkdHM6IGZhbHNlLFxyXG4gICAgICAgIHJlc29sdmVyczogW11cclxuICAgICAgfSksXHJcbiAgICAgIGNyZWF0ZVN2Z0ljb25zUGx1Z2luKHtcclxuICAgICAgICAvLyBcdTYzMDdcdTVCOUFcdTk3MDBcdTg5ODFcdTdGMTNcdTVCNThcdTc2ODRcdTU2RkVcdTY4MDdcdTY1ODdcdTRFRjZcdTU5Mzk7cGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCkpXHU3Njg0XHU0RjVDXHU3NTI4XHU2NjJGXHU1QzA2XHU1RjUzXHU1MjREXHU1REU1XHU0RjVDXHU3NkVFXHU1RjU1XHU4RjZDXHU2MzYyXHU0RTNBXHU3RUREXHU1QkY5XHU4REVGXHU1Rjg0XHUzMDAyXHJcbiAgICAgICAgaWNvbkRpcnM6IFtyZXNvbHZlKHByb2Nlc3MuY3dkKCksICdzcmMvY29tcG9uZW50cy9zdmctaWNvbi9zdmdzJyldLFxyXG4gICAgICAgIC8vIFx1NjMwN1x1NUI5QXN5bWJvbElkXHU2ODNDXHU1RjBGXHJcbiAgICAgICAgc3ltYm9sSWQ6ICdbbmFtZV0nXHJcbiAgICAgIH0pXHJcbiAgICBdLFxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgdGFyZ2V0OiBbJ2VkZ2U5MCcsICdjaHJvbWU5MCcsICdmaXJlZm94OTAnLCAnc2FmYXJpMTUnXVxyXG4gICAgfSxcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICAvLyBcdTVGMDBcdTUzRDFcdTY1RjZcdTYyNERcdTc1MUZcdTY1NDhcclxuICAgICAgcG9ydDogZW52Q29uZmlnLlZJVEVfUE9SVCxcclxuICAgICAgcHJveHk6IHtcclxuICAgICAgICAnL2FwaSc6IHtcclxuICAgICAgICAgIHRhcmdldDogZW52Q29uZmlnLlZJVEVfQVBJX0JBU0VVUkwsXHJcbiAgICAgICAgICB3czogZmFsc2UsXHJcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWVcclxuICAgICAgICAgIC8vIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJylcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJTLFNBQVMsY0FBYyxlQUFlO0FBQ2pWLE9BQU8sU0FBUztBQUNoQixPQUFPLFlBQVk7QUFDbkIsU0FBUyxlQUFlO0FBRXhCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsNEJBQTRCO0FBUHJDLElBQU0sbUNBQW1DO0FBU3pDLElBQU0sSUFBSSxJQUFJLFNBQVMsUUFBUSxrQ0FBVyxLQUFLLEdBQUcsSUFBSTtBQUN0RCxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLFNBQVMsS0FBSyxNQUFNO0FBQ2pELFFBQU0sWUFBWSxRQUFRLE1BQU0sSUFBSTtBQUNwQyxRQUFNLFFBQVE7QUFBQSxJQUNaLEtBQUssR0FBRyxRQUFRLGtDQUFXLElBQUksQ0FBQztBQUFBLElBQ2hDLE1BQU0sR0FBRyxRQUFRLGtDQUFXLEtBQUssQ0FBQztBQUFBLEVBQ3BDO0FBQ0EsU0FBTztBQUFBLElBQ0wsU0FBUztBQUFBLE1BQ1AsSUFBSTtBQUFBLE1BQ0osT0FBTztBQUFBLE1BQ1AsV0FBVztBQUFBLFFBQ1QsU0FBUyxDQUFDLE9BQU8sWUFBWTtBQUFBLFFBQzdCLEtBQUssRUFBRSx1QkFBdUI7QUFBQSxNQUNoQyxDQUFDO0FBQUE7QUFBQSxNQUVELFdBQVc7QUFBQSxRQUNULE1BQU0sQ0FBQyxFQUFFLGdCQUFnQixDQUFDO0FBQUEsUUFDMUIsS0FBSztBQUFBLFFBQ0wsV0FBVyxDQUFDO0FBQUEsTUFDZCxDQUFDO0FBQUEsTUFDRCxxQkFBcUI7QUFBQTtBQUFBLFFBRW5CLFVBQVUsQ0FBQyxRQUFRLFFBQVEsSUFBSSxHQUFHLDhCQUE4QixDQUFDO0FBQUE7QUFBQSxRQUVqRSxVQUFVO0FBQUEsTUFDWixDQUFDO0FBQUEsSUFDSDtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsUUFBUSxDQUFDLFVBQVUsWUFBWSxhQUFhLFVBQVU7QUFBQSxJQUN4RDtBQUFBLElBQ0EsUUFBUTtBQUFBO0FBQUEsTUFFTixNQUFNLFVBQVU7QUFBQSxNQUNoQixPQUFPO0FBQUEsUUFDTCxRQUFRO0FBQUEsVUFDTixRQUFRLFVBQVU7QUFBQSxVQUNsQixJQUFJO0FBQUEsVUFDSixjQUFjO0FBQUE7QUFBQSxRQUVoQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
