require('../scss/style.scss')

import Vue from 'vue'
import App from './vue/App.vue'

new Vue({
  el: '#app',
  render: h => h(App)
})

console.log('testje')