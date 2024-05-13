mapboxgl.accessToken =
  window.mapToken;

console.log(window.mapToken);
console.log(window.coordinates);
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  // projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
  zoom: 9,
  center: window.coordinates,
});

const marker = new mapboxgl.Marker()
  .setLngLat(window.coordinates)
  .addTo(map);
