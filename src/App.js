import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import './App.css'
import trackingReducer from './store/reducers/tracking.reducer'
import connectionStatusReducer from './store/reducers/connectionStatus.reducer'
import driversMiddleware from './store/middlewares/drivers.middleware'
import subscribeMQTT from './store/subscriber'
import Window from './store/components/window/window'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const appReducer = combineReducers( {
    tracking: trackingReducer,
    connection: connectionStatusReducer
  } );

  const rootReducer = ( state, action ) => {
    return appReducer( state, action );
  };

export const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      driversMiddleware
    )
  )
)

subscribeMQTT()

class App extends Component {

  render() {
    return (
      <Provider store={store}>
      <div className="App">
        <Window/>
      </div>
      </Provider>
    );
  }
}

export default App;