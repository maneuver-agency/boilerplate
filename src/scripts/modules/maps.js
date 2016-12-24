require('leaflet')
const log = require('bows')('Maps')

module.exports = {

  create: function(id, options) {
    options = options || {};

    log(options)

    let el = document.querySelector('#'+id);
    if (el) {
      if (!options.lat && el.dataset.lat) {
        options.lat = el.dataset.lat;
      }
      if (!options.lng && el.dataset.lng) {
        options.lng = el.dataset.lng;
      }

      createMap(id, options);

    }
  }

}

function createMap(element, options) {
  let map = L.map(element, {
    center: [options.lat, options.lng],
    zoom: 13,
    attributionControl: false,
    zoomControl: false
  });

  // TODO: make Google Maps work.
  // See: https://gist.github.com/crofty/2197701
  let urltemplate = 'https://api.mapbox.com/styles/v1/maneuver/ciua24ers00322iodnbymkbuv/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFuZXV2ZXIiLCJhIjoiMGR4aGktMCJ9.MF4X_7cnibJhu4RubB56Bg';

  if (options.urltemplate) {
    urltemplate = options.urltemplate;
    console.debug(urltemplate);
  }

  L.tileLayer(urltemplate, options).addTo(map);

  if (options.icon) {
    let markerIcon = L.icon({
      iconUrl: options.icon, // || '/assets/img/marker.svg',
      iconSize: [34,34],
      iconAnchor: [17,34]
    });
    L.marker([options.lat, options.lng], {icon: markerIcon}).addTo(map);
  }

  // map.getSize();
  // map.invalidateSize();
}
