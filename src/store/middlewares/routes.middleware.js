import { subActionNames } from '../actions/subscriber.actions'
import {
  routesTopics
} from '../reducers/routes.constants'
import {
  routesSet,
  routesEdit,
  routesSetAll
} from '../actions/routes.actions'
import { AXIOS_ROUTES_GET } from '../actions/axios.actions'

function handleRoutesSet(store, action) {
  store.dispatch(routesSet(action.payload))
}

function handleRoutesEdit(store, action) {
  const existingRoutes = store.getState().routes.routes
  const routeIndex = existingRoutes.findIndex(route => route._id === action.payload._id)
  
  if(routeIndex !== -1) {
    store.dispatch(routesEdit(action.payload, routeIndex))
  }
}

function handleRoutesEvents(store, action) {
  const topic = action.topic.split('/')

  if(topic[2] === routesTopics.new) {
    handleRoutesSet(store, action)
  } else if(topic[2] === routesTopics.edit) {
    handleRoutesEdit(store, action)
  }

}

export default store => next => async (action) => {
  if(action.type === subActionNames.SUBSCRIBER_UPDATE) {
    try {
      const topic = action.topic.split('/')
      if(topic[1] === routesTopics.main){
        await handleRoutesEvents(store, action)
      }
    } catch(err) {
      console.log(err)
      return err
    }
  }
  if(action.type === `RESPONSE/${AXIOS_ROUTES_GET}`) {
    store.dispatch(routesSetAll(action.payload.data))
  }
  next(action)
}