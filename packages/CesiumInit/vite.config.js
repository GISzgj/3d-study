import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import cesium from 'vite-plugin-cesium'
import { resolve } from 'path'

import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const r = (...args) => resolve(__dirname, '.', ...args)
export default defineConfig(({ command, mode }) => {
  const envConfig = loadEnv(mode, './')
  const alias = {
    '~': `${resolve(__dirname, './')}`,
    '@/': `${resolve(__dirname, 'src')}/`
  }
  return {
    plugins: [
      vue(),
      cesium(),
      AutoImport({
        imports: ['vue', 'vue-router'],
        dts: r('src/auto-imports.d.ts')
      }),
      // 组件按需引入
      Components({
        dirs: [r('src/components')],
        dts: false,
        resolvers: []
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹;path.resolve(process.cwd())的作用是将当前工作目录转换为绝对路径。
        iconDirs: [resolve(process.cwd(), 'src/components/svg-icon/svgs')],
        // 指定symbolId格式
        symbolId: '[name]'
      })
    ],
    build: {
      target: ['edge90', 'chrome90', 'firefox90', 'safari15']
    },
    server: {
      // 开发时才生效
      port: envConfig.VITE_PORT,
      proxy: {
        '/api': {
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
  }
})
