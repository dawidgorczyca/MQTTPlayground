import update from "immutability-helper";
import { DRIVER_LOCATION, DRIVER_INFO } from "../action.types";

const defaultState = {
  locations: [],
  id: ""
};

const driverReducer = (state = defaultState, action) => {
  switch (action.type) {
    case DRIVER_LOCATION:
      return update(state, {
        locations: { $push: [action.location] }
      });
    case DRIVER_INFO:
      return update(state, {
        id: { $set: action.id }
      });
    default:
      return state;
  }
};

export default driverReducer;
