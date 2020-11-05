<template>
  <div class="member">
        <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 轮播图表格列表 -->
    <el-table :data="memberData" border style="width: 100%">
      <el-table-column prop="nickname" label="昵称" width="180"> </el-table-column>
      <el-table-column prop="phone" label="手机号" width="180"></el-table-column>
      <el-table-column :formatter="timestampToTime" prop="addtime" label="注册日期" width="180"></el-table-column>
      <el-table-column  label="操作"> 
          <template slot-scope="scope">
            <el-button size="mini" @click="editFn(scope.row.uid)">编辑</el-button>
          </template>
      </el-table-column>
    </el-table> 
     <!-- -----------分页器----------- -->
    <el-pagination
        background
        layout="prev, pager, next"
        :page-size="size"
        :total="total"
        @current-change="pageChange"
        :current-page="page">
    </el-pagination>
    <!-- 会员修改对话框--------- -->
    <el-dialog title="会员修改" :visible.sync="dialogVisible" width="40%">
      <el-form
        :model="formData"
        label-width="100px">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formData.nickname"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
           <el-input v-model="formData.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="formData.status"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
   data(){
     return{
        memberData:[],
        dialogVisible:false,
        page:1,
        size:3,
        total:0,
        formData:{
           nickname:"",
           phone:"",
           password:"",
           status:true
        },    
     }
   },
   mounted(){
      this.getmemberData();
   },
   methods:{
       /*----------- 获取会员列表全部数据------------  */
       async getmemberData(){
          let res = await this.$axios.get(this.$api.MEMBERLIST,{page:this.page,size:this.size});
          this.total = res.list.length;
          if(res.code==200){
             this.memberData = res.list;
          }
       },
    /*----------  timestampToTime-------------- */
        timestampToTime(row, column){
          const daterc = row[column.property]
           let date = new Date(parseInt(daterc))
           let Y = date.getFullYear() + '-'
           let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
           let D = date.getDate() + ' '
           let h = date.getHours() + ':'
           let m = date.getMinutes() + ':';
           let s = date.getSeconds();
           return Y+M+D+h+m+s;
      },
   /*--------- currentPage当前页面发生变化触发的事件----------- */
       pageChange(page){
            this.page = page;
            this.getmemberData();
       },
        /* -------点击修改商品信息----------- */
       submit(){
                this.formData.status = this.formData.status?1:2;
                this.$axios.post(this.$api.MEMBEREDIT,this.formData).then(res=>{
                      if(res.code==200){
                          this.$message.success("操作成功");
                          this.getmemberData();
                          this.dialogVisible = false;
                      }else{
                        this.$message.error(res.msg);
                      }
                })
        },
       /* -----------------编辑数据 ---------------------------*/ 
     async editFn(uid){
        this.dialogVisible = true;
        let res = await this.$axios.get(this.$api.MEMBERINFO,{uid});
        if(res.code==200){
             this.formData={ ...res.list }
             this.formData.status = this.formData.status==1?true:false;
        }else{
           this.$message.error(res.msg);  
        }  
      },
   
   }   
}
</script>
<style lang="">
   .el-breadcrumb{
       margin-bottom: 20px;
   }
   .el-pagination{
      float: right;
      margin-top: 10px;
   }
</style>