<script lang="ts" setup>
  import userApi from '@/api/userApi'
  import { ElMessage } from 'element-plus'
  import tool from '@/utils/tool'
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const goHome = () => {
    console.log('router', router)
    router.push('/')
  }
  const goLogin = () => {
    router.push('/login')
  }
  const goRegister = () => {
    router.push('/register')
  }
  const form = ref({
    userName: 'superAdmin',
    password: '123456'
  })

  const doLogin = () => {
    userApi.userLogin(form.value).then(res => {
      if (res.code == 200) {
        const token: string = res.data.token
        const menus: any[] = res.data.menus
        const userData = res.data.userData

        tool.loginUtils.doLogin(token, menus, userData)

        ElMessage.success('登录成功')
        goHome()
      } else {
        ElMessage.error(res.message)
      }
    })
  }
  const doRegister = () => {}
</script>

<template>
  <main>
    <el-form :model="form" label-width="80px">
      <el-form-item label="账号" prop="userName">
        <el-input placeholder="请填写账号" :maxLength="20" v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          placeholder="请填写密码"
          type="password"
          :maxLength="20"
          v-model="form.password"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="doLogin" type="primary">登录</el-button>
        <el-button @click="doRegister" type="primary">注册</el-button>
      </el-form-item>
    </el-form>
  </main>
</template>
<style lang="scss" scoped>
  main {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10%;
  }
</style>
