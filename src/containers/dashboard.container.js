import React, { Component } from 'react'
import { Provider } from 'react-redux'
import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers
} from 'redux'

import subscribeMQTT from "../store/subscriber"

import trackingReducer from "../store/reducers/tracking.reducer"
import connectionStatusReducer from '../store/reducers/connectionStatus.reducer'
import areasReducer from '../store/reducers/areas.reducer'
import driversMiddleware from "../store/middlewares/drivers.middleware"
import areasMiddleware from '../store/middlewares/areas.middleware'
import axiosMiddleware from '../store/middlewares/axios.middleware'

import { areasCheck } from '../store/reducers/areas.reducer'

import InterfaceContainer from './interface.container'
import MapComponent from '../components/map.component'

import './dashboard.container.css'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const appReducer = combineReducers( {
  tracking: trackingReducer,
  connection: connectionStatusReducer,
  areas: areasReducer
} );

export const store = createStore(
  appReducer,
  composeEnhancers(
    applyMiddleware(
      driversMiddleware,
      areasMiddleware,
      axiosMiddleware
    )
  )
)

class DashboardContainer extends Component {
  componentDidMount(){
    store.dispatch(areasCheck())
  }
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