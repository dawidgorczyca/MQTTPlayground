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

  /**
   * Send message via mqtt
   * @param {Position} position
   * @param {string} driverid
   */
  const sendPosition = async (position, driverId) => {
    return await publishMessage({
      message: `${position.coords.latitude},${position.coords.longitude}|${Date.now()}`,
      driverId
    });
  };

  /**
   * Send mocked message via mqtt
   * @param {string} latitude
   * @param {string} longitude
   * @param {string} driverId
   */
  const sendMockedPosition = async (latitude, longitude, driverId) => {
    return await publishMessage({
      message: `${latitude},${longitude}|${Date.now()}`,
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
  const publishMessage = ({ message, driverId }) => {
    return new Promise((resolve, reject) => {
      driverId = driverId || "default";
      client.publish(`/Tracking/${driverId}`, message, null, err => {
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
    sendMockedPosition
  };
})();
