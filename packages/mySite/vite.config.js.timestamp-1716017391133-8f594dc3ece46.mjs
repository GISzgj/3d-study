// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///D:/study/3d_study/node_modules/.pnpm/vite@5.2.8_sass@1.69.5/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/study/3d_study/node_modules/.pnpm/@vitejs+plugin-vue@5.0.4_vite@5.2.8_vue@3.4.21/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "file:///D:/study/3d_study/node_modules/.pnpm/unplugin-auto-import@0.16.7/node_modules/unplugin-auto-import/dist/vite.js";
import { resolve } from "path";
var __vite_injected_original_dirname = "D:\\study\\3d_study\\packages\\mySite";
var __vite_injected_original_import_meta_url = "file:///D:/study/3d_study/packages/mySite/vite.config.js";
var r = (...args) => resolve(__vite_injected_original_dirname, ".", ...args);
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue", "vue-router"],
      dts: r("src/auto-imports.d.ts")
    })
  ],
  resolve: {
    alias: {
      "~": `${resolve(__vite_injected_original_dirname, "./")}`,
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxzdHVkeVxcXFwzZF9zdHVkeVxcXFxwYWNrYWdlc1xcXFxteVNpdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHN0dWR5XFxcXDNkX3N0dWR5XFxcXHBhY2thZ2VzXFxcXG15U2l0ZVxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovc3R1ZHkvM2Rfc3R1ZHkvcGFja2FnZXMvbXlTaXRlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcbmNvbnN0IHIgPSAoLi4uYXJncykgPT4gcmVzb2x2ZShfX2Rpcm5hbWUsICcuJywgLi4uYXJncylcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICBBdXRvSW1wb3J0KHtcbiAgICAgIGltcG9ydHM6IFsndnVlJywgJ3Z1ZS1yb3V0ZXInXSxcbiAgICAgIGR0czogcignc3JjL2F1dG8taW1wb3J0cy5kLnRzJylcbiAgICB9KVxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICd+JzogYCR7cmVzb2x2ZShfX2Rpcm5hbWUsICcuLycpfWAsXG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKVxuICAgIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1IsU0FBUyxlQUFlLFdBQVc7QUFFbFUsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsZUFBZTtBQUx4QixJQUFNLG1DQUFtQztBQUEwSSxJQUFNLDJDQUEyQztBQU1wTyxJQUFNLElBQUksSUFBSSxTQUFTLFFBQVEsa0NBQVcsS0FBSyxHQUFHLElBQUk7QUFHdEQsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osV0FBVztBQUFBLE1BQ1QsU0FBUyxDQUFDLE9BQU8sWUFBWTtBQUFBLE1BQzdCLEtBQUssRUFBRSx1QkFBdUI7QUFBQSxJQUNoQyxDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxHQUFHLFFBQVEsa0NBQVcsSUFBSSxDQUFDO0FBQUEsTUFDaEMsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxJQUN0RDtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
