<template>
  <div class="role">
     <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>
    <!-- 角色表格列表 -->
    <role-tab :roleData="roleData" @del="delFn" @edit="editFn"></role-tab>
    <!-- 角色表格添加弹框---->
     <el-dialog :title="tip" :visible.sync="dialogVisible" width="40%" @open="getmenuData" @close="resetFn">
           <el-form :model="formData" :rules="rules" ref="roleForm" label-width="100px">
            <el-form-item label="角色名称" prop="rolename">
              <el-input v-model="formData.rolename"></el-input>
            </el-form-item>
            <el-form-item label="菜单权限">
                  <el-tree
                       ref="tree" 
                      check-strictly
                      :data="menuData"
                      show-checkbox
                      :default-checked-keys="checklist"
                       node-key="id"
                      :props="{children:'children',label:'title'
                        }">
                  </el-tree>
            </el-form-item>
            <el-form-item label="状态">
              <el-switch v-model="formData.status"></el-switch>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
   data(){
     return{
       //角色列表数据
       roleData:[],
       tip:'',
       dialogVisible:false,
       menuData:[],//树状菜单数据
       checklist:[],//编辑时默认勾选的节点的 key 的数组
       formData:{
          rolename:"",
          menus:[],
          status:true
       },
       rules:{
         rolename:[{
            required:true,
            message:"请填写角色名称",
            trigger:"blur"
         }]
       }
     }
   },
   mounted(){
      this.getroleData();
   },
   methods:{
     /*------------------ 获取角色列表数据---------------- */
      async getroleData(){
          let res = await this.$axios.get(this.$api.ROLELIST);
          if(res.code==200){
            // console.log(res.list);
             this.roleData = res.list;
          }
      },
   /* ------------------------获取所有树状菜单列表---------- */
      async getmenuData(){
         let res = await this.$axios.get(this.$api.MENULIST, { istree: true });
         if (res.code == 200) {
            this.menuData = res.list;
          } else {
            this.$message.error(res.msg);
          }
      },
/*---- 提交添加和修改的数据，通过是否有id来判断是添加还是修改---- */
     submit(){
        this.$refs.roleForm.validate(valid=>{
            if(!valid){
              return false;
            }
            //  console.log(this.$refs.tree.getCheckedKeys());
            this.formData.menus = this.$refs.tree.getCheckedKeys().join(",");//转成字符串或者用JSON.parse方法
            this.formData.status = this.formData.status?1:2;
            let data = this.$qs.stringify(this.formData)
            let url = this.formData.id?this.$api.ROLEEDIT:this.$api.ROLEADD;
            this.$axios.post(url,data).then(res=>{
                 if(res.code==200){
                     this.$message.success("操作成功");
                     this.dialogVisible = false;
                     this.getroleData();
                 }else{
                    this.$message.error(res.msg);
                 }
           }); 
        })
     },
 /* ----------------添加按钮---------------------------*/ 
     addFn(){
         this.dialogVisible = true; 
         this.tip="角色添加"
     },
 /* ----------------重置按钮 ----------------*/
     resetFn(){
        this.checklist=[];
        this.formData={
          rolename:"",
          menus:[],
          status:true
        }
     },
  /* ----------------编辑数据 ----------------*/  
    async editFn(id){
        this.dialogVisible = true;
        this.tip="角色修改"
        let res = await this.$axios.get(this.$api.ROLEINFO,{id});
        if(res.code==200){
          // console.log(res);
            this.formData.id= id;
            this.formData.rolename  = res.list.rolename;
            this.formData.menus = res.list.menus.split(",");
            this.checklist = res.list.menus.split(",");
            // console.log(res.list.menus);
            // console.log(this.formData.checklist);
            this.formData.status = this.formData.status==1?true:false;
        }else{
           this.$message.error(res.msg);  
        }
       
     },
  /*-- -----------------删除数据 ----------------------------*/  
    delFn(roleData){
        this.roleData = roleData;
    } 
     
   }
}
</script>
<style lang="less">
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>