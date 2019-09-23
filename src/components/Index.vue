<template>
  <el-container>
    <el-header>
      <div class="logo">
        <img src="../assets/03.png" alt="">
      </div>
      <div class="title">后台电商管理系统</div>
      <div class="loginout" @click="out">欢迎光临~<a href="javascript:0">退出</a></div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
          unique-opened
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/users" ><i class="el-icon-menu"></i> 用户列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="roles"><i class="el-icon-menu"></i>角色列表</el-menu-item>
            </el-menu-item-group>
                  <el-menu-item-group>
              <el-menu-item index="rights"><i class="el-icon-menu"></i>权限列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    out () {
      this.$confirm('请确认是否退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        localStorage.removeItem('token')
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.el-container {
  height: 100%;
  .el-header{
    display: flex;
    .logo{
      width: 180px;
      height: 40px;
      margin: 10px 0;
      img{
        height:  100%;
      }
    }
    .title{
      line-height: 60px;
      font-size: 24px;
      color:#545c64;
      font-weight: 700;
      flex: 1;
      text-align: center;
    }
    .loginout{
      line-height: 60px;
      font-weight: 700;
      a{
        color: rgb(238, 124, 42)
      }
    }
  }
  .el-aside {
    background-color: #545c64;
    .el-menu{
      border-right: none
    }
  }
  .el-header {
    background-color: #ecf0f1;
  }
  .el-main{
    background-color: rgb(216, 218, 215);
  }
}
</style>
