<template>
  <div class="header-bar-container">
    <div @click="test" style="margin-right: 20px"><<</div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="item in breadcrumbPaths" :to="{ path: item.path }">
        {{ item.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script lang="ts" setup>
  import { type Router, type RouteRecordRaw } from 'vue-router'
  import tool from '@/utils/tool'
  import { layoutStore } from '@/stores/layout'
  import router from '@/router'
  const layout = layoutStore()
  const test = () => {
    layout.MENU_IS_COLLAPSE = !layout.MENU_IS_COLLAPSE
    console.log(layout)
    console.log(layout.MENU_IS_COLLAPSE)
  }
  const menus = ref()
  const breadcrumbPaths = ref([] as any[])
  onMounted(() => {
    menus.value = router.getMenu()
  })

  watch(
    () => router.currentRoute.value.fullPath,
    (newVal, oldVal) => {
      const parentPath = getParentPaths(newVal, menus.value || router.getMenu(), 'path')
      console.log('router.currentRoute.value', router.currentRoute.value)

      const path = parentPath.concat({
        path: router.currentRoute.value.fullPath,
        title: router.currentRoute.value.meta.title
      })
      breadcrumbPaths.value = path
    },
    { immediate: true, deep: true }
  )

  /** 通过指定 `key` 获取父级路径集合，默认 `key` 为 `path` */
  function getParentPaths(value: string, routes: RouteRecordRaw[], key = 'path') {
    // 深度遍历查找
    function dfs(routes: RouteRecordRaw[], value: string, parents: any[]) {
      for (let i = 0; i < routes.length; i++) {
        const item: any = routes[i]
        // 返回父级path
        if (item[key] === value) return parents
        // children不存在或为空则不递归
        if (!item.children || !item.children.length) continue
        // 往下查找时将当前path入栈
        if (item.type == 1) {
          parents.push({
            path: item.children[0]?.path || '/index',
            title: item.meta.title || item.name
          })
        } else {
          parents.push({
            path: item.path,
            title: item.meta.title || item.name
          })
        }

        if (dfs(item.children, value, parents).length) return parents
        // 深度遍历查找未找到时当前path 出栈
        parents.pop()
      }
      // 未找到时返回空数组
      return []
    }

    return dfs(routes, value, [])
  }
</script>
<style lang="scss" scoped>
  .header-bar-container {
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    // #######
    // background-color: red;
  }
</style>
