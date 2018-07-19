import { DRIVER_LOCATION, DRIVER_INFO } from '../action.types';

export const driverLocation = (location, driverIndex) => ({
    type: DRIVER_LOCATION,
    location,
    driverIndex
  });
  
export const driverInfo = (info) => ({
    type: DRIVER_INFO,
    info
  });