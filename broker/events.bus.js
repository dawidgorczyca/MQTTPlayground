const { dbEvents } = require('../helper/backend.events')

function validateClientId(id) {
  const output = id

  if( output && output.length ) {
    return output
  } else {
    console.log('[ERROR] EventBus | getClientId | No clientID specified')
    return false
  }
}

function handleDriversEvents(eventInfo, eventData) {
  const clientId = validateClientId(eventInfo[1])
  const {
    insertDriver
  } = dbEvents

  if(eventInfo[2] === 'ADD' || eventInfo[2] === 'UPDATE'){
    const data = eventData.payload.toString()
    insertDriver(clientId, data)
  }
}

function handleRoutesEvents(eventInfo, eventData) {
  const clientId = validateClientId(eventInfo[1])
  const {
    insertRoute
  } = dbEvents

  const data = eventData.payload.toString().split('|')
  const routeObj = {
    driverId: clientId,
    points: [{
      latitude: data[0],
      longitude: data[1],
      timestamp: data[2]
    }]
  }

  if(data[3] && data[3].length){
    routeObj.timeEnd = data[3]
  }
  insertRoute(clientId, routeObj)
}

function eventBus(eventInfo, eventData) {
  console.log('[INFO] eventBus || event recieved:', `\ntopic: `, eventInfo, '\npayload: ', eventData.payload.toString())
  if(eventInfo[0] === 'DRIVERS'){
    handleDriversEvents(eventInfo, eventData)
  }
  if(eventInfo[0] === 'ROUTES'){
    handleRoutesEvents(eventInfo, eventData)
  }
}

module.exports = eventBus