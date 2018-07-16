import mqtt from 'mqtt'

const BROKER_IP_ADDRESS = 'mqtt://10.0.45.139:1884';

/**
 * Service to maintain mqtt events for drivers
 */
export const MqttService = ( function () {

  /**
   * MQTT address to establish connection
   * @param {string}
   */
  const client = mqtt.connect(BROKER_IP_ADDRESS);

  /**
   * Send message via mqtt
   * @param {string} message
   */
  const sendPosition = position => {
    console.log(position, 'sended');
    client.publish('Tracking/Gps', `${position.coords.latitude},${position.coords.longitude}`);
  };

  return {
    sendPosition
  };
}() );
