import React, { Component } from 'react'

class DriversListComponent extends Component {
  renderDriverRoutes(driverId) {
    const {
      routes,
      getDriverActiveRoute,
      handleRouteShow
    } = this.props
    const activeRouteIndex = getDriverActiveRoute(driverId)
    const routesToShow = JSON.parse(JSON.stringify(routes))
    
    activeRouteIndex !== -1 && routesToShow.splice(activeRouteIndex, 1)
    
    return (
      <div className="interface--drivers--routes ">
        <h3>Driver previous routes:</h3>
        <ul>
        {routesToShow.map((route, index) => (
          <li key={route._id}>
            Route #{index}

            <input
              type="button"
              value="Show route as line"
              className="btn active"
              onClick={() => handleRouteShow(route.points, 'line')}
            />
            <input
              type="button"
              value="Show route as points"
              className="btn active"
              onClick={() => handleRouteShow(route.points, 'markers')}
            />
          </li>
        ))}
        </ul>
      </div>
    )
  }
  render() {
    const {
      drivers,
      activeDriver,
      zoomLastPosition,
      setActiveDriver,
      getDriverStatus,
    } = this.props
    return (
      <ul className="interface--drivers">
        {drivers.map((driver) => (
          <li className="interface--drivers--item" key={driver.id}>
            id: {driver.id}<br/>
            name: {driver.data.name}<br/>
            status: {getDriverStatus(driver.id)}
            {this.renderDriverRoutes(driver.id)}
            <input
              type="button"
              value={activeDriver === driver.id ? 'UNTRACK' : 'TRACK'}
              className="btn active"
              onClick={() => setActiveDriver(driver.id)}
            />
            {activeDriver === driver.id && (
              <div>
                <input
                  type="button"
                  value="Show current location"
                  className="btn active"
                  onClick={() => zoomLastPosition(driver.id)}
                />
              </div>)
            }
          </li>)
        )}
      </ul>
    );
  }
}

export default DriversListComponent