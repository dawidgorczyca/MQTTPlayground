import React from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import "./App.css";
import trackingReducer from "./store/reducers/tracking.reducer";
import driversMiddleware from "./store/middlewares/drivers.middleware";
import subscribeMQTT from "./store/subscriber";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Driver from "./Driver";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  trackingReducer,
  composeEnhancers(applyMiddleware(driversMiddleware))
);

const Dashboard = () => {
  subscribeMQTT();
  return (
    <Provider store={store}>
      <div className="App">gps track</div>
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
