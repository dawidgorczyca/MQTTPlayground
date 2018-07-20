export const AXIOS_DRIVERS = 'axios/DRIVERS'
export const AXIOS_AREAS = 'axios/AREAS'
export const AXIOS_ROUTE_BY_ID = 'axios/ROUTE_BY_ID'

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