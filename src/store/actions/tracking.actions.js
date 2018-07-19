import { MESSAGE, ADD_DRIVER, REMOVE_DRIVER } from "../action.types";

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
