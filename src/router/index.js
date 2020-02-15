import Vue from 'vue'
import VueRouter from 'vue-router'
import Player from '../views/Player.vue'
import Loading from '../views/Loading.vue'


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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// navigate from electron menu bar
electron.ipcRenderer.on('navigate', (event, url) => {
  console.log(url)
  router.push(url)
})

export default router
