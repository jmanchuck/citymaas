var mouseCoords;
let map;

function addNewLocation(coords) {
  let geojson = {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: new mapboxgl.LngLat(coords.lng, coords.lat)
      },
      properties: {
        title: 'Mapbox',
        description: prompt("enter the name")
      }
    }]
  };
  geojson.features.forEach(function(marker) {
    console.log("Added");
    // create a HTML element for each feature
    var el = document.createElement('div');
    el.className = 'marker';
  
    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el)
      .setLngLat(marker.geometry.coordinates)
      //.setHTML(marker.properties.description)
      .addTo(map);

      new mapboxgl.Popup()
      .setLngLat(marker.geometry.coordinates)
      .setHTML(marker.properties.description)
      .addTo(map);
  });
  
}

// create a function to make a directions request
function getRoute(end, start = [-0.0785536, 51.518663]) {
  // make a directions request using cycling profile
  // an arbitrary start will always be the same
  // only the end or destination will change
  var url = 'https://api.mapbox.com/directions/v5/mapbox/cycling/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken;

  // make an XHR request https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
  var req = new XMLHttpRequest();
  req.responseType = 'json';
  req.open('GET', url, true);
  req.onload = function() {
    var data = req.response.routes[0];
    var route = data.geometry.coordinates;
    var geojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route
      }
    };
    // if the route already exists on the map, reset it using setData
    if (map.getSource('route')) {
      map.getSource('route').setData(geojson);
    } else { // otherwise, make a new request
      map.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: geojson
            }
          }
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });
    }
    // add turn instructions here at the end
  };
  req.send();
}

function setupMap(location) {
      
      mapboxgl.accessToken =
          "pk.eyJ1IjoidHNxdWlyZTUiLCJhIjoiY2pvanRudmRpMDB0aTNrbnk3NXpyc205ayJ9.VebVhb0D-yXiqv8ZVMCI0Q";
        location = location.coords
        map = new mapboxgl.Map({
          container: "map", // container id
          style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
          //center: [-0.1833427, 51.555543], // starting position [lng, lat]
          center: new mapboxgl.LngLat(location.longitude, location.latitude),
          zoom: 11
        });
        
        var geojson = {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: new mapboxgl.LngLat(location.longitude, location.latitude)
            },
            properties: {
              title: 'Mapbox',
              description: 'Your Location'
            }
          }]
        };
        

        map.on("load", function() {
          
          var start = [location.longitude, location.latitude];
          getRoute(end = start);

          // Add starting point to the map
          map.addLayer({
            id: 'point',
            type: 'circle',
            source: {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [{
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Point',
                    coordinates: start
                  }
                }
                ]
              }
            },
            paint: {
              'circle-radius': 10,
              'circle-color': '#3887be'
            }
          });
          
          distination = [-0.14333, 51.53858];
          getRoute(end = distination, start = start);
          map.addLayer({
            id: 'point2',
            type: 'circle',
            source: {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [{
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Point',
                    coordinates: distination
                  }
                }
                ]
              }
            },
            paint: {
              'circle-radius': 10,
              'circle-color': '#ff00ff'
            }
          });

          fetch(
            // 51.5535663,-0.1887717,51.5589623,-0.1788357
            // 51.53858,-0.14333
            "https://fordkerbhack.azure-api.net/features?viewport=51.53758,-0.14433,51.53958,-0.14233",
            {
              headers: {
                "Ocp-Apim-Subscription-Key": "c105fb930d5b43b09d8da802326651e9"
              }
            }
          )
            .then(response => response.json())
            .then(curbLR => {
              map.addLayer({
                id: "bays",
                type: "line",
                source: {
                  type: "geojson",
                  data: curbLR
                },
                layout: {
                  "line-join": "round",
                  "line-cap": "round"
                },
                paint: {
                  "line-color": "#139DCD",
                  "line-width": 2
                }
              });
            });
        });

        map.on('load', () => {
          map.addLayer( {
            id: "places",
            source: {
              type: "geojson",
              data: geojson
            },
            type: "symbol"
          });
        });

        // map.on('click', 'places', function (e) {
        //   var coordinates = e.features[0].geometry.coordinates.slice();
        //   var description = e.features[0].properties.description;
           
        //   // Ensure that if the map is zoomed out such that multiple
        //   // copies of the feature are visible, the popup appears
        //   // over the copy being pointed to.
        //   while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        //   coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        //   }
           
        //   new mapboxgl.Popup()
        //   .setLngLat(coordinates)
        //   .setHTML(description)
        //   .addTo(map);
        //   });

        map.on('mousemove', (e) => {
          mouseCoords = e.lngLat;
        });

        // map.on('click', (e) => {
        //   console.log("clicked at: ");
        //   console.log(mouseCoords);
        //   addNewLocation(mouseCoords);
        // });

        // map.addControl(new MapboxDirections({
        //   accessToken: mapboxgl.accessToken,
        //   unit: 'metric',
        //   profile: 'mapbox/driving',
        //   destination: 'NW1 7PG',
        //   origin: `${location.longitude}, ${location.latitude}`,
        // }), 'top-left');

        geojson.features.forEach(function(marker) {

          // create a HTML element for each feature
          var el = document.createElement('div');
          el.className = 'marker';
        
          // make a marker for each feature and add to the map
          new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);
        });

        return map;
}

function setMapCenter(center) {
    map.center = [center];
}1