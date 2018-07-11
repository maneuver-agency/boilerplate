import '../scss/style.scss'
import './utils.js'

import Vue from 'vue'
import store from './store'
import api from './api'

import './components/_globals'

/**
 * Import and use a flexible modal/dialog component.
 * @see https://github.com/euvl/vue-js-modal
 */
import VModal from 'vue-js-modal'
Vue.use(VModal, { dialog: true })

Vue.mixin({
  data () {
    return {
      api
    }
  }
})

new Vue({ // eslint-disable-line no-new
  el: '#app',
  store,
  mounted () {
    let el = document.getElementById('appdata')
    if (el) {
      let appdata = JSON.parse(el.textContent)
      if (appdata) {
        this.$store.commit('setAppData', appdata)
      }
    }
  },
  components: {

  },
  methods: {

  }
})

/*
// jQuery ready
;(function($){
  let ticking = false

  function bindEvents () {
    $(window)
    .on('resize scroll', requestTick)

    $(document)
    .on('click', (e) => {

    })
    handlers.onResize()
    handlers.onScroll()
  }

  function requestTick (e) {
    const func = 'on' + e.type.capitalize()
    // console.log(func.apply());
    if (!ticking && func in handlers) {
      window.requestAnimationFrame(handlers[func])
      ticking = true
    }
  }

  let handlers = {
    onResize: function () {
      // do stuff here
      ticking = false
    },

    onScroll: function () {
      // do stuff here
      ticking = false
    }
  }
  bindEvents()

  // $('.slideshow').slick({
  //   dots: true,
  //   arrows: true,
  //   rows: 0,
  //   prevArrow: '<button class="slick-prev btn btn-primary"><i class="fa fa-angle-left"></i></button>',
  //   nextArrow: '<button class="slick-next btn btn-primary"><i class="fa fa-angle-right"></i></button>'
  // })
})(jQuery) */
