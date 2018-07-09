import update from 'immutability-helper'

const DRIVER_LOCATION = 'driver/LOCATION'
const DRIVER_INFO = 'driver/INFO'

export const driverLocation = (location, driverIndex) => ({
  type: DRIVER_LOCATION,
  location,
  driverIndex
})

export const driverInfo = (info) => ({
  type: DRIVER_INFO,
  info
})

const defaultState = {
  locations: [],
  id: ''
}

const reducer = (state = defaultState, action) => {
  switch(action.type) {
    case DRIVER_LOCATION:
      return update(state, {
        locations: {$push: [action.location]}
      })
    case DRIVER_INFO:
      return update(state, {
        id: {$set: action.id}
      })
    default:
      return state
  }
}

export default reducer