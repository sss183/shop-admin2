<template>
  <el-menu
    background-color="#20222A"
    unquie-opend
    :default-active="$route.path"
  >
    <h2>后台管理系统</h2>
    <el-menu-item index="/home">
      <i class="el-icon-s-home"></i>
      <router-link to="/home">首页</router-link>
    </el-menu-item>
    <!-- String(index+1)转成字符串形式或(index+1).toString -->
    <el-submenu
      v-for="(menu, index) in menus"
      :key="index"
      :index="(index + 1).toString()"
    >
      <template slot="title">
        <i :class="menu.icon"></i>
        <span>{{ menu.title }}</span>
      </template>
      <el-menu-item-group>
        <!-- submenu:子菜单 -->
        <el-menu-item
          v-for="(submenu, index) in menu.children"
          :key="index"
          :index="submenu.url"
        >
          <router-link :to="submenu.url">{{ submenu.title }}</router-link>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>
<script>
export default {
  computed: {
    menus() {
      //获取store中state里的info
      return this.$store.state.info.menus;
    },
  },
};
</script>
<style lang="less">
.el-menu {
  height: 100%;
  overflow-x: hidden;
  h2 {
    font-size: 18px;
    text-align: center;
    margin: 20px 0px;
    color: #fff;
  }
  a {
    color: #fff;
  }
  span {
    color: #fff;
  }
  .el-menu-item.is-active {
    color: rgb(255, 208, 75);
  }
  .router-link-exact-active {
      color: rgb(255, 208, 75);
  }
}
</style>
