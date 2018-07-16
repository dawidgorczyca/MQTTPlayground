import React from "react";
import "./Driver.css";
import { MqttService } from './Mqtt.service';

const START_TEXT = "Start gathering GPS data";
const STOP_TEXT = "Stop gathering GPS data";

class Driver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasDriverStarted: false
    };
  }

  handleDriverStartedStateChange(hasDriverStartedState) {
    if (hasDriverStartedState === true) {
      this.gatherGpsData();
    } else {
      this.stopGatheringGpsData();
    }
  }

  gatherGpsData() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => this.sendPositionInterval = setInterval(MqttService.sendPosition, 1000, position));
    }
  }

  stopGatheringGpsData() {
    clearInterval(this.sendPositionInterval);
  }

  handleGpsGatheringButton(e) {
    this.setState(
      prevState => ({ hasDriverStarted: !prevState.hasDriverStarted }),
      () => this.handleDriverStartedStateChange(this.state.hasDriverStarted)
    );
  }

  render = () => {
    return (
      <div className="driver-main">
        <input
          type="button"
          value={this.state.hasDriverStarted ? STOP_TEXT : START_TEXT}
          className={this.state.hasDriverStarted ? "btn active" : "btn inactive"}
          onClick={() => this.handleGpsGatheringButton()}
        />
      </div>
    );
  };
}

export default Driver;
