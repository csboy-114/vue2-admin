import axios from "axios";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1'
axios.interceptors.request.use(config=>{
  NProgress.start()
  config.headers.Authorization=window.sessionStorage.getItem('token') 
  return config
})
axios.interceptors.response.use(res=>{
  NProgress.done()
  return res
})

export default axios