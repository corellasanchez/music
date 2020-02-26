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
Vue.use(VueTimers)
 



  
Vue.config.productionTip = false;

const moment = require('moment');
require('moment/locale/es');
 
Vue.use(require('vue-moment'), {moment})
Vue.use(VueFirestore)
Vue.use(VueMaterial);
Vue.use(VueFirestore);
Vue.use(VAnimateCss);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
