<template>
  <div class="manager">
    <!-- -----面包屑导航------------>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>
    <!-- 管理员表格列表 -->
    <el-table :data="userData" border style="width: 100%">
        <el-table-column prop="uid" label="用户填写" width="180"> </el-table-column>
        <el-table-column prop="rolename" label="角色" width="180"> </el-table-column>
        <el-table-column prop="status" label="状态" width="180"> 
            <template slot-scope="scope">
              <el-tag type="success" effect="dark" v-if="scope.row.status == '1'">启用</el-tag>
              <el-tag type="danger"  effect="dark" v-if="scope.row.status == '2'">禁用</el-tag>
            </template> 
        </el-table-column>
        <el-table-column  label="操作">
             <template slot-scope="scope">
                <el-button size="mini" @click="editFn(scope.row.uid)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row.id)">删除</el-button>
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
    <!-- 管理员表格添加对话框--------- -->
    <el-dialog :title="tip" :visible.sync="dialogVisible" width="40%" @open="getroleData" @close="resetFn">
      <el-form
        :model="formData"
        :rules="rules"
        ref="userForm"
        label-width="100px">
        <el-form-item label="角色">
          <el-select v-model="formData.roleid" placeholder="请选择角色">
            <el-option
              v-for="item in roleData"
              :value="item.id"
              :key="item.id"
              :label="item.rolename"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username"></el-input>
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
        <el-button type="primary" @click="submit('userForm')">确 定</el-button>
      </span>
    </el-dialog>
 </div>
</template>
<script>
import axios from 'axios';
export default {
   data(){
     return{
       tip:"",
       dialogVisible:false,
       total:0,//管理员总数
       page:1,
       size:2,
        userData:[],
        roleData:[],
        formData:{
          roleid:"",
          username:"",
          password:"",
          status:true,
        },
        rules:{
          username:[{
              required:true,//必填项，不能为空
              message:"请输入用户名",//提示信息
              trigger:"blur",
          },{
              pattern:/^\S{3,10}$/g,
              message:"请输入5-10位非空字符",
              trigger:"blur"
          }],
          password:[{
              required:true,//必填项，不能为空
              message:"请输入密码",//提示信息
              trigger:"blur",
          },
          {
              min:3,
              message:"请输入3-12位字符",
              trigger:"blur"
          }]
        }
     }
   },
   mounted(){
      this.getlist();
   },
   methods:{
      /* ----------------获取管理员列表信息和管理员总数 -----------*/ 
      //并发操作
      getuserData(){
          return this.$axios.get(this.$api.USERLIST,{page:this.page,size:this.size});
      },
       getTotal(){
          return  this.$axios.get(this.$api.USERCOUNT);
      },
      getlist(){
        axios.all([this.getuserData(),this.getTotal()]).then(
          axios.spread((res1, res2) => {
             this.userData = res1.list;
             let [{total}] = res2.list;
             this.total = total;
          })
         );
      },

      /*-------------------获取角色列表数据--------------- */
      async getroleData(){
          let res = await this.$axios.get(this.$api.ROLELIST);
          if(res.code==200){
             this.roleData = res.list;
          }
      },
       /* ---------------提交添加数据和修改数据--------- */
       submit(){
        this.$refs.userForm.validate(valid=>{
            if(!valid){
              return false;
            }
            this.formData.status = this.formData.status?1:2;
            let data = this.$qs.stringify(this.formData)
            let url = this.formData.uid?this.$api.USEREDIT:this.$api.USERADD;
            this.$axios.post(url,data).then(res=>{
                 if(res.code==200){
                     this.$message.success("操作成功");
                     this.dialogVisible = false;
                     this.getlist();
                 }else{
                    this.$message.error(res.msg);
                 }
           }); 
        })
     },
     /* ----------------添加按钮---------------------------*/ 
     addFn(){
         this.dialogVisible = true; 
         this.tip="管理员添加"
     },
     /* ----------每次添加成功后关闭对话框时重置数据 -------*/
     resetFn(){
        this.formData={
         roleid:"",
          username:"",
          password:"",
          status:true,
        }
     },
    /* -----------------编辑数据 ---------------------------*/ 
    async editFn(uid){
        this.dialogVisible = true;
        this.tip="管理员修改";
        let res = await this.$axios.get(this.$api.USERINFO,{uid});
        if(res.code==200){
          //  console.log(res);
           this.formData={
             ...res.list
           }
            this.formData.status = this.formData.status==1?true:false;
        }else{
           this.$message.error(res.msg);  
        }
       
     },
    /* -----------------删除数据 ----------------------------*/ 
    async delFn(id){
        let res = await this.$axios.post(this.$api.USERDELETE,this.$qs.stringify({id}));
        if(res.code==200){
          console.log(res);
                 this.$message.success("删除成功");
                  this.page = 1;
                 this.getlist();
                 
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
    /*--------- currentPage当前页面发生变化触发的事件----------- */
    pageChange(page){
      // console.log(page);
         this.page = page;
         this.getlist();
    },
   }
}
</script>
<style lang="less">
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-pagination{
  float: right;
  margin-top: 10px;
}
</style>