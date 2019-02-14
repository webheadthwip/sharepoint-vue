import Vue from 'vue';
import App from './App.vue';
/* eslint-disable */
import Chart from 'chart.js';
import { store } from './store/store';

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
