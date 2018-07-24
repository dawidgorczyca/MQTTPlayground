import update from 'immutability-helper'
import { driversActionNames } from '../actions/drivers.actions'

const {
  DRIVERS_CLEAN,
  DRIVERS_SET,
  DRIVERS_SET_ALL,
  DRIVERS_EDIT
} = driversActionNames

const defaultState = {
  drivers: [],
  count: 0
}

const driversReducer = (state = defaultState, action) => {
  switch(action.type) {
    case DRIVERS_SET:
      return update(state, {
        drivers: {$push: [action.driver]}
      })
    case DRIVERS_SET_ALL:
      return update(state, {
        drivers: {$set: action.drivers}
      })
    case DRIVERS_CLEAN:
      return update(state, {
        drivers: {$set: []}
      })
    case DRIVERS_EDIT:
      return update(state, {
        drivers: {$set: [
          ...state.drivers.slice(0, action.driverIndex),
          action.driver,
          ...state.drivers.slice(action.driverIndex + 1)
        ]}
      })
    default:
      return state
  }
}

export default driversReducer