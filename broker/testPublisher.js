const mqtt = require('mqtt')

const client = mqtt.connect('mqtt://localhost:1883')

client.on('connect', () => {
  setInterval(() => {
    client.publish('/Tracking/Test Publisher', `Hello mqtt|${Date.now()}`)
    console.log('Message Sent')
  }, 5000)
})