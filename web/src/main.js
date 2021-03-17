import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import store from '@/store'
import SocketService from '@/utils/socketUtils'
import china from '../public/static/map/china.json'


window.echarts.registerMap('China',china)
Vue.prototype.$echarts = window.echarts // index.html引入了echarts，window就有这个属性，因此挂载在vue原型对象上

axios.defaults.baseURL = 'http://localhost:3000/api/'
Vue.prototype.$http = axios


import '@/assets/css/global.less'
import '@/assets/font/iconfont.css'

SocketService.Instance.connect() // 创建实例并连接服务器
Vue.prototype.$socket = SocketService.Instance // 挂载到原型身上，方便调用

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')