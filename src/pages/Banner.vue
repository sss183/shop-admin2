<template>
  <div class="banner">
        <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>
    <!-- 轮播图表格列表 -->
    <el-table :data="bannerData" border style="width: 100%">
      <el-table-column prop="title" label="轮播图名称" width="180"> </el-table-column>
      <el-table-column prop="status" label="状态" width="180">
           <template slot-scope="scope">
              <el-tag type="success" effect="dark" v-if="scope.row.status == '1'">启用</el-tag>
              <el-tag type="danger"  effect="dark" v-if="scope.row.status == '2'">禁用</el-tag>
          </template> 
      </el-table-column>
      <el-table-column  label="操作"> 
          <template slot-scope="scope">
            <el-button size="mini" @click="editFn(scope.row.id)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
      </el-table-column>
    </el-table> 
     <!-- 轮播图信息添加 对话框 -->
    <el-dialog :title="tip" :visible.sync="dialogVisible" width="40%"  @close="resetFn">
      <el-form
        :model="formData"
        :rules="rules"
        ref="bannerForm"
        label-width="100px" >
        <el-form-item label="轮播图名称" prop="title">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="轮播图图片" prop="img" v-if="formData.pid!=0">
          <!-- :on-preview ：预览图片  :on-remove移除图片 -->
              <el-upload
                  action="#"
                  list-type="picture-card"
                  :auto-upload="false"
                  :on-preview="handlePreview"
                  :on-change="handleChange"
                  :file-list="fileList">
                  <i class="el-icon-plus"></i>
              </el-upload>
               <!-- 设置放大图片的对话框；append-to-body:多个对话框的堆叠顺序问题，让层级升高 -->
              <el-dialog :visible.sync="imgDialogVisible" append-to-body>
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="formData.status"></el-switch>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('bannerForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
   data(){
     return {
      dialogVisible: false,
      imgDialogVisible:false,//放大图片的对话框显示状态
      dialogImageUrl: '',//设置放大图片地址
      bannerData: [],
      fileList:[],//上传文件列表
      tip:"",
      formData:{
        title:"",
        img:"",
        status:true
      },
      rules:{
         title:[{
             required:true,
             message:"请填写轮播图名称",
             trigger:"blur"
         }],
         img:[{
             required:true,
             message:"请上传图片",
             trigger:"blur"
         }]
      }
    };
   },
   mounted(){
      this.getbannerData();
   },
   methods:{
       /*----------- 获取轮播图列表全部数据------------  */
       async getbannerData(){
          let res = await this.$axios.get(this.$api.BANNERLIST);
          // console.log(res);
          if(res.code==200){
             this.bannerData = res.list;
          }
       },
/*------------------ 预览上传的图片------------------------- */
    handlePreview(file) {
      //file选中的上传图片对象
      // console.log(file);
        this.dialogImageUrl = file.url;
        this.imgDialogVisible = true;
      },
     /*------------------ 文件状态改变时调用的函数---------------- */
     //@file:上传文件信息对象 file.raw就是被上传的文件数据
    handleChange(file,fileList){
        // console.log(file,fileList);
       this.formData.img = file.raw;
    },
       /* -------点击提交添加分类信息或修改分类信息----------- */
         submit(bannerForm){
              this.$refs[bannerForm].validate(valid=>{
                  if(!valid){
                      return false;
                  }
                this.formData.status = this.formData.status?1:2;
                let url  = this.formData.id?this.$api.BANNEREDIT:this.$api.BANNERADD
                this.$axios.upload(url,this.formData).then(res=>{
                  // console.log(res);
                      if(res.code==200){
                          this.$message.success("操作成功");
                          this.getbannerData();
                          this.dialogVisible = false;
                      }else{
                        this.$message.error(res.msg);
                      }
                })
              this.formData.status = this.formData.status==1?true:false;
            })
         } ,
 /* ----------------添加按钮---------------------------*/ 
     addFn(){
         this.dialogVisible = true; 
         this.tip="轮播图添加"
     },
 /* ----------每次添加成功后关闭对话框时重置数据 @close="reserFn"-------*/
     resetFn(){
        this.formData={
         title:"",
         img:"",
         status:true
        }
        this.fileList=[];
     },
    /* -----------------编辑数据 ---------------------------*/ 
     async editFn(id){
        this.dialogVisible = true;
        this.tip="轮播图修改"
        let res = await this.$axios.get(this.$api.BANNERINFO,{id});
        if(res.code==200){
            // console.log(this.$address+res.list.img);
             this.fileList=[{
                name:"",
                url:this.$address+res.list.img 
             }]
           this.formData={
             ...res.list
           }
            this.formData.id = id;
            this.formData.status = this.formData.status==1?true:false;
        }else{
           this.$message.error(res.msg);  
        }   
     },
    /*----------------------根据id删除数据------------------------ */
    async delFn(id){
        let res = await this.$axios.post(this.$api.BANNERDELETE,this.$qs.stringify({ id }));
        if(res.code==200){
                 this.$message.success("删除成功");
                 this.bannerData = res.list;
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

  },

}
</script>
<style lang="">
   .el-breadcrumb{
       margin-bottom: 20px;
   }
</style>