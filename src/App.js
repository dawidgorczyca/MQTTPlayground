import React, { Component } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'

import "./App.css"

import DashboardContainer from './containers/dashboard.container'
import Driver from "./Driver"

const App = () => (
    <Router>
      <Switch>
          <Route exact path="/" component={DashboardContainer} />
          <Route exact path="/driver" component={Driver} />
      </Switch>
    </Router>
);


export default App
