import React from "react";
import "./Driver.css";
import { MqttService } from "./Mqtt.service";
import mockedGpsLocations from "./mockedGpsLocations.json";

const START_TEXT = "Start gathering GPS data";
const STOP_TEXT = "Stop gathering GPS data";
const SENDING_GPS_GAP = 3;

class Driver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasDriverStarted: false
    };
    this.timeouts = [];
  }

  handleDriverStartedStateChange = hasDriverStartedState => {
    if (hasDriverStartedState === true) {
      this.state.shouldDataBeMocked ? this.mockGpsData() : this.gatherGpsData();
    } else {
      this.stopSendingGpsData();
    }
  };

  gatherGpsData = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position =>
          (this.sendPositionInterval = setInterval(
            MqttService.sendPosition,
            SENDING_GPS_GAP * 1000,
            position
          ))
      );
    }
  };

  mockGpsData = () => {
    const interval = SENDING_GPS_GAP * 1000;

    mockedGpsLocations.forEach((location, index) =>
      this.timeouts[index] = setTimeout(
        MqttService.sendMockedPosition,
        index * interval,
        location.latitude,
        location.longitude
      )
    );
  };

  stopSendingGpsData = () => {
    clearInterval(this.sendPositionInterval);
    this.timeouts.forEach( t => clearTimeout(t));
  };

  handleGpsGatheringButton = e => {
    this.setState(
      prevState => ({ hasDriverStarted: !prevState.hasDriverStarted }),
      () => this.handleDriverStartedStateChange(this.state.hasDriverStarted)
    );
  };

  render = () => {
    return (
      <div className="driver-main">
        <label htmlFor="mock-cb">Mock data</label>
        <input
          type="checkbox"
          id="mock-cb"
          onClick={() =>
            this.setState({
              shouldDataBeMocked: !this.state.shouldDataBeMocked
            })
          }
          checked={this.state.shouldDataBeMocked ? true : false}
        />
        <input
          type="button"
          value={this.state.hasDriverStarted ? STOP_TEXT : START_TEXT}
          className={
            this.state.hasDriverStarted ? "btn active" : "btn inactive"
          }
          onClick={() => this.handleGpsGatheringButton()}
        />
      </div>
    );
  };
}

export default Driver;
