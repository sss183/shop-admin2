<template>
  <div class="menu">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>菜单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>
    <!-- 表格列表 -->
    <menu-tab :menuData="menuData" @changeMenuData="changeFn" @edit="editFn"></menu-tab>

    <!-- 添加表格信息弹框 -->
    <el-dialog :title="tip" :visible.sync="dialogVisible" width="40%"
     @open="getFirstMenu"
     @close="reset">
      <el-form
        :model="formData"
        :rules="rules"
        ref="menuForm"
        label-width="100px">
        <el-form-item label="菜单名称">
          <!-- <p>{{formData.pid}}</p> -->
          <el-select v-model="formData.pid" placeholder="请选择" @change="changeMenuPid">
            <el-option label="顶级菜单" :value="0" :key="0"> </el-option>
            <el-option
              v-for="item in firstMenu"
              :value="item.id"
              :key="item.id"
              :label="item.title"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-if="formData.pid === 0">
          <el-input v-model="formData.icon"></el-input>
        </el-form-item>
        <el-form-item label="菜单地址" prop="url" v-else>
          <el-input v-model="formData.url"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio
            v-model="formData.type"
            :label="1"
            :disabled="formData.type !=1"
            >目录</el-radio
          >
          <el-radio
            v-model="formData.type"
            :label="2"
            :disabled="formData.type == 1"
            >菜单</el-radio
          >
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="formData.status"></el-switch>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('menuForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menuData: [],
      firstMenu: [],
      tip:"",
      dialogVisible: false,
      formData: {
        pid: 0,
        type: 1,
        title: "",
        url: "",
        icon: "",
        status: true,
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入菜单名称",
            trigger: "blur",
          },
        ],
        icon: [
          {
            required: true,
            message: "请输入菜单图标",
            trigger: "blur",
          },
        ],
        url: [
          {
            required: true,
            message: "请输入菜单地址",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
 /*----------- 一开始就执行菜单列表数据，渲染到页面上---------- */
    this.getmenuData();
  },
  methods: {
   /*---------------- 获取所有树状菜单列表------------------- */ 
      async getmenuData(){
         let res = await this.$axios.get(this.$api.MENULIST, { istree: true });
         if (res.code == 200) {
            this.menuData = res.list;
          } else {
            this.$message.error(res.msg);
          }
      },
/*------------------ 获取一级菜单列表------------------------ */
    async getFirstMenu() {
      let res = await this.$axios.get(this.$api.MENULIST, { pid: 0 });
      if (res.code == 200) {
        this.firstMenu = res.list;
      } else {
        this.$message.error(res.msg);
      }
    },
/* ------- 通过改变pid的值来判断是目录还是菜单类型  changge事件触发 pid=0是目录 ---*/
    changeMenuPid(){
        this.formData.type=this.formData.pid===0?1:2;
    },
/*--------  自定义删除事件（@changeMenuData）的事件处理函数changeFn -------------*/
    changeFn(menuData){
        this.menuData = menuData;
    },
 /* ----------------添加按钮---------------------------*/ 
     addFn(){
         this.dialogVisible = true; 
         this.tip="菜单添加"
     },
/*--------- ---自定义编辑事件（@edit）的事件处理函数editFn-------------------- */
    editFn(rowData){
      this.dialogVisible = true;
      this.tip="菜单修改"
      this.formData = {...rowData}
      this.formData.status = this.formData.status==1?true:false;
    },
    /* -------------重置函数 --------------*/
    reset(){
        this.formData={
            pid: 0,
            type: 1,
            title: "",
            url: "",
            icon: "",
            status: true,
        }  
    },
   /*-------------- 提交添加和修改的数据，通过是否有id来判断是添加还是修改--------- */
    submit(menuForm){
      // console.log(this.formData.id?this.$api.MENUEDIT:this.$api.MENUADD);
        let url = this.formData.id?this.$api.MENUEDIT:this.$api.MENUADD;      
        this.formData.status = this.formData.status?1:2;
             this.$refs[menuForm].validate(valid=>{
                 if(!valid){
                   return false;
                 }
               this.$axios.post(url,this.formData).then(res=>{
               if(res.code==200){
                  this.$message.success("操作成功");
                  this.getmenuData();//获取最新数据，省的手动刷新
                   this.dialogVisible = false;
               } 
             })
             this.formData.status = this.formData.status===1?true:false;
        })
    },


  },
};
</script>
<style lang="">
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>