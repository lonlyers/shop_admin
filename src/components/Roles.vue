<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button plain type="success" @click="adduserVisible=true">添加角色</el-button>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template v-slot:default="obj">
          <el-row class="l1" v-for="l1 in obj.row.children" :key='l1.key'>
            <el-col :span="4">
              <el-tag closable @close="delqx(obj.row,l1)">{{ l1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="l2 in l1.children" :key='l2.key'>
                <el-col :span="4">
                  <el-tag type="success" closable @close="delqx(obj.row,l2)">{{l2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-row>
                    <el-col>
                      <el-tag v-for="l3 in l2.children" :key='l3.key' type="warning" closable  @close="delqx(obj.row,l3)">{{l3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" prop="desc">
        <template v-slot:default="obj">
          <el-button
            plain
            size="small"
            type="primary"
            icon="el-icon-edit"
            @click="editUser(obj.row)"
          ></el-button>
          <el-button
            plain
            size="small"
            type="danger"
            icon="el-icon-delete"
            @click="deletUsers(obj.row)"
          ></el-button>
          <el-button plain size="small" type="success" icon="el-icon-check" @click="grantUser">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>
        <el-tree
          :data="data"
          show-checkbox
          node-key="id"
          :default-expanded-keys="[2, 3]"
          :default-checked-keys="[5]"
          :props="defaultProps"
        ></el-tree>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary">分配</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="adduserVisible" width="40%">
      <span>
        <el-form :model="adduserForm" status-icon :rules="rules" ref="adduserForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="角色名称" prop="roleName">
              <el-input  v-model="adduserForm.roleName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input  v-model="adduserForm.roleDesc" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adduserVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      adduserVisible: false,
      tableData: [],
      data: [],
      adduserForm: {
        roleName: '',
        roleDesc: ''
      },
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserlist()
  },
  methods: {
    async getUserlist () {
      const { data } = await this.$axios.get('roles')
      // console.log(data)
      this.tableData = data
    },
    async deletUsers (row) {
      // console.log(row)
      try {
        await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`roles/${row.id}`)
        if (meta.status === 200) {
          this.$message.success('删除成功')
          this.getUserlist()
        } else {
          this.$message.error('取消删除')
        }
      } catch (error) {
        console.log(error)
        this.$message.error('删除角色失败')
      }
    },
    // 分配权限
    async grantUser () {
      this.dialogVisible = true
      const { data } = await this.$axios.get('rights/tree')
      this.data = data
    },
    // 删除角色指定权限
    async delqx (row, obj) {
      // console.log(id, obj.id)
      const { data, meta } = await this.$axios.delete(
        `roles/${row.id}/rights/${obj.id}`
      )
      if (meta.status === 200) {
        this.$message.success('删除权限成功')
        row.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 添加角色
    async adduser () {
      try {
        await this.$refs.adduserForm.validate()
        const { meta } = await this.$axios.post('roles', this.adduserForm)
        // console.log(res)4
        if (meta.status === 201) {
          this.$message.success('添加成功')
          this.$refs.adduserForm.resetFields()
          this.adduserVisible = false
          this.getUserlist()
        } else {
          this.$message.error(meta.msg)
        }
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
.el-button {
  margin: 10px 0;
}
.l1 {
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px dotted #000;
  .el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
