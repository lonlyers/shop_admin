<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="search">
      <el-input placeholder="请输入内容" v-model="input" class="input-with-select">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success" plain>添加用户</el-button>
    </div>
    <div class="users-table">
      <template>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="username" label="姓名" width="180"></el-table-column>
          <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
          <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
          <el-table-column label="用户状态">
            <template v-slot:default="obj">
              <el-switch v-model="obj.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop label="操作">
            <el-button plain size="small" type="primary" icon="el-icon-edit"></el-button>
            <el-button plain size="small" type="danger" icon="el-icon-delete"></el-button>
            <el-button plain size="small" type="success" icon="el-icon-check">分配角色</el-button>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <div class="pagetotel">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[2,4,]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      tableData: [],
      query: '',
      pagenum: 1,
      pagesize: 4,
      input: '',
      total: '',
      currentPage4: 4
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    getUserList () {
      axios
        .get('http://localhost:8888/api/private/v1/users', {
          params: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          },
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })
        .then(res => {
          console.log(res)
          const { users } = res.data.data
          this.total = res.data.data.total
          this.tableData = users
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = `${val}`
      this.getUserList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = `${val}`
      this.getUserList()
    }
  }
}
</script>

<style lang='scss' scoped>
.el-breadcrumb {
  line-height: 40px;
  border-bottom: 1px solid #ccc;
}
.search {
  margin: 10px 0;
  .el-input {
    width: 300px;
    margin-right: 15px;
  }
}
</style>
