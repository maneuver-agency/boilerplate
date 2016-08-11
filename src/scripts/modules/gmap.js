var GMaps = require('../../../bower_components/gmaps/gmaps.js');
var $ = require('jquery');

module.exports = GoogleMap;

function GoogleMap(options) {
  // Default options.
  this.settings = $.extend({
    // Custom options.
    addDefaultMarker: true,

    // Gmaps options.
    div: '#gmaps',
    lat: 51.166447,
    lng: 4.155782,
    markers: [],
    addZoomControls: true,
    scrollwheel: false,
    zoom: 11,
    panControl: false,
    scaleControl: false,
    zoomControlOpt: {style: 'SMALL'},
    zoomControl: false,
    overviewMapControl: false,
    streetViewControl: false,
    mapTypeControl: false,
  }, options);

  this.markers = [];
  this.map = this.create();

  if (this.settings.addDefaultMarker) {
    this.addMarker({lat: this.settings.lat, lng: this.settings.lng});
  }
  this.addMarkers(this.settings.markers);
}

GoogleMap.prototype = {
  constructor: GoogleMap,

  create: function(options) {
    if (typeof GMaps !== 'undefined' && $(this.settings.div).length) {
      return new GMaps($.extend(true, {}, this.settings)); // Create deep clone of settings.
    }
  },

  addMarkers: function(items) {
    if (items.length) {
      for (var i = 0, len = items.length; i < len; i++) {
        this.addMarker(items[i]);
      }
    }
  },

  addMarker: function(object) {
    if (!object.icon) {
      object.icon = this.settings.markerIcon;
    }
    this.markers.push(object);

    if (this.map) {
      this.map.addMarker(object);
    }
  },

  gotoAddress: function(address) {
    if (this.map && address) {
      GMaps.geocode({
        address: address,
        callback: function(results, status) {
          if (status == 'OK') {
            var latlng = results[0].geometry.location;
            this.map.setCenter(latlng.lat(), latlng.lng());
            this.map.setZoom(11);
          }
        }
      });
    }
  },

  locate: function(drawRoute){
    var self = this;
    if (this.map) {
      GMaps.geolocate({
        success: function(position) {
          if (drawRoute) {
            self.map.drawRoute({
              origin: [position.coords.latitude, position.coords.longitude],
              destination: [marker.lat, marker.lng],
              travelMode: 'driving',
              strokeColor: '#131540',
              strokeOpacity: 0.6,
              strokeWeight: 6
            });
            fitZoom();
          } else {
            self.map.setCenter(position.coords.latitude, position.coords.longitude);
            self.map.setZoom(11);
          }
        },
        error: function(error) {
          // self.fitZoom();
        },
        not_supported: function(){
          // self.fitZoom();
        }
      });
    }
  },

  fitZoom: function(){
    if (this.map) {
      this.map.fitZoom();
    }
  },

  getVisibleMarkers: function() {
    if (this.map && this.markers.length) {
      var bounds = this.map.map.getBounds(),
          list = [];

      this.markers.forEach(function(marker){
        if (bounds.contains(marker.position)) {
          list.push(marker);
        }
      });

      return list;
    }
  }
}
