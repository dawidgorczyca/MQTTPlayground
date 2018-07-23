import React, { Component } from 'react'
import { connect } from 'react-redux'

import map from '../services/map.service' 
import { addPolylineToMap } from '../services/map.events'

import './interface.container.css'

class InterfaceContainer extends Component {
  render() {
    const {
      drivers,
      status,
      children
    } = this.props
    return (
      <div className="interfaceContainer">
        <div className="interfaceContainer__status">
          Connection status: <span className={status}>{status}</span>
        </div>
        <div className="interfaceContainer__drivers">
          <h3>Active drivers:</h3>
          <ul>
            {drivers.map((driver) => {
              return (<li key={driver.id}>{driver.id}</li>)
            })}
          </ul>
        </div>
        <div className="interfaceContainer__content">
          {children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    drivers: state.tracking.drivers,
    status: state.connection.status,
    fences: state.areas.areas,
    routes: state.areas.routes
  }
}

export default connect( mapStateToProps )(InterfaceContainer)