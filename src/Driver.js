import React from "react";
import "./Driver.css";
import { MqttService } from "./Mqtt.service";
import axios from 'axios';

const START_TEXT = "Start new route";
const STOP_TEXT = "Finish route";
const SENDING_GPS_GAP = 3;

class Driver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasDriverStarted: false,
      driverId: '',
      driverName: '',
      connected: false,
      sentEvents: 0,
      mockedGpsLocations: '',
      eventsGap: SENDING_GPS_GAP
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
      this.mockGpsStart()
    } else {
      this.stopSendingGpsData()
      setTimeout(() => {
        this.mockGpsFinish()
      }, 1000)
    }
  };

  // gatherGpsData = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       position =>
  //         (this.sendPositionInterval = setInterval(
  //           (...props) => 
  //           MqttService.sendPosition(...props).then(() => 
  //             this.setState((prevState) => ({ sentEvents: prevState.sentEvents + 1 }))),
  //           SENDING_GPS_GAP * 1000,
  //           position,
  //           this.state.driverId
  //         ))
  //     );
  //   }
  // };

  mockGpsData = () => {
    const { mockedGpsLocations, eventsGap } = this.state
    const interval = parseInt(eventsGap) * 1000;
    mockedGpsLocations.length && mockedGpsLocations.forEach(
      (location, index) =>
        (this.timeouts[index] = setTimeout(
          (...props) => 
            MqttService.sendMockedPosition(...props, this.state.driverId, '').then(() => 
              this.setState((prevState) => ({ sentEvents: prevState.sentEvents + 1 }))),
          index * interval,
          location.latitude,
          location.longitude,
          this.state.driverId,
          ''
        ))
    );
  };

  mockGpsStart = async () => {
    await MqttService.sendMockedPosition('', '', this.state.driverId, 'ACTIVE')
    setTimeout(() => {
      this.mockGpsData()
    }, 3000)
  }

  mockGpsFinish = () => {
    MqttService.sendMockedPosition('', '', this.state.driverId, 'FINISH')
  }

  stopSendingGpsData = () => {
    clearInterval(this.sendPositionInterval);
    this.timeouts.forEach(t => clearTimeout(t));
  };

  registerDriver = () => {
    MqttService.activateDriver(this.state.driverId, this.state.driverName)
  }

  handleGpsGatheringButton = () => {
    this.setState(
      prevState => ({ hasDriverStarted: !prevState.hasDriverStarted }),
      () => this.handleDriverStartedStateChange(this.state.hasDriverStarted)
    );
  };

  handleUpdateDriverBtn = () => {
    MqttService.updateDriver(this.state.driverId, this.state.driverName)
  }

  handleClearDatabase = () => {
    axios({
      method:'get',
      url:'http://localhost:8080/clearDatabase',
    })
      .catch((err)=>{
        console.error('err ', err);
      })

  }

  updateMockedData = e => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.readAsText(e.target.files[0]);
      reader.onload = () => {
        try {
          const mockedGpsLocations = JSON.parse(reader.result);
          this.setState({ mockedGpsLocations, errorMessage: "" });
        } catch (e) {
          this.setState({errorMessage: "Invalid JSON file"});
        }
      };
    }
  };

  handleEventsGap = (newValue) => {
    this.setState({'eventsGap': newValue})
  }

  render = () => {
    return (
      <div className="driver-main">
        <h1>Driver tracking device simulator</h1>
        <div className="connection--status">
          Connection status:{" "}
          <span
            className={
              "status" + (this.state.connected ? " active" : " inactive")
            } 
          >
            {this.state.connected ? "ONLINE" : "OFFLINE"}
          </span>
        </div>
        <div className="driverInputLine">
          <label htmlFor="events-gap">Time gap between events: </label>
          <input
            type="number"
            id="events-gap"
            placeholder=""
            onChange={e => this.setState({ eventsGap: e.currentTarget.value })}
          />
        </div>
        <div className="driverInputLine">
          <label htmlFor="driver-id">Driver id: </label>
          <input
            type="text"
            id="driver-id"
            placeholder="Type in driver id"
            onChange={e => this.setState({ driverId: e.currentTarget.value })}
          />
        </div>
        <div className="driverInputLine">
          <label htmlFor="driver-name">Driver Name: </label>
          <input
            type="text"
            id="driver-name"
            placeholder="Type in name"
            onChange={e => this.setState({ driverName: e.currentTarget.value })}
          />
        </div>
        <div className="driver--addFile">
          <h4>Upload your mocked route:</h4>
          <input
              type="file"
              onChange={e => this.updateMockedData(e)}
              accept=".json,application/json"
            />
          <div className="error">
            { this.state.errorMessage }
          </div>
        </div>
        {this.state.mockedGpsLocations.length ? (
          <input
            type="button"
            value={this.state.hasDriverStarted ? STOP_TEXT : START_TEXT}
            className={
              this.state.hasDriverStarted ? "btn btn-wide routeActive" : "btn btn-wide routeInactive"
            }
            onClick={() => this.handleGpsGatheringButton()}
          />
        ) : (
          <input
            type="button"
            value={this.state.hasDriverStarted ? STOP_TEXT : START_TEXT}
            className="btn btn-wide disabled"
          />
        )}
        <div className="driver--additionalOptions">
          <input 
            type="button"
            value="Register driver"
            className="btn active"
            onClick={() => this.registerDriver()}
          />
          <input
            type="button"
            value="Clear database"
            className="btn active"
            onClick={() => this.handleClearDatabase()}
          />
        </div>
        
        <div className="counter">Sent events: <b>{this.state.sentEvents}</b></div>
      </div>
    );
  };
}

export default Driver;
