<script setup>
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  const form = ref({
    userName: 'superAdmin',
    password: '123456'
  })
  const base = 'http://localhost:3000'
  const token = ref('')
  const handleClick = () => {
    axios.post(base + '/api/user/login', form.value).then(res => {
      console.log(res)
      token.value = res.data.data
    })
  }
  const handleSignClick = () => {
    axios.post(base + '/api/user/register', form.value).then(res => {
      console.log(res)
      token.value = res.data.data
    })
  }
  const handleTestClick = () => {
    axios
      .get(base + '/api/user/current', {
        headers: {
          token: token.value
        }
      })
      .then(res => {
        console.log(res)
        ElMessage('当前登录用户为：' + res.data.data.userName)
      })
  }
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
        <el-button @click="handleClick" type="primary">登录</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleSignClick" type="primary">注册</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleTestClick" type="primary">测试</el-button>
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
