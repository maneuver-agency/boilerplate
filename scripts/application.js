

"use strict";

var ticking, handlers;

function initialize(){
  ticking = false;

  bindEvents();

  /* Create Google Maps */
  if ($('#gmaps').length) {
    require(['modules/gmap'], function(gmaps){
      gmaps.create({
        // lat: 51.207781,
        // lng: 4.346320,
        // scrollwheel: true,
        // markerIcon: '/assets/img/marker.png'
      });
    });
  }

  outdatedBrowser({
    bgColor: '#f25648',
    color: '#ffffff',
    lowerThan: 'transform',
    languagePath: ''
  });
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
