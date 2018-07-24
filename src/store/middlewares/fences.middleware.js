import { subActionNames } from '../actions/subscriber.actions'
import {
  fencesTopics
} from '../reducers/fences.constants'
import {
  fencesSet,
  fencesEdit,
  fencesSetAll
} from '../actions/fences.actions'
import { AXIOS_FENCES_GET } from '../actions/axios.actions'

function handleFencesSet(store, action) {
  store.dispatch(fencesSet(action.payload))
}

function handleFencesEdit(store, action) {
  const existingRoutes = store.getState().fences.fences
  const fenceIndex = existingRoutes.findIndex(fence => fence._id === action.payload._id)
  
  if(fenceIndex !== -1) {
    store.dispatch(fencesEdit(action.payload, fenceIndex))
  }
}

function handleFencesEvents(store, action) {
  const topic = action.topic.split('/')

  if(topic[2] === fencesTopics.new) {
    handleFencesSet(store, action)
  } else if(topic[2] === fencesTopics.edit) {
    handleFencesEdit(store, action)
  }

}

export default store => next => async (action) => {
  if(action.type === subActionNames.SUBSCRIBER_UPDATE) {
    try {
      const topic = action.topic.split('/')
      if(topic[1] === fencesTopics.main){
        await handleFencesEvents(store, action)
      }
    } catch(err) {
      console.log(err)
      return err
    }
  }
  if(action.type === `RESPONSE/${AXIOS_FENCES_GET}`) {
    store.dispatch(fencesSetAll(action.payload.data))
  }
  next(action)
}