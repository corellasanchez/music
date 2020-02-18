import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default-dark.css' 
import VueFirestore from 'vue-firestore'
  

Vue.config.productionTip = false;
Vue.use(VueFirestore)
Vue.use(VueMaterial);
Vue.use(VueFirestore);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
