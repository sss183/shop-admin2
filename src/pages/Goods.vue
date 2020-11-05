<template>
  <div class="goods">
        <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>
    <!-- 轮播图表格列表 -->
    <el-table :data="goodsData" border style="width: 100%">
      <el-table-column prop="firstcatename" label="一级分类" width="120"> </el-table-column>
      <el-table-column prop="secondcatename" label="二级分类" width="120"> </el-table-column>
      <el-table-column prop="goodsname" label="商品名称" width="120"> </el-table-column>
      <el-table-column prop="market_price" label="销售价" width="120"> </el-table-column>
      <el-table-column prop="price" label="市场价" width="120"> </el-table-column>
      <el-table-column prop="status" label="状态" width="120">
           <template slot-scope="scope">
              <el-tag type="success" effect="dark" v-if="scope.row.status == '1'">启用</el-tag>
              <el-tag type="danger"  effect="dark" v-if="scope.row.status == '2'">禁用</el-tag>
          </template> 
      </el-table-column>
      <el-table-column  label="操作"> 
          <template slot-scope="scope">
            <el-button size="mini" @click="editFn(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
      </el-table-column>
    </el-table> 
    <!------ 分页器------ -->
    <el-pagination
        background
        layout="prev, pager, next"
        :page-size="size"
        :total="total"
        @current-change="pageChange"
        :current-page="page">
    </el-pagination>
    <!-- ---商品信息对话框--- -->
     <el-dialog :title="tip" :visible.sync="dialogVisible" width="40%" @open="openFn" @opened="openedFn" @close="resetFn">
      <el-form
        :model="formData"
        :rules="rules"
        ref="goodsForm"
        label-width="100px" >
        <el-form-item label="一级分类">
            <!-- 当一级分类选中触发事件@change="selectFirstCate",获取二级分类 -->
          <el-select v-model="formData.first_cateid" @change="selectFirstCate" placeholder="请选择分类">
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
        <el-form-item label="二级分类">
          <el-select v-model="formData.second_cateid" placeholder="请选择分类">
            <!-- value:当前项被选中的value (v-model绑定的值变成选中项的value) -->
            <el-option
              v-for="item in secondCate"
              :value="item.id"
              :key="item.id"
              :label="item.catename"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名" prop="goodsname">
            <el-input v-model="formData.goodsname"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <!-- :on-preview ：预览图片  :on-remove移除图片  on-change:文件状态改变时调用的函数-->
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
        <el-form-item label="商品规格">
           <!-- 当商品规格名称选好后触发@change="selectSpecs"出现商品规格属性值选择 -->
          <el-select v-model="formData.specsid" placeholder="请选择规格" @change="selectSpecs">
            <!-- value:当前项被选中的value (v-model绑定的值变成选中项的value) -->
            <el-option
              v-for="item in specsData"
              :value="item.id"
              :key="item.id"
              :label="item.specsname"
            >
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="商品规格属性">
          <el-select v-model="formData.specsattr" multiple placeholder="请选择规格属性">
            <!-- value:当前项被选中的value (v-model绑定的值变成选中项的value) -->
            <el-option
              v-for="(item,index) in attrs"
              :value="item"
              :key="index"
              :label="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="销售价">
            <el-input v-model="formData.price" type="number"></el-input>
        </el-form-item>
         <el-form-item label="市场价">
            <el-input v-model="formData.market_price"  type="number"></el-input>
        </el-form-item>
        <el-form-item label="是否热卖">
          <el-radio v-model="formData.ishot" :label="1">是</el-radio>
          <el-radio v-model="formData.ishot" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否新品">
          <el-radio v-model="formData.isnew" :label="1">是</el-radio>
          <el-radio v-model="formData.isnew" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="商品描述">
          <div id="editor"></div>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="formData.status" :label="1">上架</el-radio>
          <el-radio v-model="formData.status" :label="2">下架</el-radio>
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
import axios from 'axios';
import E from 'wangeditor'
export default {
   data(){
     return{
        fileList:[],
        goodsData:[],//商品数据
        firstCate:[],//一级分类数据
        secondCate:[],//二级分类数据
        specsData:[],//商品规格数据
        attrs:[],//商品规格属性值数据
        size:2,
        page:1,
        total:0,
        tip:"",
        dialogVisible:false,
        imgDialogVisible:false,
        dialogImageUrl:"",
        formData:{
           first_cateid:"",
           second_cateid:"",
           goodsname:"",
           price:"",
           market_price:"",
           img:"",
           description:"",
           specsid:"",
           specsattr:"",
           isnew:1,
           ishot:1,
           status:1,
        },
        rules:{
           goodsname:[{
              required:true,
              message:"请输入商品名",
              trigger:"blur"
           }]
        }
     }
   },
   mounted(){
      this.getgoodsData();
   },
   methods:{
       /*----------- 获取轮管理员列表全部数据------------  */
       async getgoodsData(){
          let res1 = await this.$axios.get(this.$api.GOODSCOUNT);
          this.total = res1.list[0].total;
          let res = await this.$axios.get(this.$api.GOODSLIST,{size:this.size,page:this.page});
          if(res.code==200){
             this.goodsData = res.list;
          }else{
             this.$message.error(res.msg);
          }
       },
        /*-- 获取一级分类列表全部数据,和商品规格名称数据---- */
      /*-----------一打开对话框就调用@open="getlist"------------  */
      getfirstCate(){
         return this.$axios.get(this.$api.CATELIST, { pid: 0 });
      },
      getspecsData(){
         return this.$axios.get(this.$api.SPECSLIST);
      },
     async getlist(){
        axios.all([this.getfirstCate(),this.getspecsData()]).then(
           axios.spread((res1,res2)=>{
              this.firstCate = res1.list || [];
              this.specsData = res2.list || [];
           })
        )  
      },
       /*当一级分类选中触发事件@change="selectFirstCate" 获取二级分类列表全部数据- */
       /* 一级分类id作为二级分类pid 获取二级分类 */
       async selectFirstCate(pid){
            // console.log(pid);
            let res = await this.$axios.get(this.$api.CATELIST,{pid});
            if(res.code==200){
               // console.log(res);
                this.secondCate =res.list;
            }else{
               this.message.error(re.msg);
            }
       }  ,
       async selectSpecs(id){
           this.attrs = this.specsData.find(item=>item.id==id).attrs; 
         //   console.log(this.attrs);
       },
        /*--------- currentPage当前页面发生变化触发的事件----------- */
       pageChange(page){
            this.page = page;
            this.getgoodsData();
       },
        /*--------------    预览上传的图片---------------    */
       handlePreview(file){
           //file选中的上传图片对象
           this.dialogImageUrl = file.url; 
           this.imgDialogVisible = true;
       },
       handleChange(file,fileList){
         //  console.log(file.raw);
           this.formData.img = file.raw 
       },
      /* -------点击提交添加商品信息或修改商品信息----------- */
       submit(){
          this.$refs.goodsForm.validate(valid=>{
                  if(!valid){
                      return false;
                  }
                let url  = this.formData.id?this.$api.GOODSEDIT:this.$api.GOODSADD;
                this.formData.specsattr = this.formData.specsattr.join(","); 
                this.$axios.upload(url,this.formData).then(res=>{
                      if(res.code==200){
                          this.$message.success("操作成功");
                          this.getgoodsData();
                          this.dialogVisible = false;
                      }else{
                        this.$message.error(res.msg);
                      }
                })
            })
         } ,
       /* ----------------添加按钮---------------------------*/ 
      addFn(){
          this.dialogVisible = true;
          this.tip = "商品添加";
       },
       /* ----------------打开对话框的时候调用-------------------*/ 
      openFn(){
           this.getlist();        
       }, 
       openedFn(){
         this.editor = new E('#editor');
               this.editor.config.onchange = newHtml =>{
                   this.formData.description = newHtml;
                }
               this.editor.create();
              this.editor.txt.html(this.formData.description);
       },
   /*----- 每次添加成功后关闭对话框时重置数据 @close="reserFn"----- */
       resetFn(){
          this.formData={
           first_cateid:"",
           second_cateid:"",
           goodsname:"",
           price:"",
           market_price:"",
           img:"",
           description:"",
           specsid:"",
           specsattr:"",
           isnew:1,
           ishot:1,
           status:1,
          }
          this.fileList = [];
          this.editor.txt.clear();
          document.getElementById("editor").innerHTML = "";
       },
       /* -----------------编辑数据 ---------------------------*/ 
    editFn(data){
      // console.log(data);
        this.dialogVisible = true;
        this.tip="商品修改"
             this.fileList=[{
                name:"",
                url:this.$address+data.img 
             }]
            this.formData={ 
                  id:data.id,
                  first_cateid:data.first_cateid,
                  second_cateid:data.second_cateid,
                  goodsname:data.goodsname,
                  price:data.first_cateid,
                  market_price:data.price,
                  img:data.img,
                  description:data.description,
                  specsid:data.specsid,
                  specsattr:data.specsattr,
                  isnew:data.isnew,
                  ishot:data.ishot,
                  status:data.status,
             }
            this.selectFirstCate(this.formData.first_cateid);      
            this.attrs = this.formData.specsattr.split(",");
            this.formData.specsattr = this.formData.specsattr.split(",");
     },
    /*----------------------根据id删除数据------------------------ */
    async delFn(id){
        let res = await this.$axios.post(this.$api.GOODSDELETE,this.$qs.stringify({ id }));
        if(res.code==200){
                 this.$message.success("删除成功");
                 this.page = 1;
                 this.getgoodsData();
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