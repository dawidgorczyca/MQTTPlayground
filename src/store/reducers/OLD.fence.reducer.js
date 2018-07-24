import update from 'immutability-helper'

export const FENCE_POLYGONS = 'fence/POLYGONS'
export const FENCE_COST = 'fence/COST'

export const fencePolygons = (polygons, fenceIndex) => ({
  type: FENCE_POLYGONS,
  polygons,
  fenceIndex
})

export const fenceCost = (cost, fenceIndex) => ({
  type: FENCE_COST,
  fenceIndex
})

const defaultState = {
  polygons: '',
  cost: 0
}

const fenceReducer = (state = defaultState, action) => {
  switch(action.type) {
    case FENCE_POLYGONS:
      return update(state, {
        polygons: {$set: action.polygons}
      })
    case FENCE_COST:
      return update(state, {
        cost: {$set: action.cost}
      })
    default:
      return state
  }
}

export default fenceReducer