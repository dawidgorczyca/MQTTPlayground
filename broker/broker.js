const mosca = require('mosca')
require('dotenv-safe').config();


const settings = {
  port: 1883,
  http: {
    port: 1884,
    bundle: true,
    static: './'
  },
  backend: {
    type: 'mongo',
    url: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
  }
}

const server = new mosca.Server(settings)

server.on('ready', () => {
  console.log('ready')
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

require('./router').start();