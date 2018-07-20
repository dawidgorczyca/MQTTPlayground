import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios';
import './window.css'

export let map = '';
class Window extends Component {

  constructor( props ) {
    super( props );
    this.state = {
      users: [],
      paidAreas: '',
      choosedRoute: ''
    };

    this.initializeMap = this.initializeMap.bind(this);
    this.downloadUsers = this.downloadUsers.bind(this);
    this.downloadRouteById = this.downloadRouteById.bind(this);
  }

  componentDidMount(){
    this.downloadUsers();
    this.downloadPaidAreas();
    this.initializeMap();
  }

  testFunc() {
    console.log(this.props.drivers)
  }

  initializeMap(){
    //Step 1: initialize communication with the platform
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

    //Step 2: initialize a map  - not specificing a location will give a whole world view.
    map = new window.H.Map(document.getElementById('map'),
      defaultLayers.normal.map, {pixelRatio: pixelRatio});

    //Step 3: make the map interactive
    // MapEvents enables the event system
    // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
    const behavior = new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map));

    // Create the default UI components
    const ui = window.H.ui.UI.createDefault(map, defaultLayers);
   
  };

  addPolygons(){
    console.log('polygons')
    this.state.paidAreas.forEach((area) => {
      const geoPolygon = window.H.util.wkt.toGeometry(area);
      map.addObject(new window.H.map.Polygon(geoPolygon));
    })
  }
  addRoute(){
    console.log('addRoute')
    const geoLine = window.H.util.wkt.toGeometry(this.state.choosedRoute);
    map.addObject(new window.H.map.Polyline(
      geoLine, { style: { lineWidth: 4, strokeColor: "red"  }}
    ));
  }

  zoomZielonaGora(){
    map.setCenter({lat:51.96300052623031, lng:15.453757994384773});
    map.setZoom(14);
  }

  downloadUsers() {
    axios({
      method:'get',
      url:'http://localhost:8080/clients',
    })
      .then(( response ) => {
        console.log('clients', response.data)
        this.setState( { users: response.data } )
    })
  }

  downloadPaidAreas() {
    axios({
      method:'get',
      url:'http://localhost:8080/paidAreas',
    })
    .then(( response ) => {
      console.log('paidAreas', response.data)
      this.setState( { paidAreas: response.data } )
    })
    .then(() => {
      this.addPolygons();
    });
  }

  downloadRouteById(id){
    console.log('downloadRouteById', id)
    axios({
      method:'get',
      url:`http://localhost:8080/routeAfterMatching/${id}`
    })
    .then(( response ) => {
      console.log('routeAfterMatching', response.data)
      this.setState( { choosedRoute: response.data } )
    })
    .then(() => {
      this.deleteRouteOnMap();
      this.addRoute();
    });
  }

  deleteRouteOnMap(){
     map.getObjects().forEach((el)=>{
      if(el.constructor.name === 'pg')
        map.removeObject(el);
    })
  }

  render() {
    const { drivers } = this.props
    return (
      <div>
        <div>
          Connection status: <span className={this.props.status}>{this.props.status}</span>
        </div>
        <table><tbody>
          <tr>
            <th>NAME/ID</th>
            <th></th>
          </tr>
          {drivers.map((el) => (
            <tr key={el.id}>
              <td>{el.id}</td>
              <td><button onClick={() => this.downloadRouteById(el.id) }>Show this OBU</button></td>
            </tr>
          ))}
          </tbody></table>
        <div id="map"/>
        <button onClick={this.zoomZielonaGora}>Zoom to Zielona Góra</button>
        <button onClick={() => this.testFunc()}>test</button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    drivers: state.tracking.drivers,
    status: state.connection.status
  }
}

export default connect( mapStateToProps )(Window);
