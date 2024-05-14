import { markRaw, defineAsyncComponent } from 'vue'
// 自定义表单导入
const modules = import.meta.glob('/src/views/components/PresentationComponents/**.vue')

// 直接渲染组件
export const loadComponent = component => {
  // component :   /src/views/selectAction/Reaname.vue
  if (component) {
    const link = modules[`/src/views/components/PresentationComponents/${component}.vue`]
    return markRaw(defineAsyncComponent(link ? link : notFound))
  }
}
