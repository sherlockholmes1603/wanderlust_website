mapboxgl.accessToken = mapToken;

console.log(mapToken);
console.log(coordinates);
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  // projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
  zoom: 9,
  center: coordinates,
});

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(coordinates)
  .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML("<p>This is the exact location of the hotel</p>"))
  .addTo(map);
