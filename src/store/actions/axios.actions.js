export const AXIOS_DRIVERS = 'axios/DRIVERS'
export const AXIOS_AREAS = 'axios/AREAS'
export const AXIOS_ROUTE_BY_ID = 'axios/ROUTE_BY_ID'
export const AXIOS_DRIVERS_GET = 'axios/DRIVERS_GET'
export const AXIOS_ROUTES_GET = 'axios/ROUTES_GET'
export const AXIOS_FENCES_GET = 'axios/FENCES_GET'
export const AXIOS_MATCH_ROUTE = 'axios/MATCH_ROUTE'

export function axiosDrivers() {
  return {
    type: AXIOS_DRIVERS,
    payload: {
      url:'/clients'
    }
  }
}

export function axiosAreas() {
  return {
    type: AXIOS_AREAS,
    payload: {
      method: 'get',
      url:'/paidAreas'
    }
  }
}

export function axiosRouteById(entityId) {
  return {
    type: AXIOS_ROUTE_BY_ID,
    payload: {
      method: 'get',
      url:`/routeAfterMatching/${entityId}`,
      entityId: entityId 
    }
  }
}

export function axiosDriversGet() {
  return {
    type: AXIOS_DRIVERS_GET,
    payload: {
      method: 'get',
      url: `/drivers`
    }
  }
}

export function axiosRoutesGet() {
  return {
    type: AXIOS_ROUTES_GET,
    payload: {
      method: 'get',
      url: `/routes`
    }
  }
}

export function axiosFencesGet() {
  return {
    type: AXIOS_FENCES_GET,
    payload: {
      method: 'get',
      url: `/fences`
    }
  }
}