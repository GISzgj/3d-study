import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { resolve } from 'path'
const r = (...args) => resolve(__dirname, '.', ...args)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: r('src/auto-imports.d.ts')
    })
  ],
  resolve: {
    alias: {
      '~': `${resolve(__dirname, './')}`,
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
