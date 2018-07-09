import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import logo from './logo.svg'
import './App.css'
import trackingReducer from './store/reducers/tracking'

export const store = createStore(
  trackingReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

class App extends Component {

  render() {
    return (
      <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
      </Provider>
    );
  }
}

export default App;
