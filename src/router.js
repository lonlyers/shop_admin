import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Index from './components/Index.vue'
import Users from './components/Users.vue'
import Roles from './components/Roles.vue'
import Rights from './components/Rights.vue'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new Router({
  routes: [
    { path: '/', redirect: '/index' },
    { path: '/index',
      component: Index,
      children: [
        { path: '/users', component: Users },
        { path: '/roles', component: Roles },
        { path: '/rights', component: Rights }
      ]
    },
    { path: '/login', component: Login }
  ]
})
router.beforeEach((to, from, next) => {
  // console.log(to.path) 请求的路由路径
  // 如果是去登陆, 直接放行
  // 如果不是去登陆, 去其他组件, 判断下是否有 token, 有才放行
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})
export default router
