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

  /* Create Google Maps */
  if ($('#gmaps').length) {
    var gmaps = require('./modules/gmap.js');
    gmaps.create({
      lat: 51.221351,
      lng: 4.285173,
      scrollwheel: true,
      // zoom: 14,
      markerIcon: MNVR.templateDir + '/assets/img/marker-derefter.png',
      styles: [ { "featureType": "all", "elementType": "all", "stylers": [ { "visibility": "simplified" } ] }, { "featureType": "administrative", "elementType": "all", "stylers": [ { "visibility": "on" } ] }, { "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [ { "color": "#444444" } ] }, { "featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [ { "weight": "1.2" } ] }, { "featureType": "administrative.province", "elementType": "all", "stylers": [ { "visibility": "on" } ] }, { "featureType": "administrative.province", "elementType": "geometry.stroke", "stylers": [ { "weight": "1" }, { "visibility": "off" } ] }, { "featureType": "administrative.neighborhood", "elementType": "all", "stylers": [ { "visibility": "off" } ] }, { "featureType": "landscape", "elementType": "all", "stylers": [ { "color": "#f2f2f2" } ] }, { "featureType": "poi", "elementType": "all", "stylers": [ { "visibility": "off" } ] }, { "featureType": "poi.business", "elementType": "all", "stylers": [ { "visibility": "off" } ] }, { "featureType": "poi.park", "elementType": "all", "stylers": [ { "visibility": "on" } ] }, { "featureType": "road", "elementType": "all", "stylers": [ { "saturation": -100 }, { "lightness": 45 }, { "visibility": "on" } ] }, { "featureType": "road.highway", "elementType": "all", "stylers": [ { "visibility": "simplified" } ] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] }, { "featureType": "transit", "elementType": "all", "stylers": [ { "visibility": "on" } ] }, { "featureType": "transit.station", "elementType": "all", "stylers": [ { "visibility": "on" } ] }, { "featureType": "water", "elementType": "all", "stylers": [ { "color": "#b4d2dc" } ] } ]
    });
  }
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
