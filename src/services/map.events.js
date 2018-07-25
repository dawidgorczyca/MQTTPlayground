function prepareLineString(lineData) {
  console.log('lineData', lineData)
  const lineString = new window.H.geo.LineString()

  lineData.forEach((point) => {
    // console.log('point', point.latitude, point.longitude)
    if(point.latitude && point.longitude) {
      const lat = parseFloat(point.latitude)
      const lng = parseFloat(point.longitude)
      // console.log('lat, lng',lat, lng)
      if(lat !== NaN && lng !== NaN) {
        // console.log('point',{lat: lat, lng: lng})
        lineString.pushPoint({lat: lat, lng: lng})
      }
    }
  })

  return lineString
}

export function addRoute(map, route) {
  removeAllRoads(map)
  console.log('route in map.events ', route);
  const line = prepareLineString(route)
  console.log('line', line)
  map.addObject(new window.H.map.Polyline(
    line, { style: { lineWidth: 3, strokeColor: 'red' }}
  ))
}
function editRoute(route) {

}
function deleteRoute(routeId) {

}
function addMarker(marker){

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
export function removeAllRoads(map){
  map.getObjects().forEach((el)=>{
    if(el.constructor.name === 'pg')
      map.removeObject(el);
  })
}