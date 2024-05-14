import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import glsl from 'vite-plugin-glsl'
export default defineConfig(({ command, mode }) => {
  const alias = {
    '~': `${resolve(__dirname, './')}`,
    '@/': `${resolve(__dirname, 'src')}/`
  }
  return {
    resolve: {
      alias
    },
    plugins: [
      vue({
        script: {
          refTransform: true
        }
      }),
      AutoImport({
        imports: ['vue', 'vue-router'],
        dts: resolve(__dirname, './src/auto-imports.d.ts')
      }),
      glsl()
    ]
  }
})
