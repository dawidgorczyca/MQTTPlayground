import {
  AREAS_CHECK,
  ROUTES_CHECK,
  areasAdd,
  routesAdd,
  routesEdit
} from '../reducers/areas.reducer'
import {
  fencePolygons,
  fenceCost
} from '../reducers/fence.reducer'
import {
  AXIOS_AREAS,
  AXIOS_ROUTE_BY_ID,
  axiosAreas,
  axiosRouteById
} from '../actions/axios.actions'
import { findExistingDriver } from './drivers.middleware'

function handleAreas(areas, store) {
  areas.forEach((area) => {
    store.dispatch(areasAdd(area))
  })
}

export default store => next => (action) => {
  if(action.type === AREAS_CHECK) {
    store.dispatch(axiosAreas())
  }
  if(action.type === `RESPONSE/${AXIOS_AREAS}`) {
    handleAreas(action.payload.data, store)
  }

  // if(action.type === ROUTES_CHECK) {
  //   store.dispatch(axiosRouteById(action.driverId))
  // }
  if(action.type === `RESPONSE/${AXIOS_ROUTE_BY_ID}`) {
    const existingRoutes = store.getState().areas.routes
    const driverIndex = findExistingDriver(action.payload.entityId, existingRoutes, 'driver')
    if ( driverIndex === -1 ) {
      store.dispatch(routesAdd(action.payload.data, action.payload.entityId))
    } else {
      store.dispatch(routesEdit(action.payload.data, driverIndex, action.payload.entityId))
    }
  }
  next(action)
}