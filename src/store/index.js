import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
let store = new Vuex.Store({
    state:{
      token:localStorage.getItem("token")?localStorage.getItem("token"):"",
      //用户登录信息
      info:localStorage.getItem("info")?JSON.parse(localStorage.getItem("info")):{}
    },
    mutations:{
      setInfo(state,payload){
        //数据在vuex中随着页面刷新而重置，所以要保存一份在localStorage中
          localStorage.setItem("token",payload.token);
          localStorage.setItem("info",JSON.stringify(payload.info));
          state.token = payload.token;
          state.info = payload.info;
      },
      clearInfo(state){
          localStorage.clear();
          state.token = "";
          state.info={}  
    }
  }

});
export default store;