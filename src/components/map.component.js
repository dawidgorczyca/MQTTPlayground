import React, { Component } from 'react'

import mapInstance from '../services/map.service'
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

    setTimeout(function() {
      this.resizeMap()
    }.bind(this), 1000)
    
    window.addEventListener('resize', this.resizeMap.bind(this))
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeMap.bind(this))
  }

  resizeMap() {
    mapInstance.map.getViewPort().resize()
  }

  render() {
    return (
      <div className="mapComponent">
        <div id="map"/>
      </div>
    );
  }
}

export default MapComponent