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
    component:Login
  },
  {
    path:'/home',
    component:()=>import(/* webpackChunkName: "Home" */'../views/Home.vue'),
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:()=>import(/* webpackChunkName: "Welcome" */'../components/Welcome.vue')
      },
      {
        path:'/users',
        component:()=>import(/* webpackChunkName: "Users" */'../components/users/Users.vue')
      },
      {
        path:'/rights',
        component:()=>import(/* webpackChunkName: "Rights" */'../components/power/Rights.vue')
      },
      {
        path:'/roles',
        component:()=>import(/* webpackChunkName: "Roles" */'../components/power/Roles.vue')
      },
      {
        path:'/categories',
        component:()=>import(/* webpackChunkName: "Cate" */'../components/goods/Cate.vue')
      },
      {
        path:'/params',
        component:()=>import(/* webpackChunkName: "Params" */'../components/goods/Params.vue')
      },
      {
        path:'/goods',
        component:()=>import(/* webpackChunkName: "List" */'../components/goods/List.vue')
      },
      {
        path:'/goods/add',
        component:()=>import(/* webpackChunkName: "Add" */'../components/goods/Add.vue')
      },
      {
        path:'/orders',
        component:()=>import(/* webpackChunkName: "Order" */'../components/order/Order.vue')
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
