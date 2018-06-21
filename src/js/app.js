import '../scss/style.scss'
import './utils.js'
import './offcanvas.js'

import Vue from 'vue'
import App from './vue/App.vue'
import Map from './components/Map'
// import slick from 'slick-carousel';


if (document.getElementById('app')) {
  new Vue({
    el: '#app',
    render: h => h(App)
  })
}



// jQuery ready
;(function($){
  let ticking = false

  if (document.getElementById('map')) {
    Map.create('map')
  }
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

      $('.site-header').toggleClass('site-header--shrink', window.pageYOffset > 70)
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