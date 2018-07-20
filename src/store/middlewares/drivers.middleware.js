import { MESSAGE, addDriver } from '../reducers/tracking.reducer'
import { driverLocation } from '../reducers/driver.reducer'

function findExistingDriver(driver, list) {
  return list.findIndex(x => x.id === driver)
}

function prepareLocationInfo(msg) {
  return msg.split('|')
}

export default store => next => action => {
  if(action.type === MESSAGE) {

    const currentState = store.getState().tracking;

    const existing = (action.sender && currentState.drivers) ? findExistingDriver(action.sender, currentState.drivers) : undefined
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
  next(action)
}