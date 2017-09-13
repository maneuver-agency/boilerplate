'use strict'

// Use global jQuery object to use by third party jQuery plugins.
global.jQuery = require('jquery')

// Add Modernizr tests.
// See: https://github.com/jnordberg/browsernizr
require('browsernizr/test/touchevents')
global.Modernizr = require('browsernizr')

// Add our own utilities and polyfills.
require('./polyfills.js')
require('./utils.js')

// Add bootstrap javascripts.
require('../../node_modules/bootstrap-sass/assets/javascripts/bootstrap/transition.js')
require('../../node_modules/bootstrap-sass/assets/javascripts/bootstrap/collapse.js')

// Our own modules.
const Maps = require('./modules/maps.js')

// START
;(function ($) {
  let ticking = false
  let $siteheader = $('#site-header')

  Maps.create('map', {
    // urltemplate: 'https://api.mapbox.com/styles/v1/maneuver/ciubdy6pb00642io6anxjb705/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFuZXV2ZXIiLCJhIjoiMGR4aGktMCJ9.MF4X_7cnibJhu4RubB56Bg',
    icon: '/assets/img/marker.svg'
  })

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

      $siteheader.toggleClass('shrink', window.pageYOffset > 100)

      ticking = false
    }

  }

  bindEvents()

  // @TODO: put in seperate file.
  let outdatedBrowserRework = require('outdated-browser-rework')
  outdatedBrowserRework({
    browserSupport: {
      'Chrome': 37, // Includes Chrome for mobile devices
      'IE': 10,
      'Safari': 7,
      'Mobile Safari': 7,
      'Firefox': 32
    }
  })
})(global.jQuery)
