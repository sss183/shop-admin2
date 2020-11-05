// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import MenuTab from './components/MenuTab'
import RoleTab from './components/RoleTab'
import RoleForm from './components/RoleForm'
import router from './router'
import store from './store'
import axios from './utils/http';


//引入element-ui插件
import ElementUI from 'element-ui';
//引入element-ui样式插件
import 'element-ui/lib/theme-chalk/index.css';

//引入重置样式
import "./assets/css/reset.css";
import API from "./API";
import qs from "qs";
Vue.prototype.$qs = qs;
Vue.prototype.$api = API;
Vue.prototype.$address = "http://localhost:3000";
//安装插件
Vue.use(ElementUI);
Vue.prototype.$axios = axios;
Vue.config.productionTip = false
Vue.component("menu-tab",MenuTab);
Vue.component("role-tab",RoleTab);
Vue.component("role-form",RoleForm);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
