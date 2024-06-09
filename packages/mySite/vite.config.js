import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

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
      AutoImport({
        imports: ['vue', 'vue-router'],
        dts: r('src/auto-imports.d.ts')
      }),
      // 组件按需引入
      Components({
        dirs: [r('src/components')],
        dts: false,
        resolvers: []
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
        }
      }
    },
    resolve: {
      alias
    }
  }
})
