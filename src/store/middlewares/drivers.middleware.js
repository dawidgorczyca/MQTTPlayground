import { subActionNames } from '../actions/subscriber.actions'
import {
  driversTopics
} from '../reducers/drivers.constants'
import {
  driversSet,
  driversEdit,
  driversSetAll
} from '../actions/drivers.actions'
import { AXIOS_DRIVERS_GET } from '../actions/axios.actions'

import { driverLocation } from '../reducers/OLD.driver.reducer'
import { axiosRouteById } from '../actions/axios.actions'

function handleDriversSet(store, action) {
  store.dispatch(driversSet(action.payload))
}

function handleDriversEdit(store, action) {
  const existingDrivers = store.getState().drivers.drivers
  const driverIndex = existingDrivers.findIndex(driver => driver._id === action.payload._id)
  
  if(driverIndex !== -1) {
    store.dispatch(driversEdit(action.payload, driverIndex))
  }
}

function handleDriversEvents(store, action) {
  const topic = action.topic.split('/')

  if(topic[2] === driversTopics.new) {
    handleDriversSet(store, action)
  } else if(topic[2] === driversTopics.edit) {
    handleDriversEdit(store, action)
  }

}

export default store => next => async (action) => {
  if(action.type === subActionNames.SUBSCRIBER_UPDATE) {
    try {
      const topic = action.topic.split('/')
      if(topic[1] === driversTopics.main){
        await handleDriversEvents(store, action)
      }
    } catch(err) {
      console.log(err)
      return err
    }
  }
  if(action.type === `RESPONSE/${AXIOS_DRIVERS_GET}`) {
    store.dispatch(driversSetAll(action.payload.data))
  }
  next(action)
}