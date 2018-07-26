import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

import './interface.container.css'

import mapService from '../services/map.service'
import {
  addRoute,
  removeAllRoads,
  addMarker,
  removeMarkersRoads
} from '../services/map.events'

import { routesEdit } from '../store/actions/routes.actions'

import DriversListComponent from '../components/drivers.component'
import FencesComponent from '../components/fences.component'

class InterfaceContainer extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      activeDriver: '',
      zoomLat: '',
      zoomLong: '',
      zoomZoom: '',
      fencesPrice: 0
    };

    this.getDriverActiveRoute = this.getDriverActiveRoute.bind(this)
    this.handleRouteShow = this.handleRouteShow.bind(this)
    this.zoomLastPosition = this.zoomLastPosition.bind(this)
    this.setActiveDriver = this.setActiveDriver.bind(this)
    this.getDriverStatus = this.getDriverStatus.bind(this)
    this.handleFenceZoom = this.handleFenceZoom.bind(this)
    this.calculateRoad = this.calculateRoad.bind(this)
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
        activeRoadPoints.pop()
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

  calculateRoad(road) {
    const { dispatch, routes } = this.props
    if(this.state.fencesPrice !== 0){
      axios.post('http://localhost:8080/calculateroute', {
        ...road,
        price: this.state.fencesPrice
      })
      .then(( response ) => {
        const routeIndex = routes.findIndex(route => route._id === road._id)
        dispatch(routesEdit(
          {
            ...road,
            cost: response.data.cost
          },
          routeIndex
        ))
      })
    }
  }

  handleGenericInput(e) {
    this.setState({ [e.target.name]: e.target.value})
  }

  render() {
    const {
      mqttStatus,
      children,
      drivers,
      routes,
      fences
    } = this.props

    const {
      zoomLat,
      zoomLong,
      zoomZoom
    } = this.state
    
    return (
      <div className="interfaceContainer">
        <div className="interfaceToolbox">
          <h1 className="interfaceToolbox_heading">
            Driver tracker
          </h1>
          <div className="interfaceToolbox_subheading">
            Connection status: <span className={mqttStatus}>{mqttStatus.toUpperCase()}</span>
          </div>
          <div className="interfaceContainer__options">
            <label htmlFor="fencesPrice">Tool cost per meter:</label>
            <input
              type="text"
              name="fencesPrice"
              id="fencesPrice"
              value={this.state.fencesPrice}
              onChange={(e) => this.handleGenericInput(e)}
            />€

            <input
              type="button"
              value="Clear map selection"
              className="btn btn-primary assignRight"
              onClick={() => removeMarkersRoads(mapService.map)}
            />
          </div>
          <div className="interfaceContainer__drivers">
            <h2>Known Drivers</h2>
            <DriversListComponent
              drivers={drivers}
              routes={routes}
              getDriverActiveRoute={this.getDriverActiveRoute}
              handleRouteShow={this.handleRouteShow}
              zoomLastPosition={this.zoomLastPosition}
              activeDriver={this.state.activeDriver}
              setActiveDriver={this.setActiveDriver}
              getDriverStatus={this.getDriverStatus}
              calculateRoad={this.calculateRoad}
            />
          </div>
          <div className="interfaceContainer__fences">
            <h2>Defined Tool areas</h2>
            <FencesComponent
              fences={fences}
              handleFenceZoom={this.handleFenceZoom}
            />
          </div>
          <div className="interfaceContainer__customZoom">
            <h3>Manual zoom</h3>
            <input
              name="zoomZoom"
              type="text"
              value={this.state.zoomZoom}
              placeholder="zoom level"
              onChange={(e) => this.handleGenericInput(e)}
            />
            <input
              name="zoomLat"
              type="text"
              value={this.state.zoomLat}
              placeholder="latitude"
              onChange={(e) => this.handleGenericInput(e)}
            />
            <input
              name="zoomLong"
              type="text"
              value={this.state.zoomLong}
              placeholder="longitude"
              onChange={(e) => this.handleGenericInput(e)}
            />
            <input
              type="button"
              value="Zoom To"
              onClick={() => this.handleZoom({
                "latitude": zoomLat,
                "longitude": zoomLong
              }, zoomZoom)}
            />
          </div>
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