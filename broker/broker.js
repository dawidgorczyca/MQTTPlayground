const mosca = require('mosca')

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