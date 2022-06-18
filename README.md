# Earthquake Mapping:
## Purpose
For this project I created a map that shows earthquakes from the last 7 days using GeoJSON data from the USGS API. The size and color of the markers for the quakes correspond to the magnitude of the earthquakes. When you hover over the markers the opacity changes and when you click on it a pop-up with the date, time, magnitude and location of the quake will be visible. There are several different options to view the map that can be toggled on and off in the top right corner of the page. 

##### Deliverable 1: 
![Deliverable1]()

##### Deliverable 2:
![Deliverable2]()

##### Deliverable 2:
![Deliverable1]()


## Methods: 
I up my folder structure, HTML, and CSS file which was pretty much straight out of the module, but I will walk through the logic.js file below. 

### Logic.js
1. I set up the base map layers.
```
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
```
2. I set up the overlay layers. 
```
let allEarthquakes = new L.LayerGroup();
let tectonic = new L.LayerGroup();
let majorEarthquakes = new L.LayerGroup();

let overlays = {
  "Earthquakes": allEarthquakes,
  "Tectonic Plates": tectonic,
  "Major Earthquakes": majorEarthquakes
```
3. I initialized the map and set up layer controls. I set the defaults to show the map in dark mode with the tectonic plates and earthquakes visible.
```
var map = L.map("mapid", {
	center: [30, -13],
	zoom: 3,
  layers: [dark, allEarthquakes, tectonic] // default
});
L.control.layers(baseMaps, overlays).addTo(map);
```
4. I retrieved the earthquake GeoJSON data using d3
```
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
```
5. I set up the style and created functions to create markers with sizes and colors dependent on the magnitude of the earthquake.
```
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

  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }
````
6. Then I created a geoJSON layer  for All the earthquakes and added markers for each point on the map. These markers have a hover function that changes the opacity of the fill color when you hover over it. I created a pop-up that shows the date, time, magnitude and location when you click on the marker.
```
  L.geoJson(data, {
    	pointToLayer: function(feature, latlng) {
      		console.log(data);
      		return L.circleMarker(latlng);
        },
    style: styleInfo,
     onEachFeature: function(feature, layer) {
        var unix_timestamp = feature.properties.time;
        var date = new Date(unix_timestamp).toLocaleDateString("en-US");
        var time = new Date(unix_timestamp).toLocaleTimeString("en-US");
      layer.bindPopup("Date: " + date + "<br>Time: " + time + "<br>Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
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
```
7. Then I repeated steps 4-6 for the Major earthquakes layer.
```  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson").then(function(data) {

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

      function getColor(magnitude) {
        if (magnitude > 5) {
          return "#ea2c2c";
        }
        if (magnitude > 4) {
          return "#ea822c";
        }
        return "#98ee00";
      }

      function getRadius(magnitude) {
        if (magnitude === 0) {
          return 1;
        }
        return magnitude * 4;
      }
    
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
```
8. Then I added a legend for the earthquakes and major earthquake layers.
```
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

      for (var i = 0; i < magnitudes.length; i++) {
        console.log(colors[i]);
        div.innerHTML +=
          "<i style='background: " + colors[i] + "'></i> " +
          magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
        }
        return div;
      };

      legend.addTo(map);
```
9. Then I gathered Tectonic Plate geoJSON data and added it to the tectonic overlay layer.
```      d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function(data) {
        L.geoJson(data, {
        style: {color: "#aacc00", weight: 3},
        }).addTo(tectonic); 
        
      });
```
