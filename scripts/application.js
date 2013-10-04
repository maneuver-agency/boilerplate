;(function($, undefined){

	"use strict";

	var Application = function(){
    this.ticking = false;

	};

  Application.prototype.init = function() {
    sefl.bindEvents();
  };

  Application.prototype.bindEvents = function() {
    $(document).
    on('click', function(e){

    });
  };

  Application.prototype.createMap = function() {
    var gmap, $zoomcontrols, markers = [{ lat: 50.827563, lng: 4.371094 }],
        i, len;

    if (GMaps !== undefined) {

      gmap = new GMaps({
        div: '#gmaps',
        lat: 50.827563,
        lng: 4.371094,
        panControl: false,
        scaleControl: false,
        zoomControlOpt: {style: 'SMALL'},
        zoomControl: false,
        overviewMapControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        scrollwheel: false,
        styles: [
          {
            "stylers": [
              { "gamma": 0.9 },
              { "saturation": -83 }
            ]
          }
        ]
      });

      for(i=0, len=markers.length; i<len; i++) {
        (function(mark){
          mark.icon = self.baseurl + 'assets/img/marker.png';
          gmap.addMarker(mark);
        })(markers[i]);
      }

      $zoomcontrols = $('<div />', {class: 'zoom-controls'}).appendTo('#gmaps');
      $('<div />', {class: 'zoom-in'}).text('+').appendTo($zoomcontrols);
      $('<div />', {class: 'zoom-out'}).text('--').appendTo($zoomcontrols);

      $('#gmaps')
      .on('click', '.zoom-in', function(e){
        gmap.zoomIn();
      })
      .on('click', '.zoom-out', function(e){
        gmap.zoomOut();
      });

      /*GMaps.geolocate({
        success: function(position) {
          gmap.drawRoute({
            origin: [position.coords.latitude, position.coords.longitude],
            destination: [marker.lat, marker.lng],
            travelMode: 'driving',
            strokeColor: '#131540',
            strokeOpacity: 0.6,
            strokeWeight: 6
          });
          //gmap.setCenter(position.coords.latitude, position.coords.longitude);
          // gmap.fitZoom();
        }
      });*/
    }
  };

  Application.prototype.requestTick = function(e) {
    var func = 'on' + e.type.capitalize();
    if (!self.ticking && func in self) {
      window.requestAnimationFrame(self[func]);
      self.ticking = true;
    }
  };

  Application.prototype.onResize = function() {
    // do stuff here

    self.ticking = false;
  };

  Application.prototype.onScroll = function() {
    // do stuff here

    self.ticking = false;
  };

	var self = new Application();

	// create global reference.
	window.App = self;

  $(window).on('resize scroll', self.requestTick).trigger('resize');

})(jQuery);



