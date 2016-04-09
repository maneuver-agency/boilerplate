var $ = require('jquery');
require('./polyfills.js');
require('./utils.js');
// require('./application.js');

var handlers;
bindEvents();

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

/*require.config({
  paths: {
    "googlemaps": "modules/googlemaps",
    "async": "modules/async",
    "webfont": "http://ajax.googleapis.com/ajax/libs/webfont/1/webfont"
  },
});

require(['polyfills', 'jquery', 'webfont'], function(pol, $){
  require(['components'], function(pol, com){
    require(['utils', 'application'], function(util, app){
      app.init();
    });
  });
});*/
