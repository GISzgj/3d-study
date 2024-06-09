<template>
  <div>test</div>
  <el-button @click="handleTestClick" type="primary">测试</el-button>
  <el-button @click="clear">置空</el-button>
  <el-button @click="filter">修改部分Token</el-button>
</template>
<script setup lang="ts">
  import tool from '@/utils/tool'
  import { ElMessage } from 'element-plus'
  import userApi from '@/api/userApi'
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const handleTestClick = () => {
    userApi.userGetCurrent().then(res => {
      console.log('res.data', res.data)
      console.log(router.getRoutes())

      ElMessage('当前登录用户为：' + res.data.a.userName)
    })
  }
  const clear = () => {
    tool.loginUtils.logout()
    ElMessage('已清空登录后的缓存')
  }
  const filter = () => {
    // tool.loginUtils.doLogin('asdasdasd', ['asd'])
    ElMessage('已修改部分Token和Menu')
  }
</script>
<style lang="scss" scoped></style>
