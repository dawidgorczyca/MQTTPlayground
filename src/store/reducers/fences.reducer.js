import update from 'immutability-helper'
import { fencesActionNames } from '../actions/fences.actions'

const {
  FENCES_CLEAN,
  FENCES_SET,
  FENCES_SET_ALL,
  FENCES_EDIT
} = fencesActionNames

const defaultState = {
  fences: [],
  count: 0
}

const fencesReducer = (state = defaultState, action) => {
  switch(action.type) {
    case FENCES_SET:
      return update(state, {
        fences: {$push: [action.fence]}
      })
    case FENCES_SET_ALL:
      return update(state, {
        fences: {$set: action.fences}
      })
    case FENCES_CLEAN:
      return update(state, {
        fences: {$set: []}
      })
    case FENCES_EDIT:
      return update(state, {
        fences: {$set: [
          ...state.fences.slice(0, action.fenceIndex),
          action.fence,
          ...state.fences.slice(action.fenceIndex + 1)
        ]}
      })
    default:
      return state
  }
}

export default fencesReducer