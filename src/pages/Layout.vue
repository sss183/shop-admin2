<template>
  <div class="layout">
    <el-container class="container">
      <el-aside width="150px">
        <side-bar></side-bar>
      </el-aside>
      <el-container>
        <el-header>
          <my-header></my-header>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import SideBar from "@/components/SideBar";
import MyHeader from "@/components/MyHeader";
export default {
  components: {
    SideBar,
    MyHeader,
  },
};
</script>
<style lang="less">
.layout {
  height: 100%;
  .container {
    height: 100%;
    .el-header {
      background-color: #b3c0d1;
    }
    .el-main {
      background-color: #e5e5e5;
    }
  }
}
</style>