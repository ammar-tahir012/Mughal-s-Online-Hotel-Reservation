mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: myHotel.geometry.coordinates,
  // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});
console.log(myHotel);
const marker1 = new mapboxgl.Marker({ color: "red", zoom: 10 })
  .setLngLat(myHotel.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset:25}).setHTML(
      `<h3>${myHotel.title}</h3><p>Exact location will be provided after booking!</p>`
    )
  )
  .addTo(map);
