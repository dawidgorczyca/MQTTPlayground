import React, { Component } from 'react'

import { mapInit } from '../services/map.service'
import { mapDefault } from '../services/map.constants'

import './map.component.css';

class FencesComponent extends Component {
  render() {
    const {
      fences,
      handleFenceZoom
    } = this.props
    return (
      <ul className="interface--fences">
        {fences.map((fence, index) => {
          return (
            <li key={fence._id} onClick={() => handleFenceZoom(index)}>
              <span className="fence--name">
                Fence <b>no.{index}</b>
              </span>
              <span className="fence--toolbox">
                <input
                  type="button"
                  value="Show"
                  className="btn active"
                  onClick={() => handleFenceZoom(index)}
                />
              </span>
            </li>
          )
        })}
      </ul>
    );
  }
}

export default FencesComponent