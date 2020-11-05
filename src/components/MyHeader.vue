<template>
  <el-dropdown @command="logout">
    <span class="el-dropdown-link">
         <i>{{ $store.state.info.username }}</i>
         <i class="el-icon-setting"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item>退出登录</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
export default {
      methods: {
        logout() {
            this.$store.commit("clearInfo");
            this.$router.replace("/login");
    },
  },
}
</script>
<style lang="less">
     .el-dropdown{
        float: right;
        margin: 18px 40px 0px 0px;
        i{
             cursor: pointer;
        }
      }
</style>