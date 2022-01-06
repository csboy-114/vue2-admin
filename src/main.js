import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import "@/plugins/element-ui.js"
import request from './api/request'
import 'default-passive-events'
import TreeTable  from 'vue-table-with-tree-grid'
import "@/assets/css/global.css";
import "@/assets/fonts/iconfont.css"


Vue.config.productionTip = false;
Vue.prototype.$http=request
Vue.component('tree-table',TreeTable)

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
