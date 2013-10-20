define(function(){

  var gmap;

  function build(options) {
    var $zoomcontrols, i, len, settings;

    settings = $.extend({
      id: '#gmaps',
      lat: 51.159444,
      lng: 4.181447,
      markers: [{lat: 51.159444, lng: 4.181447}],
      addZoomControls: true
    }, options);

    console.log(settings);

    if (GMaps !== undefined) {

      gmap = new GMaps({
        div: settings.id,
        lat: settings.lat,
        lng: settings.lng,
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

      for(i=0, len=settings.markers.length; i<len; i++) {
        settings.markers[i].icon = '/assets/img/marker.png';
        gmap.addMarker(settings.markers[i]);
      }

      if (settings.addZoomControls) {
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
          } else {
            gmap.setCenter(position.coords.latitude, position.coords.longitude);
          }
          gmap.fitZoom();
        }
      });
    }
  }

  return {
    create: build,
    locate: findLocation
  };
});
