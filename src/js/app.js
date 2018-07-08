require('../scss/style.scss')
require('./utils.js')

// import slick from 'slick-carousel';

import Vue from 'vue'
import { store } from './store/store'
import { upperFirst, camelCase } from 'lodash'

const requireComponent = require.context(
  './vue', false, /[\w-]+\.vue$/
)

requireComponent.keys().forEach(fileName => {
  // Get component config
  const componentConfig = requireComponent(fileName)

  // Get PascalCase name of component
  const componentName = upperFirst(
    camelCase(
      // Strip the leading `'./` and extension from the filename
      fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')
    )
  )

  // Register component globally
  Vue.component(componentName, componentConfig.default || componentConfig)
})

new Vue({
  el: '#app',
  store
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
