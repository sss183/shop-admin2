<template>
  <el-table
    :data="menuData"
    border
    style="width: 100%"
    row-key="id"
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
  >
    <el-table-column prop="title" label="名称" width="180"></el-table-column>
    <el-table-column prop="icon" label="图标" width="180">
      <!-- 插槽 -->
      <template slot-scope="scope">
        <i :class="scope.row.icon"></i>
      </template>
    </el-table-column>
    <el-table-column prop="type" label="类型">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.type == '1'">目录</el-tag>
        <el-tag type="success" v-if="scope.row.type == '2'">菜单</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="url" label="菜单URL"> </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button size="mini" @click="$emit('edit',scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
    props:{
        menuData:{
            type:Array
        }
    },
    methods:{
      async delMenu(id){
         let str  =  this.$qs.stringify({ id });
        let res = await this.$axios.post(this.$api.MENUDELETE,str);
        if(res.code==200){
                 this.$message.success("删除成功");
                 //触发父组件(Menu.vue)的自定事件changeMenuData
                  this.$emit("changeMenuData",res.list);
          }else{
                 this.$message.erroer(res.msg);
           }
      },
      handleDelete(id){
          this.$confirm('此操作将永久删除该文件, 是否继续?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delMenu(id);
        }).catch(() => {});        
      },

    }
}
</script>