import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Vuex from 'vuex';
// @ts-ignore
// import Vuetify from 'vuetify'
// import vuetify from '@/plugins/vuetify'
// import BootstrapVue from 'bootstrap-vue'

Vue.use(Vuex);
// Vue.use(BootstrapVue);
// Vue.use(Vuetify);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h: any) => h(App),
}).$mount('#app');
