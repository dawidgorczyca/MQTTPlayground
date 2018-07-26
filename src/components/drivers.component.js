import React, { Component } from 'react'

class DriversListComponent extends Component {
  renderDriverRoutes(driverId) {
    const {
      routes,
      getDriverActiveRoute,
      handleRouteShow,
      calculateRoad
    } = this.props
    const activeRouteIndex = getDriverActiveRoute(driverId)
    const routesToShow = JSON.parse(JSON.stringify(routes))
    
    activeRouteIndex !== -1 && routesToShow.splice(activeRouteIndex, 1)
    const driverRoutes = routesToShow.filter(route => route.driverId === driverId)
    
    return (
      <div className="interface--drivers--routes ">
        <h3>Driver previous routes:</h3>
        <ul>
        {driverRoutes.map((route, index) => (
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
            <input
              type="button"
              value="Calculate road cost"
              className="btn active"
              onClick={() => calculateRoad(route)}
            />

            {route.cost && (
              <span>
                Cost: <b>{route.cost}</b> per meter
              </span> 
            )}
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
            <div className="driver--basicInfo">
              <span className="driver--name">
                {driver.data.name}
              </span>
              <span className="driver--basicInfo-right">
                <span className="driver--basicInfo-status">
                  Status: <b className={`driver-status--${getDriverStatus(driver.id)} driver--basicInfo-status-indicator`}>{getDriverStatus(driver.id)}</b>  
                </span>
                <span className="driver--basicInfo-id">
                  Id: <b>{driver.id}</b>
                </span>
              </span>
            </div>
            <div className="driver--toolbar">
              <input
                type="button"
                value={activeDriver === driver.id ? 'Stop tracking' : 'Track this driver live'}
                className="btn btn-track"
                onClick={() => setActiveDriver(driver.id)}
              />
              {activeDriver === driver.id && (
                  <input
                    type="button"
                    value="Show current location"
                    className="btn btn-track"
                    onClick={() => zoomLastPosition(driver.id)}
                  />)
              }
            </div>
            {this.renderDriverRoutes(driver.id)}
          </li>)
        )}
      </ul>
    );
  }
}

export default DriversListComponent