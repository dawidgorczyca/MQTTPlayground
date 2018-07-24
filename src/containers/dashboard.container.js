import React, { Component } from 'react'
import { Provider } from 'react-redux'
import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers
} from 'redux'

import subscribeMQTT from "../store/subscriber"

import driversReducer from "../store/reducers/drivers.reducer"
import routesReducer from "../store/reducers/routes.reducer"
import fencesReducer from "../store/reducers/fences.reducer"
import configReducer from "../store/reducers/config.reducer"

import driversMiddleware from "../store/middlewares/drivers.middleware"
import fencesMiddleware from '../store/middlewares/fences.middleware'
import routesMiddleware from '../store/middlewares/routes.middleware'
import axiosMiddleware from '../store/middlewares/axios.middleware'

import InterfaceContainer from './interface.container'
import MapComponent from '../components/map.component'

import './dashboard.container.css'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const appReducer = combineReducers( {
  config: configReducer,
  drivers: driversReducer,
  routes: routesReducer,
  fences: fencesReducer
} );

export const store = createStore(
  appReducer,
  composeEnhancers(
    applyMiddleware(
      axiosMiddleware,
      driversMiddleware,
      routesMiddleware,
      fencesMiddleware
    )
  )
)

class DashboardContainer extends Component {
  render() {
    subscribeMQTT()
    return(
      <div>
        <Provider store={store}>
          <InterfaceContainer>
            <MapComponent/>
          </InterfaceContainer>
        </Provider>
      </div>
    )
  }
}

export default DashboardContainer