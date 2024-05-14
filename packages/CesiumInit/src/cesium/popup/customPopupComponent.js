import { markRaw, defineAsyncComponent } from 'vue'
// 自定义表单导入
const modules = import.meta.glob('/src/cesium/popup/component/**.vue')
const notFound = () => import(/* @vite-ignore */ `/src/cesium/popup/component/404.vue`)

// 直接渲染组件
export const loadComponent = component => {
  // component :   /src/views/selectAction/Reaname.vue
  if (component) {
    const link = modules[`/src/cesium/popup/component/${component}.vue`]
    // console.log(modules)
    // return markRaw(defineAsyncComponent(link ? link : notFound))
    return markRaw(link())
  } else {
    return markRaw(notFound())
  }
}
