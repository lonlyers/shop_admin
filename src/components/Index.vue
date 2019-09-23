<template>
  <div class="index">
    这是index组件
    <el-button @click="loginout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    loginout () {
      localStorage.setItem('token', '')
      this.$router.push('/login')
    }
  }
}
</script>

<style>

</style>
