<template>
  <el-container class="app-container">
    <el-aside :width="variablesCSS.sideBarWidth" class="sidebar-container">
      <div class="top-logo-container">
        <div class="logo-bar">
          <img src="/LOGO.png" class="logo" />
          <span>后台管理</span>
        </div>
      </div>
      <Menu></Menu>
    </el-aside>
    <el-container class="container">
      <el-header :height="variablesCSS.headerHeight" class="top-header">
        <div class="header-left">
          <TopHeaderbar></TopHeaderbar>
        </div>
        <div class="header-right">
          <TopHeaderUserbar />
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
  import variablesCSS from '@/styles/variables.module.scss'
  import Menu from './components/menu.vue'
  import TopHeaderUserbar from './components/topHeaderUserbar.vue'
  import TopHeaderbar from './components/topHeaderbar.vue'
  console.log('variablesCSS', variablesCSS)
</script>

<style lang="scss" scoped>
  @use '@/styles/variables.module.scss';
  .app-container {
    position: relative;
    width: 100%;
    height: 100%;
    .sidebar-container {
      transition: margin-left #{variables.$sideBarDuration};
      height: 100%;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 1001;
      overflow: hidden;
      background-color: variables.$menuBg;
      .top-logo-container {
        // width: 100%;
        display: flex;
        align-items: center;
        padding-left: 20px;
        background-color: variables.$subMenuBg;
        height: variables.$headerHeight;
        overflow: hidden;
        border-bottom: 1px solid rgba(77, 77, 77, 0.2);
        box-sizing: border-box;
      }
    }

    .logo-bar {
      font-weight: bold;
      display: flex;
      align-items: center;
      font-size: 26px;
      font-weight: 600;
      color: #fff;
      .logo {
        margin-right: 10px;
        width: 35px;
        height: 35px;
      }
    }
  }
  .container {
    width: calc(100% - variables.$sideBarWidth);
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    transition: all 0.28s;
    .top-header {
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      border-bottom: 1px solid rgba(77, 77, 77, 0.2);
      background-color: variables.$topHeaderBg;
      box-sizing: border-box;
      .header-left {
        display: flex;
        align-items: center;
        padding-left: 20px;
        max-width: 40vw;
      }
      .header-right {
        display: flex;
        // flex: 1;
        align-items: center;
      }
    }
  }
</style>
