import { MESSAGE, ADD_DRIVER, REMOVE_DRIVER, FETCH_AREA_POINTS, AREA_POINTS_HAVE_BEEN_FETCHED } from "../action.types";

export const newMessageHasBeenReceived = (receivedMsg, sender) => ({
  type: MESSAGE,
  receivedMsg,
  sender
});

export const addDriver = driver => ({
  type: ADD_DRIVER,
  driver
});

export const removeDriver = driver => ({
  type: REMOVE_DRIVER,
  driver
});

export const fetchAreaPointsForDriver = driver => ({
  type: FETCH_AREA_POINTS,
  driver
});

export const areaPointsHaveBeenFetched = payload => ({
  type: AREA_POINTS_HAVE_BEEN_FETCHED,
  payload
});