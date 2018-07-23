import mqtt from "mqtt";
import { resolve } from "url";
import { rejects } from "assert";

const BROKER_IP_ADDRESS = "mqtt://localhost:1887";

/**
 * Service to maintain mqtt events for drivers
 */
export const MqttService = (function() {
  /**
   * MQTT address to establish connection
   * @param {string}
   */
  let client = null;

  const initializeMqttConnection = () =>
    (client = mqtt.connect(BROKER_IP_ADDRESS));


  const activateDriver = async (driverId, driverName) => {
    return await publishMessage({
      topic: `DRIVERS/${driverId}/ADD`,
      message: `${driverName}`,
    })
  }

  const updateDriver = async (driverId, driverName) => {
    return await publishMessage({
      topic: `DRIVERS/${driverId}/UPDATE`,
      message: `${driverName}`,
    })
  }

  /**
   * Send message via mqtt
   * @param {Position} position
   * @param {string} driverid
   */
  const sendPosition = async (position, driverId) => {
    return await publishMessage({
      message: `${position.coords.latitude},${position.coords.longitude}|${Date.now()}|${position.end}`,
      driverId
    });
  };

  /**
   * Send mocked message via mqtt
   * @param {string} latitude
   * @param {string} longitude
   * @param {string} driverId
   */
  const sendMockedPosition = async (latitude, longitude, driverId, routeFinish) => {
    return await publishMessage({
      topic: `ROUTES/${driverId}/UPDATE`,
      message: `${latitude}|${longitude}|${Date.now()}|${routeFinish ? routeFinish : ''}`,
      driverId
    });
  };
  /**
   * @private Publish the message
   * @param {string} latitude
   * @param {string} longitude
   * @param {string} driverId
   *
   */
  const publishMessage = ({ message, driverId, topic }) => {
    return new Promise((resolve, reject) => {
      driverId = driverId || "default";
      client.publish(`${topic ? topic : driverId}`, message, null, err => {
        if (!err) {
          console.log(`Published ${message} from ${driverId}`);
          resolve();
        } else {
          reject();
        }
      });
    });
  };

  return {
    initializeMqttConnection,
    sendPosition,
    sendMockedPosition,
    activateDriver,
    updateDriver
  };
})();
