import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/pages/Layout'
import Home from  '@/pages/Home'
import Goods from '@/pages/Goods'
import Category from '@/pages/Category'
import Member from '@/pages/Member'
import Specs from '@/pages/Specs'
import Seckill from '@/pages/Seckill'
import Banner from '@/pages/Banner'
import Login from '@/pages/Login'
import Menu from '@/pages/Menu'
import Role from '@/pages/Role'
import Manager from '@/pages/Manager'
// 重复点击报错
const originalPush = Router.prototype.push

Router.prototype.push = function push(location) { 
  return originalPush.call(this, location).catch(err => err) 
}

Vue.use(Router)

let router =  new Router({
  routes: [
    {
      path:'/login',
      component:Login
     },
    {
     path:'/',
     component:Layout,
     children:[
       {
        path:"home",
        component:Home
      },
      {
        path:"menu",
        component:Menu
      },
      {
        path:"role",
        component:Role
      },
      {
        path:"user",
        component:Manager
      },
      {
        path:"category",
        component:Category
      },{
        path:"specs",
        component:Specs
      },{
        path:"goods",
        component:Goods
      },{
        path:"banner",
        component:Banner
      },
      {
       path:"member",
       component:Member
     },
     {
      path:"seckill",
      component:Seckill,
     },
     {
      path:"",
      redirect:"/home",
    }]
    },
  ]
});

router.beforeEach((to,from,next)=>{
  //登录状态
    let token =localStorage.getItem("token")?localStorage.getItem("token"):"";
    let info = JSON.parse(localStorage.getItem("info"));
    if(token&&info){//已登录的情况
      if(to.path=="/login"){
        next(false);//取消本次导航
      }else{
         //查看当前目的地址是否是后台允许访问的地址
         let flag =info.menus_url.find(item=>to.path==item)
          // 如果是就放行，否者阻止
         if(flag||to.path=="/home"){
           next();
         }else{
           next(false);
          }
      }
    }else{//未登录时情况
      if(to.path=="/login"){
        next();
      }else{
        next("/login")
      }
    }

})
export default router;
