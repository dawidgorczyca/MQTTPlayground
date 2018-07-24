const mqtt = require('mqtt')

function routeEdit(route) {
  const client = mqtt.connect('mqtt://localhost:1886')

  client.on('connect', () => {
    client.publish('UPDATE/ROUTES/EDIT', JSON.stringify(route))
  })
}

function routeNew(route) {
  const client = mqtt.connect('mqtt://localhost:1886')

  client.on('connect', () => {
    client.publish('UPDATE/ROUTES/NEW', JSON.stringify(route))
  })
}

function driverNew(driver) {
  const client = mqtt.connect('mqtt://localhost:1886')

  client.on('connect', () => {
    client.publish('UPDATE/DRIVERS/NEW', JSON.stringify(driver))
  })
}

function driverEdit(driver) {
  const client = mqtt.connect('mqtt://localhost:1886')

  client.on('connect', () => {
    client.publish('UPDATE/DRIVERS/EDIT', JSON.stringify(driver))
  })
}

function fenceNew(fence) {
  const client = mqtt.connect('mqtt://localhost:1886')

  client.on('connect', () => {
    client.publish('UPDATE/FENCES/NEW', JSON.stringify(fence))
  })
}

function collectionSend(collection) {
  const client = mqtt.connect('mqtt://localhost:1886')

  client.on('connect', () => {
    client.publish('API/COLLECTION', JSON.stringify(collection))
  })
}

module.exports.events = {
  routeNew: routeNew,
  routeEdit: routeEdit,
  driverNew: driverNew,
  driverEdit: driverEdit,
  fenceNew: fenceNew,
  collectionSend: collectionSend
}