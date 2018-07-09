const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
  setInterval(() => {
    client.publish('myTopic', 'Hello mqtt');
    console.log('Message Sent');
  }, 5000);
});