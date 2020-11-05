<template>
  <div class="loginBg">
    <div class="loginContainer">
      <h2>用户登录</h2>
      <el-form :model="ruleForm" :rules="rules" ref="loginForm">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item  prop="password">
          <el-input v-model="ruleForm.password" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {mapMutations} from "vuex"
export default {
  data() {
    return {
      ruleForm: {
        username: "",
        password: "",
      },
      rules:{
          username:[{
              required:true,//必填项，不能为空
              message:"请输入用户名",//提示信息
              trigger:"blur",
          },{
              pattern:/^\S{3,10}$/g,
              message:"请输入5-10位非空字符" ,
              trigger:"blur"
          }],
          password:[{
              required:true,//必填项，不能为空
              message:"请输入密码",//提示信息
              trigger:"blur",
          },
          {
              min:3,
              max:12,
              message:"请输入6-12位字符",
              trigger:"blur"
          }]
      }
    };
  },
  methods: {
    ...mapMutations(["setInfo"]),
    submitForm(loginForm){
         this.$refs[loginForm].validate(valid=>{
             if(!valid){
                 return false;
             }
            this.$axios.post(this.$api.USERLOGIN, this.ruleForm).then((res) => {
                console.log(res.list);
                if (res.code == 200) {
                    this.setInfo({token:res.list.token,info:res.list})
                    this.$router.replace("/home");
                }else {
                   this.$message.error(res.msg)
                }
            });
         })      
     },


  }  
};
</script>
<style lang="less">
.loginBg {
  height: 100%;
  background: linear-gradient(to left, #563443, #413a53, #2f3d60);
  .loginContainer {
    width: 300px;
    height: 260px;
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -130px;
    margin-left: -150px;
    h2 {
      font-size: 24px;
      margin-bottom: 20px;
      color: #fff;
    }
    .el-button{
       width: 300px;
    }
  }
}
</style>
