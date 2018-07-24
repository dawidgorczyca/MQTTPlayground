import update from 'immutability-helper'
import { routesActionNames } from '../actions/routes.actions'

const {
  ROUTES_CLEAN,
  ROUTES_SET,
  ROUTES_SET_ALL,
  ROUTES_EDIT
} = routesActionNames

const defaultState = {
  routes: [],
  count: 0
}

const routesReducer = (state = defaultState, action) => {
  switch(action.type) {
    case ROUTES_SET:
      return update(state, {
        routes: {$push: [action.route]}
      })
    case ROUTES_SET_ALL:
      return update(state, {
        routes: {$set: action.routes}
      })
    case ROUTES_CLEAN:
      return update(state, {
        routes: {$set: []}
      })
    case ROUTES_EDIT:
      return update(state, {
        routes: {$set: [
          ...state.routes.slice(0, action.routeIndex),
          action.route,
          ...state.routes.slice(action.routeIndex + 1)
        ]}
      })
    default:
      return state
  }
}

export default routesReducer