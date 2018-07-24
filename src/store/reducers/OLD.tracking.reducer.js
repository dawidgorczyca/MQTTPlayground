import update from 'immutability-helper'
import driverReducer from './OLD.driver.reducer'

export const ADD_DRIVER = 'tracking/ADD'
export const REMOVE_DRIVER = 'tracking/REMOVE_DRIVER'
export const MESSAGE = 'tracking/MSG'

export const msg = (topic, payload) => ({
  type: MESSAGE,
  topic,
  payload
})

export const addDriver = (driver) => ({
  type: ADD_DRIVER,
  driver
})

export const removeDriver = (driver) => ({
  type: REMOVE_DRIVER,
  driver
})


const defaultState = {
  drivers: []
}

const trackingReducer = (state = defaultState, action) => {
  if(action.type.startsWith('driver/')) {
    return update(state, {
      drivers: {$set: [
        ...state.drivers.slice(0, action.driverIndex),
        driverReducer(state.drivers[action.driverIndex], action),
        ...state.drivers.slice(action.driverIndex + 1)
      ]}
    })
  }
  switch(action.type) {
    case ADD_DRIVER:
      return update(state, {
        drivers: {$push: [action.driver]}
      })
    case REMOVE_DRIVER:
      return update(state, {
        drivers: {$push: [action.driver] }
      })
    default:
      return state
  }
}

export default trackingReducer