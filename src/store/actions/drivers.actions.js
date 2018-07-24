
export const driversActionNames = {
  DRIVERS_GET: 'DRIVERS/GET',
  DRIVERS_GET_DRIVER: 'DRIVERS/GET/DRIVER',
  DRIVERS_CLEAN: 'DRIVERS/CLEAN',
  DRIVERS_SET: 'DRIVERS/SET',
  DRIVERS_SET_ALL: 'DRIVERS/SET/ALL',
  DRIVERS_EDIT: 'DRIVERS/EDIT'
}

const {
  DRIVERS_GET,
  DRIVERS_GET_DRIVER,
  DRIVERS_CLEAN,
  DRIVERS_SET,
  DRIVERS_SET_ALL,
  DRIVERS_EDIT
} = driversActionNames

export const driversGet = () => ({
  type: DRIVERS_GET
})

export const driversGetSingle = (driver) => ({
  type: DRIVERS_GET_DRIVER,
  driver
})

export const driversClean = () => ({
  type: DRIVERS_CLEAN
})

export const driversSet = (driver) => ({
  type: DRIVERS_SET,
  driver
})

export const driversSetAll = (drivers) => ({
  type: DRIVERS_SET_ALL,
  drivers
})

export const driversEdit = (driver, driverIndex) => ({
  type: DRIVERS_EDIT,
  driver,
  driverIndex
})