var mouseCoords;

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

function setupMap(location) {
mapboxgl.accessToken =
          "pk.eyJ1IjoidHNxdWlyZTUiLCJhIjoiY2pvanRudmRpMDB0aTNrbnk3NXpyc205ayJ9.VebVhb0D-yXiqv8ZVMCI0Q";
        
        var map = new mapboxgl.Map({
          container: "map", // container id
          style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
          //center: [-0.1833427, 51.555543], // starting position [lng, lat]
          center: new mapboxgl.LngLat(location[1], location[0]),
          zoom: 16
        });
        
        var geojson = {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: new mapboxgl.LngLat(location[1], location[0])
            },
            properties: {
              title: 'Mapbox',
              description: 'Your Location'
            }
          }]
        };
        

        map.on("load", function() {
          fetch(
            "https://fordkerbhack.azure-api.net/features?viewport=51.5535663,-0.1887717,51.5589623,-0.1788357",
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

        map.on('click', 'places', function (e) {
          var coordinates = e.features[0].geometry.coordinates.slice();
          var description = e.features[0].properties.description;
           
          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
           
          new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map);
          });

        map.on('mousemove', (e) => {
          mouseCoords = e.lngLat;
        });

        map.on('click', (e) => {
          console.log("clicked at: ");
          console.log(mouseCoords);
          addNewLocation(mouseCoords);
        });

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