import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'/login'
  },
  {
    path:'/login',
    component:()=>import(/* webpackChunkName: "login_home_welcome" */'../views/Login.vue')
  },
  {
    path:'/home',
    component:()=>import(/* webpackChunkName: "login_home_welcome" */'../views/Home.vue'),
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:()=>import(/* webpackChunkName: "login_home_welcome" */'../components/Welcome.vue')
      },
      {
        path:'/users',
        component:()=>import(/* webpackChunkName: "Users_Rights_Roles" */'../components/users/Users.vue')
      },
      {
        path:'/rights',
        component:()=>import(/* webpackChunkName: "Users_Rights_Roles" */'../components/power/Rights.vue')
      },
      {
        path:'/roles',
        component:()=>import(/* webpackChunkName: "Users_Rights_Roles" */'../components/power/Roles.vue')
      },
      {
        path:'/categories',
        component:()=>import(/* webpackChunkName: "Cate_Params" */'../components/goods/Cate.vue')
      },
      {
        path:'/params',
        component:()=>import(/* webpackChunkName: "Cate_Params" */'../components/goods/Params.vue')
      },
      {
        path:'/goods',
        component:()=>import(/* webpackChunkName: "GoodsList_Add" */'../components/goods/List.vue')
      },
      {
        path:'/goods/add',
        component:()=>import(/* webpackChunkName: "GoodsList_Add" */'../components/goods/Add.vue')
      },
      {
        path:'/orders',
        component:()=>import(/* webpackChunkName: "Order_Report" */'../components/order/Order.vue')
      },
      {
        path:'/reports',
        component:()=>import(/* webpackChunkName: "Order_Report" */'../components/report/Report.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next)=>{
  if(to.path=='/login') return next();
  const tokenStr=window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

export default router
