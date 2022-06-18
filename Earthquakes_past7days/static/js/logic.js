// STEP 0: Get the Data
// Accessing the airport GeoJSON URL
let earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(earthquakeData).then(function(data) {
  console.log(data);
  makeMap(data);
});
function makeMap(data){
  // STEP 1: Initialize the Base Layers
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



  // Step 3 - CREATE LAYER DICTIONARIES
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
      "Dark": dark,
      "Light": light,
      "Satellite": satellite,
      "Street": street,
      "Satelite Street": satelliteStreet

    };
    // Create the earthquake layer for our map.
    let earthquakes = new L.layerGroup();
  // Overlays that may be toggled on or off
    let overlays = {
      Earthquakes: earthquakes
    };




  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: .5,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    }};

  // This function returns the style data for each of the earthquakes we plot on
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  };
  function getColor(magnitude) {
    if (magnitude > 5) {
      return "#ea2c2c";
    }
    if (magnitude > 4) {
      return "#ea822c";
    }
    if (magnitude > 3) {
      return "#ee9c00";
    }
    if (magnitude > 2) {
      return "#eecc00";
    }
    if (magnitude > 1) {
      return "#d4ee00";
    }
    return "#98ee00";
  }

    // STEP 4 = INIT THE MAP
  // Create a new map
  var map = L.map("mapid", {
    center: [30, 30],
    zoom: 2,
    layers: [street, earthquakes] // default
  });

  // // Grabbing our GeoJSON data.
  //   // Creating a GeoJSON layer with the retrieved data.
  
    L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        console.log(earthquakeData);
        return L.circleMarker(latlng);
        
      },
    // We set the style for each circleMarker using our styleInfo function.
      style: styleInfo,
  //     // We turn each feature into a marker on the map.      
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        // event listeners
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
    }).addTo(earthquakes);
  


  // STEP 5: Layer Control
  // Create a layer control, containing our baseMaps and overlayMaps, and add them to the map
  L.control.layers(baseMaps, overlays).addTo(map);

  // Create a legend control object.
  let legend = L.control({position: "bottomright"}); 
  legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend');
    const magnitudes = [0, 1, 2, 3, 4, 5];
    const colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];
    // Looping through our intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < magnitudes.length; i++) {
      console.log(colors[i]);
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
    }
    return div;
  };

legend.addTo(map);
}