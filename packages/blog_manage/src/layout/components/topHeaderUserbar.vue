<template>
  <div class="userbar-container">
    <el-tooltip content="全屏" :hide-after="10" placement="bottom">
      <div class="panel-item" @click="fullscreen">
        <el-icon><FullScreen /></el-icon>
      </div>
    </el-tooltip>
    <el-dropdown :hide-on-click="false" class="panel-item">
      <span class="user-container">
        <el-avatar :size="38" :src="userData?.avator || '/LOGO.png'"></el-avatar>
        <span style="margin-left: 5px">{{ userData?.nickname || 'admin' }}</span>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="clearCache">清除缓存</el-dropdown-item>
          <el-dropdown-item @click="loginOut">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script setup>
  import { FullScreen } from '@element-plus/icons-vue'
  import tool from '@/utils/tool'
  import { watch } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import router from '@/router'
  const userData = ref({})
  const isFullScreen = ref(false)
  onMounted(() => {
    userData.value = tool.loginUtils.getUserData()
    console.log(userData.value)
  })
  const fullscreen = () => {
    isFullScreen.value = !isFullScreen.value
  }
  const clearCache = () => {
    ElMessageBox.confirm('确定要清除缓存吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(res => {
        tool.loginUtils.logout()
        ElMessage.success('清除成功')
        window.location.reload()
      })
      .catch(err => {
        console.log(err)
      })
  }
  const loginOut = () => {
    ElMessageBox.confirm('确定退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(res => {
        tool.loginUtils.logout()
        // window.location.reload()
        router.go('/login')
      })
      .catch(err => {
        console.log(err)
      })
  }
  watch(
    () => isFullScreen.value,
    newVal => {
      const element = document.documentElement
      if (newVal) {
        fullScreen(element)
      } else {
        exitFullScreen(element)
      }
    }
  )
  // 进入全屏
  function fullScreen(element) {
    if (element.requestFullScreen) {
      element.requestFullScreen()
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen()
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen()
    }
  }
  // 退出全屏
  function exitFullScreen(el) {
    var el = document,
      cfs =
        el.cancelFullScreen ||
        el.webkitCancelFullScreen ||
        el.mozCancelFullScreen ||
        el.exitFullScreen,
      wscript
    if (typeof cfs != 'undefined' && cfs) {
      cfs.call(el)
      return
    }
    if (typeof window.ActiveXObject != 'undefined') {
      wscript = new ActiveXObject('WScript.Shell')
      if (wscript != null) {
        wscript.SendKeys('{F11}')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .userbar-container {
    display: flex;
    height: 100%;
    align-items: center;
    .user-container {
      display: flex;
      align-items: center;
      justify-content: center;
      outline: none;
    }
    .panel-item {
      padding: 0 10px;
      min-width: 30px;
      cursor: pointer;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .panel-item:hover {
      background: #f6f6f6;
    }
  }
</style>
