<template>
  <el-scrollbar class="layout-menu">
    <el-menu
      :router="true"
      unique-opened
      :default-active="defaultActive"
      :collapse="layout.MENU_IS_COLLAPSE"
      :collapse-transition="true"
    >
      <template v-for="item in routerMenus" :key="item.id">
        <el-menu-item @click="test" v-if="!item.children || item.type === 2" :index="item.path">
          <el-icon><message /></el-icon>
          <span>{{ item.meta.title }}</span>
        </el-menu-item>
        <el-sub-menu v-else :index="item.path">
          <template #title>
            <el-icon><message /></el-icon>
            <span>{{ item.meta.title }}</span>
          </template>
          <el-menu-item v-for="it in item.children" :index="it.path" :key="it.id">
            <el-icon><message /></el-icon>
            <span>{{ it.meta.title }}</span>
          </el-menu-item>
          <!-- 之后可以支持三级路由 -->
        </el-sub-menu>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts" setup>
  import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue'
  import tool from '@/utils/tool'
  import { useRouter } from 'vue-router'
  import { layoutStore } from '@/stores/layout'
  const layout = layoutStore()
  const test = () => {
    console.log('asd', layout.MENU_IS_COLLAPSE)
  }
  // 获取当前的路由
  const router = useRouter()
  const defaultActive = ref('test')
  watch(
    () => router.currentRoute.value,
    (nval, oldval) => {
      defaultActive.value = nval.path || '/test'
    },
    { immediate: true }
  )
  // 设置路由menu
  const routerMenus = ref([] as any[])

  const setRouteMenus = () => {
    const menus = router.getMenu()
    routerMenus.value = [...menus]
    console.log('menus', routerMenus.value)
  }
  onBeforeMount(() => {
    setRouteMenus()
  })
</script>

<style lang="scss" scoped>
  @use '@/styles/variables.module.scss';
  .layout-menu {
    --el-menu-bg-color: #{variables.$menuBg};
    --el-menu-hover-bg-color: #{variables.$menuHover};
    --el-menu-text-color: #{variables.$menuText};
    --el-menu-active-color: #{variables.$menuActiveText};
    :deep(.el-scrollbar__view) {
      height: 100%;
      .el-menu {
        border: none;
        height: 100%;
        // width: 100%;
        // 最外层的el-menu--vertical
        &.el-menu--vertical {
          .el-sub-menu > .el-sub-menu__title {
            background-color: variables.$subMenuBg;
          }
          > .el-menu-item {
            background-color: variables.$subMenuBg;
          }
        }
        & .el-menu-item {
          // :hover 和 .is-active 顺序不能变化
          &:hover {
            color: variables.$menuActiveText;
            background-color: variables.$menuHover;
          }
          &.is-active {
            background-color: variables.$menuActive;
          }
        }
      }
    }
  }
</style>
