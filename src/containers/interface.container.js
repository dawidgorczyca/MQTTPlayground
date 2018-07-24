import React, { Component } from 'react'
import { connect } from 'react-redux'

import './interface.container.css'

import mapService from '../services/map.service'
import {
  addRoute,
  removeAllRoads,
  addMarker,
  removeMarkersRoads
} from '../services/map.events'

import DriversListComponent from '../components/drivers.component'

class InterfaceContainer extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      activeDriver: ''
    };

    this.getDriverActiveRoute = this.getDriverActiveRoute.bind(this)
    this.handleRouteShow = this.handleRouteShow.bind(this)
    this.zoomLastPosition = this.zoomLastPosition.bind(this)
    this.setActiveDriver = this.setActiveDriver.bind(this)
    this.getDriverStatus = this.getDriverStatus.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    nextProps.routes && this.handleActiveRoad(nextProps.routes)
  }

  setActiveDriver(driver) {
    removeAllRoads(mapService.map)
    if(driver === this.state.activeDriver) {
      this.setState( { activeDriver: '' } )
    } else {
      this.setState( { activeDriver: driver } )
      this.handleActiveRoad(this.props.routes)
    }
  }

  handleActiveRoad(routes) {
    const { activeDriver } = this.state
    const activeRoad = this.getDriverActiveRoute(activeDriver)
        
    if(activeRoad !== -1) {
      let activeRoadPoints = JSON.parse(JSON.stringify(routes[activeRoad].points))

      if(activeRoadPoints.length >= 3) {
        activeRoadPoints.shift()
        addRoute(
          mapService.map,
          activeRoadPoints
        )
      }
    }
  }

  handleRouteShow(points, mode){
    const preparedPoints = JSON.parse(JSON.stringify(points))
    const lastPoint = preparedPoints[preparedPoints.length - 2]
    if(preparedPoints.length >= 3) {
      preparedPoints.shift()
      removeMarkersRoads(mapService.map)
      if(mode === 'line'){
        addRoute(
          mapService.map,
          preparedPoints
        )
      } else if(mode === 'markers'){
        preparedPoints.forEach((point)=> {
          addMarker(mapService.map, point)
        })
      }
      this.handleZoom(lastPoint, 12)
    }
    this.setState({'activeDriver': ''})
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

  handleFenceZoom(fenceIndex) {
    if(fenceIndex === 0){
      this.handleZoom({
        "latitude": 48.086733,
        "longitude": 8.448947
      }, 13)
    }
    if(fenceIndex === 1){
      this.handleZoom({
        "latitude": 51.935365,
        "longitude": 15.491919
      }, 14)
    }
  }

  renderFences(fences) {
    return fences.map((fence, index) => {
      return (
        <li key={fence._id} onClick={() => this.handleFenceZoom(index)}>
          Fence #{index}
          <input
            type="button"
            value="Show"
            className="btn active"
            onClick={() => this.handleFenceZoom(index)}
          />
        </li>
      )
    })
  }
  render() {
    const {
      mqttStatus,
      children,
      drivers,
      routes
    } = this.props
    const fencesRender = this.renderFences(this.props.fences)
    return (
      <div className="interfaceContainer">
        <div className="interfaceContainer__status">
          Connection status: <span className={mqttStatus}>{mqttStatus}</span>
        </div>
        <div>
          <input
            type="button"
            value="Clear map selection"
            className="btn active"
            onClick={() => removeMarkersRoads(mapService.map)}
          />
        </div>
        <div className="interfaceContainer__drivers">
          <h3>Drivers:</h3>
          <DriversListComponent
            drivers={drivers}
            routes={routes}
            getDriverActiveRoute={this.getDriverActiveRoute}
            handleRouteShow={this.handleRouteShow}
            zoomLastPosition={this.zoomLastPosition}
            activeDriver={this.state.activeDriver}
            setActiveDriver={this.setActiveDriver}
            getDriverStatus={this.getDriverStatus}
          />
        </div>
        <div className="interfaceContainer__fences">
          <h3>Fences:</h3>
          {fencesRender}
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