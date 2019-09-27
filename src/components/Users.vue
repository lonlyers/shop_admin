<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="search">
      <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="searchUsers"></el-button>
      </el-input>
      <el-button type="success" plain @click="dialogFormVisible = true">添加用户</el-button>
    </div>
    <div class="users-table">
      <template>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="username" label="姓名" width="180"></el-table-column>
          <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
          <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
          <el-table-column label="用户状态">
            <template v-slot:default="obj">
              <el-switch
                v-model="obj.row.mg_state"
                @change="changstate(obj.row)"
                active-color="#13ce66"
                inactive-color="#ff4949"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop label="操作">
            <template v-slot:default="obj">
              <el-button plain size="small" type="primary" icon="el-icon-edit"></el-button>
              <el-button
                plain
                size="small"
                type="danger"
                icon="el-icon-delete"
                @click="deletUsers(obj.row)"
              ></el-button>
              <el-button plain size="small" type="success" icon="el-icon-check">分配角色</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <div class="pagetotel">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2,4,]"
        :page-size="pagesize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <!-- 添加用户弹出框 -->
    <el-dialog title="添加用户"  :visible.sync="dialogFormVisible" label-width="300px">
      <el-form :model="form" :rules="rules" ref="addForm" status-icon>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="form.password" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      query: '',
      pagenum: 1,
      pagesize: 4,
      total: 0,
      dialogFormVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      formLabelWidth: '100px',
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const res = await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      this.total = res.data.total
      this.tableData = res.data.users
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getUserList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
    },
    async deletUsers (data) {
      try {
        await this.$confirm('是否删除此用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.$axios.delete(`users/${data.id}`)
        console.log(res)

        if (res.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          if (this.tableData.length === 1 && this.pagenum > 1) {
            // console.log(1)
            this.pagenum--
          }
          this.getUserList()
        } else {
          this.$message({
            type: 'info',
            message: res.meta.msg
          })
        }
      } catch (err) {
        this.$message({
          type: 'error',
          message: '删除失败'
        })
      }
    },
    async changstate (data) {
      const uid = data.id
      const res = await this.$axios.put(`users/${uid}/state/true`, 'utf-8')

      if (res.meta.status === 200) {
        this.$message({
          type: 'success',
          message: '设置成功'
        })
      } else {
        this.$message({
          type: 'success',
          message: res.meta.msg
        })
      }
    },
    searchUsers () {
      this.getUserList()
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    async addUsers () {
      try {
        await this.$refs.addForm.validate()

        // console.log(1)
        const res = await this.$axios.post('users', {
          username: this.form.username,
          password: this.form.password,
          email: this.form.email,
          mobile: this.form.mobile
        })
        if (res.meta.status === 201) {
          this.$message.success('添加成功')
        } else {
          this.$message.error(res.meta.msg)
        }
        this.dialogFormVisible = false
        this.getUserList()
      } catch (error) {
        console.log(error)
      }
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
