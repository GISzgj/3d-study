import { createRouter, createWebHistory, type Router, type RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import tool from '@/utils/tool'
import { constantRoutes, defaultMenus } from './constantRoutes'
// 进度条配置
NProgress.configure({ showSpinner: false, speed: 500 })

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  strict: true,
  scrollBehavior(to, from, savedPosition) {
    return new Promise(resolve => {
      if (savedPosition) {
        return savedPosition
      } else {
        if (from.meta.saveSrollTop) {
          const top: number = document.documentElement.scrollTop || document.body.scrollTop
          resolve({ left: 0, top })
        }
      }
    })
  }
})
router.getMenu = () => {
  const menus = tool.loginUtils.getAsyncMenus()
  // id 升序
  return menus.concat(defaultMenus).sort((a, b) => a.id - b.id)
}

// ---调整代码顺序
const loadComponent = (component?: string): (() => Promise<any>) => {
  const modules = import.meta.glob('/src/views/**/*.vue')

  if (component) {
    return modules[`/src/views/${component}.vue`]
  } else {
    // 对于type为1的路由应该展示位空
    return () => import(/* @vite-ignore */ `/src/layout/other/empty.vue` as any)
  }
}
const filterAsyncRouter = (routerMap: any) => {
  const accessedRouters: any[] = []
  routerMap.forEach((item: any) => {
    item.meta = item.meta ? item.meta : {}
    // MAP转路由对象
    const route = {
      path: item.path,
      name: item.meta.title,
      meta: item.meta,
      children: item.children ? filterAsyncRouter(item.children) : null,
      component: loadComponent(item.codePath)
    }
    accessedRouters.push(route)
  })
  return accessedRouters
}

const flatAsyncRoutes = (routes: any, breadcrumb: any[] = []) => {
  const res: any[] = []
  routes.forEach((route: any) => {
    const tmp = { ...route }
    if (tmp.children) {
      const childrenBreadcrumb: any[] = [...breadcrumb]
      childrenBreadcrumb.push(route)
      const tmpRoute = { ...route }
      delete tmpRoute.children
      res.push(tmpRoute)
      const childrenRoutes = flatAsyncRoutes(tmp.children, childrenBreadcrumb)
      childrenRoutes.map(item => {
        res.push(item)
      })
    } else {
      const tmpBreadcrumb: any[] = [...breadcrumb]
      tmpBreadcrumb.push(tmp)
      res.push(tmp)
    }
  })
  return res
}
// 添加路由
function addAsyncRoute(menus: any[]) {
  const routeMenus = filterAsyncRouter(menus)
  for (let route of flatAsyncRoutes(routeMenus)) {
    router.addRoute('layout', route)
  }
}
let isGetRouter: boolean = false
// 路由守卫
const whiteList: Array<string> = ['']

router.beforeEach((to, from, next) => {
  NProgress.start()
  // 过滤白名单: 不需要判断Token， 不经过路由守卫
  if (whiteList.includes(to.path)) {
    next()
    NProgress.done()
    return false
  }
  const token = tool.loginUtils.getToken()
  if (to.path === '/login') {
    // 如果token存在
    if (!!token) {
      next({
        path: '/'
      })
    }
    // token不存在， 就前往/login
    next()
    return false
  }
  if (!token) {
    next({
      path: '/login'
    })
    return false
  }
  if (!isGetRouter) {
    const menus = tool.loginUtils.getAsyncMenus()
    addAsyncRoute(menus)
    isGetRouter = true
    next({ ...to, replace: true })
    return false
  }
  next()
  return false
})
router.afterEach(() => {
  NProgress.done()
})

export default router
