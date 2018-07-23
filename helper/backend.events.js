const {
  initializeCollections,
  populateCollection,
  findInCollection,
  alterCollection
} = require('./backend.methods')
const {
  driverAttributes
} = require('./backend.constants')
const driverInitState = {
  status: 'created',
  routes: []
}
const backendPublished = require('./backend.publisher')

// Backend side only configuration for broker collection
process.env.DB_USER            = 'inqu'
process.env.DB_PASSWORD        =  'test'
process.env.DB_HOST            =  '127.0.0.1'
process.env.DB_PORT            =  '27017'
process.env.DB_NAME            =  'mqtt'
process.env.DB_MAIN_COLLECTION =  'events'

const dbConfig = {
  dbUrl: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  dbUser: process.env.DB_USER,
  dbMainCollection: process.env.DB_MAIN_COLLECTION,
  dbName: process.env.DB_NAME
}

function prepareDriverData(data) {
  let output = {}

  data.forEach( (item, index) => {
    output[`${driverAttributes[index]}`] = item 
  } )

  return output
}

function prepareRouteTimeStart(timestamp) {
  return timestamp.timestamp
}

async function createNewRoute(routeData) {
  try {
    await findInCollection(dbConfig,
      {id: routeData.driverId},
      'drivers',
      async (driver) => {
        if(!driver){
          console.log('[ERROR] backend.events | insertRoute | driver not found, cannot create a route without driver ')
        } else {
          const timeStart = prepareRouteTimeStart(routeData.points[0])
          await populateCollection(
            dbConfig,
            {
              timeStart: timeStart,
              previousEvent: timeStart,
              ...routeData
            },
            'routes',
            async (createdRoute) => {
              await backendPublished.events.routeNew(createdRoute)
              await alterCollection(
                dbConfig,
                { id: routeData.driverId },
                mergeDriver(driver, createdRoute._id),
                'drivers',
                (updatedDriver) => backendPublished.events.driverEdit(updatedDriver)
              )
            }
          )
        }
      }
    )
  } catch(err) {
    console.log(err)
    return err
  }
}

function mergeRoute(existingRoute, routeData) {
  const output = {
    ...existingRoute,
    previousEvent: prepareRouteTimeStart(routeData.points[0]),
    points: existingRoute.points.concat(routeData.points)
  }
  if(routeData.timeEnd) {
    output.timeEnd = prepareRouteTimeStart(routeData.points[0])
  }
  return output
}

function mergeDriver(existingDriver, routeId) {
  const updatedRoutes = existingDriver.routes.length ?
    [].concat(existingDriver.routes, [routeId.toString()]) :
    [routeId.toString()]

  const output = {
    ...existingDriver,
    routes: updatedRoutes
  }
  return output
}

async function editRoute(existingRoute, routeData) {
  await alterCollection(
    dbConfig,
    existingRoute,
    mergeRoute(existingRoute, routeData),
    'routes',
    (alteredRoute) => {
      backendPublished.events(alteredRoute)
    }
  )
}

async function insertRoute(driverId, routeData) {
  // HERE FIX IT AFTER SETTING UP FRONTEND TO
  // sent previous time and start time
  const routeIdentifier = {
    driverId: routeData.driverId,
    timeStart: routeData.timeStart,
    previousEvent: prepareRouteTimeStart(routeData.previousEvent ? routeData.previousEvent : routeData.points[0].timestamp)
  }
  await findInCollection(dbConfig,
    routeIdentifier,
    'routes',
    async (existingRoute) => {
      if( existingRoute && !existingRoute.timeEnd ){
        editRoute(existingRoute, routeData)
      } else {
        createNewRoute(routeData)
      }
    }
  )
}

async function insertDriver(driverId, driverData) {
  const dataRaw = driverData.split('|')
  let dataConverted = prepareDriverData(dataRaw)

  await findInCollection(
    dbConfig,
    {id: driverId},
    'drivers',
    async (driver) => {
      if(!driver){
        await populateCollection(
          dbConfig,
          {
            id: driverId,
            ...driverInitState,
            data: {
              ...dataConverted
            }
          },
          'drivers',
          (newDriver) => backendPublished.events.driverNew(newDriver)
        )
      } else {
        await alterCollection(
          dbConfig,
          { 
            ...driver,
            ...driverData
          },
          dataConverted,
          'drivers',
          (updatedDriver) => backendPublished.events.driverEdit(updatedDriver)
        )
      }
  })
}

async function initBackend() {
  try {
    await initializeCollections(dbConfig)
  } catch(e) {
    console.log(e)
  }
}

module.exports.dbEvents = {
  insertDriver,
  insertRoute
}
module.exports.init = initBackend