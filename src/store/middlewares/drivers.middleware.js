import { MESSAGE } from '../action.types';
import { addDriver } from '../actions/tracking.actions';
import { driverLocation } from '../actions/driver.actions'

function findExistingDriver(driver, list) {
  return list.findIndex(x => x.id === driver)
}

function prepareLocationInfo(msg) {
  return msg.split('|')
}

export default store => next => action => {
  if(action.type === MESSAGE) {
    const currentState = store.getState()
    const existing = (action.sender && currentState.drivers) ? findExistingDriver(action.sender, currentState.drivers) : undefined
    const msg = prepareLocationInfo(action.receivedMsg)
    const loc = {
      loc: msg[0],
      time: msg[1]
    }

    existing ? store.dispatch(addDriver({
      id: action.sender,
      locations: [loc]
    })) : store.dispatch(driverLocation(loc, existing))
  }
  next(action)
}