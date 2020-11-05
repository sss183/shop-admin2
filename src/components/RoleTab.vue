<template>
    <el-table :data="roleData" border style="width: 100%">
      <el-table-column prop="rolename" label="名称" width="180"> </el-table-column>
      <el-table-column  label="状态" width="180">
           <template slot-scope="scope">
              <el-tag type="success" effect="dark" v-if="scope.row.status == '1'">启用</el-tag>
              <el-tag type="danger"  effect="dark" v-else>禁用</el-tag>
          </template> 
      </el-table-column>
      <el-table-column  label="操作"> 
          <template slot-scope="scope">
             <el-button size="mini" @click="$emit('edit',scope.row.id)">编辑</el-button>
             <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
      </el-table-column>
    </el-table>
</template>
<script>
export default {
    props:{
        roleData:{
            type:Array
        }
    },
    methods:{
       async delFn(id){
        let str  =  this.$qs.stringify({ id });
        let res = await this.$axios.post(this.$api.ROLEDELETE,str);
        if(res.code==200){
                 this.$message.success("删除成功");
                 this.$emit("del",res.list)//触发自定义删除事件，把值传过去
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
          this.delFn(id);
        }).catch(() => {});        
      }, 
    }
}
</script>