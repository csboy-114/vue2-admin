import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
// import Home from '@/views/Home.vue'
// import Welcome from '../components/Welcome.vue'
// import Users from '../components/users/Users.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'
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
      }
    ]
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
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
