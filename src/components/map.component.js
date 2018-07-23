import React, { Component } from 'react'

import { mapInit } from '../services/map.service'
import { mapDefault } from '../services/map.constants'

import './map.component.css';

class MapComponent extends Component {

  componentDidMount(){
    mapInit({
      appId: mapDefault.appId,
      appCode: mapDefault.appCode,
      useHTTPS: true
    })
  }

  render() {
    return (
      <div>
        <div id="map"/>
      </div>
    );
  }
}

export default MapComponent