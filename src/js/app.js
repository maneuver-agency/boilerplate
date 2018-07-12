import '../scss/style.scss'

import Vue from 'vue'
import store from './store'

import './directives'
import './plugins'
import './mixins'

import './components/_globals'

new Vue({ // eslint-disable-line no-new
  el: '#app',
  store,
  mounted () {
    // Load appdata into store.
    const el = document.getElementById('appdata')
    if (el) {
      let appdata = JSON.parse(el.textContent)
      if (appdata) {
        this.$store.commit('setAppData', appdata)
      }
    }

    // Animate jump links.
    document.querySelectorAll('a[href^="#"]').forEach(el => {
      const id = el.getAttribute('href')
      if (id.length > 1) {
        el.addEventListener('click', event => {
          event.preventDefault()
          this.$scrollTo(id)
        })
      }
    })
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
