require('../scss/style.scss')
require('./utils.js')

// import slick from 'slick-carousel';

import Vue from 'vue'
import App from './vue/App.vue'
new Vue({
  el: '#app',
  render: h => h(App)
})



// jQuery ready
;(function($){
  let ticking = false

  /*
   * Main method for binding some events to the document or window.
   */
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

   /*
   * Event Handlers object.
   */
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
})(jQuery)