<template>
  <div class="seck">
        <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>限时秒杀列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>
    <!-- 轮播图表格列表 -->
    <el-table :data="seckData" border style="width: 100%">
      <el-table-column prop="title" label="活动名称" width="180"> </el-table-column>
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
      <!-- 限时秒杀信息添加对话框 -->
    <el-dialog :title="tip" :visible.sync="dialogVisible" width="40%" @open="getfirstCate" @close="resetFn">
      <el-form
        :model="formData"
        :rules="rules"
        ref="seckForm"
        label-width="100px" >
        <el-form-item label="活动名称" prop="title">
            <el-input v-model="formData.title"></el-input>
        </el-form-item>
         <el-form-item label="活动期限">
             <template>
               <div class="block">
                 <!--@change="dateChange" 用户确认选定的值时触发 -->
                  <el-date-picker
                    v-model="value"
                    @change="dateChange"
                    value-format="timestamp"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right">
                  </el-date-picker>
                </div>
            </template>
         </el-form-item>
        <el-form-item label="一级分类">
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
          <el-select v-model="formData.second_cateid" @change="selectSecondCate" placeholder="请选择分类">
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
        <el-form-item label="商品">
          <el-select v-model="formData.goodsid"  placeholder="请选择商品">
            <!-- value:当前项被选中的value (v-model绑定的值变成选中项的value) -->
            <el-option
              v-for="item in goodslist"
              :value="item.id"
              :key="item.id"
              :label="item.goodsname"
            >
            </el-option>
          </el-select>
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
        dialogVisible:false,
        seckData:[],
        firstCate:[],
        secondCate:[],
        goodslist:[],
        value:[],
        tip:"",
        formData:{
           title:"",
           begintime:"",
           endtime:"",
           first_cateid:"",
           second_cateid:"",
           goodsid:"",
           status:true,
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        rules:{
           title:[{
              required:true,
              message:"请填写活动名称",
              trigger:"blur"
           }]
        }
     }
   },
   mounted(){
      this.getseckData();
   },
   methods:{
       /*----------- 获取秒杀活动数据------------  */
       async getseckData(){
          let res = await this.$axios.get(this.$api.SECKLIST);
         //  console.log(res);
          if(res.code==200){
             this.seckData = res.list;
          }
       },
      /*--获取一级分类列表全部数据一打开对话框就调用@open="getfirstCate"  */
     async getfirstCate(){
          let res = await  this.$axios.get(this.$api.CATELIST, { pid: 0 });
          if(res.code==200){
             this.firstCate = res.list || [];
          }
      },
       /*当一级分类选中触发事件@change="selectFirstCate" 获取二级分类列表全部数据- */
       /* 一级分类id作为二级分类pid 获取二级分类 */
       async selectFirstCate(pid){
            // console.log(pid);
            let res = await this.$axios.get(this.$api.CATELIST,{pid});
            if(res.code==200){
                this.secondCate =res.list;
            }else{
               this.message.error(re.msg);
            }
       }  ,
     /*当二级分类选中触发事件@change="selectSecondCate" 获取商品全部数据- */
       async selectSecondCate(){
           let res = await this.$axios.get(this.$api.GOODSLIST,{sid:this.formData.second_cateid,fid:this.formData.first_cateid});
            if(res.code==200){
                this.goodslist =res.list;
            }else{
               this.message.error(re.msg);
            }

       }  ,
    /*---------- @change="dateChange" 用户确认选定的值时触发--------------  */
    dateChange(val){
        // console.log(val);
       this.formData.begintime = val[0]; 
       this.formData.endtime = val[1]; 
    },
 /* -------点击提交添加分类信息或修改分类信息----------- */
      submit(){
             this.$refs.seckForm.validate(valid=>{
            if(!valid){
              return false;
            }
            this.formData.status = this.formData.status?1:2;
            let data = this.$qs.stringify(this.formData)
            let url = this.formData.id?this.$api.SECKEDIT:this.$api.SECKADD;
            this.$axios.post(url,data).then(res=>{
                 if(res.code==200){
                     this.$message.success("操作成功");
                     this.dialogVisible = false;
                     this.getseckData();
                 }else{
                    this.$message.error(res.msg);
                 }
           }); 
           this.formData.status = this.formData.status==1?true:false;
        })
      } ,
 /* ----------------添加按钮---------------------------*/ 
     addFn(){
         this.dialogVisible = true; 
         this.tip="限时秒杀添加"
     },
 /* ----------每次添加成功后关闭对话框时重置数据 @close="reserFn"-------*/
     resetFn(){
        this.formData={
           title:"",
           begintime:"",
           endtime:"",
           first_cateid:"",
           second_cateid:"",
           goodsid:"",
           status:true,
        }
        this.fileList=[];
        this.value=[];
     },
    /* -------------------编辑数据 -----------------------*/ 
     async editFn(id){
        this.dialogVisible = true;
        this.tip="限时秒杀修改"
        let res = await this.$axios.get(this.$api.SECKINFO,{id});
        if(res.code==200){
           this.formData={
             ...res.list
           }
           this.value.push(this.formData.begintime);
           this.value.push(this.formData.endtime);
            this.formData.id = id;
            this.formData.status = this.formData.status==1?true:false;
            this.selectFirstCate(this.formData.first_cateid);
            this.selectSecondCate(this.formData.goodsid);        
        }
     },
    /*----------------------根据id删除数据------------------------ */
    async delFn(id){
        let res = await this.$axios.post(this.$api.SECKDELETE,this.$qs.stringify({ id }));
        if(res.code==200){
                 this.$message.success("删除成功");
                 this.getseckData();
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