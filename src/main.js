import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  response = response.data
  // 校验结果, 如果响应时, 发现状态码是401, 说明是无效token, 拦截到登录
  if (response.meta.status === 401) {
    router.push('/login')
    response.meta.msg = '登录状态已失效, 请重新登录'
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})
Vue.prototype.$axios = axios

// 使用element-ui
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
