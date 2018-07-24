import update from 'immutability-helper'

import fenceReducer from './OLD.fence.reducer'

export const AREAS_ADD = 'areas/ADD'
export const AREAS_RESET = 'areas/RESET'
export const AREAS_CHECK = 'areas/CHECK'
export const ROUTES_ADD = 'routes/ADD'
export const ROUTES_RESET = 'routes/RESET'
export const ROUTES_CHECK = 'routes/CHECK'
export const ROUTES_EDIT = 'routes/EDIT'

export const areasCheck = () => ({
  type: AREAS_CHECK
})

export const areasAdd = (area) => ({
  type: AREAS_ADD,
  area
})

export const areasReset = () => ({
  type: AREAS_RESET
})

export const routesCheck = (id) => ({
  type: ROUTES_CHECK,
  driverId: id
})

export const routesAdd = (route, driverId) => ({
  type: ROUTES_ADD,
  route: route,
  driverId: driverId
})

export const routesReset = () => ({
  type: ROUTES_RESET
})

export const routesEdit = (route, driverIndex, driverId) => ({
  type: ROUTES_EDIT,
  route: route,
  driverIndex: driverIndex,
  driverId: driverId
})

const defaultState = {
  areas: [],
  routes: []
}

const areasReducer = (state = defaultState, action) => {
  if(action.type.startsWith('fence/')) {
    return update(state, {
      areas: {$set: [
        ...state.areas.slice(0, action.fenceIndex),
        fenceReducer(state.areas[action.fenceIndex], action),
        ...state.areas.slice(action.fenceIndex + 1)
      ]}
    })
  }
  switch(action.type) {
    case AREAS_ADD:
      return update(state, {
        areas: {$push: [action.area]}
      })
    case AREAS_RESET:
      return update(state, {
        areas: {$set: []}
      })
    case ROUTES_RESET:
      return update(state, {
        routes: {$set: []}
      })
    case ROUTES_ADD:
      return update(state, {
        routes: {$push: [{
          route: action.route,
          driver: action.driverId
        }]}
      })
    case ROUTES_EDIT:
      return update(state, {
        routes: {$set: [
          ...state.routes.slice(0, action.driverIndex),
          {
            route: action.route,
            driver: action.driverId
          },
          ...state.routes.slice(action.driverIndex + 1)
        ]}
      })
    default:
      return state
  }
}

export default areasReducer