require('leaflet')
require('leaflet.gridlayer.googlemutant')
const GMStyles = require('./googlemaps-styles.js')

let map;
let poi;
let markers = [];
let el

module.exports = {

  create: function (id, options) {
    options = options || {}
    el = document.querySelector('#' + id)

    if (el) {
      if (!options.locations) {
        options.locations = [
          {
            location: {
              'lat': el.dataset.lat,
              'lng': el.dataset.lng 
            },
            mapslink: (el.dataset.mapslink) ? el.dataset.mapslink: ''
          }
        ]
      }

      this.createMap(id, options)
      window.addEventListener('resize', (event) => {
        // this.fitBounds()
      })
    }
  },

  fitBounds() {
    if (markers.length) {
      let group = new L.featureGroup(markers);
      map.fitBounds(group.getBounds());
    }
  },

  createMap (id, options) {

    let lat = options.locations[0].location.lat
    let lng = options.locations[0].location.lng

  
    map = L.map(id, {
      scrollWheelZoom: false,
      dragging: !L.Browser.mobile,
      tap: false
    }).setView([lat, lng], 13);

    L.gridLayer.googleMutant({
        type: 'roadmap', // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
        styles: GMStyles.gray
    }).addTo(map)


    let loopIndex=0;
    options.locations.forEach((item) => {
      if (item.location.lat && item.location.lng) {

        let icon = L.icon({
          iconUrl: MNVR.templateDir + '/assets/icons/marker.svg',
          iconSize: [50, 50], // size of the icon,
          iconAnchor: [25, 50]
        });
        
        //add marker to map
        // let marker = L.marker([item.location.lat, item.location.lng], {icon: icon}).addTo(map).bindPopup(item.title)
        let marker = L.marker([item.location.lat, item.location.lng], {icon: icon}).addTo(map)

        marker.index = loopIndex;
        marker.mapslink = item.mapslink
        
        let self = this
        marker.addEventListener('click', (e) =>  {
          // console.log(marker.mapslink)
          window.open (marker.mapslink)
        })

        markers.push(marker)
      }
      loopIndex++;
    })

    // this.fitBounds()
  }    
}