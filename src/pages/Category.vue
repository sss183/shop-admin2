<template>
  <div class="category">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>
    <!-- 商品分类表格列表 -->
    <el-table
      :data="cateData"
      border
      style="width: 100%"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        prop="catename"
        label="分类名称"
        width="180"
      ></el-table-column>
      <el-table-column prop="" label="状态" width="180">
        <template slot-scope="scope">
          <el-tag type="success" effect="dark" v-if="scope.row.status == '1'"
            >启用</el-tag
          >
          <el-tag type="danger" effect="dark" v-if="scope.row.status == '2'"
            >禁用</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 商品分类信息添加 弹框 -->
    <el-dialog :title="tip" :visible.sync="dialogVisible" width="40%" @open="getfirstCate" @close="resetFn">
      <el-form
        :model="formData"
        :rules="rules"
        ref="cateForm"
        label-width="100px" >
        <el-form-item label="上级分类">
          <el-select v-model="formData.pid" placeholder="请选择上级分类">
            <el-option label="顶级分类" :value="0" :key="0"> </el-option>
            <!-- value:当前项被选中的value (v-model绑定的值变成选中项的value) -->
            <el-option
              v-for="item in firstCate"
              :value="item.id"
              :key="item.id"
              :label="item.catename"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="catename">
          <el-input v-model="formData.catename"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="img" v-if="formData.pid!=0">
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
        <el-button type="primary" @click="submit('cateForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      imgDialogVisible:false,//放大图片的对话框显示状态
      dialogImageUrl: '',//设置放大图片地址
      cateData: [],
      firstCate:[],
      fileList:[],//上传文件列表
      tip:"",
      formData:{
        pid:0,
        catename:"",
        img:"",
        status:true
      },
      rules:{
         catename:[{
             required:true,
             message:"请填写分类名称",
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
  mounted() {
    this.getcateData();
  },
  methods: {
    /*--------查询分类列表的数据----------- */
    async getcateData() {
      let res = await this.$axios.get(this.$api.CATELIST, { istree: true });
      if (res.code == 200) {
        this.cateData = res.list;
      } else {
        this.$message.error(res.msg);
      }
    },
    /*--------查询上级分类列表的数据 pid=0是一级分类，打开对话框的时候调用----------- */
      async getfirstCate() {
      let res = await this.$axios.get(this.$api.CATELIST, { pid: 0 });
      if (res.code == 200) {
        this.firstCate = res.list;
      } else {
        this.$message.error(res.msg);
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
     //获取上传文件的数据
    handleChange(file,fileList){
        // console.log(file,fileList);
       this.formData.img = file.raw;
    },
    /* -------点击提交添加分类信息或修改分类信息----------- */
         submit(cateForm){
              this.$refs[cateForm].validate(valid=>{
                  if(!valid){
                      return false;
                  }
                this.formData.status = this.formData.status?1:2;
                let url  = this.formData.id?this.$api.CATEEDIT:this.$api.CATEADD
                // console.log(this.formData);
                this.$axios.upload(url,this.formData).then(res=>{
                      if(res.code==200){
                          this.$message.success("操作成功");
                          this.getcateData();
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
         this.tip="分类添加"
     },
 /* ----------每次添加成功后关闭对话框时重置数据 @close="reserFn"-------*/
     resetFn(){
        this.formData={
         pid:0,
         catename:"",
         img:"",
         status:true
        }
        this.fileList=[];
     },
    /* -----------------编辑数据 ---------------------------*/ 
     async editFn(id){
        this.dialogVisible = true;
        this.tip="分类修改"
        let res = await this.$axios.get(this.$api.CATEINFO,{id});
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
        let res = await this.$axios.post(this.$api.CATEDELETE,this.$qs.stringify({ id }));
        if(res.code==200){
                 this.$message.success("删除成功");
                 this.getcateData();
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
};
</script>
<style lang="less">
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>