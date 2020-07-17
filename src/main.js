import 'vue-material/dist/theme/default-dark.css'
import 'vue-material/dist/vue-material.min.css'
import *  as material_icons from './assets/css/material_icons.css'
import App from './App.vue'
import Firebase from 'firebase/app';
import MarqueeText from 'vue-marquee-text-component'
import Notifications from 'vue-notification'
import router from './router'
import store from './store'
import VAnimateCss from 'v-animate-css';
import VueAgile from 'vue-agile'
import Vue from 'vue'
import VueMaterial from 'vue-material'
import VueTimers from 'vue-timers'
import { EmojiPickerPlugin } from 'vue-emoji-picker'

Vue.config.productionTip = false;

const moment = require('moment');
require('moment/locale/es');
require('firebase/firestore');

Vue.component('marquee-text', MarqueeText);
Vue.use(EmojiPickerPlugin);
Vue.use(material_icons);
Vue.use(Notifications);
Vue.use(require('vue-moment'), {moment});
Vue.use(VAnimateCss);
Vue.use(VueAgile);
Vue.use(VueMaterial);
Vue.use(VueTimers);

const config = {
  apiKey: "AIzaSyAAgoc6CyGGfc0a6DyCUqFTj0jgkJs30zw",
  authDomain: "pongalamusic-api.firebaseapp.com",
  databaseURL: "https://pongalamusic-api.firebaseio.com",
  projectId: "pongalamusic-api",
  storageBucket: "pongalamusic-api.appspot.com",
  messagingSenderId: "917512446533",
  appId: "1:917512446533:web:4697952b7a099ba622392c"
};

Firebase.initializeApp(config);

/* Bind firebase to your Vue instance */
Vue.prototype.$firebase = Firebase;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
