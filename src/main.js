// Imports
import Vue from 'vue';
import store from './components/Store';
import App from './App.vue';
import 'es6-promise/auto';

const VueFire = require('vuefire')
 
Vue.use(VueFire)

// Config
Vue.config.productionTip = false;

// Start the app
new Vue({
  store,
  render: h => h(App)
}).$mount('#app');
