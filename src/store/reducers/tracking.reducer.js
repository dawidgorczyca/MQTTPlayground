import update from "immutability-helper";
import driverReducer from "./driver.reducer";
import { ADD_DRIVER, REMOVE_DRIVER, AREA_POINTS_HAVE_BEEN_FETCHED } from "../action.types";

const defaultState = {
  drivers: [],
  points: []
};

const trackingReducer = (state = defaultState, action) => {
  if (action.type.startsWith("driver/")) {
    return update(state, {
      drivers: {
        $set: [
          ...state.drivers.slice(0, action.driverIndex),
          driverReducer(state.drivers[action.driverIndex], action),
          ...state.drivers.slice(action.driverIndex + 1)
        ]
      }
    });
  }
  switch (action.type) {
    case ADD_DRIVER:
      return update(state, {
        drivers: { $push: [action.driver] }
      });
    case REMOVE_DRIVER:
      return update(state, {
        drivers: { $push: [action.driver] }
      });
    case AREA_POINTS_HAVE_BEEN_FETCHED:
      return update(state, {
        points: { $set: action.payload }
      });
    default:
      return state;
  }
};

export default trackingReducer;
