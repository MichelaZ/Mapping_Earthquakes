// Add console.log to check to see if our code is working.
console.log("working");

var streets = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
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

let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});


// Create a base layer that holds all three maps.
let baseMaps = {
  "Dark": dark,
  "Light": light,
  "Satellite": satellite,
  "Streets": streets,
  "Satellite": satelliteStreets
  
};

// 1. Add a 2nd layer group for the tectonic plate data.
let allEarthquakes = new L.LayerGroup();
let tectonic = new L.LayerGroup();
let majorEarthquakes = new L.LayerGroup();

// 2. Add a reference to the tectonic plates group to the overlays object.
let overlays = {
  "Earthquakes": allEarthquakes,
  "Tectonic Plates": tectonic,
  "Major Earthquakes": majorEarthquakes
};

var map = L.map("mapid", {
	center: [30, -13],
	zoom: 3,
  layers: [dark, allEarthquakes, tectonic] // default
});

// Then we add a control to the map that will allow the user to change which
// layers are visible.
L.control.layers(baseMaps, overlays).addTo(map);

// Retrieve the earthquake GeoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
  
  // This function returns the style data for each of the earthquakes we plot on
  // the map. We pass the magnitude of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: .5,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // This function determines the color of the marker based on the magnitude of the earthquake.
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

  // This function determines the radius of the earthquake marker based on its magnitude.
  // Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }

  // Creating a GeoJSON layer with the retrieved data.
  L.geoJson(data, {
    	// We turn each feature into a circleMarker on the map.
    	pointToLayer: function(feature, latlng) {
      		console.log(data);
      		return L.circleMarker(latlng);
        },
      // We set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
     // We create a popup for each circleMarker to display the magnitude and location of the earthquake
     onEachFeature: function(feature, layer) {
      //add timestamp
        var unix_timestamp = feature.properties.time;
        var date = new Date(unix_timestamp).toLocaleDateString("en-US");
        var time = new Date(unix_timestamp).toLocaleTimeString("en-US");
      layer.bindPopup("Date: " + date + "<br>Time: " + time + "<br>Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
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
  }).addTo(allEarthquakes);

});
  // Retrieve the major earthquake GeoJSON data >4.5 mag for the week.
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson").then(function(data) {

    function styleInfo(feature) {
      return {
        opacity: 1,
        fillOpacity: .5,
        fillColor: getColor(feature.properties.mag),
        color: "#000000",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
      };
    }

      // Change the color function to use three colors for the major earthquakes based on the magnitude of the earthquake.
      function getColor(magnitude) {
        if (magnitude > 5) {
          return "#ea2c2c";
        }
        if (magnitude > 4) {
          return "#ea822c";
        }
        return "#98ee00";
      }

      // Use the function that determines the radius of the earthquake marker based on its magnitude.
      function getRadius(magnitude) {
        if (magnitude === 0) {
          return 1;
        }
        return magnitude * 4;
      }
    
    // Creating a GeoJSON layer with the retrieved data.
    L.geoJson(data, {
      // We turn each feature into a circleMarker on the map.
      pointToLayer: function(feature, latlng) {
          console.log(data);
          return L.circleMarker(latlng);
        },
          // We set the style for each circleMarker using our styleInfo function.
        style: styleInfo,
        // We create a popup for each circleMarker to display the magnitude and location of the earthquake
        onEachFeature: function(feature, layer) {
          //add timestamp
          var unix_timestamp = feature.properties.time;
          var date = new Date(unix_timestamp).toLocaleDateString("en-US");
          var time = new Date(unix_timestamp).toLocaleTimeString("en-US");
        layer.bindPopup("Date: " + date + "<br>Time: " + time + "<br>Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
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
    }).addTo(majorEarthquakes);
  });

    // Here we create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });
  
    // Then add all the details for the legend
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend");

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

      // Finally, we our legend to the map.
      legend.addTo(map);

      //Use d3.json to make a call to get our Tectonic Plate geoJSON data.
      d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function(data) {
        L.geoJson(data, {
        style: {color: "#aacc00", weight: 3},
        }).addTo(tectonic); 
        
      });
  
