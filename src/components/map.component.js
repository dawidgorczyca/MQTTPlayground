import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

import './map.component.css'

export let map = '';

function initializeMap(){
  const platform = new window.H.service.Platform({
    app_id: 'DemoAppId01082013GAL',
    app_code: 'AJKnXv84fjrb0KIHawS0Tg',
    useCIT: true,
    useHTTPS: false
  });
  const pixelRatio = window.devicePixelRatio || 1;
  const defaultLayers = platform.createDefaultLayers({
    tileSize: pixelRatio === 1 ? 256 : 512,
    ppi: pixelRatio === 1 ? undefined : 320
  });

  map = new window.H.Map(document.getElementById('map'),
    defaultLayers.normal.map, {pixelRatio: pixelRatio});

  const behavior = new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map));

  const ui = window.H.ui.UI.createDefault(map, defaultLayers);   
}

class MapComponent extends Component {

  constructor( props ) {
    super( props );
    this.state = {
      choosedRoute: '',
      intervalId: ''
    };
  }

  componentDidMount(){
    initializeMap()
    const intervalId = setInterval(this.handleRoutes(this.props.routes), 1000)
    this.setState({intervalId: intervalId})
  }

  componentWillReceiveProps(newProps) {
    const { fences, drivers } = this.props

    if(newProps.fences && newProps.fences !== fences) {
      this.addPolygons(newProps.fences)
    }

    newProps.drivers.forEach((newDriver, index)=>{
      if( newProps.routes && drivers.length === 0 || newDriver.locations.length !== drivers[index].locations.length) {
        this.handleRoutes(newProps.routes)
      }
    })

  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  handleRoutes( routes ) {
    console.log('handleRoutes')
    routes.forEach((route) => {
        this.addRoute(route.route)
    })
  }

  addPolygons(areas){
    areas.forEach((area) => {
      const geoPolygon = window.H.util.wkt.toGeometry(area);
      map.addObject(new window.H.map.Polygon(geoPolygon));
    })
  }
  addRoute(route){
    console.log('draw route')
    const geoLine = window.H.util.wkt.toGeometry(route);
    map.addObject(new window.H.map.Polyline(
      geoLine, { style: { lineWidth: 4, strokeColor: "red"  }}
    ));
  }
  zoomSomewhere(coords){
    map.setCenter(coords);
    map.setZoom(14);
  }

  // downloadRouteById(id){
  //   axios({
  //     method:'get',
  //     url:`http://localhost:8080/routeAfterMatching/${id}`
  //   })
  //   .then(( response ) => {
  //     this.setState( { choosedRoute: response.data } )
  //   })
  //   .then(() => {
  //     this.deleteRouteOnMap();
  //     this.addRoute();
  //   });
  // }

  deleteRouteOnMap(){
     map.getObjects().forEach((el)=>{
      if(el.constructor.name === 'pg')
        map.removeObject(el);
    })
  }

  render() {
    const { drivers, dispatch } = this.props
    return (
      <div>
        <div>
          Connection status: <span className={this.props.status}>{this.props.status}</span>
        </div>
        <table><tbody>
          <tr>
            <th>ACTIVE DRIVERS</th>
            <th></th>
          </tr>
          {drivers.map((el) => (
            <tr key={el.id}>
              <td>{el.id}</td>
            </tr>
          ))}
          </tbody></table>
        <div id="map"/>
        <button onClick={() => this.zoomSomewhere({lat:51.96300052623031, lng:15.453757994384773})}>Zoom to Zielona Góra</button>
        <button onClick={() => this.zoomSomewhere({lat:48.07788339260274, lng:8.45672405609298})}>Zoom somewhere</button>
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

export default connect( mapStateToProps )(MapComponent);