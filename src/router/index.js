import Vue from 'vue'
import VueRouter from 'vue-router'
import Player from '../views/Player.vue'
import Loading from '../views/Loading.vue'
//import Messages from '../views/Messages.vue'


Vue.use(VueRouter)

const electron = require('electron')

const routes = [
  {
    path: '/',
    name: 'loading',
    component: Loading
  },
  {
    path: '/player',
    name: 'player',
    component: Player
  },
  {
    path: '/config',
    name: 'config',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Config.vue')
  },
  {
    path: '/messages',
    name: 'messages',
    component: () => import('../views/Messages.vue')
  },
  {
    path: '/banners',
    name: 'banners',
    component: () => import('../views/Banners.vue')
  }
  ,
  {
    path: '/admin_users',
    name: 'admin_users',
    component: () => import('../views/AdminUsers.vue')
  }
  
]

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes
})

// navigate from electron menu bar
electron.ipcRenderer.on('navigate', (event, url) => {
  // //console.log(url)
  router.push(url)
})

export default router
