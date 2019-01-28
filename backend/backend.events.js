const {
  initializeCollections,
  populateCollection,
  findInCollection,
  alterCollection,
  getCollection,
  findAllInCollection,
  dropDatabase
} = require('./backend.methods')
const {
  driverAttributes
} = require('./backend.constants')
const driverInitState = {
  status: 'created',
  routes: []
}
const backendPublished = require('./backend.publisher')
const { getRandomColor } = require('./backend.tools')
const heremap = require('./heremapHelper')

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
    status: routeData.status ? routeData.status : existingRoute.status,
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
      backendPublished.events.routeEdit(alteredRoute)
    }
  )
}

async function insertRoute(driverId, routeData) {
  const routeIdentifier = {
    driverId: routeData.driverId
  }
  await findAllInCollection(dbConfig,
    routeIdentifier,
    'routes',
    async (existingRoutes) => {
      console.log('existingRoutes', existingRoutes)
      if(existingRoutes.length) {
        const activeIndex = existingRoutes.findIndex(route => route.status === 'ACTIVE')
        console.log('activeIndex',activeIndex)
        if(activeIndex !== -1) {
          editRoute(existingRoutes[activeIndex], routeData)    
        } else {
          createNewRoute(routeData)
        }
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
            color: getRandomColor(),
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
          { _id: driver._id },
          { 
            ...driver,
            status: 'edited',
            data: dataConverted
          },
          'drivers',
          (updatedDriver) => backendPublished.events.driverEdit(updatedDriver)
        )
      }
  })
}

async function insertFence(fenceData) {
  await populateCollection(
    dbConfig,
    {
      raw: fenceData
    },
    'fences',
    (newFence) => backendPublished.events.fenceNew(newFence)
  )
}

async function getFromDb(collectionName, cb) {
  try {
    await getCollection(
      dbConfig,
      collectionName,
      (collectionFound) => cb(collectionFound)
    )
  } catch(err) {
    console.log(err)
    return err
  }
}

async function getFromCollection(collectionName, item, cb) {
  try {
    await findInCollection(
      dbConfig,
      item,
      collectionName,
      (itemFound) => cb(itemFound)
    )
  } catch(err) {
    console.log(err)
    return err
  }
}

async function clearDatabase(cb){
  try{
    await dropDatabase(
      dbConfig,
      (status) => cb(status) 
    )
  }catch(e){
    console.log(e)
    return e;
  }
}

async function initBackend() {
  try {
    await dropDatabase(dbConfig, async () => {
      await heremap.getPaidAreas(data => {
        console.log('paid areas data', data)
        data.forEach((fenceData) => {
          insertFence(fenceData)
        })
        console.log(data)
      })
    })
  } catch(e) {
    console.log(e)
    return e;
  }
}


module.exports.dbEvents = {
  insertDriver,
  insertRoute,
  insertFence,
  getFromDb,
  getFromCollection,
  clearDatabase
}
module.exports.init = initBackend