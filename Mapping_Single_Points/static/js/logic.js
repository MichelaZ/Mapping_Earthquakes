// Add console.log to check to see if our code is working.
// $(document).ready(function() {
//     // STEP 0: Get the Data
//     console.log(line);
// });
// Accessing the airport GeoJSON URL
let airportData = "https://raw.githubusercontent.com/MichelaZ/Mapping_Earthquakes/Mapping_GeoJSON_Polygons/torontoNeighborhoods.json";



// We create the tile layer that will be the background of our map.
// Create base layers

// Streetmap Layer
var street = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  maxZoom: 18,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});

var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "satellite-v9",
  accessToken: API_KEY
});

var satelliteStreet = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "satellite-streets-v11",
  accessToken: API_KEY
});

var baseMaps = {
    "Dark": dark,
    "Light": light,
    "Satellite": satellite,
    "Street": street,
    "Satelite Street": satelliteStreet

  };

  // Create the map object with a center and zoom level.
var map = L.map("mapid", {
    center: [43.7, -79.3],
    zoom: 11,
    layers: [street] // default
  });

L.control.layers(baseMaps).addTo(map);

// Grabbing our GeoJSON data.
d3.json(airportData).then(function(data) {
    console.log(data);
  // Creating a GeoJSON layer with the retrieved data.
  L.geoJSON(data, {
    weight: 2,
    fillOpacity: '50%',
    fillColor: '#ffc43d',
    color: "#e98a15",
      // We turn each feature into a marker on the map.
    onEachFeature: function(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.AREA_NAME}</h3>`);
        layer.on({
            mouseover: function(event) {
                let layer_target = event.target;
                layer_target.setStyle({ fillOpacity: 1 });
            },
            mouseout: function(event) {
                let layer_target = event.target;
                layer_target.setStyle({ fillOpacity: 0.5 });
            },
            click: function(event) {
                myMap.fitBounds(event.target.getBounds());
            }
        });  
    }  
  }).addTo(map);
});