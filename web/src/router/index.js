import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/trend',
    name: 'Trend',
    component: () => import('@/views/trend/index.vue')
  },
  {
    path: '/seller',
    name: 'Seller',
    component: () => import('@/views/seller/index.vue')
  },
  {
    path: '/map',
    name: 'Map',
    component: () => import('@/views/map/index.vue')
  },
  {
    path: '/rank',
    name: 'Rank',
    component: () => import('@/views/rank/index.vue')
  },
  {
    path: '/hot',
    name: 'Hot',
    component: () => import('@/views/hot/index.vue')
  },
  {
    path: '/stock',
    name: 'Stock',
    component: () => import('@/views/stock/index.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router