import axios from "axios"
// 全局默认配置：超时时间
axios.defaults.timeout = 3000;

//定义请求拦截器   config:请求配置对象
axios.interceptors.request.use(config => {
  // Do something before request is sent
  // console.log(config)
  let token = localStorage.getItem("token")?localStorage.getItem("token"):"";
  config.headers.Authorization = token;
//   console.log(config);
  return config;
}, error => {
  // Do something with request error
  return Promise.reject(error);
});

//定义请求拦截器：响应拦截器 response:响应对象
axios.interceptors.response.use(response => {
  // Do something before response is sent
  // console.log(response);
  // return response;
  return response.data;
}, error => {
  // Do something with response error
  return Promise.reject(error);
});


/* 
封装的get请求方法
@url:string请求路径
@params:Object|string 请求参数 
: Promise 
*/
 function get(url,params={}){
    
  return new Promise((res,rej)=>{
        axios({
            url,
            method:"get",
            params,
        }).then(data=>{
            res(data);
        }).catch(err=>{
            rej(err);
        })
    })
} 

/* 
封装的post请求方法
@url:string请求路径
@data:Object|string 请求参数 
: Promise 
*/
 function post(url,data={}){
    return new Promise((res,rej)=>{
        axios({
            url,
            method:"post",
            data,
        }).then(data=>{
            res(data);
        }).catch(err=>{
            rej(err);
        })
    })
}

 /* 封装包含上传内容的方法
    @url:上传地址
    @data:上传数据  
 */
  function upload(url,data={}){
      return new Promise((res,rej)=>{
        let form = new FormData();
        for(var key in data){
         /*  @append:向表单实例添加数据的方法
          @key: 数据的名称
          @ value: 数据的值 */
          form.append(key,data[key]);
        }
        axios({
          method:"post",
          url,
          data:form,
          headers:{
            "Content-Type":"multipart/form-data"
          }
        }).then(data=>{
           res(data);
        }).catch(err=>{
           rej(err);
        })
      })
  }



//  export default axios;
export default {
    get,
    post,
    upload
}