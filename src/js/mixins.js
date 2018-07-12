import Vue from 'vue'
import api from './api'

Vue.mixin({
  data () {
    return {
      api
    }
  }
})
