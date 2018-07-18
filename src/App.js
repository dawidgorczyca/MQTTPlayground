import React, { Component } from 'react'
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import "./App.css";
import trackingReducer from "./store/reducers/tracking.reducer";
import connectionStatusReducer from './store/reducers/connectionStatus.reducer'
import driversMiddleware from "./store/middlewares/drivers.middleware";
import subscribeMQTT from "./store/subscriber";
import Window from './store/components/window/window'
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Driver from "./Driver";


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

const Dashboard = () => {
  subscribeMQTT();
  return (
    <Provider store={store}>
      <div className="App"><Window/></div>
    </Provider>
  );
};

const App = () => (
    <Router>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/driver" component={Driver} />
      </Switch>
    </Router>
);


export default App;
