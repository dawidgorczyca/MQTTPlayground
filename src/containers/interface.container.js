import React, { Component } from 'react'
import { connect } from 'react-redux'

import { axiosDriversGet } from '../store/actions/axios.actions'

import map from '../services/map.service' 
import { addPolylineToMap } from '../services/map.events'

import './interface.container.css'

class InterfaceContainer extends Component {
  renderDrivers(drivers) {
    return drivers.map((driver) => {
      return (<li key={driver.id}>{driver.id}</li>)
    })
  }
  getCollection(collectionName) {
    this.props.dispatch(axiosDriversGet())
  }
  render() {
    const {
      mqttStatus,
      children
    } = this.props
    return (
      <div className="interfaceContainer">
        <div className="interfaceContainer__status">
          Connection status: <span className={mqttStatus}>{mqttStatus}</span>
        </div>
        <button onClick={() => this.getCollection('drivers')} >Get collection</button>
        <div className="interfaceContainer__content">
          {children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    mqttStatus: state.config.mqttStatus
  }
}

export default connect( mapStateToProps )(InterfaceContainer)