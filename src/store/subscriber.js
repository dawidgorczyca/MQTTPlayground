import mqtt from 'mqtt'
import {store} from '../App'
import {msg} from './reducers/tracking'


function subscribeMQTT() {
  const client = mqtt.connect('mqtt://localhost:1884')

  client.on('connect', () => {
    client.subscribe('myTopic')
  })
  client.on('message', (topic, message) => {
    store.dispatch(msg(message.toString()))
  })
}

export default subscribeMQTT