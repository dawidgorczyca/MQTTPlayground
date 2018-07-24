const mosca = require('mosca')
require('dotenv-safe').config();
const eventBus = require('./events.bus')
const dbBackend = require('../backend/backend.events')


// const SECURE_KEY = __dirname + '/tls-key.pem';
// const SECURE_CERT = __dirname + '/tls-cert.pem';

const settings = {
  port: 1886,
  http: {
    port: 1887,
    bundle: true,
    static: './'
  }
}

const server = new mosca.Server(settings)

server.on('ready', () => {
  dbBackend.init()
  console.log('[INFO] dbBackend | broker | collections up')
  console.log('[INFO] mqttBroker | server.on | broker up')
})

server.on('clientConnected', function(client) {
  console.log('client connected', client.id)
})

server.on('subscribed', function(topic, client) {
  console.log('subscribed : ', topic)
})

server.on('unsubscribed', function(topic, client) {
  console.log('unsubscribed : ', topic)
})

server.on('clientDisconnecting', function(client) {
  console.log('clientDisconnecting : ', client.id)
})
server.on('clientDisconnected', function(client) {
  console.log('clientDisconnected : ', client.id)
})
server.on('published', function(packet, client) {
  const { topic } = packet
  const eventInfo = topic.split('/')
  eventBus(eventInfo, packet)
})