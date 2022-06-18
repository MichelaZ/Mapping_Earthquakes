// Add console.log to check to see if our code is working.
$(document).ready(function() {
    // STEP 0: Get the Data
    console.log(cities);
});


// Create the map object with a center and zoom level.
let map = L.map('mapid').setView([40.7, -94.5], 4);

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/dark-v10",
    accessToken: API_KEY
});
//Using the Leaflet documentation, create a light-yellow circle with black lines indicating a 
//300-meter radius of Central Los Angeles on a dark map.
//var marker = L.marker([51.5, -0.09]).addTo(map);
//  Add a marker to the map for Los Angeles, California.
//let marker = L.marker([34.0522, -118.2437]).addTo(map);
// Then we add our 'graymap' tile layer to the map.
//L.circleMarker([34.0522, -118.2437], {
//    fillOpacity: '20%',
//    color: "black",
//    fillColor: '#ffffa1',
//    radius: '300'
// }).addTo(map);

streets.addTo(map);

// Loop through the cities array and create one marker for each city.
cities.forEach(function(city) {
    console.log(city)
    L.circleMarker(city.location, {
        radius: city.population/100000,
        weight: .5,
        fillOpacity: '20%',
        color: "#e98a15",
        fillColor: '#ffc43d'
    })
    .bindPopup("<h2>" + city.city + ", " + city.state + "</h2> <hr> <h3>Population " + city.population.toLocaleString() + "</h3>")
    .addTo(map);
});