function prepareLineString(lineData) {
  const lineString = new window.H.geo.LineString()

  lineData.forEach((point) => {
    if(point.latitude && point.longitude) {
      const lat = parseFloat(point.latitude)
      const lng = parseFloat(point.longitude)
      if(typeof lat === "number" || typeof lng === "number") {
        lineString.pushPoint({lat: lat, lng: lng})
      }
    }
  })

  return lineString
}

export function addRoute(map, route) {
  removeAllRoads(map)
  const line = prepareLineString(route)
  map.addObject(new window.H.map.Polyline(
    line, { style: { lineWidth: 3, strokeColor: 'red' }}
  ))
}
function editRoute(route) {

}
function deleteRoute(routeId) {

}
export function addMarker(map, marker){
  var newMarker = new window.H.map.Marker({lat:marker.latitude, lng:marker.longitude});
  map.addObject(newMarker)
}
function editMarker(marker){

}
function deleteMarker(markerId){

}
export function addFence(map, fence){
  const geoPolygon = window.H.util.wkt.toGeometry(fence.raw)
  map.addObject(new window.H.map.Polygon(geoPolygon))
}
function editFence(fence){
  
}
function removeFence(fence){

}

export function removeAll(map) {
  for (let object of map.getObjects()){  
        map.removeObject(object)
  }
}

export function removeMarkersRoads(map){
  removeAllMarkers(map)
  removeAllRoads(map)
}

export function removeAllMarkers(map) {
  map.getObjects().forEach((el)=>{
    if(el.constructor.name === 'xi')
      map.removeObject(el);
  })
}
export function removeAllRoads(map){
  map.getObjects().forEach((el)=>{
    if(el.constructor.name === 'pg')
      map.removeObject(el);
  })
}