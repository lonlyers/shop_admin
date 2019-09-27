<template>
  <div class="login">
    <el-form ref="form"  :rules="rules" :model="form" label-width="100px">
      <img src='../assets/1.jpeg' alt="">
      <el-form-item label="用户名" prop='username' >
        <el-input v-model="form.username" placeholder="请输入用户名" ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop='password'>
        <el-input v-model="form.password" placeholder="请输入用户密码" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click='login' :plain="true">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          // required 非空校验
          // message 提示消息
          // trigger 触发条件
          // min 和 max 长度校验
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 12, message: '用户名长度必须在3-12位', trigger: ['change', 'blur'] }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 3, max: 12, message: '密码长度必须在3-12位', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.form.resetFields()
    },
    async login () {
      try {
        this.$refs.form.validate()
        const res = await this.$axios({
          method: 'post',
          url: 'login',
          data: this.form
        })
        console.log(res)

        if (res.meta.status === 200) {
          // console.log(meta.msg)
          localStorage.setItem('token', res.data.token)
          this.$router.push('/index')
          this.$message.success(res.meta.msg)
        } else {
          // console.log(res.meta.msg)
          this.$message.error(res.meta.msg)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss">
$bgColor: #2d434c;

.login {
  width: 100%;
  height: 100%;
  list-style: none;
  background: $bgColor;
  overflow: hidden;

  .el-form {
    width: 400px;
    background-color: #fff;
    margin: 200px auto;
    padding: 75px 20px 20px;
    border-radius: 20px;
    position: relative;
    img {
      width: 120px;
      height: 120px;
      position: absolute;
      left: 50%;
      top: -70px;
      transform: translateX(-50%);
      border-radius: 50%;
      background-color: #fff;
      border: 5px solid #fff;

    }

    .el-button:last-child {
      margin-left: 80px;
    }
  }
}
</style>
