import HomeView from '../views/HomeView.vue'
import layout from '../layout/index.vue'
import loginCom from '@/views/system/login/index.vue'
import homePageCom from '@/views/homePage/index.vue'
import { createRouter, createWebHistory, type Router, type RouteRecordRaw } from 'vue-router'
const defaultMenus = [
  {
    path: '/index',
    id: 0,
    parentId: 0,
    type: 2,
    meta: {
      title: '首页',
      icon: 'ep:lollipop'
    },
    sortWeight: 0
  },
  {
    path: '/about',
    id: 9999,
    type: 2,
    parentId: 0,
    meta: {
      title: '关于',
      icon: 'ep:lollipop'
    },
    sortWeight: 9999
  },
  {
    path: '/test',
    id: 99999,
    type: 2,
    parentId: 0,
    meta: {
      title: '测试',
      icon: 'ep:lollipop'
    },
    sortWeight: 99999
  }
]
// 静态路由
const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'layout',
    component: layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        name: 'index',
        component: homePageCom,
        meta: {
          title: '首页'
        }
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('../views/AboutView.vue'),
        meta: {
          title: '关于'
        }
      },
      {
        path: '/test',
        name: 'test',
        component: () => import('../views/test.vue'),
        meta: {
          title: '测试'
        }
      }
    ]
  },

  {
    path: '/login',
    name: 'login',
    component: loginCom
  }
]
export { defaultMenus, constantRoutes }
