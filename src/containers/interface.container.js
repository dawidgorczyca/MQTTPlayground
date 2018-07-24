import React, { Component } from 'react'
import { connect } from 'react-redux'

import './interface.container.css'

import mapService from '../services/map.service'
import {
  addRoute,
  removeAllRoads
} from '../services/map.events'

class InterfaceContainer extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      activeDriver: ''
    };
  }
  componentWillReceiveProps(nextProps) {
    this.handleActiveRoad(nextProps.routes)
  }

  setActiveDriver(driver) {
    removeAllRoads(mapService.map)
    if(driver === this.state.activeDriver) {
      this.setState( { activeDriver: '' } )
    } else {
      this.setState( { activeDriver: driver } )
    }
  }

  handleActiveRoad(routes) {
    const { activeDriver } = this.state
    const activeRoad = this.getDriverActiveRoute(activeDriver)
        
    if(activeRoad !== -1) {
      let activeRoadPoints = JSON.parse(JSON.stringify(routes[activeRoad].points))
      console.log('activeRoadPoints',routes[activeRoad].points)
      if(activeRoadPoints.length >= 3) {
        activeRoadPoints.shift()
        console.log('activeRoadPoints splice',activeRoadPoints)
        addRoute(
          mapService.map,
          activeRoadPoints
        )
      }
    }
  }

  getDriverActiveRoute(driverId) {
    const { routes } = this.props
    const activeRoute = routes.findIndex(route => (route.status === 'ACTIVE' && route.driverId === driverId))
    return activeRoute
  }
  getDriverStatus(driverId) {
    return this.getDriverActiveRoute(driverId) !== -1 ? 'ACTIVE' : 'UNACTIVE'
  }
  handleZoom(zoomCoords, zoomLevel) {
    mapService.map.setCenter({lat:zoomCoords.latitude, lng:zoomCoords.longitude})
    mapService.map.setZoom(zoomLevel)
  }
  zoomLastPosition(driverId) {
    const { routes } = this.props
    const activeRouteIndex = this.getDriverActiveRoute(driverId)
    
    if(activeRouteIndex !== -1) {
      const pointData = routes[activeRouteIndex].points[routes[activeRouteIndex].points.length -1]
      this.handleZoom(pointData, 14)
    }
  }
  renderDrivers(drivers) {
    const { activeDriver } = this.state
    return drivers.map((driver) => {
      return (
      <li key={driver.id}>
        id: {driver.id}<br/>
        name: {driver.data.name}<br/>
        status: {this.getDriverStatus(driver.id)}
        <input
          type="button"
          value={activeDriver === driver.id ? 'UNTRACK' : 'TRACK'}
          className="btn active"
          onClick={() => this.setActiveDriver(driver.id)}
        />
        {activeDriver === driver.id && (
          <input
            type="button"
            value="Show current location"
            className="btn active"
            onClick={() => this.zoomLastPosition(driver.id)}
          />
        )}
      </li>)
    })
  }
  render() {
    const {
      mqttStatus,
      children
    } = this.props
    const driversRender = this.renderDrivers(this.props.drivers)
    return (
      <div className="interfaceContainer">
        <div className="interfaceContainer__status">
          Connection status: <span className={mqttStatus}>{mqttStatus}</span>
        </div>
        <div className="interfaceContainer__drivers">
          <h3>Known drivers:</h3>
          {driversRender}
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
    mqttStatus: state.config.mqttStatus,
    drivers: state.drivers.drivers,
    routes: state.routes.routes,
    fences: state.fences.fences
  }
}

export default connect( mapStateToProps )(InterfaceContainer)