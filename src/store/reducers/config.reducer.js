import update from 'immutability-helper'
import { mqttStatuses } from './config.constants'
import { configActionNames } from '../actions/config.actions'

const {
  CONNECTION_STATUS
} = configActionNames

const defaultState = {
  mqttStatus: mqttStatuses.offline
}

const configReducer = (state = defaultState, action) => {
  switch(action.type) {
    case CONNECTION_STATUS:
    return update(state, {
      mqttStatus: {$set: action.status}
    })
    default:
      return state
  }
}

export default configReducer