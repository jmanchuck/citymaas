var mouseCoords;
var mousePointCoords;
let map;

function addNewLocation(coords) {
  let geojson = {
    id: "places",
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

function addNewPinOnMap(coords, elementClassName) {
  let geojson = {
    id: elementClassName,
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: new mapboxgl.LngLat(coords[0], coords[1])
      }
    }]
  };

  geojson.features.forEach(function(marker) {
    console.log("Added");
    // create a HTML element for each feature
    var el = document.createElement('div');
    el.className = elementClassName;

    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el)
      .setLngLat(marker.geometry.coordinates)
      //.setHTML(marker.properties.description)
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

function checkMouseCollision(id) {
  let cc = map.getContainer();
  let elements = cc.getElementsByClassName('marker');
  let mousePos = mousePointCoords;
  console.log(elements.length);
  for(let i = 0; i < elements.length; i++)
  {
    let elementPos = [elements[i].getBoundingClientRect().x, elements[i].getBoundingClientRect().y];
    console.log(elementPos);
    let elementRect = {
      top: parseInt(elementPos[1] - 40),
      bottom: parseInt(elementPos[1] + 40),
      left: parseInt(elementPos[0] - 40),
      right: parseInt(elementPos[0] + 40)
    };
    if(
      mousePos.x >= elementRect.left && mousePos.x <= elementRect.right
      && mousePos.y + 100 >= elementRect.top && mousePos.y + 100 <= elementRect.bottom
    ) {
      return true;
    }
  }
  return false;
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
          zoom: 12
        });
        fetch(
          "http://127.0.0.1:8000/apicall/",
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
              lat: 51.51520420713295,
              lng: -0.12958518467630434
            })
          }
        )
        .then(response => response.json())
        .then(
        function(response) {
            response = JSON.parse(response);
            console.log(response);

            for(let i = 0; i < response.length; i++)
            {
            let geojson = {
              type: 'FeatureCollection',
              features: [{
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: new mapboxgl.LngLat(response[i].location[1], response[i].location[0])
                },
                properties: {
                  title: 'Mapbox',
                  description: 'Disabled parking location'
                }
              }]
            };
            geojson.features.forEach(function(marker) {
                console.log("added");
            // create a HTML element for each feature
              var el = document.createElement('div');
              el.className = 'start';
              // make a marker for each feature and add to the map
              new mapboxgl.Marker(el)
                .setLngLat(marker.geometry.coordinates)
                .addTo(map);
            });
          }
        }
        );
        map.on("load", function() {

          var start = [location.longitude, location.latitude];
          getRoute(end = start);
          destination = [-0.14333, 51.53858];
          getRoute(end = destination, start = start);
          addNewPinOnMap(destination, 'destination');
          // map.addLayer({
          //   id: 'point2',
          //   type: 'circle',
          //   source: {
          //     type: 'geojson',
          //     data: {
          //       type: 'FeatureCollection',
          //       features: [{
          //         type: 'Feature',
          //         properties: {},
          //         geometry: {
          //           type: 'Point',
          //           coordinates: distination
          //         }
          //       }
          //       ]
          //     }
          //   },
          //   paint: {
          //     'circle-radius': 10,
          //     'circle-color': '#ff00ff'
          //   }
          // });



          /*
        fetch(
          "http://localhost:8000/apicall/getDisabled",
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
              lng: -0.08346151464363061,
              lat: 51.525662072723975
            })
          }
        )
        */

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
          el.className = 'start';

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
