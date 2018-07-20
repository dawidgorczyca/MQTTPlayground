import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios';
import './Window.scss'
import GpsDataTable from '../GpsDataTable/GpsDataTable';

export let map = '';
class Window extends Component {

  constructor( props ) {
    super( props );
    this.state = {
      users: []
    };

    this.initializeMap = this.initializeMap.bind(this);
    this.downloadUsers = this.downloadUsers.bind(this);
  }

  componentDidMount(){
    this.downloadUsers();
    this.initializeMap();
  }

  initializeMap(){
    //Step 1: initialize communication with the platform
    let platform = new window.H.service.Platform({
      app_id: 'DemoAppId01082013GAL',
      app_code: 'AJKnXv84fjrb0KIHawS0Tg',
      useCIT: true,
      useHTTPS: false
    });
    let pixelRatio = window.devicePixelRatio || 1;
    let defaultLayers = platform.createDefaultLayers({
      tileSize: pixelRatio === 1 ? 256 : 512,
      ppi: pixelRatio === 1 ? undefined : 320
    });

    //Step 2: initialize a map  - not specificing a location will give a whole world view.
    map = new window.H.Map(document.getElementById('map'),
      defaultLayers.normal.map, {pixelRatio: pixelRatio});

    //Step 3: make the map interactive
    // MapEvents enables the event system
    // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
    let behavior = new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map));

    // Create the default UI components
    let ui = window.H.ui.UI.createDefault(map, defaultLayers);
  };

  downloadUsers() {
    axios({
      method:'get',
      url:'http://localhost:8080/clients',
    })
      .then(( response ) => {
        this.setState( { users: response.data } )
    });
  }

  deleteRouteOnMap = () => {

    map.getObjects().forEach((el)=>{
     if(el.constructor.name === 'pg')
       map.removeObject(el);
   })
 }

 addRoute = () => {
  const geoLine = window.H.util.wkt.toGeometry(this.state.choosedRoute);
  map.addObject(new window.H.map.Polyline(
    geoLine, { style: { lineWidth: 4, strokeColor: "red"  }}
  ));
}

  downloadRouteById = (id) => {
    axios({
      method:'get',
      url:`http://localhost:8080/routeAfterMatching/${id}`
    })
    .then(( response ) => {
      this.setState( { choosedRoute: response.data, chosenDriverId: id } )
    })
    .then(() => {
      this.deleteRouteOnMap();
      this.addRoute();
    });
  }

  render() {

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
          {this.state.users.map((el) => (
            <tr key={el}>
              <td>{el}</td>
              <td><button onClick={() => this.downloadRouteById(el) }>Show this OBU</button></td>
            </tr>
          ))}
          </tbody></table>
        <div id="map"/>
        <button onClick={this.downloadUsers}>click me</button>
        <GpsDataTable driverId={this.state.chosenDriverId}/>
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
