import Vue from 'vue';
import App from './App.vue';
import router from './router';

// Import Tailwind CSS
import './styles/tailwind.css';

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});