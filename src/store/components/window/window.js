import React, { Component } from 'react'
import { connect } from 'react-redux'
import './window.css'


class Window extends Component {

  constructor( props ) {
    super( props );
    setInterval(function(){console.log(props)}, 5000);
  }

  initializeMap(){
    //Step 1: initialize communication with the platform
    var platform = new window.H.service.Platform({
      app_id: 'DemoAppId01082013GAL',
      app_code: 'AJKnXv84fjrb0KIHawS0Tg',
      useCIT: true,
      useHTTPS: false
    });
    var pixelRatio = window.devicePixelRatio || 1;
    var defaultLayers = platform.createDefaultLayers({
      tileSize: pixelRatio === 1 ? 256 : 512,
      ppi: pixelRatio === 1 ? undefined : 320
    });

    //Step 2: initialize a map  - not specificing a location will give a whole world view.
    var map = new window.H.Map(document.getElementById('map'),
      defaultLayers.normal.map, {pixelRatio: pixelRatio});

    //Step 3: make the map interactive
    // MapEvents enables the event system
    // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
    var behavior = new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map));

    // Create the default UI components
    var ui = window.H.ui.UI.createDefault(map, defaultLayers);
  };

  componentDidMount(){
    // setInterval(function(){console.log(store)}, 5000);
    
    this.initializeMap();
  }

  render() {
    return (
      <div>
        <div>
          Connection status: connectionStatus
        </div>
        <table>
          <tr>
            <th>NAME/ID</th>
            <th></th>
          </tr>
        </table>
        <div id="map"/>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    drivers: state.drivers
  }
}

export default connect( mapStateToProps )(Window);
