var $ = require('jquery');
require('./polyfills.js');
require('./utils.js');

if (!window.jQuery) window.jQuery = window.$ = $;
require('../bower_components/bootstrap-sass/assets/javascripts/bootstrap/transition.js');
require('../bower_components/bootstrap-sass/assets/javascripts/bootstrap/collapse.js');

var ticking, handlers;

function initialize(){
  ticking = false;

  bindEvents();
}

/*
 * Main method for binding some events to the document or window.
 */
function bindEvents(){
  $(window)
  .on('resize scroll', requestTick);

  $(document)
  .on('click', function(e){

  });

  handlers.onResize();
  handlers.onScroll();
}

function requestTick(e) {
  var func = 'on' + e.type.capitalize();
  // console.log(func.apply());
  if (!ticking && func in handlers) {
    window.requestAnimationFrame(handlers[func]);
    ticking = true;
  }
}

/*
 * Event Handlers object.
 */
handlers = {

  onResize: function() {
    // do stuff here

    ticking = false;
  },

  onScroll: function() {
    // do stuff here

    ticking = false;
  }

};


// @TODO: put in seperate file.
var outdatedBrowserRework = require("outdated-browser-rework");
outdatedBrowserRework({
	browserSupport: {
		'Chrome': 37, // Includes Chrome for mobile devices
		'IE': 10,
		'Safari': 7,
		'Mobile Safari': 7,
		'Firefox': 32
	}
});

/* KICKSTART */
initialize();
