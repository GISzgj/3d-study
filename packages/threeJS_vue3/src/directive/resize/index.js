import { ref } from 'vue'
import debounce from '@/utils/debounce.js'
export default app => {
  app.directive('Gresize', {
    mounted(el, binding) {
      const { value: callback } = binding
      const width = ref(0)
      const height = ref(0)
      function handleResize() {
        width.value = el.clientWidth
        height.value = el.clientHeight
        callback({ el, width: width.value, height: height.value })
      }

      // 监听窗口大小变化，调用 handleResize
      window.addEventListener('resize', debounce(handleResize, 200))

      // 初始时调用一次 handleResize
      handleResize()

      // 在组件卸载前移除事件监听
      onUnmounted(() => {
        window.removeEventListener('resize', handleResize)
      })
    }
  })
}
