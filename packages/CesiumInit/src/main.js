import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import CesiumNavigation from 'cesium-navigation-es6'
import svgIcon from './components/svg-icon'
import 'ant-design-vue/dist/reset.css'
import { Dropdown, MenuItem, Menu, Select } from 'ant-design-vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(ElementPlus)
app.use(Dropdown)
app.use(Select)
app.use(Menu)

window.CesiumNavigation = CesiumNavigation
app.use(svgIcon)
app.use(router)
app.use(createPinia())
app.mount('#app')
