<template>
    <el-row style="margin:2%">
      <cube-button @click="handlerQuitClick()">退出登录</cube-button>
    </el-row>
</template>

<script>
export default {
  name: 'me-setting',
  methods: {
    handlerQuitClick () {
      localStorage.removeItem('uid', 'tokenType', 'refreshToken', 'accessToken')
      this.$router.push('/login')
    }
  }
}
</script>

<style></style>
