import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import './App.css'
import trackingReducer from './store/reducers/tracking.reducer'
import driversMiddleware from './store/middlewares/drivers.middleware'
import subscribeMQTT from './store/subscriber'
import Window from './store/components/window/window'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export const store = createStore(
  trackingReducer,
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