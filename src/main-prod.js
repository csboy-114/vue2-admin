import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// import "@/plugins/element-ui.js"
import request from './api/request'
import 'default-passive-events'
import VueQuillEditor from 'vue-quill-editor'
import TreeTable  from 'vue-table-with-tree-grid'


import "@/assets/css/global.css";
import "@/assets/fonts/iconfont.css"

Vue.use(VueQuillEditor)
Vue.config.productionTip = false;
Vue.prototype.$http=request
Vue.component('tree-table',TreeTable)
Vue.filter('dateFormat',function(originVal){
  const dt= new Date(originVal)
  const y=dt.getFullYear()
  const m=(dt.getMonth()+1+'').padStart(2,'0')
  const d=(dt.getDate()+'').padStart(2,'0')
  const hh=(dt.getHours()+'').padStart(2,'0')
  const mm=(dt.getMinutes()+'').padStart(2,'0')
  const ss=(dt.getSeconds()+'').padStart(2,'0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
