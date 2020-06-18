import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default-dark.css'
import VueFirestore from 'vue-firestore'
import VAnimateCss from 'v-animate-css';
import VueTimers from 'vue-timers'
import MarqueeText from 'vue-marquee-text-component'
import { EmojiPickerPlugin } from 'vue-emoji-picker'
import *  as material_icons from './assets/css/material_icons.css'
import Notifications from 'vue-notification'
import VueAgile from 'vue-agile'





Vue.config.productionTip = false;

const moment = require('moment');
require('moment/locale/es');

Vue.component('marquee-text', MarqueeText);
Vue.use(require('vue-moment'), {moment});
Vue.use(VueFirestore);
Vue.use(VueMaterial);
Vue.use(VueFirestore);
Vue.use(VAnimateCss);
Vue.use(VueTimers);
Vue.use(EmojiPickerPlugin);
Vue.use(material_icons);
Vue.use(Notifications);
Vue.use(VueAgile);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
