<template>
  <div class="specs">
        <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>规格列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>
    <!-- 轮播图表格列表 -->
    <el-table :data="specsData" border style="width: 100%">
      <el-table-column prop="specsname" label="属性名称" width="180"> </el-table-column>
      <el-table-column prop="attrs" label="属性值" width="180">
          <template slot-scope="scope">
              <el-tag v-for="(item,index) in scope.row.attrs" :key="index">{{item}}</el-tag>
          </template> 
      </el-table-column>
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
   <!-- 商品分类信息添加 弹框 -->
    <el-dialog :title="tip" :visible.sync="dialogVisible" width="40%"  @close="resetFn">
      <el-form
        :model="formData"
        :rules="rules"
        ref="specsForm"
        label-width="100px" >
        <el-form-item label="属性名称" prop="specsname">
          <el-input v-model="formData.specsname"></el-input>
        </el-form-item>
        <el-form-item label="属性值" class="addAttrs"
         v-for="(item,index) in attrsArr" :key="index"
         >
            <el-input v-model="item.value"></el-input>
            <el-button type="primary" v-if="index==0" @click="addAttrs">新增属性值</el-button>
            <el-button type="danger" v-else  @click="delAttrs(index)">删除</el-button>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="formData.status"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('specsForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      specsData: [],
      tip:"",
      formData:{
        specsname:"",
        attrs:"",
        status:true
      },
      attrsArr:[{
          value:""
        }],
      rules:{
         specsname:[{
             required:true,
             message:"请填写属性名称",
             trigger:"blur"
         }]
      }
    };
  },
  mounted() {
    this.getspecsData();
  },
  methods: {
    /*--------查询规格列表的数据----------- */
    async getspecsData() {
      let res = await this.$axios.get(this.$api.SPECSLIST);
      if (res.code == 200) {
        console.log(res.list[0].attrs);
        this.specsData = res.list;
      } else {
        this.$message.error(res.msg);
      }
    },
    /* -------点击提交添加规格信息或修改规格信息----------- */
         submit(specsForm){
              this.$refs[specsForm].validate(valid=>{
                  if(!valid){
                      return false;
                  }
                let arr = this.attrsArr.map(item=>item.value);  //组成一个新的数组返回
                this.formData.attrs = arr.join(",");//将数组按,组成成字符串
                this.formData.status = this.formData.status?1:2;
                let url  = this.formData.id?this.$api.SPECSEDIT:this.$api.SPECSADD
                this.$axios.post(url,this.formData).then(res=>{
                  // console.log(res);
                      if(res.code==200){
                          this.$message.success("操作成功");
                          this.getspecsData();
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
         this.tip="规格添加"
     },
/* ----------------添加属性值按钮---------------------------*/ 
     addAttrs() {
        this.attrsArr.push({ value: ''});
      },
      /* ----------------删除属性值按钮---------------------------*/ 
     delAttrs(i) {
        this.attrsArr.splice(i,1);
      },
 /* ----------每次添加成功后关闭对话框时重置数据 @close="reserFn"-------*/
     resetFn(){
       this.attrsArr = "";
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
        this.tip="规格修改"
        let res = await this.$axios.get(this.$api.SPECSINFO,{id});
        if(res.code==200){
           this.formData={  ...res.list[0] }
            this.attrsArr = res.list[0].attrs.map(item=>({value:item}));
            this.formData.status = this.formData.status==1?true:false;
        }else{
           this.$message.error(res.msg);  
        }
       
     },
    /*----------------------根据id删除数据------------------------ */
    async delFn(id){
        let res = await this.$axios.post(this.$api.SPECSDELETE,this.$qs.stringify({ id }));
        if(res.code==200){
                 this.$message.success("删除成功");
                 this.getspecsData();
          }else{
                 this.$message.error(res.msg);
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
   .el-breadcrumb{
       margin-bottom: 20px;
   }
   .addAttrs{
     .el-input{
       width: 200px;
     }
   }
</style>