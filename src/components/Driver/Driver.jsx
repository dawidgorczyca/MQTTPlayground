import React from "react";
import "./Driver.css";
import { MqttService } from "../../services/mqtt.service";
import mockedGpsLocations from "../../mockedGpsLocations.json";

const START_TEXT = "Start gathering GPS data";
const STOP_TEXT = "Stop gathering GPS data";
const SENDING_GPS_GAP = 3;

class Driver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasDriverStarted: false,
      driverId: "",
      connected: false,
      sentEvents: 0,
    };
    this.timeouts = [];
  }

  componentDidMount() {
    const client = MqttService.initializeMqttConnection();
    client.on("connect", () => {
      this.setState({ connected: true});
    });
    client.on("offline", () => {
      this.setState({ connected: false});
    });
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
            (...props) => 
            MqttService.sendPosition(...props).then(() => 
              this.setState((prevState) => ({ sentEvents: prevState.sentEvents + 1 }))),
            SENDING_GPS_GAP * 1000,
            position,
            this.state.driverId
          ))
      );
    }
  };

  mockGpsData = () => {
    const interval = SENDING_GPS_GAP * 1000;

    mockedGpsLocations.forEach(
      (location, index) =>
        (this.timeouts[index] = setTimeout(
          (...props) => 
            MqttService.sendMockedPosition(...props).then(() => 
              this.setState((prevState) => ({ sentEvents: prevState.sentEvents + 1 }))),
          index * interval,
          location.latitude,
          location.longitude,
          this.state.driverId
        ))
    );
  };

  stopSendingGpsData = () => {
    clearInterval(this.sendPositionInterval);
    this.timeouts.forEach(t => clearTimeout(t));
  };

  handleGpsGatheringButton = () => {
    this.setState(
      prevState => ({ hasDriverStarted: !prevState.hasDriverStarted }),
      () => this.handleDriverStartedStateChange(this.state.hasDriverStarted)
    );
  };

  render = () => {
    return (
      <div className="driver-main">
        <div>
          Connection status:{" "}
          <span
            className={
              "status" + (this.state.connected ? " active" : " inactive")
            }
          >
            {this.state.connected ? "ONLINE" : "OFFLINE"}
          </span>
        </div>
        <div>
          <label htmlFor="driver-id">Driver id: </label>
          <input
            type="text"
            id="driver-id"
            placeholder="Type in driver id"
            onChange={e => this.setState({ driverId: e.currentTarget.value })}
          />
        </div>
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
        <div className="counter">Sent events: {this.state.sentEvents}</div>
      </div>
    );
  };
}

export default Driver;
