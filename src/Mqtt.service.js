import mqtt from 'mqtt'

const BROKER_IP_ADDRESS = 'mqtt://mqtt.broker.gkasperski.usermd.net:1884';

/**
 * Service to maintain mqtt events for drivers
 */
export const MqttService = ( function () {

  /**
   * MQTT address to establish connection
   * @param {string}
   */
  let client = null;

  const initializeMqttConnection = () => client = mqtt.connect(BROKER_IP_ADDRESS);

  /**
   * Send message via mqtt
   * @param {Position} position
   * @param {string} driverid
   */
  const sendPosition = (position, driverId) => {
    publishMessage(
      { 
        message: `${position.coords.latitude},${position.coords.longitude}|${Date.now()}`, 
        driverId 
      }
    );
  };

  /**
   * Send mocked message via mqtt
   * @param {string} latitude 
   * @param {string} longitude 
   * @param {string} driverId
   */
  const sendMockedPosition = (latitude, longitude, driverId) => {
    publishMessage(
      { 
        message: `${latitude},${longitude}|${Date.now()}`, 
        driverId 
      }
    );
  }
  /**
   * @private Publish the message
   * @param {string} latitude 
   * @param {string} longitude 
   * @param {string} driverId
   * 
   */
  const publishMessage= ({ message, driverId }) => {
    driverId = driverId || "default";
    console.log(`Published ${message} from ${driverId}`);
    client.publish(`Tracking/${driverId}`, message);
  }

  return {
    initializeMqttConnection,
    sendPosition,
    sendMockedPosition
  };
}() );
