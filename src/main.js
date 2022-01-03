import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import "@/plugins/element-ui.js"
import axios from 'axios'
import 'default-passive-events'
import TreeTable  from 'vue-table-with-tree-grid'
import "@/assets/css/global.css";
import "@/assets/fonts/iconfont.css"

axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1'
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token') 
  return config
})
Vue.config.productionTip = false;
Vue.prototype.$http=axios
Vue.component('tree-table',TreeTable)

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
