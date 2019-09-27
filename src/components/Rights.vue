<template>
  <div class="rights">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
      ref="singleTable"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="authName" label="权限名称" width="400"></el-table-column>
      <el-table-column property="path" label="路径" width="400"></el-table-column>
      <el-table-column  label="层级">
        <template v-slot:default="{ row: { level }}">
          <span v-if="level === '0'">一级</span>
          <span v-else-if="level === '1'">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: []
    }
  },
  async created () {
    const { data } = await this.$axios.get('rights/list')
    this.tableData = data
  }
}
</script>

<style lang='scss' scoped>
.el-breadcrumb {
  line-height: 40px;
  border-bottom: 1px solid #ccc;
}
</style>
