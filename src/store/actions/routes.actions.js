
export const routesActionNames = {
  ROUTES_GET: 'ROUTES/GET',
  ROUTES_GET_ROUTE: 'ROUTES/GET/ROUTE',
  ROUTES_CLEAN: 'ROUTES/CLEAN',
  ROUTES_SET: 'ROUTES/SET',
  ROUTES_SET_ALL: 'ROUTES/SET/ALL',
  ROUTES_EDIT: 'ROUTES/EDIT'
}

const {
  ROUTES_GET,
  ROUTES_GET_ROUTE,
  ROUTES_CLEAN,
  ROUTES_SET,
  ROUTES_SET_ALL,
  ROUTES_EDIT
} = routesActionNames

export const routesGet = () => ({
  type: ROUTES_GET
})

export const routesGetSingle = (route) => ({
  type: ROUTES_GET_ROUTE,
  route
})

export const routesClean = () => ({
  type: ROUTES_CLEAN
})

export const routesSet = (route) => ({
  type: ROUTES_SET,
  route
})

export const routesSetAll = (routes) => ({
  type: ROUTES_SET_ALL,
  routes
})

export const routesEdit = (route, routeIndex) => ({
  type: ROUTES_EDIT,
  route,
  routeIndex
})