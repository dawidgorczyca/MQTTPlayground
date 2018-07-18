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
   */
  const sendPosition = position => {
    console.log(`Sended Real GPS Position : ${position.coords.latitude},${position.coords.longitude}|${Date.now()}`);
    client.publish('Tracking/d1', `${position.coords.latitude},${position.coords.longitude}|${Date.now()}`);
  };

  /**
   * Send mocked message via mqtt
   * @param {string} latitude 
   * @param {string} longitude 
   */
  const sendMockedPosition = (latitude, longitude) => {
    console.log(`Sended Mocked GPS Position : ${latitude},${longitude}|${Date.now()}`);
    client.publish('Tracking/d1', `${latitude},${longitude}|${Date.now()}`);
  }

  return {
    initializeMqttConnection,
    sendPosition,
    sendMockedPosition
  };
}() );
