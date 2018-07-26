import axios from 'axios'

function prepareLineString(lineData) {
  const lineString = new window.H.geo.LineString()

  lineData.forEach((point) => {
    if(point[0] && point[1]) {
      const lat = parseFloat(point[1])
      const lng = parseFloat(point[0])
      if(typeof lat === "number" || typeof lng === "number") {
        lineString.pushPoint({lat: lat, lng: lng})
      }
    }
  })

  return lineString
}

function cleanArray(actual) {
  var newArray = new Array();
  for (var i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

function prepareRoute(route) {
  return cleanArray(route.map((point) => {
    if((point.latitude && point.longitude) && (point.latitude.length && point.longitude.length) ){
      return point
    }
  }))
}

async function matchRoute(route) {
  return axios.post('http://localhost:8080/matchroute', {
    route: route
  })
  .then(( response ) => {
    return response
  })
}

export async function addRoute(map, route) {
  try {
    const newRoute = prepareRoute(route)
    await removeAllRoads(map)
    const matchedRoute = await matchRoute(newRoute)
    const convertedRoute = await prepareLineString(matchedRoute.data)

    map.addObject(new window.H.map.Polyline(
      convertedRoute, { style: { lineWidth: 3, strokeColor: 'red' }}
    ))
  } catch(err) {
    console.log(err)
    return err
  }
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