import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹;path.resolve(process.cwd())的作用是将当前工作目录转换为绝对路径。
      iconDirs: [path.resolve(process.cwd(), 'src/components/svg-icon/svgs')],
      // 指定symbolId格式
      symbolId: '[name]'
    })
  ]
})
