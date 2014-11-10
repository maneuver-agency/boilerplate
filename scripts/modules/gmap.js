define(function(){

  var gmap, markers = [];

  function build(options) {
    var $zoomcontrols, i, len, settings;

    settings = $.extend({
      id: '#gmaps',
      lat: 51.159444,
      lng: 4.181447,
      markers: [],
      addZoomControls: true,
      scrollwheel: false,
      zoom: 11
    }, options);

    // Add default marker.
    if (settings.markers !== false && settings.markers.length === 0) {
      settings.markers.push({lat: settings.lat, lng: settings.lng});
    }

    if (typeof GMaps !== 'undefined' && $(settings.id).length) {

      gmap = new GMaps({
        div: settings.id,
        lat: settings.lat,
        lng: settings.lng,
        zoom: settings.zoom,
        panControl: false,
        scaleControl: false,
        zoomControlOpt: {style: 'SMALL'},
        zoomControl: false,
        overviewMapControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        scrollwheel: settings.scrollwheel,
        dragend: settings.dragend || function(){},
        radius_changed: settings.change || function(){},
        center_changed: settings.change || function(){},
        zoom_changed: settings.change || function(){},
        // mouseup: settings.mouseup || function(){ console.log("mpouseup"); },
        styles: [
          {
            "stylers": [
              { "gamma": 1 },
              { "saturation": -50 }
            ]
          }
        ]
      });

      for(i=0, len=settings.markers.length; i<len; i++) {
        settings.markers[i].icon = '/theme/bertoy14/assets/img/marker.png';
        if (typeof settings.clickMarker == 'function') {
          settings.markers[i].click = settings.clickMarker;
        }
        markers.push(gmap.addMarker(settings.markers[i]));
      }

      if (settings.addZoomControls) {
        $zoomcontrols = $('<div />', {class: 'zoom-controls'}).appendTo('#gmaps');
        $('<div />', {class: 'zoom-in'}).html('<i class="icon-plus"></i>').appendTo($zoomcontrols);
        $('<div />', {class: 'zoom-out'}).html('<i class="icon-minus"></i>').appendTo($zoomcontrols);

        $('#gmaps')
        .on('click', '.zoom-in', function(e){
          gmap.zoomIn();
        })
        .on('click', '.zoom-out', function(e){
          gmap.zoomOut();
        });
      }

    }
  }

  function findLocation(drawRoute){
    if (gmap) {
      GMaps.geolocate({
        success: function(position) {
          if (drawRoute) {
            gmap.drawRoute({
              origin: [position.coords.latitude, position.coords.longitude],
              destination: [marker.lat, marker.lng],
              travelMode: 'driving',
              strokeColor: '#131540',
              strokeOpacity: 0.6,
              strokeWeight: 6
            });
            fitZoom();
          } else {
            gmap.setCenter(position.coords.latitude, position.coords.longitude);
            gmap.setZoom(11);
          }
        },
        error: function(error) {
          // fitZoom();
        },
        not_supported: function(){
          // fitZoom();
        }
      });
    }
  }

  function gotoAddress(address) {
    if (gmap && address) {
      GMaps.geocode({
        address: address,
        callback: function(results, status) {
          if (status == 'OK') {
            var latlng = results[0].geometry.location;
            gmap.setCenter(latlng.lat(), latlng.lng());
            gmap.setZoom(11);
          }
        }
      });
    }
  }

  function fitZoom(){
    if (gmap) {
      gmap.fitZoom();
    }
  }

  function getVisibleMarkers() {
    if (gmap && markers.length) {
      var bounds = gmap.map.getBounds(),
          list = [];

      [].map.call(markers, function(marker){
        if (bounds.contains(marker.position)) {
          list.push(marker);
        }
      });

      return list;
    }
  }

  function getAllMarkers() {
    return markers;
  }

  return {
    getMap: function(){ return gmap.map; },

    create: build,
    locate: findLocation,
    fit: fitZoom,
    goTo: gotoAddress,

    getVisibleMarkers: getVisibleMarkers,
    getAllMarkers: getAllMarkers
  };
});
