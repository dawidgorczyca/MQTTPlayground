function convertWkt(lineData) {
  return window.H.util.wkt.toGeometry(lineData)
}

export function addPolylineToMap(map, lineData) {
  console.log('lineData',lineData)
  // map.addObject(new window.H.map.Polyline(
  //   lineData, { style: { lineWidth: 3, strokeColor: 'red' }}
  // ))
}

function addRoute(route) {
  console.log('addRoute', route)

  this.drawRoute(route.route)
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
function addFence(fence){

}
function editFence(fence){
  
}
function removeFence(fence){

}
function removeAll(){

}