import {
  MESSAGE,
  addDriver,
  ADD_DRIVER
} from '../reducers/tracking.reducer'
import { driverLocation } from '../reducers/driver.reducer'
import { axiosRouteById } from '../actions/axios.actions'
import { getRandomColor } from '../../services/color.service'

export function findExistingDriver(driver, list, attrName) {
  return list.findIndex(x => x[attrName] === driver)
}

function prepareLocationInfo(msg) {
  return msg.split('|')
}

export default store => next => action => {
  if(action.type === MESSAGE) {
    console.log('action',action)
    const currentState = store.getState().tracking;

    const existing = (action.sender && currentState.drivers) ? findExistingDriver(action.sender, currentState.drivers, 'id') : undefined
    const msg = prepareLocationInfo(action.recieved_msg)
    const loc = {
      loc: msg[0],
      time: msg[1]
    }
    
    if(existing === -1){
      store.dispatch(addDriver({
        id: action.sender,
        locations: [loc]
      }))
    } else {
      store.dispatch(driverLocation(loc, existing))
    }
  }
  // if(action.type === ADD_DRIVER){
  //   setInterval(() => {
  //     store.dispatch(axiosRouteById(action.driver.id))
  //   }, 3000)
  // }
  next(action)
}